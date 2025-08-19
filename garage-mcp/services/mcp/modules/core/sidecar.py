from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import httpx
import os
from datetime import datetime

router = APIRouter(prefix="/tools/sidecar", tags=["sidecar"])

SIDECAR_URL = os.getenv("SIDECAR_URL", "http://localhost:8000")

class EventRequest(BaseModel):
    tool: str
    params: Dict[str, Any]
    result: Optional[Any] = None
    error: Optional[str] = None

class EventResponse(BaseModel):
    status: str
    event_id: int

class HealthResponse(BaseModel):
    status: str
    sidecar_url: str

@router.post("/event", response_model=EventResponse)
async def post_event(request: EventRequest):
    """Post an event to the sidecar service"""
    try:
        async with httpx.AsyncClient() as client:
            event_data = {
                "tool": request.tool,
                "params": request.params,
                "result": request.result,
                "error": request.error,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            response = await client.post(f"{SIDECAR_URL}/events/mcp", json=event_data)
            response.raise_for_status()
            
            data = response.json()
            return EventResponse(
                status=data.get("status", "logged"),
                event_id=data.get("event_id", 0)
            )
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Failed to reach sidecar: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health", response_model=HealthResponse)
async def check_sidecar_health():
    """Check if sidecar service is healthy"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{SIDECAR_URL}/health")
            response.raise_for_status()
            
            return HealthResponse(
                status=response.json().get("status", "unknown"),
                sidecar_url=SIDECAR_URL
            )
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Sidecar unreachable: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))