"""MCP Server for IMO Creator HEIR integration"""
import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from typing import Dict, Any
import yaml
import requests
import json
from pathlib import Path

try:
    from .models import HeirCheckRequest, HeirCheckResult
except ImportError:
    from src.models import HeirCheckRequest, HeirCheckResult

# Load environment variables
load_dotenv()

app = FastAPI(title="IMO Creator MCP Server", description="HEIR/MCP integration server")

# CORS configuration
allow_origin = os.getenv("ALLOW_ORIGIN", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[allow_origin, "http://localhost:7002", "http://127.0.0.1:7002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).parent.parent

@app.post("/heir/check", response_model=HeirCheckResult)
async def heir_check(request: HeirCheckRequest):
    """
    Run HEIR validation checks on provided SSOT configuration
    Currently returns a stub response for minimal implementation
    """
    try:
        # Stub implementation - always returns ok:true for now
        # In full implementation, this would call packages.heir.checks
        
        # Basic validation of SSOT structure
        ssot = request.ssot
        errors = []
        warnings = []
        
        # Check for required SSOT fields
        required_fields = ["meta", "doctrine"]
        for field in required_fields:
            if field not in ssot:
                errors.append(f"Missing required SSOT field: {field}")
        
        # Check meta structure
        if "meta" in ssot:
            meta = ssot["meta"]
            if "app_name" not in meta:
                warnings.append("Missing app_name in meta")
        
        # For minimal implementation, consider it ok if no critical errors
        is_ok = len(errors) == 0
        
        result = HeirCheckResult(
            ok=is_ok,
            errors=errors if errors else None,
            warnings=warnings if warnings else None,
            details={
                "ssot_keys": list(ssot.keys()),
                "check_type": "minimal_stub",
                "version": "1.0.0"
            }
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"HEIR check failed: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint with service info"""
    return {
        "service": "IMO Creator MCP Server",
        "version": "1.0.0",
        "endpoints": [
            "/heir/check",
            "/builder/create-content",
            "/builder/models",
            "/mcp/tools/builder_create_content",
            "/mcp/resources/builder/models",
            "/mcp/prompts/generate_component",
            "/vscode/sync-with-builder"
        ],
        "integrations": ["HEIR", "Builder.io", "VS Code MCP"],
        "vscode_support": {
            "mcp_tools": ["builder_create_content", "builder_get_models", "heir_validate"],
            "mcp_resources": ["builder://models/*", "builder://content/*"],
            "mcp_prompts": ["generate_component", "sync_figma_design", "validate_heir_compliance"]
        },
        "status": "ok"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "mcp"}

@app.post("/builder/create-content")
async def create_builder_content(request: Dict[str, Any]):
    """
    Create content in Builder.io using MCP integration
    """
    try:
        api_key = os.getenv("BUILDER_IO_API_KEY")
        space_id = os.getenv("BUILDER_IO_SPACE_ID")

        if not api_key:
            raise HTTPException(status_code=400, detail="Builder.io API key not configured")

        # Builder.io API headers
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        # Prepare Builder.io content data
        content_data = {
            "name": request.get("name", "IMO Generated Content"),
            "data": request.get("data", {}),
            "published": request.get("published", "draft"),
            "meta": {
                "source": "imo-creator-mcp",
                "generated": True
            }
        }

        # Make request to Builder.io API
        builder_url = f"https://builder.io/api/v1/write/{space_id}"
        response = requests.post(builder_url, headers=headers, json=content_data)

        if response.status_code == 200:
            return {
                "success": True,
                "builder_response": response.json(),
                "content_id": response.json().get("id"),
                "edit_url": f"https://builder.io/content/{response.json().get('id')}"
            }
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Builder.io API error: {response.text}"
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Builder.io integration failed: {str(e)}")

@app.get("/builder/models")
async def get_builder_models():
    """
    Fetch available Builder.io models/schemas
    """
    try:
        api_key = os.getenv("BUILDER_IO_API_KEY")
        space_id = os.getenv("BUILDER_IO_SPACE_ID")

        if not api_key:
            raise HTTPException(status_code=400, detail="Builder.io API key not configured")

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        # Fetch models from Builder.io
        builder_url = f"https://builder.io/api/v1/models/{space_id}"
        response = requests.get(builder_url, headers=headers)

        if response.status_code == 200:
            return {
                "success": True,
                "models": response.json()
            }
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Builder.io API error: {response.text}"
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Builder.io models: {str(e)}")

# VS Code MCP Integration Endpoints
@app.post("/mcp/tools/builder_create_content")
async def mcp_tool_builder_create_content(request: Dict[str, Any]):
    """
    MCP Tool: Create Builder.io content from VS Code
    """
    try:
        # Extract VS Code context
        workspace_path = request.get("workspace_path")
        file_context = request.get("file_context")
        selection = request.get("selection")

        # Create content with VS Code context
        content_request = {
            "name": request.get("name", f"Component from {workspace_path}"),
            "data": {
                "code": selection,
                "framework": request.get("framework", "react"),
                "workspace": workspace_path,
                "context": file_context
            },
            "published": "draft",
            "meta": {
                "source": "vscode-mcp",
                "workspace": workspace_path
            }
        }

        result = await create_builder_content(content_request)
        return {
            "tool": "builder_create_content",
            "result": result,
            "vscode_integration": True
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"VS Code MCP tool failed: {str(e)}")

@app.get("/mcp/resources/builder/models")
async def mcp_resource_builder_models():
    """
    MCP Resource: Access Builder.io models for VS Code
    """
    try:
        models = await get_builder_models()
        return {
            "resource": "builder://models/*",
            "data": models,
            "metadata": {
                "type": "builder_models",
                "source": "mcp_server",
                "timestamp": "2025-09-26"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MCP resource failed: {str(e)}")

@app.post("/mcp/prompts/generate_component")
async def mcp_prompt_generate_component(request: Dict[str, Any]):
    """
    MCP Prompt: Generate component with VS Code context
    """
    try:
        workspace_info = request.get("workspace", {})
        component_spec = request.get("component_spec", {})

        prompt_result = {
            "prompt": "generate_component",
            "context": {
                "workspace": workspace_info,
                "component": component_spec,
                "framework": component_spec.get("framework", "react"),
                "styling": component_spec.get("styling", "tailwind")
            },
            "generated_code": f"""
// Generated by IMO Creator MCP for VS Code
import React from 'react';

interface {component_spec.get('name', 'Component')}Props {{
  // Add your prop types here
}}

const {component_spec.get('name', 'Component')}: React.FC<{component_spec.get('name', 'Component')}Props> = (props) => {{
  return (
    <div className="p-4">
      <h1>Generated {component_spec.get('name', 'Component')}</h1>
      {{/* Builder.io integration ready */}}
    </div>
  );
}};

export default {component_spec.get('name', 'Component')};
            """,
            "builder_integration": {
                "api_key_configured": bool(os.getenv("BUILDER_IO_API_KEY")),
                "ready_for_sync": True
            }
        }

        return prompt_result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MCP prompt failed: {str(e)}")

@app.post("/vscode/sync-with-builder")
async def vscode_sync_with_builder(request: Dict[str, Any]):
    """
    VS Code specific endpoint to sync current file with Builder.io
    """
    try:
        file_path = request.get("file_path")
        file_content = request.get("file_content")
        component_name = request.get("component_name")

        # Create Builder.io content from VS Code file
        builder_request = {
            "name": f"VSCode Sync: {component_name}",
            "data": {
                "source_file": file_path,
                "code": file_content,
                "sync_timestamp": "2025-09-26T15:00:00Z"
            },
            "published": "draft"
        }

        result = await create_builder_content(builder_request)

        return {
            "success": True,
            "message": f"Synced {component_name} with Builder.io",
            "builder_url": result.get("edit_url"),
            "content_id": result.get("content_id")
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"VS Code sync failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 7001))
    uvicorn.run(app, host="0.0.0.0", port=port)