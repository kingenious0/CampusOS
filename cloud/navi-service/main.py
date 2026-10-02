"""
CampusOS Navi Cloud - Intelligent Campus Assistant Engine
Dual-Engine Edge-Cloud Hybrid Service:
- Primary: Cactus Needle 2 / Deterministic Tool Matcher
- Cloud Intelligence: Groq (Llama 3.3 70B) with instant Cerebras (Llama 3.1 70B) fallback
- Seamless CampusOS Map & Navigation integration
"""

import os
import time
import json
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Initialize FastAPI
app = FastAPI(
    title="CampusOS Navi Cloud Service",
    description="Intelligent Intent & Navigation Assistant for CampusOS",
    version="2.0.0"
)

# Enable CORS for all origins (CampusOS web, PWA, mobile)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration & Secrets
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "").strip()
CEREBRAS_API_KEY = os.environ.get("CEREBRAS_API_KEY", "").strip()
NAVI_AUTH_TOKEN = os.environ.get("NAVI_AUTH_TOKEN", "").strip()

# Lazy clients
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
    print(f"[Navi Cloud] OpenAI SDK init notice: {e}")

# Optional Needle Engine Initialization
needle_engine = None
try:
    import needle

    @needle.tool(triggers=[
        'take me to', 'navigate to', 'guide me to', 'directions to', 'route to', 
        'go to', 'lead me to', 'how do i get to', 'way to', 'walk to'
    ])
    def route_to(target: str, start_location: str = 'current_location', mode: str = 'walking'):
        """Calculates and displays a navigation path to a building, hall, or room."""
        return {'action': 'route_to', 'target': target, 'start_location': start_location, 'mode': mode}

    @needle.tool(triggers=[
        'where is', 'show me', 'locate', 'find building', 'find hall', 
        'find lab', 'find room', 'point me to', 'which block is'
    ])
    def locate_place(place_name: str, category: str = ''):
        """Pans the camera and highlights a building, lecture hall, lab, or office block."""
        return {'action': 'locate_place', 'place_name': place_name, 'category': category}

    @needle.tool(triggers=[
        'lecturer', 'hod', 'dean', 'officer', 'staff', 'professor', 
        'dr', 'office of', 'find lecturer', 'who is', 'contact'
    ])
    def find_staff(name: str, role: str = '', department: str = ''):
        """Finds an academic or administrative staff member and locates their office."""
        return {'action': 'find_staff', 'name': name, 'role': role, 'department': department}

    @needle.tool(triggers=[
        'food', 'eat', 'canteen', 'cafeteria', 'chop bar', 'snack', 
        'toilet', 'washroom', 'restroom', 'wc', 'atm', 'bank', 
        'print', 'photocopy', 'stationery', 'clinic', 'health'
    ])
    def find_amenity(amenity_type: str, near_landmark: str = ''):
        """Finds nearby facilities such as washrooms, cafeterias, ATMs, clinics, or print hubs."""
        return {'action': 'find_amenity', 'amenity_type': amenity_type, 'near_landmark': near_landmark}

    TOOLS = [route_to, locate_place, find_staff, find_amenity]
    needle_engine = needle.Needle(tools=TOOLS, stateless=True)
    print("[Navi Cloud] Cactus Needle engine initialized successfully.")
except Exception as e:
    print(f"[Navi Cloud] Needle engine skipped or not installed ({e}). Using AI + Regex fallback engine.")


# System instructions for LLM Intent Parsing
SYSTEM_PROMPT = """You are Navi, the official intelligent AI guide for CampusOS (University Campus Map & Information System for USTED Kumasi).
Your job is to parse student questions into structured JSON actions and provide a natural, friendly speech response.

Available Actions:
1. "route_to": Student wants directions/path/walk to a place on campus.
   Parameters: {"target": "<destination name>", "mode": "walking"}
2. "locate_place": Student asks where something is, or to show/find a building, lab, hall, or room.
   Parameters: {"place_name": "<building or room name>"}
3. "find_staff": Student is looking for a lecturer, professor, dean, HOD, or staff member's office.
   Parameters: {"name": "<staff name>", "role": "<optional role>", "department": "<optional department>"}
4. "find_amenity": Student needs food, cafeteria, toilet/washroom, ATM, print shop, or clinic.
   Parameters: {"amenity_type": "<food|washroom|atm|printing|clinic>", "near_landmark": "<optional location>"}
5. "conversational": General greetings, campus questions, or friendly chit-chat.
   Parameters: {"message": "<helpful answer>"}
6. "unknown_place": The student is asking for a place that is unfamiliar, external, or not on USTED Kumasi campus.
   Parameters: {"place_name": "<place query>", "reason": "not_on_campus"}

Tone & Speech Guidelines:
- Keep "speech_text" warm, concise, and friendly (1-2 sentences).
- If the requested location or entity does not sound like a legitimate campus building, department, hall, or service, use "unknown_place" or "conversational" and politely say in "speech_text" that the location couldn't be found on the USTED Kumasi campus, and offer to help find nearby lecture halls, departments, or amenities.

Respond ONLY in valid, clean JSON with this exact schema:
{
  "action": "route_to" | "locate_place" | "find_staff" | "find_amenity" | "conversational" | "unknown_place",
  "parameters": { ... },
  "speech_text": "Short friendly voice line to read to the user"
}
"""

# Model configuration
GROQ_MODEL = os.environ.get("GROQ_MODEL", "qwen/qwen3.8-27b").strip()
GROQ_FALLBACK_MODELS = [GROQ_MODEL, "openai/gpt-oss-20b", "llama-3.3-70b-versatile", "allam-2-7b"]

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
    """
    Attempts to call Groq using user's available models, falling back to Cerebras.
    Returns (parsed_json_dict, provider_name).
    """
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": query}
    ]

    # 1. Try Groq (Primary)
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
                print(f"[Navi Cloud] Groq with {model_candidate} failed: {e}. Trying next...")

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
            print(f"[Navi Cloud] Cerebras request failed: {e}")

    return None, "none"


@app.get("/")
def root():
    return {
        "service": "CampusOS Navi Cloud API",
        "status": "operational",
        "docs_url": "/docs",
        "health_url": "/health"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "CampusOS Navi Cloud",
        "version": "2.0.0",
        "providers": {
            "needle": needle_engine is not None,
            "groq": groq_client is not None,
            "cerebras": cerebras_client is not None
        },
        "timestamp": time.time()
    }


@app.post("/parse", response_model=ParseResponse)
def parse_query(req: ParseRequest, request: Request):
    # Optional API key protection if configured
    if NAVI_AUTH_TOKEN:
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "").strip()
        if token != NAVI_AUTH_TOKEN:
            raise HTTPException(status_code=401, detail="Unauthorized CampusOS client")

    query = req.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    start_time = time.perf_counter()

    # Step 1: If Needle Engine is available, check for deterministic fast triggers
    if needle_engine:
        try:
            result = needle_engine.run(query, strict=False)
            results_list = result.get('results', [])
            confidence = float(result.get('confidence', 0.0))

            if results_list and isinstance(results_list[0], dict) and 'action' in results_list[0]:
                duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
                first = results_list[0]
                action = first.get('action')
                params = {k: v for k, v in first.items() if k != 'action'}
                
                # Default speech text
                speech_text = None
                if action == 'route_to':
                    speech_text = f"Routing to {params.get('target', 'your destination')}"
                elif action == 'locate_place':
                    speech_text = f"Locating {params.get('place_name', 'destination')}"
                elif action == 'find_staff':
                    speech_text = f"Searching for {params.get('name', 'staff member')}"
                elif action == 'find_amenity':
                    speech_text = f"Finding nearest {params.get('amenity_type', 'facility')}"

                return ParseResponse(
                    success=True,
                    action=action,
                    parameters=params,
                    speech_text=speech_text,
                    engine="needle-2",
                    confidence=confidence or 0.95,
                    latency_ms=duration_ms,
                    raw_query=query
                )
        except Exception as e:
            print(f"[Navi Cloud] Needle parse pass: {e}")

    # Step 2: Use Cloud AI (Groq or Cerebras) for complex/natural phrasing
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

    # Step 3: Cloud Fallback to safe locate_place
    return ParseResponse(
        success=True,
        action="locate_place",
        parameters={"place_name": query},
        speech_text=f"Searching campus for {query}",
        engine="cloud_fallback",
        confidence=0.5,
        latency_ms=duration_ms,
        raw_query=query
    )


@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Transcribes audio using Groq's whisper-large-v3-turbo (Free 28.8K audio seconds/day).
    """
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


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    print(f"[Navi Cloud] Starting server on http://0.0.0.0:{port}")
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
