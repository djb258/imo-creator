"""Main Blueprint API Application

CTB Layer: app (entry point)
IMO Phase: All phases - routes to appropriate handlers

This is the main FastAPI application that composes endpoints from various CTB layers.
"""
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Import from CTB layers
from src.app.api.blueprints import get_manifest, put_manifest, score_blueprint, generate_visuals
from src.app.ssot.processor import save_ssot
from src.ai.llm.router import llm_endpoint
from src.ai.subagents.registry import list_subagents

app = FastAPI(title="Blueprint API")

# CORS configuration
allow_origin = os.getenv("ALLOW_ORIGIN", "http://localhost:7002")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[allow_origin, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Blueprint endpoints (CTB: app)
@app.get("/blueprints/{slug}/manifest")
async def _get_manifest(slug: str):
    return await get_manifest(slug)

@app.put("/blueprints/{slug}/manifest")
async def _put_manifest(slug: str, body: bytes):
    return await put_manifest(slug, body)

@app.post("/blueprints/{slug}/score")
async def _score_blueprint(slug: str):
    return await score_blueprint(slug)

@app.post("/blueprints/{slug}/visuals")
async def _generate_visuals(slug: str):
    return await generate_visuals(slug)

# LLM endpoint (CTB: ai)
@app.post("/llm")
async def _llm_endpoint(request: Request):
    return await llm_endpoint(request)

# SSOT endpoint (CTB: app)
@app.post("/api/ssot/save")
async def _save_ssot(request: Request):
    return await save_ssot(request)

# Subagents endpoint (CTB: ai)
@app.get("/api/subagents")
async def _get_subagents():
    return JSONResponse({"items": list_subagents()})

@app.get("/")
async def root():
    return {
        "message": "Blueprint API",
        "version": "2.0.0",
        "ctb_structure": True,
        "endpoints": [
            "/blueprints/{slug}/manifest",
            "/blueprints/{slug}/score",
            "/blueprints/{slug}/visuals",
            "/llm",
            "/api/ssot/save",
            "/api/subagents"
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "blueprint-api"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 7002))
    uvicorn.run(app, host="0.0.0.0", port=port)
