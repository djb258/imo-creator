from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent.parent))

from services.mcp.adapters.db_adapter import DatabaseAdapter

router = APIRouter(prefix="/tools/domains/db", tags=["domains", "database"])

class MigrateRequest(BaseModel):
    target_version: Optional[str] = None
    dry_run: bool = False

class MigrateResponse(BaseModel):
    current_version: str
    target_version: str
    migrations_applied: List[str]
    success: bool

class UpgradeRequest(BaseModel):
    force: bool = False

class UpgradeResponse(BaseModel):
    previous_version: str
    new_version: str
    upgraded: bool

class SeedRequest(BaseModel):
    dataset: str
    truncate: bool = False

class SeedResponse(BaseModel):
    dataset: str
    records_inserted: int
    tables_affected: List[str]

class SnapshotRequest(BaseModel):
    name: str
    include_data: bool = True

class SnapshotResponse(BaseModel):
    snapshot_id: str
    name: str
    timestamp: str
    size_bytes: int

class BackupRequest(BaseModel):
    backup_name: Optional[str] = None
    compress: bool = True

class BackupResponse(BaseModel):
    backup_id: str
    path: str
    size_bytes: int
    timestamp: str

class RestoreRequest(BaseModel):
    backup_id: str
    target_database: Optional[str] = None

class RestoreResponse(BaseModel):
    backup_id: str
    restored: bool
    target_database: str

@router.post("/migrate", response_model=MigrateResponse)
async def migrate(request: MigrateRequest):
    """Run database migrations"""
    try:
        adapter = DatabaseAdapter()
        result = await adapter.migrate(request.target_version, request.dry_run)
        
        return MigrateResponse(
            current_version=result.get("current_version", "unknown"),
            target_version=result.get("target_version", "latest"),
            migrations_applied=result.get("migrations_applied", []),
            success=result.get("success", True)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upgrade", response_model=UpgradeResponse)
async def upgrade(request: UpgradeRequest):
    """Upgrade database to latest version"""
    try:
        adapter = DatabaseAdapter()
        result = await adapter.upgrade(request.force)
        
        return UpgradeResponse(
            previous_version=result.get("previous_version", "unknown"),
            new_version=result.get("new_version", "unknown"),
            upgraded=result.get("upgraded", True)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/seed", response_model=SeedResponse)
async def seed(request: SeedRequest):
    """Seed database with test data"""
    try:
        adapter = DatabaseAdapter()
        result = await adapter.seed(request.dataset, request.truncate)
        
        return SeedResponse(
            dataset=result.get("dataset", request.dataset),
            records_inserted=result.get("records_inserted", 0),
            tables_affected=result.get("tables_affected", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/snapshot", response_model=SnapshotResponse)
async def snapshot(request: SnapshotRequest):
    """Create database snapshot"""
    try:
        adapter = DatabaseAdapter()
        result = await adapter.snapshot(request.name, request.include_data)
        
        return SnapshotResponse(
            snapshot_id=result.get("snapshot_id", f"snap_{datetime.now().strftime('%Y%m%d%H%M%S')}"),
            name=result.get("name", request.name),
            timestamp=result.get("timestamp", datetime.utcnow().isoformat()),
            size_bytes=result.get("size_bytes", 0)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/backup", response_model=BackupResponse)
async def backup(request: BackupRequest):
    """Create database backup"""
    try:
        adapter = DatabaseAdapter()
        result = await adapter.backup(request.backup_name, request.compress)
        
        return BackupResponse(
            backup_id=result.get("backup_id", f"backup_{datetime.now().strftime('%Y%m%d%H%M%S')}"),
            path=result.get("path", "/backups/backup.sql"),
            size_bytes=result.get("size_bytes", 0),
            timestamp=result.get("timestamp", datetime.utcnow().isoformat())
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/restore", response_model=RestoreResponse)
async def restore(request: RestoreRequest):
    """Restore database from backup"""
    try:
        adapter = DatabaseAdapter()
        result = await adapter.restore(request.backup_id, request.target_database)
        
        return RestoreResponse(
            backup_id=result.get("backup_id", request.backup_id),
            restored=result.get("restored", True),
            target_database=result.get("target_database", "default")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))