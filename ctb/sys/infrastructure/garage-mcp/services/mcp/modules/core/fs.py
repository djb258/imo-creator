from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pathlib import Path
from typing import Optional

router = APIRouter(prefix="/tools/fs", tags=["filesystem"])

class ReadRequest(BaseModel):
    path: str

class WriteRequest(BaseModel):
    path: str
    content: str

class ReadResponse(BaseModel):
    content: str
    path: str
    size: int

class WriteResponse(BaseModel):
    path: str
    bytes_written: int

@router.post("/read", response_model=ReadResponse)
async def read_file(request: ReadRequest):
    """Read a file from the filesystem"""
    try:
        path = Path(request.path)
        if not path.exists():
            raise HTTPException(status_code=404, detail=f"File not found: {request.path}")
        
        content = path.read_text()
        return ReadResponse(
            content=content,
            path=str(path),
            size=len(content)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/write", response_model=WriteResponse)
async def write_file(request: WriteRequest):
    """Write content to a file"""
    try:
        path = Path(request.path)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(request.content)
        
        return WriteResponse(
            path=str(path),
            bytes_written=len(request.content)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))