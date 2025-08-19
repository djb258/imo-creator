"""
Database adapter - selects and manages database drivers
"""
import os
import importlib
from typing import Dict, Any, Optional
import toml
from pathlib import Path
from .sidecar_client import SidecarClient


class DatabaseAdapter:
    """Adapter for database operations that selects appropriate driver"""
    
    def __init__(self):
        self.driver = None
        self.driver_name = None
        self.sidecar = SidecarClient()
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
        driver_name = os.getenv("DB_DRIVER")
        
        if not driver_name:
            # Fall back to config
            config = self._load_config()
            driver_name = config.get("database", {}).get("driver", "postgres_local")
        
        return driver_name
    
    def _load_driver(self):
        """Load the appropriate database driver"""
        self.driver_name = self._get_driver_name()
        
        try:
            # Import the driver module
            module_path = f"services.mcp.drivers.db.{self.driver_name}"
            driver_module = importlib.import_module(module_path)
            
            # Get the driver class (capitalize and add Driver suffix)
            class_name = f"{self.driver_name.title().replace('_', '')}Driver"
            driver_class = getattr(driver_module, class_name)
            
            # Instantiate the driver
            self.driver = driver_class()
            
        except (ImportError, AttributeError) as e:
            raise RuntimeError(f"Failed to load database driver '{self.driver_name}': {str(e)}")
    
    def _redact_secrets(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Redact sensitive information from data before logging"""
        redacted = data.copy()
        
        # List of keys that might contain secrets
        secret_keys = [
            "password", "token", "key", "secret", "credential",
            "api_key", "access_token", "service_key", "auth"
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
    
    async def migrate(self, target_version: Optional[str] = None, dry_run: bool = False) -> Dict[str, Any]:
        """Run database migrations"""
        if not self.driver:
            raise RuntimeError("No database driver loaded")
        
        params = {"target_version": target_version, "dry_run": dry_run}
        
        try:
            result = await self.driver.migrate(target_version, dry_run)
            result["driver"] = self.driver_name
            
            # Log to sidecar
            await self.sidecar.log_adapter_event(
                adapter_type="database",
                method="migrate",
                driver=self.driver_name,
                params=params,
                result=self._redact_secrets(result)
            )
            
            return result
        except Exception as e:
            # Log error to sidecar
            await self.sidecar.log_adapter_event(
                adapter_type="database",
                method="migrate",
                driver=self.driver_name,
                params=params,
                error=str(e)
            )
            raise RuntimeError(f"Migration failed with {self.driver_name} driver: {str(e)}")
    
    async def upgrade(self, force: bool = False) -> Dict[str, Any]:
        """Upgrade database to latest version"""
        if not self.driver:
            raise RuntimeError("No database driver loaded")
        
        params = {"force": force}
        
        try:
            result = await self.driver.upgrade(force)
            result["driver"] = self.driver_name
            
            # Log to sidecar
            await self.sidecar.log_adapter_event(
                adapter_type="database",
                method="upgrade",
                driver=self.driver_name,
                params=params,
                result=self._redact_secrets(result)
            )
            
            return result
        except Exception as e:
            # Log error to sidecar
            await self.sidecar.log_adapter_event(
                adapter_type="database",
                method="upgrade",
                driver=self.driver_name,
                params=params,
                error=str(e)
            )
            raise RuntimeError(f"Upgrade failed with {self.driver_name} driver: {str(e)}")
    
    async def seed(self, dataset: str, truncate: bool = False) -> Dict[str, Any]:
        """Seed database with data"""
        if not self.driver:
            raise RuntimeError("No database driver loaded")
        
        params = {"dataset": dataset, "truncate": truncate}
        
        try:
            result = await self.driver.seed(dataset, truncate)
            result["driver"] = self.driver_name
            
            # Log to sidecar
            await self.sidecar.log_adapter_event(
                adapter_type="database",
                method="seed",
                driver=self.driver_name,
                params=params,
                result=self._redact_secrets(result)
            )
            
            return result
        except Exception as e:
            # Log error to sidecar
            await self.sidecar.log_adapter_event(
                adapter_type="database",
                method="seed",
                driver=self.driver_name,
                params=params,
                error=str(e)
            )
            raise RuntimeError(f"Seeding failed with {self.driver_name} driver: {str(e)}")
    
    async def snapshot(self, name: str, include_data: bool = True) -> Dict[str, Any]:
        """Create database snapshot"""
        if not self.driver:
            raise RuntimeError("No database driver loaded")
        
        params = {"name": name, "include_data": include_data}
        
        try:
            result = await self.driver.snapshot(name, include_data)
            result["driver"] = self.driver_name
            
            # Log to sidecar
            await self.sidecar.log_adapter_event(
                adapter_type="database",
                method="snapshot",
                driver=self.driver_name,
                params=params,
                result=self._redact_secrets(result)
            )
            
            return result
        except Exception as e:
            # Log error to sidecar
            await self.sidecar.log_adapter_event(
                adapter_type="database",
                method="snapshot",
                driver=self.driver_name,
                params=params,
                error=str(e)
            )
            raise RuntimeError(f"Snapshot failed with {self.driver_name} driver: {str(e)}")
    
    async def backup(self, backup_name: Optional[str] = None, compress: bool = True) -> Dict[str, Any]:
        """Create database backup"""
        if not self.driver:
            raise RuntimeError("No database driver loaded")
        
        params = {"backup_name": backup_name, "compress": compress}
        
        try:
            result = await self.driver.backup(backup_name, compress)
            result["driver"] = self.driver_name
            
            # Log to sidecar
            await self.sidecar.log_adapter_event(
                adapter_type="database",
                method="backup",
                driver=self.driver_name,
                params=params,
                result=self._redact_secrets(result)
            )
            
            return result
        except Exception as e:
            # Log error to sidecar
            await self.sidecar.log_adapter_event(
                adapter_type="database",
                method="backup",
                driver=self.driver_name,
                params=params,
                error=str(e)
            )
            raise RuntimeError(f"Backup failed with {self.driver_name} driver: {str(e)}")
    
    async def restore(self, backup_id: str, target_database: Optional[str] = None) -> Dict[str, Any]:
        """Restore from database backup"""
        if not self.driver:
            raise RuntimeError("No database driver loaded")
        
        params = {"backup_id": backup_id, "target_database": target_database}
        
        try:
            result = await self.driver.restore(backup_id, target_database)
            result["driver"] = self.driver_name
            
            # Log to sidecar
            await self.sidecar.log_adapter_event(
                adapter_type="database",
                method="restore",
                driver=self.driver_name,
                params=params,
                result=self._redact_secrets(result)
            )
            
            return result
        except Exception as e:
            # Log error to sidecar
            await self.sidecar.log_adapter_event(
                adapter_type="database",
                method="restore",
                driver=self.driver_name,
                params=params,
                error=str(e)
            )
            raise RuntimeError(f"Restore failed with {self.driver_name} driver: {str(e)}")
    
    def get_driver_info(self) -> Dict[str, Any]:
        """Get information about the currently loaded driver"""
        return {
            "driver_name": self.driver_name,
            "driver_class": self.driver.__class__.__name__ if self.driver else None,
            "available_methods": [
                "migrate", "upgrade", "seed", "snapshot", "backup", "restore"
            ] if self.driver else []
        }