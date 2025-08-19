#!/usr/bin/env python3
"""Test the registry module directly"""
import sys
import os
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI
from services.mcp.modules.core.registry import router

app = FastAPI(title="Registry Test Server")
app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Registry test server", "registry_prefix": router.prefix}

if __name__ == "__main__":
    import uvicorn
    print("Starting registry test server...")
    print(f"Registry router prefix: {router.prefix}")
    print(f"Registry router tags: {router.tags}")
    uvicorn.run(app, host="0.0.0.0", port=7003, log_level="debug")