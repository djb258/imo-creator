#!/usr/bin/env python3
"""
MCP (Mission Control Processor) Backend Server
==============================================

Central orchestrator for GitHub → Whimsical → Plasmic → GitHub workflow.

This FastAPI server handles:
- GitHub webhook processing
- CTB structure parsing and validation
- LLM-enhanced CTB analysis and suggestions
- Whimsical diagram updates (one-way push only)
- Plasmic component generation
- GitHub repo updates

Architecture: Stateless, modular, extensible
Deployment: Render.com with environment-based configuration
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import logging
from contextlib import asynccontextmanager

from config import settings
from routes import webhooks, render, health
from utils.logger import setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup/shutdown events"""
    # Startup
    setup_logging()
    logging.info("🚀 MCP Server starting up...")
    logging.info(f"Environment: {settings.ENVIRONMENT}")
    logging.info(f"Debug mode: {settings.DEBUG}")
    
    yield
    
    # Shutdown
    logging.info("🛑 MCP Server shutting down...")


# Initialize FastAPI app
app = FastAPI(
    title="MCP Backend",
    description="Mission Control Processor for IMO Creator ecosystem orchestration",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled errors"""
    logging.error(f"Unhandled error in {request.method} {request.url}: {str(exc)}")
    
    if settings.DEBUG:
        raise exc
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred",
            "request_id": getattr(request.state, "request_id", None)
        }
    )


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests"""
    import time
    import uuid
    
    # Generate request ID
    request_id = str(uuid.uuid4())[:8]
    request.state.request_id = request_id
    
    start_time = time.time()
    
    # Log request
    logging.info(f"[{request_id}] {request.method} {request.url}")
    
    # Process request
    response = await call_next(request)
    
    # Log response
    process_time = time.time() - start_time
    logging.info(
        f"[{request_id}] {response.status_code} - {process_time:.3f}s"
    )
    
    # Add request ID to response headers
    response.headers["X-Request-ID"] = request_id
    
    return response


# Include routers
app.include_router(
    health.router,
    prefix="/health",
    tags=["Health"]
)

app.include_router(
    webhooks.router,
    prefix="/webhooks",
    tags=["GitHub Webhooks"]
)

app.include_router(
    render.router,
    prefix="/render",
    tags=["CTB Rendering"]
)


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint - basic service information"""
    return {
        "service": "MCP Backend",
        "version": "1.0.0",
        "status": "operational",
        "description": "Mission Control Processor for IMO Creator ecosystem",
        "docs": "/docs" if settings.DEBUG else "disabled",
        "endpoints": {
            "health": "/health",
            "github_webhooks": "/webhooks/github",
            "render_ctb": "/render/ctb",
            "status": "/health/status"
        }
    }


# Development server
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info" if not settings.DEBUG else "debug"
    )