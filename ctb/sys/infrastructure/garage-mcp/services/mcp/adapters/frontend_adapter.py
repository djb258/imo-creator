"""
Frontend adapter - selects and manages frontend deployment drivers
"""
import os
import importlib
from typing import Dict, Any, Optional
import toml
from pathlib import Path


class FrontendAdapter:
    """Adapter for frontend operations that selects appropriate driver"""
    
    def __init__(self):
        self.driver = None
        self.driver_name = None
        self._load_driver()
    
    def _load_config(self) -> Dict[str, Any]:
        """Load driver configuration"""
        config_path = Path(__file__).parent.parent.parent.parent / "config" / "drivers.toml"
        if config_path.exists():
            return toml.load(config_path)
        return {}
    
    def _get_driver_name(self) -> str:
        """Get driver name from environment or config"""
        # Environment override takes precedence
        driver_name = os.getenv("FRONTEND_DRIVER")
        
        if not driver_name:
            # Fall back to config
            config = self._load_config()
            driver_name = config.get("frontend", {}).get("driver", "vercel")
        
        return driver_name
    
    def _load_driver(self):
        """Load the appropriate frontend driver"""
        self.driver_name = self._get_driver_name()
        
        try:
            # Import the driver module
            module_path = f"services.mcp.drivers.frontend.{self.driver_name}"
            driver_module = importlib.import_module(module_path)
            
            # Get the driver class (capitalize and add Driver suffix)
            class_name = f"{self.driver_name.title()}Driver"
            driver_class = getattr(driver_module, class_name)
            
            # Instantiate the driver
            self.driver = driver_class()
            
        except (ImportError, AttributeError) as e:
            raise RuntimeError(f"Failed to load frontend driver '{self.driver_name}': {str(e)}")
    
    def _redact_secrets(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Redact sensitive information from data before logging"""
        redacted = data.copy()
        
        # List of keys that might contain secrets
        secret_keys = [
            "token", "key", "secret", "credential", "api_key", 
            "access_token", "auth", "password", "deploy_key"
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
    
    async def scaffold(self, project_name: str, framework: str = "react", template: Optional[str] = "default") -> Dict[str, Any]:
        """Scaffold a new frontend project"""
        if not self.driver:
            raise RuntimeError("No frontend driver loaded")
        
        try:
            result = await self.driver.scaffold(project_name, framework, template)
            result["driver"] = self.driver_name
            return result
        except Exception as e:
            raise RuntimeError(f"Scaffolding failed with {self.driver_name} driver: {str(e)}")
    
    async def build(self, environment: str = "production", optimize: bool = True) -> Dict[str, Any]:
        """Build frontend application"""
        if not self.driver:
            raise RuntimeError("No frontend driver loaded")
        
        try:
            result = await self.driver.build(environment, optimize)
            result["driver"] = self.driver_name
            return result
        except Exception as e:
            raise RuntimeError(f"Build failed with {self.driver_name} driver: {str(e)}")
    
    async def preview(self, port: int = 3000, host: str = "localhost") -> Dict[str, Any]:
        """Start preview server"""
        if not self.driver:
            raise RuntimeError("No frontend driver loaded")
        
        try:
            result = await self.driver.preview(port, host)
            result["driver"] = self.driver_name
            return result
        except Exception as e:
            raise RuntimeError(f"Preview failed with {self.driver_name} driver: {str(e)}")
    
    async def deploy(self, target: str, environment: str = "production") -> Dict[str, Any]:
        """Deploy frontend application"""
        if not self.driver:
            raise RuntimeError("No frontend driver loaded")
        
        try:
            result = await self.driver.deploy(target, environment)
            result["driver"] = self.driver_name
            return result
        except Exception as e:
            raise RuntimeError(f"Deployment failed with {self.driver_name} driver: {str(e)}")
    
    async def routes_sync(self, backend_url: str, auto_generate: bool = True) -> Dict[str, Any]:
        """Sync routes with backend API"""
        if not self.driver:
            raise RuntimeError("No frontend driver loaded")
        
        try:
            result = await self.driver.routes_sync(backend_url, auto_generate)
            result["driver"] = self.driver_name
            return result
        except Exception as e:
            raise RuntimeError(f"Route sync failed with {self.driver_name} driver: {str(e)}")
    
    def get_driver_info(self) -> Dict[str, Any]:
        """Get information about the currently loaded driver"""
        return {
            "driver_name": self.driver_name,
            "driver_class": self.driver.__class__.__name__ if self.driver else None,
            "available_methods": [
                "scaffold", "build", "preview", "deploy", "routes_sync"
            ] if self.driver else []
        }