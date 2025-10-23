"""Pydantic models for IMO Creator HEIR/MCP integration"""
from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field
import time

# HEIR Check Models
class HeirCheckRequest(BaseModel):
    """Request model for HEIR validation checks"""
    ssot: Dict[str, Any] = Field(..., description="Single Source of Truth configuration")

class HeirCheckResult(BaseModel):
    """Result model for HEIR validation checks"""
    ok: bool = Field(..., description="Whether all checks passed")
    errors: Optional[List[str]] = Field(None, description="List of validation errors")
    warnings: Optional[List[str]] = Field(None, description="List of validation warnings")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional check details")

# Sidecar Event Models
class SidecarEvent(BaseModel):
    """Model for sidecar telemetry events"""
    type: str = Field(..., description="Event type (e.g., app.start, action.invoked)")
    payload: Dict[str, Any] = Field(..., description="Event payload data")
    tags: Dict[str, Any] = Field(default_factory=dict, description="Event metadata tags")
    ts: int = Field(default_factory=lambda: int(time.time()), description="Unix timestamp")
    
    class Config:
        json_encoders = {
            # Ensure timestamps are integers
            int: lambda v: int(v) if isinstance(v, (int, float)) else v
        }