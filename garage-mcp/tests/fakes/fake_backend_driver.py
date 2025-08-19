"""
Fake backend driver for testing
"""
from typing import Dict, Any, Optional
from datetime import datetime


class FakeBackendDriver:
    """Fake backend driver for testing purposes"""
    
    def __init__(self):
        self.required_env = []  # No env requirements for testing
        self.calls = []  # Track method calls
    
    def _record_call(self, method: str, **kwargs):
        """Record method call for testing verification"""
        self.calls.append({
            "method": method,
            "args": kwargs,
            "timestamp": datetime.utcnow().isoformat()
        })
    
    async def scaffold(self, project_name: str, framework: str = "fastapi", database: Optional[str] = "postgresql") -> Dict[str, Any]:
        """Fake scaffolding"""
        self._record_call("scaffold", project_name=project_name, framework=framework, database=database)
        
        return {
            "driver": "fake_backend",
            "project_name": project_name,
            "framework": framework,
            "database": database,
            "files_created": 15,
            "project_path": f"./fake_{project_name}",
            "fake_service_id": f"fake_svc_{project_name}"
        }
    
    async def lint(self, fix: bool = False, config_file: Optional[str] = None) -> Dict[str, Any]:
        """Fake linting"""
        self._record_call("lint", fix=fix, config_file=config_file)
        
        issues_found = 5 if not fix else 0
        
        return {
            "driver": "fake_backend",
            "issues_found": issues_found,
            "issues_fixed": 5 if fix else 0,
            "files_checked": 20,
            "passed": issues_found == 0,
            "fake_linter": "fake-lint-tool"
        }
    
    async def test(self, test_suite: Optional[str] = "all", coverage: bool = True) -> Dict[str, Any]:
        """Fake testing"""
        self._record_call("test", test_suite=test_suite, coverage=coverage)
        
        return {
            "driver": "fake_backend",
            "tests_run": 42,
            "tests_passed": 40,
            "tests_failed": 2,
            "coverage_percent": 85.5 if coverage else 0.0,
            "test_suite": test_suite,
            "fake_test_runner": "fake-pytest"
        }
    
    async def container_build(self, tag: str, dockerfile: str = "Dockerfile", push: bool = False) -> Dict[str, Any]:
        """Fake container build"""
        self._record_call("container_build", tag=tag, dockerfile=dockerfile, push=push)
        
        fake_image_id = f"fake_{tag.replace(':', '_')}"
        
        return {
            "driver": "fake_backend",
            "image_id": fake_image_id,
            "tag": tag,
            "size_mb": 256,
            "pushed": push,
            "dockerfile": dockerfile,
            "fake_registry": "fake-registry.example.com" if push else "local"
        }
    
    async def deploy(self, target: str, environment: str = "production", replicas: int = 1) -> Dict[str, Any]:
        """Fake deployment"""
        self._record_call("deploy", target=target, environment=environment, replicas=replicas)
        
        deployment_id = f"fake_deploy_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        return {
            "driver": "fake_backend",
            "deployment_id": deployment_id,
            "environment": environment,
            "replicas": replicas,
            "status": "deployed",
            "endpoint": f"https://fake-{target}-{environment}.example.com",
            "fake_service_id": f"fake_svc_{target}"
        }
    
    async def cron_schedule(self, job_name: str, schedule: str, command: str, enabled: bool = True) -> Dict[str, Any]:
        """Fake cron scheduling"""
        self._record_call("cron_schedule", job_name=job_name, schedule=schedule, command=command, enabled=enabled)
        
        job_id = f"fake_job_{job_name}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        next_run = (datetime.utcnow()).isoformat()
        
        return {
            "driver": "fake_backend",
            "job_id": job_id,
            "job_name": job_name,
            "schedule": schedule,
            "next_run": next_run,
            "status": "scheduled" if enabled else "disabled",
            "command": command,
            "fake_scheduler": "fake-cron-service"
        }
    
    def get_calls(self) -> list:
        """Get all recorded method calls"""
        return self.calls.copy()
    
    def reset_calls(self):
        """Reset call history"""
        self.calls.clear()