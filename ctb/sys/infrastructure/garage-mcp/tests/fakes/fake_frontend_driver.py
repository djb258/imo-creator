"""
Fake frontend driver for testing
"""
from typing import Dict, Any, Optional
from datetime import datetime


class FakeFrontendDriver:
    """Fake frontend driver for testing purposes"""
    
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
    
    async def scaffold(self, project_name: str, framework: str = "react", template: Optional[str] = "default") -> Dict[str, Any]:
        """Fake scaffolding"""
        self._record_call("scaffold", project_name=project_name, framework=framework, template=template)
        
        return {
            "driver": "fake_frontend",
            "project_name": project_name,
            "framework": framework,
            "template": template,
            "files_created": 25,
            "project_path": f"./fake_{project_name}",
            "fake_url": f"https://fake-{project_name}.example.com"
        }
    
    async def build(self, environment: str = "production", optimize: bool = True) -> Dict[str, Any]:
        """Fake build"""
        self._record_call("build", environment=environment, optimize=optimize)
        
        return {
            "driver": "fake_frontend",
            "environment": environment,
            "build_time_ms": 30000,  # 30 seconds
            "output_path": "/fake/dist",
            "bundle_size_kb": 512,
            "optimized": optimize,
            "fake_build_id": f"build_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        }
    
    async def preview(self, port: int = 3000, host: str = "localhost") -> Dict[str, Any]:
        """Fake preview"""
        self._record_call("preview", port=port, host=host)
        
        return {
            "driver": "fake_frontend",
            "preview_url": f"http://{host}:{port}",
            "port": port,
            "status": "running",
            "dev_command": "fake dev server"
        }
    
    async def deploy(self, target: str, environment: str = "production") -> Dict[str, Any]:
        """Fake deployment"""
        self._record_call("deploy", target=target, environment=environment)
        
        deployment_id = f"fake_deploy_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        return {
            "driver": "fake_frontend",
            "deployment_id": deployment_id,
            "url": f"https://fake-{target}-{environment}.example.com",
            "environment": environment,
            "status": "deployed",
            "fake_deploy_time": datetime.utcnow().isoformat()
        }
    
    async def routes_sync(self, backend_url: str, auto_generate: bool = True) -> Dict[str, Any]:
        """Fake route sync"""
        self._record_call("routes_sync", backend_url=backend_url, auto_generate=auto_generate)
        
        # Simulate some fake routes
        fake_routes = [
            "/api/users",
            "/api/products", 
            "/api/orders"
        ] if auto_generate else []
        
        return {
            "driver": "fake_frontend",
            "routes_synced": len(fake_routes),
            "new_routes": fake_routes,
            "removed_routes": [],
            "backend_url": backend_url,
            "fake_config_updated": True
        }
    
    def get_calls(self) -> list:
        """Get all recorded method calls"""
        return self.calls.copy()
    
    def reset_calls(self):
        """Reset call history"""
        self.calls.clear()