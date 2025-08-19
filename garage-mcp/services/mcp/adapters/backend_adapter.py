"""
Backend adapter - selects and manages backend deployment drivers
"""
import os
import importlib
from typing import Dict, Any, Optional
import toml
from pathlib import Path


class BackendAdapter:
    """Adapter for backend operations that selects appropriate driver"""
    
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
        driver_name = os.getenv("BACKEND_DRIVER")
        
        if not driver_name:
            # Fall back to config
            config = self._load_config()
            driver_name = config.get("backend", {}).get("driver", "render")
        
        return driver_name
    
    def _load_driver(self):
        """Load the appropriate backend driver"""
        self.driver_name = self._get_driver_name()
        
        try:
            # Import the driver module
            module_path = f"services.mcp.drivers.backend.{self.driver_name}"
            driver_module = importlib.import_module(module_path)
            
            # Get the driver class (capitalize and add Driver suffix)
            class_name = f"{self.driver_name.title()}Driver"
            driver_class = getattr(driver_module, class_name)
            
            # Instantiate the driver
            self.driver = driver_class()
            
        except (ImportError, AttributeError) as e:
            raise RuntimeError(f"Failed to load backend driver '{self.driver_name}': {str(e)}")
    
    def _redact_secrets(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Redact sensitive information from data before logging"""
        redacted = data.copy()
        
        # List of keys that might contain secrets
        secret_keys = [
            "token", "key", "secret", "credential", "api_key", 
            "access_token", "auth", "password", "deploy_key",
            "service_key", "auth_token"
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
    
    async def scaffold(self, project_name: str, framework: str = "fastapi", database: Optional[str] = "postgresql") -> Dict[str, Any]:
        """Scaffold a new backend project"""
        if not self.driver:
            raise RuntimeError("No backend driver loaded")
        
        try:
            result = await self.driver.scaffold(project_name, framework, database)
            result["driver"] = self.driver_name
            return result
        except Exception as e:
            raise RuntimeError(f"Scaffolding failed with {self.driver_name} driver: {str(e)}")
    
    async def lint(self, fix: bool = False, config_file: Optional[str] = None) -> Dict[str, Any]:
        """Run linting on backend code"""
        if not self.driver:
            raise RuntimeError("No backend driver loaded")
        
        try:
            result = await self.driver.lint(fix, config_file)
            result["driver"] = self.driver_name
            return result
        except Exception as e:
            raise RuntimeError(f"Linting failed with {self.driver_name} driver: {str(e)}")
    
    async def test(self, test_suite: Optional[str] = "all", coverage: bool = True) -> Dict[str, Any]:
        """Run test suite"""
        if not self.driver:
            raise RuntimeError("No backend driver loaded")
        
        try:
            result = await self.driver.test(test_suite, coverage)
            result["driver"] = self.driver_name
            return result
        except Exception as e:
            raise RuntimeError(f"Testing failed with {self.driver_name} driver: {str(e)}")
    
    async def container_build(self, tag: str, dockerfile: str = "Dockerfile", push: bool = False) -> Dict[str, Any]:
        """Build container image"""
        if not self.driver:
            raise RuntimeError("No backend driver loaded")
        
        try:
            result = await self.driver.container_build(tag, dockerfile, push)
            result["driver"] = self.driver_name
            return result
        except Exception as e:
            raise RuntimeError(f"Container build failed with {self.driver_name} driver: {str(e)}")
    
    async def deploy(self, target: str, environment: str = "production", replicas: int = 1) -> Dict[str, Any]:
        """Deploy backend service"""
        if not self.driver:
            raise RuntimeError("No backend driver loaded")
        
        try:
            result = await self.driver.deploy(target, environment, replicas)
            result["driver"] = self.driver_name
            return result
        except Exception as e:
            raise RuntimeError(f"Deployment failed with {self.driver_name} driver: {str(e)}")
    
    async def cron_schedule(self, job_name: str, schedule: str, command: str, enabled: bool = True) -> Dict[str, Any]:
        """Schedule a cron job"""
        if not self.driver:
            raise RuntimeError("No backend driver loaded")
        
        try:
            result = await self.driver.cron_schedule(job_name, schedule, command, enabled)
            result["driver"] = self.driver_name
            return result
        except Exception as e:
            raise RuntimeError(f"Cron scheduling failed with {self.driver_name} driver: {str(e)}")
    
    def get_driver_info(self) -> Dict[str, Any]:
        """Get information about the currently loaded driver"""
        return {
            "driver_name": self.driver_name,
            "driver_class": self.driver.__class__.__name__ if self.driver else None,
            "available_methods": [
                "scaffold", "lint", "test", "container_build", "deploy", "cron_schedule"
            ] if self.driver else []
        }