from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent.parent))

from services.mcp.adapters.backend_adapter import BackendAdapter

router = APIRouter(prefix="/tools/domains/backend", tags=["domains", "backend"])

class ScaffoldRequest(BaseModel):
    project_name: str
    framework: str = "fastapi"
    database: Optional[str] = "postgresql"

class ScaffoldResponse(BaseModel):
    project_name: str
    framework: str
    files_created: int
    project_path: str

class LintRequest(BaseModel):
    fix: bool = False
    config_file: Optional[str] = None

class LintResponse(BaseModel):
    issues_found: int
    issues_fixed: int
    files_checked: int
    passed: bool

class TestRequest(BaseModel):
    test_suite: Optional[str] = "all"
    coverage: bool = True

class TestResponse(BaseModel):
    tests_run: int
    tests_passed: int
    tests_failed: int
    coverage_percent: float

class ContainerBuildRequest(BaseModel):
    tag: str
    dockerfile: str = "Dockerfile"
    push: bool = False

class ContainerBuildResponse(BaseModel):
    image_id: str
    tag: str
    size_mb: int
    pushed: bool

class DeployRequest(BaseModel):
    target: str
    environment: str = "production"
    replicas: int = 1

class DeployResponse(BaseModel):
    deployment_id: str
    environment: str
    replicas: int
    status: str
    endpoint: str

class CronScheduleRequest(BaseModel):
    job_name: str
    schedule: str  # Cron expression
    command: str
    enabled: bool = True

class CronScheduleResponse(BaseModel):
    job_id: str
    job_name: str
    schedule: str
    next_run: str
    status: str

@router.post("/scaffold", response_model=ScaffoldResponse)
async def scaffold(request: ScaffoldRequest):
    """Scaffold a new backend project"""
    try:
        adapter = BackendAdapter()
        result = await adapter.scaffold(
            project_name=request.project_name,
            framework=request.framework,
            database=request.database
        )
        
        return ScaffoldResponse(
            project_name=result.get("project_name", request.project_name),
            framework=result.get("framework", request.framework),
            files_created=result.get("files_created", 0),
            project_path=result.get("project_path", f"./{request.project_name}")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/lint", response_model=LintResponse)
async def lint(request: LintRequest):
    """Run linting on backend code"""
    try:
        adapter = BackendAdapter()
        result = await adapter.lint(
            fix=request.fix,
            config_file=request.config_file
        )
        
        return LintResponse(
            issues_found=result.get("issues_found", 0),
            issues_fixed=result.get("issues_fixed", 0),
            files_checked=result.get("files_checked", 0),
            passed=result.get("passed", True)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/test", response_model=TestResponse)
async def test(request: TestRequest):
    """Run test suite"""
    try:
        adapter = BackendAdapter()
        result = await adapter.test(
            test_suite=request.test_suite,
            coverage=request.coverage
        )
        
        return TestResponse(
            tests_run=result.get("tests_run", 0),
            tests_passed=result.get("tests_passed", 0),
            tests_failed=result.get("tests_failed", 0),
            coverage_percent=result.get("coverage_percent", 0.0)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/container_build", response_model=ContainerBuildResponse)
async def container_build(request: ContainerBuildRequest):
    """Build container image"""
    try:
        adapter = BackendAdapter()
        result = await adapter.container_build(
            tag=request.tag,
            dockerfile=request.dockerfile,
            push=request.push
        )
        
        return ContainerBuildResponse(
            image_id=result.get("image_id", ""),
            tag=result.get("tag", request.tag),
            size_mb=result.get("size_mb", 0),
            pushed=result.get("pushed", request.push)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/deploy", response_model=DeployResponse)
async def deploy(request: DeployRequest):
    """Deploy backend service"""
    try:
        adapter = BackendAdapter()
        result = await adapter.deploy(
            target=request.target,
            environment=request.environment,
            replicas=request.replicas
        )
        
        from datetime import datetime
        default_deployment_id = f"deploy_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        return DeployResponse(
            deployment_id=result.get("deployment_id", default_deployment_id),
            environment=result.get("environment", request.environment),
            replicas=result.get("replicas", request.replicas),
            status=result.get("status", "deployed"),
            endpoint=result.get("endpoint", f"https://api-{request.environment}.example.com")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/cron_schedule", response_model=CronScheduleResponse)
async def cron_schedule(request: CronScheduleRequest):
    """Schedule a cron job"""
    try:
        adapter = BackendAdapter()
        result = await adapter.cron_schedule(
            job_name=request.job_name,
            schedule=request.schedule,
            command=request.command,
            enabled=request.enabled
        )
        
        from datetime import datetime, timedelta
        default_job_id = f"cron_{request.job_name}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        default_next_run = (datetime.utcnow() + timedelta(hours=1)).isoformat()
        
        return CronScheduleResponse(
            job_id=result.get("job_id", default_job_id),
            job_name=result.get("job_name", request.job_name),
            schedule=result.get("schedule", request.schedule),
            next_run=result.get("next_run", default_next_run),
            status=result.get("status", "scheduled" if request.enabled else "disabled")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))