from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
import sys
import toml
import importlib
import httpx
from pathlib import Path
from datetime import datetime

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

app = FastAPI(title="MCP Service", version="1.0.0")

MCP_TOKEN = os.getenv("MCP_TOKEN", "dev-local")
SIDECAR_URL = os.getenv("SIDECAR_URL", "http://localhost:8000")

async def verify_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    if token != MCP_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return token

async def post_event_to_sidecar(tool: str, params: Dict[str, Any], result: Any, error: Optional[str] = None):
    try:
        async with httpx.AsyncClient() as client:
            event_data = {
                "tool": tool,
                "params": params,
                "result": result,
                "error": error,
                "timestamp": datetime.utcnow().isoformat()
            }
            await client.post(f"{SIDECAR_URL}/events/mcp", json=event_data)
    except Exception as e:
        print(f"Failed to post event to sidecar: {e}")

def load_config():
    """Load configuration from toolbox.toml"""
    config_path = Path(__file__).parent.parent.parent / "config" / "toolbox.toml"
    if not config_path.exists():
        print(f"Warning: Config file not found at {config_path}")
        return {}
    
    return toml.load(config_path)

def get_selected_bay(config):
    """Determine which bay to load"""
    bay_env = os.getenv("BAY")
    if bay_env:
        return bay_env
    return config.get("system", {}).get("default_bay", "database")

def load_routers():
    """Dynamically load routers based on configuration"""
    config = load_config()
    loaded_modules = []
    
    # Always load core modules
    core_modules = config.get("core", {}).get("modules", [])
    if config.get("core", {}).get("enabled", True):
        for module_name in core_modules:
            try:
                module = importlib.import_module(f"services.mcp.modules.core.{module_name}")
                if hasattr(module, "router"):
                    app.include_router(module.router)
                    loaded_modules.append(f"core.{module_name}")
                    print(f"Loaded core module: {module_name}")
            except Exception as e:
                print(f"Failed to load core module {module_name}: {e}")
    
    # Always load intake modules
    intake_modules = config.get("intake", {}).get("modules", [])
    if config.get("intake", {}).get("enabled", True):
        for module_name in intake_modules:
            try:
                module = importlib.import_module(f"services.mcp.modules.intake.{module_name}")
                if hasattr(module, "router"):
                    app.include_router(module.router)
                    loaded_modules.append(f"intake.{module_name}")
                    print(f"Loaded intake module: {module_name}")
            except Exception as e:
                print(f"Failed to load intake module {module_name}: {e}")
    
    # Load selected bay's domain modules
    selected_bay = get_selected_bay(config)
    bay_config_path = Path(__file__).parent.parent.parent / "bays" / f"{selected_bay}.toml"
    
    if bay_config_path.exists():
        bay_config = toml.load(bay_config_path)
        domain_modules = bay_config.get("modules", {}).get("domains", [])
        
        for module_name in domain_modules:
            try:
                module = importlib.import_module(f"services.mcp.modules.domains.{module_name}")
                if hasattr(module, "router"):
                    app.include_router(module.router)
                    loaded_modules.append(f"domains.{module_name}")
                    print(f"Loaded domain module for bay '{selected_bay}': {module_name}")
            except Exception as e:
                print(f"Failed to load domain module {module_name}: {e}")
    else:
        print(f"Warning: Bay configuration not found for '{selected_bay}'")
    
    return loaded_modules

@app.on_event("startup")
async def startup_event():
    """Load routers on startup"""
    loaded = load_routers()
    print(f"MCP Service started with modules: {', '.join(loaded)}")
    
    # Log loaded bay
    config = load_config()
    selected_bay = get_selected_bay(config)
    print(f"Active bay: {selected_bay}")

@app.get("/health")
async def health():
    config = load_config()
    selected_bay = get_selected_bay(config)
    return {
        "status": "healthy",
        "service": "mcp",
        "active_bay": selected_bay,
        "version": "1.0.0"
    }

@app.get("/info")
async def info():
    """Get information about loaded modules and configuration"""
    config = load_config()
    selected_bay = get_selected_bay(config)
    
    # Get list of available endpoints
    routes = []
    for route in app.routes:
        if hasattr(route, "path"):
            routes.append({
                "path": route.path,
                "methods": list(route.methods) if hasattr(route, "methods") else []
            })
    
    return {
        "active_bay": selected_bay,
        "available_bays": config.get("bays", {}).get("available", []),
        "loaded_modules": {
            "core": config.get("core", {}).get("modules", []),
            "intake": config.get("intake", {}).get("modules", []),
            "domains": [selected_bay]
        },
        "routes": routes
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7001)