"""
Direct Composio API Integration
Simple REST endpoints that call Composio SDK directly - perfect for LLMs
"""

from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
import os
import requests
import json
from datetime import datetime

router = APIRouter(prefix="/api/composio", tags=["composio"])

# Composio configuration
COMPOSIO_API_KEY = os.getenv("COMPOSIO_API_KEY", "ak_t-F0AbvfZHUZSUrqAGNn")
COMPOSIO_BASE_URL = "https://backend.composio.dev/api"

class ToolRequest(BaseModel):
    """Simple tool execution request"""
    arguments: Dict[str, Any] = Field(default_factory=dict)
    entity_id: Optional[str] = Field(None, description="User/entity ID")

class ToolResponse(BaseModel):
    """Simple tool execution response"""
    success: bool
    data: Dict[str, Any]
    tool_name: str
    timestamp: str

def get_api_key(authorization: str = Header(None)) -> str:
    """Simple API key validation"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization: Bearer <token> required")

    token = authorization[7:]
    if token not in ["dev-secret", "mcpo-secret-key", COMPOSIO_API_KEY]:
        raise HTTPException(status_code=401, detail="Invalid API key")

    return token

def call_composio_api(endpoint: str, method: str = "GET", data: Dict = None) -> Dict:
    """Direct call to Composio API"""
    url = f"{COMPOSIO_BASE_URL}/{endpoint.lstrip('/')}"
    headers = {
        "X-API-Key": COMPOSIO_API_KEY,
        "Content-Type": "application/json"
    }

    try:
        if method == "GET":
            response = requests.get(url, headers=headers, timeout=30)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data or {}, timeout=30)
        else:
            raise ValueError(f"Unsupported method: {method}")

        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Composio API error: {str(e)}")

def execute_composio_tool(tool_name: str, parameters: Dict, entity_id: str = None) -> Dict:
    """Execute a Composio tool directly"""
    payload = {
        "toolName": tool_name,
        "parameters": parameters,
        "entityId": entity_id or "default-user"
    }

    return call_composio_api("tools/execute", "POST", payload)

# ===== CORE COMPOSIO TOOLS =====

@router.get("/tools")
async def list_tools(api_key: str = Depends(get_api_key)):
    """List all available Composio tools"""
    try:
        result = call_composio_api("tools")
        return {
            "success": True,
            "tools": result.get("tools", []),
            "count": len(result.get("tools", [])),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/apps")
async def list_apps(api_key: str = Depends(get_api_key)):
    """List all available Composio apps"""
    try:
        result = call_composio_api("apps")
        return {
            "success": True,
            "apps": result.get("apps", []),
            "count": len(result.get("apps", [])),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/entities")
async def list_entities(api_key: str = Depends(get_api_key)):
    """List all connected entities/accounts"""
    try:
        result = call_composio_api("entities")
        return {
            "success": True,
            "entities": result.get("entities", []),
            "count": len(result.get("entities", [])),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== INSTANTLY.AI TOOLS =====

@router.post("/instantly/campaigns", response_model=ToolResponse)
async def instantly_list_campaigns(
    request: ToolRequest,
    api_key: str = Depends(get_api_key)
):
    """List Instantly.ai campaigns - LLM friendly"""
    try:
        result = execute_composio_tool(
            "INSTANTLY_LIST_CAMPAIGNS",
            request.arguments,
            request.entity_id
        )

        return ToolResponse(
            success=True,
            data=result,
            tool_name="instantly_list_campaigns",
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/instantly/campaigns/create", response_model=ToolResponse)
async def instantly_create_campaign(
    request: ToolRequest,
    api_key: str = Depends(get_api_key)
):
    """Create Instantly.ai campaign - LLM friendly"""
    try:
        result = execute_composio_tool(
            "INSTANTLY_CREATE_CAMPAIGN",
            request.arguments,
            request.entity_id
        )

        return ToolResponse(
            success=True,
            data=result,
            tool_name="instantly_create_campaign",
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/instantly/leads", response_model=ToolResponse)
async def instantly_list_leads(
    request: ToolRequest,
    api_key: str = Depends(get_api_key)
):
    """List Instantly.ai leads - LLM friendly"""
    try:
        result = execute_composio_tool(
            "INSTANTLY_LIST_LEADS",
            request.arguments,
            request.entity_id
        )

        return ToolResponse(
            success=True,
            data=result,
            tool_name="instantly_list_leads",
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/instantly/leads/create", response_model=ToolResponse)
async def instantly_create_lead(
    request: ToolRequest,
    api_key: str = Depends(get_api_key)
):
    """Create Instantly.ai lead - LLM friendly"""
    try:
        result = execute_composio_tool(
            "INSTANTLY_CREATE_LEAD",
            request.arguments,
            request.entity_id
        )

        return ToolResponse(
            success=True,
            data=result,
            tool_name="instantly_create_lead",
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== GMAIL TOOLS =====

@router.post("/gmail/send", response_model=ToolResponse)
async def gmail_send_email(
    request: ToolRequest,
    api_key: str = Depends(get_api_key)
):
    """Send Gmail email - LLM friendly"""
    try:
        result = execute_composio_tool(
            "GMAIL_SEND_EMAIL",
            request.arguments,
            request.entity_id
        )

        return ToolResponse(
            success=True,
            data=result,
            tool_name="gmail_send_email",
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/gmail/list", response_model=ToolResponse)
async def gmail_list_emails(
    request: ToolRequest,
    api_key: str = Depends(get_api_key)
):
    """List Gmail emails - LLM friendly"""
    try:
        result = execute_composio_tool(
            "GMAIL_LIST_EMAILS",
            request.arguments,
            request.entity_id
        )

        return ToolResponse(
            success=True,
            data=result,
            tool_name="gmail_list_emails",
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== GITHUB TOOLS =====

@router.post("/github/repos", response_model=ToolResponse)
async def github_list_repos(
    request: ToolRequest,
    api_key: str = Depends(get_api_key)
):
    """List GitHub repositories - LLM friendly"""
    try:
        result = execute_composio_tool(
            "GITHUB_LIST_REPOS",
            request.arguments,
            request.entity_id
        )

        return ToolResponse(
            success=True,
            data=result,
            tool_name="github_list_repos",
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/github/issues/create", response_model=ToolResponse)
async def github_create_issue(
    request: ToolRequest,
    api_key: str = Depends(get_api_key)
):
    """Create GitHub issue - LLM friendly"""
    try:
        result = execute_composio_tool(
            "GITHUB_CREATE_ISSUE",
            request.arguments,
            request.entity_id
        )

        return ToolResponse(
            success=True,
            data=result,
            tool_name="github_create_issue",
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== GOOGLE DRIVE TOOLS =====

@router.post("/gdrive/files", response_model=ToolResponse)
async def gdrive_list_files(
    request: ToolRequest,
    api_key: str = Depends(get_api_key)
):
    """List Google Drive files - LLM friendly"""
    try:
        result = execute_composio_tool(
            "GOOGLEDRIVE_LIST_FILES",
            request.arguments,
            request.entity_id
        )

        return ToolResponse(
            success=True,
            data=result,
            tool_name="gdrive_list_files",
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/gdrive/upload", response_model=ToolResponse)
async def gdrive_upload_file(
    request: ToolRequest,
    api_key: str = Depends(get_api_key)
):
    """Upload file to Google Drive - LLM friendly"""
    try:
        result = execute_composio_tool(
            "GOOGLEDRIVE_UPLOAD_FILE",
            request.arguments,
            request.entity_id
        )

        return ToolResponse(
            success=True,
            data=result,
            tool_name="gdrive_upload_file",
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== GENERIC TOOL EXECUTOR =====

@router.post("/execute/{tool_name}", response_model=ToolResponse)
async def execute_any_tool(
    tool_name: str,
    request: ToolRequest,
    api_key: str = Depends(get_api_key)
):
    """Execute any Composio tool by name - Ultimate LLM flexibility"""
    try:
        # Convert tool_name to uppercase for Composio
        composio_tool_name = tool_name.upper()

        result = execute_composio_tool(
            composio_tool_name,
            request.arguments,
            request.entity_id
        )

        return ToolResponse(
            success=True,
            data=result,
            tool_name=tool_name,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== HEALTH & STATUS =====

@router.get("/health")
async def health_check():
    """Health check for Composio direct integration"""
    return {
        "status": "healthy",
        "composio_api_configured": bool(COMPOSIO_API_KEY),
        "base_url": COMPOSIO_BASE_URL,
        "timestamp": datetime.now().isoformat(),
        "endpoints": [
            "GET /api/composio/tools",
            "GET /api/composio/apps",
            "GET /api/composio/entities",
            "POST /api/composio/instantly/campaigns",
            "POST /api/composio/instantly/leads",
            "POST /api/composio/gmail/send",
            "POST /api/composio/github/repos",
            "POST /api/composio/gdrive/files",
            "POST /api/composio/execute/{tool_name}"
        ]
    }

@router.get("/")
async def composio_root():
    """Root endpoint with available actions for LLMs"""
    return {
        "message": "Composio Direct API - Perfect for LLMs",
        "description": "Simple REST endpoints that call Composio tools directly",
        "authentication": "Bearer token in Authorization header",
        "example_tools": [
            "instantly_list_campaigns",
            "gmail_send_email",
            "github_create_issue",
            "gdrive_list_files"
        ],
        "generic_endpoint": "/api/composio/execute/{tool_name}",
        "health": "/api/composio/health"
    }