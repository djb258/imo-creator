"""Subagent registry module for garage-mcp"""
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import os
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent.parent))

router = APIRouter(prefix="/registry", tags=["registry"])

class SubagentItem(BaseModel):
    id: str
    bay: str
    description: str
    namespace: Optional[str] = None
    version: str = "1.0.0"
    status: str = "active"

class SubagentRegistryResponse(BaseModel):
    items: List[SubagentItem]
    total: int
    bay_filter: Optional[str] = None

# Static registry of available subagents
SUBAGENT_REGISTRY = [
    # Core HEIR subagents
    {
        "id": "heir-check", 
        "bay": "backend", 
        "description": "Run HEIR compliance validation checks",
        "namespace": "heir",
        "version": "1.0.0",
        "status": "active"
    },
    {
        "id": "validate-ssot",
        "bay": "frontend", 
        "description": "Validate SSOT against HEIR schema",
        "namespace": "validation",
        "version": "1.0.0", 
        "status": "active"
    },
    {
        "id": "register-blueprint",
        "bay": "backend",
        "description": "Persist + emit registration event", 
        "namespace": "blueprint",
        "version": "1.0.0",
        "status": "active"
    },
    
    # Database subagents
    {
        "id": "db-backup",
        "bay": "database",
        "description": "Create database backup snapshot",
        "namespace": "db",
        "version": "1.0.0",
        "status": "active"
    },
    {
        "id": "db-migrate", 
        "bay": "database",
        "description": "Run database schema migrations",
        "namespace": "db",
        "version": "1.0.0",
        "status": "active"
    },
    {
        "id": "db-seed",
        "bay": "database", 
        "description": "Seed database with initial data",
        "namespace": "db",
        "version": "1.0.0",
        "status": "active"
    },
    
    # Backend subagents
    {
        "id": "backend-deploy",
        "bay": "backend",
        "description": "Deploy backend service to target environment", 
        "namespace": "deploy",
        "version": "1.0.0",
        "status": "active"
    },
    {
        "id": "backend-test",
        "bay": "backend",
        "description": "Run backend test suite",
        "namespace": "test", 
        "version": "1.0.0",
        "status": "active"
    },
    {
        "id": "container-build",
        "bay": "backend",
        "description": "Build Docker container for backend",
        "namespace": "docker",
        "version": "1.0.0", 
        "status": "active"
    },
    
    # Frontend subagents  
    {
        "id": "frontend-build",
        "bay": "frontend",
        "description": "Build frontend application for production",
        "namespace": "build",
        "version": "1.0.0",
        "status": "active"
    },
    {
        "id": "frontend-deploy", 
        "bay": "frontend",
        "description": "Deploy frontend to CDN/hosting platform",
        "namespace": "deploy",
        "version": "1.0.0",
        "status": "active"
    },
    {
        "id": "routes-sync",
        "bay": "frontend", 
        "description": "Synchronize frontend route definitions",
        "namespace": "routing",
        "version": "1.0.0",
        "status": "active"
    },
    
    # Data processing subagents
    {
        "id": "ingest-extract",
        "bay": "data",
        "description": "Extract data from various sources",
        "namespace": "intake", 
        "version": "1.0.0",
        "status": "active"
    },
    {
        "id": "ingest-parse",
        "bay": "data",
        "description": "Parse and structure ingested data",
        "namespace": "intake",
        "version": "1.0.0",
        "status": "active"
    },
    {
        "id": "mapping-validate", 
        "bay": "data",
        "description": "Validate data mappings against schema",
        "namespace": "mapping",
        "version": "1.0.0",
        "status": "active"
    },
    
    # Utility subagents
    {
        "id": "git-commit",
        "bay": "backend",
        "description": "Create git commit with standardized message",
        "namespace": "git",
        "version": "1.0.0",
        "status": "active"
    },
    {
        "id": "fs-read",
        "bay": "backend", 
        "description": "Read files from filesystem with safety checks",
        "namespace": "fs",
        "version": "1.0.0",
        "status": "active"
    },
    {
        "id": "fs-write",
        "bay": "backend",
        "description": "Write files to filesystem with validation", 
        "namespace": "fs",
        "version": "1.0.0", 
        "status": "active"
    },
    
    # Sidecar integration
    {
        "id": "sidecar-event",
        "bay": "backend",
        "description": "Emit structured events to sidecar service",
        "namespace": "sidecar", 
        "version": "1.0.0",
        "status": "active"
    },
    {
        "id": "sidecar-health",
        "bay": "backend",
        "description": "Check sidecar service health status",
        "namespace": "sidecar",
        "version": "1.0.0", 
        "status": "active"
    }
]

@router.get("/subagents", response_model=SubagentRegistryResponse)
async def list_subagents(bay: str = None, namespace: str = None, status: str = "active"):
    """
    List available subagents in the registry
    
    Args:
        bay: Filter by bay (backend, frontend, database, data)
        namespace: Filter by namespace (heir, validation, db, etc.)
        status: Filter by status (active, inactive, deprecated)
    """
    items = SUBAGENT_REGISTRY.copy()
    
    # Apply filters
    if bay:
        items = [item for item in items if item["bay"] == bay]
        
    if namespace:
        items = [item for item in items if item.get("namespace") == namespace]
        
    if status:
        items = [item for item in items if item.get("status", "active") == status]
    
    # Convert to Pydantic models
    subagent_items = [SubagentItem(**item) for item in items]
    
    return SubagentRegistryResponse(
        items=subagent_items,
        total=len(subagent_items),
        bay_filter=bay
    )

@router.get("/subagents/{subagent_id}")
async def get_subagent_details(subagent_id: str):
    """Get detailed information about a specific subagent"""
    for item in SUBAGENT_REGISTRY:
        if item["id"] == subagent_id:
            return SubagentItem(**item)
    
    raise HTTPException(status_code=404, detail=f"Subagent '{subagent_id}' not found")

@router.get("/bays")
async def list_bays():
    """List all available bays and their subagent counts"""
    bay_counts = {}
    for item in SUBAGENT_REGISTRY:
        bay = item["bay"]
        if bay not in bay_counts:
            bay_counts[bay] = {"count": 0, "subagents": []}
        bay_counts[bay]["count"] += 1
        bay_counts[bay]["subagents"].append(item["id"])
    
    return {
        "bays": bay_counts,
        "total_bays": len(bay_counts),
        "total_subagents": len(SUBAGENT_REGISTRY)
    }

@router.get("/namespaces")
async def list_namespaces():
    """List all available namespaces and their subagent counts"""
    namespace_counts = {}
    for item in SUBAGENT_REGISTRY:
        namespace = item.get("namespace", "default")
        if namespace not in namespace_counts:
            namespace_counts[namespace] = {"count": 0, "subagents": []}
        namespace_counts[namespace]["count"] += 1
        namespace_counts[namespace]["subagents"].append(item["id"])
    
    return {
        "namespaces": namespace_counts,
        "total_namespaces": len(namespace_counts)
    }