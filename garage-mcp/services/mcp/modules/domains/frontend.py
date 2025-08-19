from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent.parent))

from services.mcp.adapters.frontend_adapter import FrontendAdapter

router = APIRouter(prefix="/tools/domains/frontend", tags=["domains", "frontend"])

class ScaffoldRequest(BaseModel):
    project_name: str
    framework: str = "react"
    template: Optional[str] = "default"

class ScaffoldResponse(BaseModel):
    project_name: str
    framework: str
    files_created: int
    project_path: str

class BuildRequest(BaseModel):
    environment: str = "production"
    optimize: bool = True

class BuildResponse(BaseModel):
    environment: str
    build_time_ms: int
    output_path: str
    bundle_size_kb: int

class PreviewRequest(BaseModel):
    port: int = 3000
    host: str = "localhost"

class PreviewResponse(BaseModel):
    preview_url: str
    port: int
    status: str

class DeployRequest(BaseModel):
    target: str
    environment: str = "production"

class DeployResponse(BaseModel):
    deployment_id: str
    url: str
    environment: str
    status: str

class RoutesSyncRequest(BaseModel):
    backend_url: str
    auto_generate: bool = True

class RoutesSyncResponse(BaseModel):
    routes_synced: int
    new_routes: List[str]
    removed_routes: List[str]

@router.post("/scaffold", response_model=ScaffoldResponse)
async def scaffold(request: ScaffoldRequest):
    """Scaffold a new frontend project"""
    try:
        adapter = FrontendAdapter()
        result = await adapter.scaffold(
            project_name=request.project_name,
            framework=request.framework,
            template=request.template
        )
        
        return ScaffoldResponse(
            project_name=result.get("project_name", request.project_name),
            framework=result.get("framework", request.framework),
            files_created=result.get("files_created", 0),
            project_path=result.get("project_path", f"./{request.project_name}")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/build", response_model=BuildResponse)
async def build(request: BuildRequest):
    """Build frontend application"""
    try:
        adapter = FrontendAdapter()
        result = await adapter.build(
            environment=request.environment,
            optimize=request.optimize
        )
        
        return BuildResponse(
            environment=result.get("environment", request.environment),
            build_time_ms=result.get("build_time_ms", 0),
            output_path=result.get("output_path", "./dist"),
            bundle_size_kb=result.get("bundle_size_kb", 0)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/preview", response_model=PreviewResponse)
async def preview(request: PreviewRequest):
    """Start preview server"""
    try:
        adapter = FrontendAdapter()
        result = await adapter.preview(
            port=request.port,
            host=request.host
        )
        
        return PreviewResponse(
            preview_url=result.get("preview_url", f"http://{request.host}:{request.port}"),
            port=result.get("port", request.port),
            status=result.get("status", "running")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/deploy", response_model=DeployResponse)
async def deploy(request: DeployRequest):
    """Deploy frontend application"""
    try:
        adapter = FrontendAdapter()
        result = await adapter.deploy(
            target=request.target,
            environment=request.environment
        )
        
        from datetime import datetime
        default_deployment_id = f"deploy_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        return DeployResponse(
            deployment_id=result.get("deployment_id", default_deployment_id),
            url=result.get("url", f"https://{request.target}.example.com"),
            environment=result.get("environment", request.environment),
            status=result.get("status", "deployed")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/routes_sync", response_model=RoutesSyncResponse)
async def routes_sync(request: RoutesSyncRequest):
    """Sync routes with backend API"""
    try:
        adapter = FrontendAdapter()
        result = await adapter.routes_sync(
            backend_url=request.backend_url,
            auto_generate=request.auto_generate
        )
        
        return RoutesSyncResponse(
            routes_synced=result.get("routes_synced", 0),
            new_routes=result.get("new_routes", []),
            removed_routes=result.get("removed_routes", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))