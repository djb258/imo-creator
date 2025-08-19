#!/usr/bin/env python3
"""
FastAPI Registry Endpoint for Claude Code Agents Library
Provides REST API access to agent metadata and content
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime

from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

# Configuration
LIBRARY_ROOT = Path(__file__).parent.parent
MANIFEST_PATH = LIBRARY_ROOT / "manifest.json"
AGENTS_DIR = LIBRARY_ROOT / "agents"

# Pydantic Models
class AgentSummary(BaseModel):
    id: str
    name: str
    version: str
    category: str
    description: str
    tags: List[str]
    capabilities: List[str]
    file: str

class AgentDetail(AgentSummary):
    prerequisites: List[str]
    tools: List[str]
    content: Optional[str] = None

class Category(BaseModel):
    id: str
    name: str
    description: str

class AgentSearchResult(BaseModel):
    query: str
    total: int
    agents: List[AgentSummary]

class LibraryInfo(BaseModel):
    name: str
    version: str
    description: str
    author: str
    repository: str
    created: str
    updated: str
    total_agents: int
    categories: List[Category]

class HealthCheck(BaseModel):
    status: str
    timestamp: str
    version: str
    agents_available: int

# Initialize FastAPI app
app = FastAPI(
    title="Claude Code Agents Library API",
    description="REST API for accessing Claude Code agents and metadata",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to load manifest
async def get_manifest() -> Dict[str, Any]:
    """Load and return the agents manifest."""
    try:
        with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Agents manifest not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid manifest JSON format")

# Dependency to load agent content
async def load_agent_content(agent_file: str) -> str:
    """Load agent markdown content from file."""
    agent_path = AGENTS_DIR / agent_file
    try:
        with open(agent_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Agent file not found: {agent_file}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading agent file: {str(e)}")

# API Endpoints

@app.get("/", response_model=LibraryInfo)
async def get_library_info(manifest: Dict[str, Any] = Depends(get_manifest)):
    """Get basic information about the agents library."""
    return LibraryInfo(
        name=manifest["name"],
        version=manifest["version"],
        description=manifest["description"],
        author=manifest["author"],
        repository=manifest["repository"],
        created=manifest["created"],
        updated=manifest["updated"],
        total_agents=len(manifest["agents"]),
        categories=[Category(**cat) for cat in manifest["categories"]]
    )

@app.get("/health", response_model=HealthCheck)
async def health_check(manifest: Dict[str, Any] = Depends(get_manifest)):
    """Health check endpoint."""
    return HealthCheck(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        version=manifest["version"],
        agents_available=len(manifest["agents"])
    )

@app.get("/agents", response_model=List[AgentSummary])
async def list_agents(
    category: Optional[str] = Query(None, description="Filter by category"),
    tag: Optional[str] = Query(None, description="Filter by tag"),
    manifest: Dict[str, Any] = Depends(get_manifest)
):
    """List all available agents with optional filtering."""
    agents = manifest["agents"]
    
    # Apply category filter
    if category:
        agents = [agent for agent in agents if agent["category"] == category]
    
    # Apply tag filter
    if tag:
        agents = [agent for agent in agents if tag.lower() in [t.lower() for t in agent["tags"]]]
    
    return [AgentSummary(**agent) for agent in agents]

@app.get("/agents/{agent_id}", response_model=AgentDetail)
async def get_agent(
    agent_id: str,
    include_content: bool = Query(False, description="Include agent markdown content"),
    manifest: Dict[str, Any] = Depends(get_manifest)
):
    """Get detailed information about a specific agent."""
    # Find the agent
    agent_data = None
    for agent in manifest["agents"]:
        if agent["id"] == agent_id:
            agent_data = agent
            break
    
    if not agent_data:
        raise HTTPException(status_code=404, detail=f"Agent not found: {agent_id}")
    
    # Create agent detail object
    agent_detail = AgentDetail(**agent_data)
    
    # Include content if requested
    if include_content:
        agent_detail.content = await load_agent_content(agent_data["file"])
    
    return agent_detail

@app.get("/agents/{agent_id}/content")
async def get_agent_content(
    agent_id: str,
    manifest: Dict[str, Any] = Depends(get_manifest)
):
    """Get the raw markdown content of an agent."""
    # Find the agent
    agent_data = None
    for agent in manifest["agents"]:
        if agent["id"] == agent_id:
            agent_data = agent
            break
    
    if not agent_data:
        raise HTTPException(status_code=404, detail=f"Agent not found: {agent_id}")
    
    content = await load_agent_content(agent_data["file"])
    
    return JSONResponse(
        content={"agent_id": agent_id, "content": content},
        headers={"Content-Type": "application/json"}
    )

@app.get("/search", response_model=AgentSearchResult)
async def search_agents(
    q: str = Query(..., description="Search query for agent capabilities, tags, or description"),
    manifest: Dict[str, Any] = Depends(get_manifest)
):
    """Search agents by capabilities, tags, or description."""
    query_lower = q.lower()
    matching_agents = []
    
    for agent in manifest["agents"]:
        # Search in multiple fields
        if (
            query_lower in agent["name"].lower() or
            query_lower in agent["description"].lower() or
            any(query_lower in tag.lower() for tag in agent["tags"]) or
            any(query_lower in cap.lower() for cap in agent["capabilities"])
        ):
            matching_agents.append(AgentSummary(**agent))
    
    return AgentSearchResult(
        query=q,
        total=len(matching_agents),
        agents=matching_agents
    )

@app.get("/categories", response_model=List[Category])
async def list_categories(manifest: Dict[str, Any] = Depends(get_manifest)):
    """List all available agent categories."""
    return [Category(**cat) for cat in manifest["categories"]]

@app.get("/categories/{category_id}/agents", response_model=List[AgentSummary])
async def get_agents_by_category(
    category_id: str,
    manifest: Dict[str, Any] = Depends(get_manifest)
):
    """Get all agents in a specific category."""
    # Verify category exists
    category_exists = any(cat["id"] == category_id for cat in manifest["categories"])
    if not category_exists:
        raise HTTPException(status_code=404, detail=f"Category not found: {category_id}")
    
    # Filter agents by category
    agents = [agent for agent in manifest["agents"] if agent["category"] == category_id]
    return [AgentSummary(**agent) for agent in agents]

@app.get("/tags")
async def list_tags(manifest: Dict[str, Any] = Depends(get_manifest)):
    """Get all unique tags used across agents."""
    all_tags = set()
    for agent in manifest["agents"]:
        all_tags.update(agent["tags"])
    
    return JSONResponse(
        content={"tags": sorted(list(all_tags))}
    )

@app.get("/stats")
async def get_library_stats(manifest: Dict[str, Any] = Depends(get_manifest)):
    """Get statistical information about the agents library."""
    agents = manifest["agents"]
    categories = manifest["categories"]
    
    # Calculate stats
    category_counts = {}
    all_tags = set()
    all_capabilities = set()
    
    for agent in agents:
        # Count by category
        category = agent["category"]
        category_counts[category] = category_counts.get(category, 0) + 1
        
        # Collect tags and capabilities
        all_tags.update(agent["tags"])
        all_capabilities.update(agent["capabilities"])
    
    return JSONResponse(content={
        "total_agents": len(agents),
        "total_categories": len(categories),
        "total_tags": len(all_tags),
        "total_capabilities": len(all_capabilities),
        "agents_by_category": category_counts,
        "most_common_tags": sorted(list(all_tags)),
        "library_info": {
            "name": manifest["name"],
            "version": manifest["version"],
            "created": manifest["created"],
            "updated": manifest["updated"]
        }
    })

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Resource not found", "path": str(request.url)}
    )

@app.exception_handler(500)
async def internal_server_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )

# Development server runner
if __name__ == "__main__":
    import uvicorn
    
    # Check if manifest exists
    if not MANIFEST_PATH.exists():
        print(f"Error: Manifest file not found at {MANIFEST_PATH}")
        print("Please ensure the agents library is properly installed.")
        exit(1)
    
    print(f"Starting Claude Code Agents Library API server...")
    print(f"Manifest: {MANIFEST_PATH}")
    print(f"Agents directory: {AGENTS_DIR}")
    print(f"API Documentation: http://localhost:8000/docs")
    
    uvicorn.run(
        "registry_endpoint:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )