"""
Fake database driver for testing
"""
from typing import Dict, Any, Optional
from datetime import datetime


class FakeDbDriver:
    """Fake database driver for testing purposes"""
    
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
    
    async def migrate(self, target_version: Optional[str] = None, dry_run: bool = False) -> Dict[str, Any]:
        """Fake migration"""
        self._record_call("migrate", target_version=target_version, dry_run=dry_run)
        
        return {
            "driver": "fake_db",
            "current_version": "1.0.0",
            "target_version": target_version or "latest",
            "migrations_applied": ["001_init", "002_add_users"] if not dry_run else [],
            "success": True,
            "dry_run": dry_run
        }
    
    async def upgrade(self, force: bool = False) -> Dict[str, Any]:
        """Fake upgrade"""
        self._record_call("upgrade", force=force)
        
        return {
            "driver": "fake_db",
            "previous_version": "1.0.0",
            "new_version": "1.1.0",
            "upgraded": True
        }
    
    async def seed(self, dataset: str, truncate: bool = False) -> Dict[str, Any]:
        """Fake seeding"""
        self._record_call("seed", dataset=dataset, truncate=truncate)
        
        return {
            "driver": "fake_db",
            "dataset": dataset,
            "records_inserted": 100,
            "tables_affected": ["users", "products"],
            "truncated": truncate
        }
    
    async def snapshot(self, name: str, include_data: bool = True) -> Dict[str, Any]:
        """Fake snapshot"""
        self._record_call("snapshot", name=name, include_data=include_data)
        
        snapshot_id = f"fake_snap_{name}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        return {
            "driver": "fake_db",
            "snapshot_id": snapshot_id,
            "name": name,
            "timestamp": datetime.utcnow().isoformat(),
            "size_bytes": 1024 * 1024,  # 1MB
            "include_data": include_data
        }
    
    async def backup(self, backup_name: Optional[str] = None, compress: bool = True) -> Dict[str, Any]:
        """Fake backup"""
        backup_name = backup_name or f"fake_backup_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        self._record_call("backup", backup_name=backup_name, compress=compress)
        
        return {
            "driver": "fake_db",
            "backup_id": backup_name,
            "path": f"/fake/backups/{backup_name}.sql{'gz' if compress else ''}",
            "size_bytes": 2048 * 1024,  # 2MB
            "timestamp": datetime.utcnow().isoformat(),
            "compressed": compress
        }
    
    async def restore(self, backup_id: str, target_database: Optional[str] = None) -> Dict[str, Any]:
        """Fake restore"""
        self._record_call("restore", backup_id=backup_id, target_database=target_database)
        
        return {
            "driver": "fake_db",
            "backup_id": backup_id,
            "restored": True,
            "target_database": target_database or "fake_default"
        }
    
    def get_calls(self) -> list:
        """Get all recorded method calls"""
        return self.calls.copy()
    
    def reset_calls(self):
        """Reset call history"""
        self.calls.clear()