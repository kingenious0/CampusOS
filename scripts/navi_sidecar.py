"""
Navi Sidecar - Cactus Needle Microservice for CampusOS
Provides an ultra-fast, local function-calling API that maps student queries
into structured campus actions (routing, locating, staff discovery, amenities).
"""

import time
import os
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import needle

# 1. Define Tool Schemas with Triggers
@needle.tool(triggers=[
    'take me to', 'navigate to', 'guide me to', 'directions to', 'route to', 
    'go to', 'lead me to', 'how do i get to', 'way to', 'walk to'
])
def route_to(target: str, start_location: str = 'current_location', mode: str = 'walking'):
    """Calculates and displays a navigation path to a building, hall, or room."""
    return {
        'action': 'route_to',
        'target': target,
        'start_location': start_location,
        'mode': mode
    }

@needle.tool(triggers=[
    'where is', 'show me', 'locate', 'find building', 'find hall', 
    'find lab', 'find room', 'point me to', 'which block is'
])
def locate_place(place_name: str, category: str = ''):
    """Pans the camera and highlights a building, lecture hall, lab, or office block."""
    return {
        'action': 'locate_place',
        'place_name': place_name,
        'category': category
    }

@needle.tool(triggers=[
    'lecturer', 'hod', 'dean', 'officer', 'staff', 'professor', 
    'dr', 'office of', 'find lecturer', 'who is', 'contact'
])
def find_staff(name: str, role: str = '', department: str = ''):
    """Finds an academic or administrative staff member and locates their office."""
    return {
        'action': 'find_staff',
        'name': name,
        'role': role,
        'department': department
    }

@needle.tool(triggers=[
    'food', 'eat', 'canteen', 'cafeteria', 'chop bar', 'snack', 
    'toilet', 'washroom', 'restroom', 'wc', 'atm', 'bank', 
    'print', 'photocopy', 'stationery', 'clinic', 'health'
])
def find_amenity(amenity_type: str, near_landmark: str = ''):
    """Finds nearby facilities such as washrooms, cafeterias, ATMs, clinics, or print hubs."""
    return {
        'action': 'find_amenity',
        'amenity_type': amenity_type,
        'near_landmark': near_landmark
    }

# 2. Initialize Needle Engine
TOOLS = [route_to, locate_place, find_staff, find_amenity]
print("[Navi Sidecar] Initializing Cactus Needle engine...")
needle_engine = needle.Needle(tools=TOOLS, stateless=True)
print("[Navi Sidecar] Engine initialized successfully.")

# 3. Create FastAPI app
app = FastAPI(
    title="CampusOS Navi Sidecar",
    description="Stateless Intent & Entity Extractor powered by Cactus Needle",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ParseRequest(BaseModel):
    query: str

class ParseResponse(BaseModel):
    success: bool
    action: Optional[str] = None
    parameters: Dict[str, Any] = {}
    confidence: float = 0.0
    latency_ms: float = 0.0
    raw_query: str

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "CampusOS Navi Sidecar",
        "model": "cactus-needle-2",
        "tools": [t.__name__ for t in TOOLS]
    }

@app.post("/parse", response_model=ParseResponse)
def parse_query(req: ParseRequest):
    query = req.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    start_time = time.perf_counter()
    try:
        # Needle inference with strict=False to ensure robust extraction
        result = needle_engine.run(query, strict=False)
        duration_ms = round((time.perf_counter() - start_time) * 1000, 2)

        results_list = result.get('results', [])
        function_calls = result.get('function_calls', [])
        confidence = float(result.get('confidence', 0.0))

        # Case 1: result already returned by tool execution
        if results_list and isinstance(results_list[0], dict) and 'action' in results_list[0]:
            first = results_list[0]
            action = first.get('action')
            params = {k: v for k, v in first.items() if k != 'action'}
            return ParseResponse(
                success=True,
                action=action,
                parameters=params,
                confidence=confidence,
                latency_ms=duration_ms,
                raw_query=query
            )

        # Case 2: raw function call emitted
        if function_calls:
            fc = function_calls[0]
            action = fc.get('name')
            params = fc.get('arguments', {})
            return ParseResponse(
                success=True,
                action=action,
                parameters=params,
                confidence=confidence,
                latency_ms=duration_ms,
                raw_query=query
            )

        # Fallback: Default to generic locate_place
        return ParseResponse(
            success=True,
            action='locate_place',
            parameters={'place_name': query, 'category': ''},
            confidence=confidence,
            latency_ms=duration_ms,
            raw_query=query
        )

    except Exception as e:
        duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
        return ParseResponse(
            success=False,
            action=None,
            parameters={'error': str(e)},
            confidence=0.0,
            latency_ms=duration_ms,
            raw_query=query
        )

if __name__ == "__main__":
    port = int(os.environ.get("NAVI_PORT", 8000))
    print(f"[Navi Sidecar] Starting server on http://127.0.0.1:{port}")
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="info")
