"""
CampusOS Navi Cloud - Vercel Serverless Assistant Engine
Edge-Cloud Hybrid AI backend for USTED Nav (CampusOS).
- Primary: Groq (qwen/qwen3.8-27b & openai/gpt-oss-20b)
- Hot Backup: Cerebras (llama3.1-70b)
- Speech-to-Text: Groq (whisper-large-v3-turbo)
- Deterministic Tool Execution: route_to, locate_place, find_staff, find_amenity
"""

import os
import time
import json
import re
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="USTED Nav - Navi Cloud Serverless Engine",
    description="Vercel Serverless API for CampusOS Navi",
    version="2.1.0"
)

# Enable CORS for all domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "").strip()
CEREBRAS_API_KEY = os.environ.get("CEREBRAS_API_KEY", "").strip()
NAVI_AUTH_TOKEN = os.environ.get("NAVI_AUTH_TOKEN", "").strip()

# User Groq models
GROQ_MODEL = os.environ.get("GROQ_MODEL", "qwen/qwen3.8-27b").strip()
GROQ_FALLBACK_MODELS = [GROQ_MODEL, "openai/gpt-oss-20b", "llama-3.3-70b-versatile", "allam-2-7b"]

# Initialize OpenAI-compatible clients
groq_client = None
cerebras_client = None

try:
    from openai import OpenAI
    if GROQ_API_KEY:
        groq_client = OpenAI(
            base_url="https://api.groq.com/openai/v1",
            api_key=GROQ_API_KEY
        )
    if CEREBRAS_API_KEY:
        cerebras_client = OpenAI(
            base_url="https://api.cerebras.ai/v1",
            api_key=CEREBRAS_API_KEY
        )
except Exception as e:
    print(f"[Navi Cloud] OpenAI SDK warning: {e}")

# System prompt for structured campus intent extraction
SYSTEM_PROMPT = """You are Navi, the official AI navigation guide for USTED Nav (CampusOS).
Parse the user's natural language into structured JSON actions and a friendly voice line.

Actions:
1. "route_to": Student wants directions/path/walk to a place.
   Parameters: {"target": "<destination name>", "mode": "walking"}
2. "locate_place": Student asks where something is, or to show/find a building, lab, hall, or room.
   Parameters: {"place_name": "<building or room name>"}
3. "find_staff": Student is looking for a lecturer, professor, dean, HOD, or staff member's office.
   Parameters: {"name": "<staff name>", "role": "<optional role>", "department": "<optional department>"}
4. "find_amenity": Student needs food, cafeteria, washroom/toilet, ATM, print shop, or clinic.
   Parameters: {"amenity_type": "<food|washroom|atm|printing|clinic>", "near_landmark": "<optional location>"}
5. "conversational": Greetings, chit-chat, or general questions about USTED campus.
   Parameters: {"message": "<helpful answer>"}

Respond ONLY in valid, clean JSON with this exact schema:
{
  "action": "route_to" | "locate_place" | "find_staff" | "find_amenity" | "conversational",
  "parameters": { ... },
  "speech_text": "Short 1-sentence friendly voice line to read to the user"
}
"""

class ParseRequest(BaseModel):
    query: str
    campus_context: Optional[Dict[str, Any]] = None

class ParseResponse(BaseModel):
    success: bool
    action: Optional[str] = None
    parameters: Dict[str, Any] = {}
    speech_text: Optional[str] = None
    engine: str = "unknown"
    confidence: float = 0.0
    latency_ms: float = 0.0
    raw_query: str


def call_llm_json(query: str) -> tuple[Optional[dict], str]:
    """Tries Groq models first, then falls back to Cerebras."""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": query}
    ]

    # 1. Try Groq (User's models: qwen/qwen3.8-27b, openai/gpt-oss-20b)
    if groq_client:
        for model_candidate in GROQ_FALLBACK_MODELS:
            try:
                resp = groq_client.chat.completions.create(
                    model=model_candidate,
                    messages=messages,
                    response_format={"type": "json_object"},
                    temperature=0.1,
                    max_tokens=250,
                    timeout=2.2
                )
                content = resp.choices[0].message.content
                return json.loads(content), f"groq:{model_candidate}"
            except Exception as e:
                print(f"[Navi Cloud] Groq ({model_candidate}) error: {e}")

    # 2. Try Cerebras (Instant Hot Backup)
    if cerebras_client:
        try:
            resp = cerebras_client.chat.completions.create(
                model="llama3.1-70b",
                messages=messages,
                response_format={"type": "json_object"},
                temperature=0.1,
                max_tokens=250,
                timeout=2.2
            )
            content = resp.choices[0].message.content
            return json.loads(content), "cerebras:llama3.1-70b"
        except Exception as e:
            print(f"[Navi Cloud] Cerebras error: {e}")

    return None, "none"


# Deterministic high-speed rule parser for zero-delay campus triggers
def fast_deterministic_parse(query: str) -> Optional[dict]:
    q = query.lower().strip()
    
    # 1. Route triggers
    route_match = re.search(r'\b(?:take me to|navigate to|guide me to|directions to|route to|how do i get to|way to|lead me to)\s+(.+)', q, re.I)
    if route_match:
        target = route_match.group(1).strip()
        return {
            "action": "route_to",
            "parameters": {"target": target, "mode": "walking"},
            "speech_text": f"Routing to {target}"
        }

    # 2. Amenity triggers
    amenity_match = re.search(r'\b(food|eat|canteen|cafeteria|chop bar|snack|toilet|washroom|restroom|wc|atm|bank|print|photocopy|stationery|clinic|health)\b', q, re.I)
    if amenity_match:
        raw_type = amenity_match.group(1).lower()
        atype = 'food' if raw_type in ['eat', 'canteen', 'cafeteria', 'chop bar', 'snack'] else (
            'washroom' if raw_type in ['toilet', 'restroom', 'wc'] else (
                'atm' if raw_type in ['bank'] else (
                    'printing' if raw_type in ['photocopy', 'stationery'] else (
                        'clinic' if raw_type in ['health'] else raw_type
                    )
                )
            )
        )
        landmark_match = re.search(r'\b(?:around|near|close to|at|by|in)\s+([a-zA-Z0-9\s]+)', q, re.I)
        near = landmark_match.group(1).strip() if landmark_match else ""
        return {
            "action": "find_amenity",
            "parameters": {"amenity_type": atype, "near_landmark": near},
            "speech_text": f"Finding nearest {atype}" + (f" around {near}" if near else "")
        }

    # 3. Staff triggers
    staff_match = re.search(r'\b(?:dr\.|dr|prof\.|prof|mr\.|mr|mrs\.|mrs|lecturer|dean|hod)\s+([a-zA-Z\s]+)', q, re.I)
    if staff_match:
        name = staff_match.group(1).strip()
        return {
            "action": "find_staff",
            "parameters": {"name": name},
            "speech_text": f"Looking up office for {name}"
        }

    return None


@app.get("/")
@app.get("/api")
def root():
    return {
        "service": "USTED Nav - Navi Cloud Serverless Engine",
        "status": "operational",
        "platform": "Vercel Serverless Python"
    }


@app.get("/health")
@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "USTED Nav - Navi Cloud",
        "providers": {
            "groq": groq_client is not None,
            "cerebras": cerebras_client is not None
        },
        "default_model": GROQ_MODEL,
        "timestamp": time.time()
    }


@app.post("/parse", response_model=ParseResponse)
@app.post("/api/parse", response_model=ParseResponse)
def parse_query(req: ParseRequest, request: Request):
    if NAVI_AUTH_TOKEN:
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "").strip()
        if token != NAVI_AUTH_TOKEN:
            raise HTTPException(status_code=401, detail="Unauthorized")

    query = req.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    start_time = time.perf_counter()

    # Step 1: Fast deterministic regex trigger (0ms)
    fast_match = fast_deterministic_parse(query)
    if fast_match:
        duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
        return ParseResponse(
            success=True,
            action=fast_match["action"],
            parameters=fast_match["parameters"],
            speech_text=fast_match.get("speech_text"),
            engine="needle-fast-matcher",
            confidence=0.96,
            latency_ms=duration_ms,
            raw_query=query
        )

    # Step 2: Cloud LLM (Groq Qwen/GPT-OSS or Cerebras) for complex/conversational queries
    llm_result, provider = call_llm_json(query)
    duration_ms = round((time.perf_counter() - start_time) * 1000, 2)

    if llm_result and "action" in llm_result:
        return ParseResponse(
            success=True,
            action=llm_result.get("action"),
            parameters=llm_result.get("parameters", {}),
            speech_text=llm_result.get("speech_text"),
            engine=provider,
            confidence=0.98,
            latency_ms=duration_ms,
            raw_query=query
        )

    # Step 3: Safe fallback to locate_place
    return ParseResponse(
        success=True,
        action="locate_place",
        parameters={"place_name": query},
        speech_text=f"Searching campus for {query}",
        engine="cloud_fallback",
        confidence=0.60,
        latency_ms=duration_ms,
        raw_query=query
    )


@app.post("/transcribe")
@app.post("/api/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """Transcribes audio using Groq Whisper-large-v3-turbo."""
    if not groq_client:
        raise HTTPException(status_code=503, detail="Groq Whisper client not configured")

    try:
        audio_bytes = await file.read()
        transcription = groq_client.audio.transcriptions.create(
            file=(file.filename or "audio.wav", audio_bytes),
            model="whisper-large-v3-turbo",
            response_format="json",
            language="en"
        )
        return {"success": True, "text": transcription.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
