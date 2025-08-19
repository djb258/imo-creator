from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import os
import sys
from datetime import datetime
from pathlib import Path

# Add packages to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

app = FastAPI(title="Sidecar Service", version="1.0.0")

# In-memory storage for events (in production, use a database)
mcp_events: List[Dict[str, Any]] = []

class MCPEvent(BaseModel):
    tool: str
    params: Dict[str, Any]
    result: Optional[Any] = None
    error: Optional[str] = None
    timestamp: str
    domain: Optional[str] = None
    verb: Optional[str] = None
    driver: Optional[str] = None

class CommitReviewRequest(BaseModel):
    branch: str
    commit_sha: Optional[str] = None

class HealthResponse(BaseModel):
    status: str

class ReviewResponse(BaseModel):
    passed: bool
    checks: List[Dict[str, Any]]
    errors: List[str]

@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="ok")

def _redact_secrets(data: Dict[str, Any]) -> Dict[str, Any]:
    """Redact sensitive information from data before logging"""
    if not isinstance(data, dict):
        return data
    
    redacted = data.copy()
    
    # List of keys that might contain secrets
    secret_keys = [
        "password", "token", "key", "secret", "credential",
        "api_key", "access_token", "service_key", "auth",
        "deploy_key", "auth_token"
    ]
    
    def redact_recursive(obj):
        if isinstance(obj, dict):
            for key, value in obj.items():
                if any(secret_key in key.lower() for secret_key in secret_keys):
                    obj[key] = "***REDACTED***"
                elif isinstance(value, (dict, list)):
                    redact_recursive(value)
        elif isinstance(obj, list):
            for item in obj:
                if isinstance(item, (dict, list)):
                    redact_recursive(item)
    
    redact_recursive(redacted)
    return redacted

@app.post("/events/mcp")
async def log_mcp_event(event: MCPEvent):
    """Log MCP tool events with driver information"""
    try:
        event_data = event.dict()
        event_data["received_at"] = datetime.utcnow().isoformat()
        
        # Redact secrets from params and result
        if event_data.get("params"):
            event_data["params"] = _redact_secrets(event_data["params"])
        if event_data.get("result"):
            event_data["result"] = _redact_secrets(event_data["result"])
        
        mcp_events.append(event_data)
        
        # Enhanced console logging with driver information
        log_parts = [f"Tool: {event.tool}"]
        if event.domain:
            log_parts.append(f"Domain: {event.domain}")
        if event.verb:
            log_parts.append(f"Verb: {event.verb}")
        if event.driver:
            log_parts.append(f"Driver: {event.driver}")
        log_parts.append(f"Timestamp: {event.timestamp}")
        
        print(f"[MCP Event] {', '.join(log_parts)}")
        
        if event.error:
            print(f"  Error: {event.error}")
        elif event.result and isinstance(event.result, dict) and event.result.get("driver"):
            print(f"  Driver Result: {event.result.get('driver')}")
        
        return {"status": "logged", "event_id": len(mcp_events)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/events/mcp")
async def get_mcp_events(limit: int = 100):
    """Retrieve recent MCP events"""
    return {
        "events": mcp_events[-limit:],
        "total": len(mcp_events)
    }

@app.post("/review/commit", response_model=ReviewResponse)
async def review_commit(request: CommitReviewRequest):
    """Run HEIR checks on a commit"""
    try:
        from packages.heir.checks import run_checks
        
        # Run the checks
        check_results = run_checks(request.branch, request.commit_sha)
        
        # Determine if all checks passed
        all_passed = all(check["passed"] for check in check_results)
        errors = [check["message"] for check in check_results if not check["passed"]]
        
        return ReviewResponse(
            passed=all_passed,
            checks=check_results,
            errors=errors
        )
    except ImportError as e:
        return ReviewResponse(
            passed=False,
            checks=[],
            errors=[f"Failed to import HEIR checks: {str(e)}"]
        )
    except Exception as e:
        return ReviewResponse(
            passed=False,
            checks=[],
            errors=[f"Review failed: {str(e)}"]
        )

@app.get("/stats")
async def get_stats():
    """Get statistics about tool usage"""
    if not mcp_events:
        return {"total_events": 0, "tools": {}}
    
    tool_counts = {}
    error_count = 0
    
    for event in mcp_events:
        tool = event.get("tool", "unknown")
        tool_counts[tool] = tool_counts.get(tool, 0) + 1
        if event.get("error"):
            error_count += 1
    
    return {
        "total_events": len(mcp_events),
        "error_count": error_count,
        "tools": tool_counts,
        "last_event": mcp_events[-1] if mcp_events else None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)