from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import subprocess
from typing import Optional

router = APIRouter(prefix="/tools/exec", tags=["execution"])

class RunRequest(BaseModel):
    command: str
    cwd: Optional[str] = "."
    timeout: Optional[int] = 30

class RunResponse(BaseModel):
    stdout: str
    stderr: str
    returncode: int
    command: str

@router.post("/run", response_model=RunResponse)
async def exec_run(request: RunRequest):
    """Execute a shell command"""
    try:
        result = subprocess.run(
            request.command,
            shell=True,
            cwd=request.cwd,
            capture_output=True,
            text=True,
            timeout=request.timeout
        )
        
        return RunResponse(
            stdout=result.stdout,
            stderr=result.stderr,
            returncode=result.returncode,
            command=request.command
        )
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail=f"Command timed out after {request.timeout} seconds")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))