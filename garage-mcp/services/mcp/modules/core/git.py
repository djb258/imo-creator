from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import subprocess
from typing import Optional

router = APIRouter(prefix="/tools/git", tags=["git"])

class DiffRequest(BaseModel):
    cwd: Optional[str] = "."

class CommitRequest(BaseModel):
    message: str
    cwd: Optional[str] = "."

class DiffResponse(BaseModel):
    diff: str
    cwd: str

class CommitResponse(BaseModel):
    message: str
    output: str
    cwd: str

@router.post("/diff", response_model=DiffResponse)
async def git_diff(request: DiffRequest):
    """Get git diff for current changes"""
    try:
        result = subprocess.run(
            ["git", "diff"],
            cwd=request.cwd,
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            raise HTTPException(status_code=400, detail=f"Git diff failed: {result.stderr}")
        
        return DiffResponse(
            diff=result.stdout,
            cwd=request.cwd
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/commit", response_model=CommitResponse)
async def git_commit(request: CommitRequest):
    """Create a git commit with staged changes"""
    try:
        # Stage all changes
        stage_result = subprocess.run(
            ["git", "add", "-A"],
            cwd=request.cwd,
            capture_output=True,
            text=True
        )
        
        if stage_result.returncode != 0:
            raise HTTPException(status_code=400, detail=f"Git add failed: {stage_result.stderr}")
        
        # Commit
        commit_result = subprocess.run(
            ["git", "commit", "-m", request.message],
            cwd=request.cwd,
            capture_output=True,
            text=True
        )
        
        if commit_result.returncode != 0:
            raise HTTPException(status_code=400, detail=f"Git commit failed: {commit_result.stderr}")
        
        return CommitResponse(
            message=request.message,
            output=commit_result.stdout,
            cwd=request.cwd
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))