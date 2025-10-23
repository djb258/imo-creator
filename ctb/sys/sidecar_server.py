"""Sidecar Server for IMO Creator event logging"""
import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
from typing import Dict, Any

try:
    from .models import SidecarEvent
except ImportError:
    from src.models import SidecarEvent

# Load environment variables
load_dotenv()

app = FastAPI(title="IMO Creator Sidecar Server", description="Event logging and telemetry server")

# CORS configuration
allow_origin = os.getenv("ALLOW_ORIGIN", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[allow_origin, "http://localhost:7002", "http://127.0.0.1:7002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).parent.parent
LOGS_DIR = BASE_DIR / "logs"
SIDECAR_LOG_FILE = LOGS_DIR / "sidecar.ndjson"

# Ensure logs directory exists
LOGS_DIR.mkdir(exist_ok=True)

@app.post("/events")
async def log_event(event: SidecarEvent):
    """
    Accept and log sidecar events to NDJSON file
    """
    try:
        # Convert event to JSON line
        event_json = event.model_dump_json()
        
        # Append to NDJSON file
        with open(SIDECAR_LOG_FILE, "a", encoding="utf-8") as f:
            f.write(event_json + "\n")
        
        return {
            "status": "logged",
            "event_type": event.type,
            "timestamp": event.ts
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to log event: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint with service info"""
    return {
        "service": "IMO Creator Sidecar Server",
        "version": "1.0.0",
        "endpoints": ["/events", "/events/recent"],
        "log_file": str(SIDECAR_LOG_FILE),
        "status": "ok"
    }

@app.get("/events/recent")
async def get_recent_events(limit: int = 10):
    """Get recent events from the log file"""
    try:
        if not SIDECAR_LOG_FILE.exists():
            return {"events": [], "total": 0}
        
        # Read last N lines from NDJSON file
        with open(SIDECAR_LOG_FILE, "r", encoding="utf-8") as f:
            lines = f.readlines()
        
        # Get last N lines and parse as JSON
        recent_lines = lines[-limit:] if len(lines) > limit else lines
        events = []
        
        for line in recent_lines:
            try:
                event_data = json.loads(line.strip())
                events.append(event_data)
            except json.JSONDecodeError:
                continue
        
        return {
            "events": events,
            "total": len(events),
            "total_logged": len(lines)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read events: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "sidecar"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)