from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional
from src.server.infra.error_log import log_error

router = APIRouter()

class ErrorEvent(BaseModel):
    source_system: str
    message: str
    severity: str = Field(pattern="^(info|warning|error|critical)$")
    source_service: Optional[str] = None
    environment: Optional[str] = None
    error_code: Optional[str] = None
    http_status: Optional[int] = None
    process_id: Optional[str] = None
    unique_id: Optional[str] = None
    blueprint_version_hash: Optional[str] = None
    schema_version: Optional[str] = None
    agent_execution_signature: Optional[str] = None
    mcp_bay: Optional[str] = None
    subagent_id: Optional[str] = None
    details_json: Optional[Dict[str, Any]] = None
    stack_trace: Optional[str] = None
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    context_tags: List[str] = Field(default_factory=list)
    created_by: Optional[str] = None
    updated_by: Optional[str] = None
    resolution_notes: Optional[str] = None

@router.post("/api/errors/log")
def api_log_error(evt: ErrorEvent):
    try:
        result = log_error(evt.model_dump())
        return {"ok": True, "result": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))