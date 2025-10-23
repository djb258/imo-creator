from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import sys
from pathlib import Path

# Add packages to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent.parent))

router = APIRouter(prefix="/tools/heir", tags=["heir"])

# Global variables for optional import handling
heir_checks = None
_heir_import_error = None

try:
    from packages.heir import checks as heir_checks
except Exception as e:
    heir_checks = None
    _heir_import_error = e

class CheckRequest(BaseModel):
    target_path: Optional[str] = "."
    strict: Optional[bool] = False
    branch: Optional[str] = None
    commit_sha: Optional[str] = None

class CheckResponse(BaseModel):
    status: str
    missing: List[str]
    details: Dict[str, Any]

class StatusResponse(BaseModel):
    status: str
    available: bool
    version: Optional[str] = None
    reason: Optional[str] = None
    hint: Optional[str] = None

@router.post("/check", response_model=CheckResponse)
async def run_heir_checks(request: CheckRequest):
    """Run HEIR compliance checks"""
    if heir_checks is None:
        return CheckResponse(
            status="unavailable",
            missing=["heir"],
            details={
                "reason": str(_heir_import_error),
                "hint": "Install optional deps: pip install toml  # plus any others used by HEIR"
            }
        )
    
    try:
        result = heir_checks.run_checks(
            target_path=request.target_path,
            strict=request.strict,
            branch=request.branch,
            commit_sha=request.commit_sha
        )
        return CheckResponse(**result)
    except Exception as e:
        return CheckResponse(
            status="error",
            missing=[],
            details={"error": str(e)}
        )

@router.get("/status", response_model=StatusResponse)
async def heir_status():
    """Get HEIR module status and availability"""
    if heir_checks is None:
        return StatusResponse(
            status="unavailable",
            available=False,
            reason=str(_heir_import_error),
            hint="Install optional deps: pip install toml"
        )
    
    try:
        # Test if the module works
        result = heir_checks.run_checks(".", strict=False)
        return StatusResponse(
            status=result["status"],
            available=True,
            version=heir_checks.HEIR_VERSION
        )
    except Exception as e:
        return StatusResponse(
            status="error",
            available=False,
            reason=str(e)
        )