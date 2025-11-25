"""SSOT Processing utilities

CTB Layer: app
IMO Phase: MIDDLE (SSOT transformation and validation)
"""
from fastapi import Request
from fastapi.responses import JSONResponse
from typing import Dict, Any

from src.app.blueprints import ensure_ids, stamp_version_hash


async def save_ssot(request: Request):
    """SSOT processing with doctrine-safe IDs"""
    try:
        body = await request.json()
        ssot = body.get("ssot", {})
        ssot = ensure_ids(ssot)
        ssot = stamp_version_hash(ssot)

        return JSONResponse({"ok": True, "ssot": ssot})
    except Exception as error:
        print(f"SSOT processing error: {error}")
        return JSONResponse({"error": f"Failed to process SSOT: {str(error)}"}, status_code=500)
