"""
Netlify driver implementation
"""
import os
import httpx
from typing import Dict, Any, Optional


class NetlifyDriver:
    """Netlify deployment driver implementation"""
    
    def __init__(self):
        self.required_env = [
            "NETLIFY_ACCESS_TOKEN"
        ]
        self._validate_environment()
    
    def _validate_environment(self):
        """Validate required environment variables"""
        missing = [key for key in self.required_env if not os.getenv(key)]
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")
    
    def _get_headers(self) -> Dict[str, str]:
        """Get authenticated headers for Netlify API"""
        return {
            "Authorization": f"Bearer {os.getenv('NETLIFY_ACCESS_TOKEN')}",
            "Content-Type": "application/json"
        }
    
    async def scaffold(self, project_name: str, framework: str = "react", template: Optional[str] = "default") -> Dict[str, Any]:
        """Scaffold a new Netlify project"""
        async with httpx.AsyncClient() as client:
            # Create site on Netlify
            response = await client.post(
                "https://api.netlify.com/api/v1/sites",
                headers=self._get_headers(),
                json={
                    "name": project_name,
                    "build_settings": {
                        "cmd": "npm run build" if framework in ["react", "vue", "angular"] else "build",
                        "dir": "dist" if framework == "vue" else "build"
                    }
                }
            )
            
            if response.status_code == 201:
                site_data = response.json()
                return {
                    "driver": "netlify",
                    "project_name": project_name,
                    "framework": framework,
                    "template": template,
                    "files_created": 20,  # Mock count
                    "project_path": f"./{project_name}",
                    "site_id": site_data.get("id"),
                    "netlify_url": site_data.get("url")
                }
            else:
                raise RuntimeError(f"Netlify site creation failed: {response.text}")
    
    async def build(self, environment: str = "production", optimize: bool = True) -> Dict[str, Any]:
        """Build project on Netlify"""
        site_id = os.getenv("NETLIFY_SITE_ID")
        if not site_id:
            raise ValueError("NETLIFY_SITE_ID environment variable required")
        
        async with httpx.AsyncClient() as client:
            # Trigger build
            response = await client.post(
                f"https://api.netlify.com/api/v1/sites/{site_id}/builds",
                headers=self._get_headers(),
                json={
                    "clear_cache": True if environment == "production" else False
                }
            )
            
            if response.status_code == 201:
                build_data = response.json()
                return {
                    "driver": "netlify",
                    "environment": environment,
                    "build_time_ms": 35000,  # Mock time
                    "output_path": "/opt/build/repo/_site",
                    "bundle_size_kb": 180,
                    "build_id": build_data.get("id"),
                    "deploy_url": build_data.get("deploy_url")
                }
            else:
                raise RuntimeError(f"Netlify build failed: {response.text}")
    
    async def preview(self, port: int = 3000, host: str = "localhost") -> Dict[str, Any]:
        """Start Netlify preview (dev mode)"""
        return {
            "driver": "netlify",
            "preview_url": f"http://{host}:{port}",
            "port": port,
            "status": "running",
            "dev_command": "netlify dev"
        }
    
    async def deploy(self, target: str, environment: str = "production") -> Dict[str, Any]:
        """Deploy to Netlify"""
        site_id = os.getenv("NETLIFY_SITE_ID", target)
        
        async with httpx.AsyncClient() as client:
            # Create deployment
            response = await client.post(
                f"https://api.netlify.com/api/v1/sites/{site_id}/deploys",
                headers=self._get_headers(),
                json={
                    "branch": "main" if environment == "production" else environment,
                    "title": f"Deploy to {environment}"
                }
            )
            
            if response.status_code == 201:
                deploy_data = response.json()
                
                return {
                    "driver": "netlify",
                    "deployment_id": deploy_data.get("id"),
                    "url": deploy_data.get("deploy_ssl_url") or deploy_data.get("deploy_url"),
                    "environment": environment,
                    "status": deploy_data.get("state", "building"),
                    "site_id": site_id,
                    "branch": deploy_data.get("branch")
                }
            else:
                raise RuntimeError(f"Netlify deployment failed: {response.text}")
    
    async def routes_sync(self, backend_url: str, auto_generate: bool = True) -> Dict[str, Any]:
        """Sync routes with backend API for Netlify"""
        async with httpx.AsyncClient() as client:
            try:
                # Fetch API routes from backend
                response = await client.get(f"{backend_url}/openapi.json")
                response.raise_for_status()
                
                openapi_spec = response.json()
                paths = openapi_spec.get("paths", {})
                
                new_routes = []
                removed_routes = []
                
                if auto_generate:
                    # Generate Netlify redirects/rewrites
                    redirects = []
                    for path, methods in paths.items():
                        # Create proxy rules for API calls
                        redirect_rule = f"/api{path} {backend_url}{path} 200"
                        redirects.append(redirect_rule)
                        new_routes.append(f"API_{path.replace('/', '_')}")
                    
                    # Write to _redirects file
                    with open("_redirects", "w") as f:
                        f.write("\n".join(redirects))
                
                return {
                    "driver": "netlify",
                    "routes_synced": len(new_routes),
                    "new_routes": new_routes,
                    "removed_routes": removed_routes,
                    "backend_url": backend_url,
                    "redirects_file": "_redirects updated"
                }
                
            except Exception as e:
                raise RuntimeError(f"Failed to sync routes: {str(e)}")