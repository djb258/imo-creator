"""MCP Server for IMO Creator HEIR integration"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from typing import Dict, Any
import yaml
from pathlib import Path

try:
    from .models import HeirCheckRequest, HeirCheckResult
except ImportError:
    from src.models import HeirCheckRequest, HeirCheckResult

# Load environment variables
load_dotenv()

app = FastAPI(title="IMO Creator MCP Server", description="HEIR/MCP integration server")

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

@app.post("/heir/check", response_model=HeirCheckResult)
async def heir_check(request: HeirCheckRequest):
    """
    Run HEIR validation checks on provided SSOT configuration
    Currently returns a stub response for minimal implementation
    """
    try:
        # Stub implementation - always returns ok:true for now
        # In full implementation, this would call packages.heir.checks
        
        # Basic validation of SSOT structure
        ssot = request.ssot
        errors = []
        warnings = []
        
        # Check for required SSOT fields
        required_fields = ["meta", "doctrine"]
        for field in required_fields:
            if field not in ssot:
                errors.append(f"Missing required SSOT field: {field}")
        
        # Check meta structure
        if "meta" in ssot:
            meta = ssot["meta"]
            if "app_name" not in meta:
                warnings.append("Missing app_name in meta")
        
        # For minimal implementation, consider it ok if no critical errors
        is_ok = len(errors) == 0
        
        result = HeirCheckResult(
            ok=is_ok,
            errors=errors if errors else None,
            warnings=warnings if warnings else None,
            details={
                "ssot_keys": list(ssot.keys()),
                "check_type": "minimal_stub",
                "version": "1.0.0"
            }
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"HEIR check failed: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint with service info"""
    return {
        "service": "IMO Creator MCP Server",
        "version": "1.0.0",
        "endpoints": ["/heir/check"],
        "status": "ok"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "mcp"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 7001))
    uvicorn.run(app, host="0.0.0.0", port=port)