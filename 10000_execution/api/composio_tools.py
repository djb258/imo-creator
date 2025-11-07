"""
Composio Tools REST API
Provides HTTP endpoints for all Composio MCP tools
"""

from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
import subprocess
import json
import os
import asyncio
from pathlib import Path
from ..utils.database import get_db_client

router = APIRouter(prefix="/api/composio", tags=["composio"])

# Base directory for MCP server
MCP_SERVER_PATH = Path(__file__).parent.parent.parent.parent / "scraping-tool" / "imo-creator" / "mcp-servers" / "composio-mcp"

class ToolExecutionRequest(BaseModel):
    """Request model for tool execution"""
    arguments: Dict[str, Any] = Field(default_factory=dict, description="Tool arguments")
    user_id: Optional[str] = Field(None, description="User ID for entity tracking")

class ToolExecutionResponse(BaseModel):
    """Response model for tool execution"""
    success: bool
    result: Dict[str, Any]
    tool_name: str
    executed_at: str
    heir_tracking: Optional[Dict[str, Any]] = None

class ComposioStatsResponse(BaseModel):
    """Response model for Composio stats"""
    available_tools: List[str]
    connected_accounts: Dict[str, Any]
    system_status: str
    api_key_configured: bool

def get_api_key(authorization: str = Header(None)) -> str:
    """Extract and validate API key from Authorization header"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format. Use 'Bearer <token>'")

    api_key = authorization[7:]  # Remove "Bearer " prefix

    # Validate against expected API key
    expected_key = os.getenv("COMPOSIO_API_KEY", "ak_t-F0AbvfZHUZSUrqAGNn")
    if api_key != expected_key:
        raise HTTPException(status_code=401, detail="Invalid API key")

    return api_key

async def execute_mcp_tool(tool_name: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    """Execute a tool via the MCP server"""

    # Prepare the MCP call payload
    mcp_payload = {
        "tool": tool_name,
        "data": payload,
        "unique_id": f"REST-{tool_name}-{payload.get('user_id', 'unknown')}",
        "process_id": f"REST-PROC-{tool_name}",
        "orbt_layer": 2,
        "blueprint_version": "1.0"
    }

    # Create the command to execute
    cmd = [
        "node",
        str(MCP_SERVER_PATH / "server.js")
    ]

    # Set up environment
    env = os.environ.copy()
    env["COMPOSIO_API_KEY"] = os.getenv("COMPOSIO_API_KEY", "ak_t-F0AbvfZHUZSUrqAGNn")

    try:
        # Create a subprocess to communicate with the MCP server
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env=env,
            cwd=str(MCP_SERVER_PATH)
        )

        # Send the request to MCP server
        request_data = json.dumps({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/call",
            "params": {
                "name": tool_name,
                "arguments": mcp_payload
            }
        })

        stdout, stderr = await process.communicate(input=request_data.encode())

        if process.returncode != 0:
            raise Exception(f"MCP server error: {stderr.decode()}")

        # Parse the response
        response = json.loads(stdout.decode())
        if "error" in response:
            raise Exception(f"MCP tool error: {response['error']}")

        return response.get("result", {})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tool execution failed: {str(e)}")

# Core Composio Tools
@router.post("/tools/execute", response_model=ToolExecutionResponse)
async def execute_composio_tool(
    request: ToolExecutionRequest,
    api_key: str = Depends(get_api_key)
):
    """Execute a Composio tool via toolkit.tool format"""
    if "toolkit" not in request.arguments or "tool" not in request.arguments:
        raise HTTPException(status_code=400, detail="toolkit and tool are required in arguments")

    result = await execute_mcp_tool("execute_composio_tool", request.dict())

    return ToolExecutionResponse(
        success=True,
        result=result,
        tool_name=f"{request.arguments['toolkit']}.{request.arguments['tool']}",
        executed_at=result.get("executed_at", ""),
        heir_tracking=result.get("heir_tracking")
    )

@router.get("/tools/available")
async def get_available_tools(api_key: str = Depends(get_api_key)):
    """Get list of available Composio tools"""
    result = await execute_mcp_tool("get_available_tools", {})
    return result

@router.post("/accounts/manage")
async def manage_connected_account(
    request: ToolExecutionRequest,
    api_key: str = Depends(get_api_key)
):
    """Manage connected accounts (list, add, remove)"""
    result = await execute_mcp_tool("manage_connected_account", request.dict())
    return result

@router.get("/stats", response_model=ComposioStatsResponse)
async def get_composio_stats(api_key: str = Depends(get_api_key)):
    """Get Composio integration statistics"""
    result = await execute_mcp_tool("get_composio_stats", {})

    return ComposioStatsResponse(
        available_tools=result.get("available_tools", []),
        connected_accounts=result.get("connected_accounts", {}),
        system_status=result.get("system_status", "unknown"),
        api_key_configured=bool(os.getenv("COMPOSIO_API_KEY"))
    )

# Instantly.ai Tools
@router.post("/instantly/campaigns/list")
async def instantly_list_campaigns(
    request: ToolExecutionRequest,
    api_key: str = Depends(get_api_key)
):
    """List Instantly.ai campaigns"""
    result = await execute_mcp_tool("instantly_list_campaigns", request.dict())
    return result

@router.post("/instantly/campaigns/create")
async def instantly_create_campaign(
    request: ToolExecutionRequest,
    api_key: str = Depends(get_api_key)
):
    """Create new Instantly.ai campaign"""
    result = await execute_mcp_tool("instantly_create_campaign", request.dict())
    return result

@router.post("/instantly/campaigns/{campaign_id}")
async def instantly_get_campaign(
    campaign_id: str,
    request: ToolExecutionRequest,
    api_key: str = Depends(get_api_key)
):
    """Get specific Instantly.ai campaign"""
    request.arguments["campaign_id"] = campaign_id
    result = await execute_mcp_tool("instantly_get_campaign", request.dict())
    return result

@router.post("/instantly/leads/list")
async def instantly_list_leads(
    request: ToolExecutionRequest,
    api_key: str = Depends(get_api_key)
):
    """List Instantly.ai leads"""
    result = await execute_mcp_tool("instantly_list_leads", request.dict())
    return result

@router.post("/instantly/leads/create")
async def instantly_create_lead(
    request: ToolExecutionRequest,
    api_key: str = Depends(get_api_key)
):
    """Create new Instantly.ai lead"""
    result = await execute_mcp_tool("instantly_create_lead", request.dict())
    return result

@router.delete("/instantly/leads/{lead_id}")
async def instantly_delete_lead(
    lead_id: str,
    request: ToolExecutionRequest,
    api_key: str = Depends(get_api_key)
):
    """Delete Instantly.ai lead"""
    request.arguments["lead_id"] = lead_id
    result = await execute_mcp_tool("instantly_delete_lead", request.dict())
    return result

# Relevance AI Tools
@router.post("/relevance/workflows/list")
async def relevance_list_workflows(
    request: ToolExecutionRequest,
    api_key: str = Depends(get_api_key)
):
    """List Relevance AI workflows"""
    result = await execute_mcp_tool("relevance_list_workflows", request.dict())
    return result

@router.post("/relevance/workflows/trigger")
async def relevance_trigger_workflow(
    request: ToolExecutionRequest,
    api_key: str = Depends(get_api_key)
):
    """Trigger Relevance AI workflow"""
    result = await execute_mcp_tool("relevance_trigger_workflow", request.dict())
    return result

@router.post("/relevance/agents/list")
async def relevance_list_agents(
    request: ToolExecutionRequest,
    api_key: str = Depends(get_api_key)
):
    """List Relevance AI agents"""
    result = await execute_mcp_tool("relevance_list_agents", request.dict())
    return result

# Builder.io Tools
@router.post("/builder/spaces/create")
async def builder_create_space(
    request: ToolExecutionRequest,
    api_key: str = Depends(get_api_key)
):
    """Create Builder.io space"""
    result = await execute_mcp_tool("builder_io_create_space", request.dict())
    return result

@router.post("/builder/models/create")
async def builder_create_model(
    request: ToolExecutionRequest,
    api_key: str = Depends(get_api_key)
):
    """Create Builder.io model"""
    result = await execute_mcp_tool("builder_io_create_model", request.dict())
    return result

@router.post("/builder/content/create")
async def builder_create_content(
    request: ToolExecutionRequest,
    api_key: str = Depends(get_api_key)
):
    """Create Builder.io content"""
    result = await execute_mcp_tool("builder_io_create_content", request.dict())
    return result

# Neon Database Tools
# ✅ CORRECT: Using direct database connection (not fake Composio tools)
@router.post("/neon/query")
async def neon_query_database(
    request: ToolExecutionRequest,
    api_key: str = Depends(get_api_key)
):
    """
    Query Neon database using direct PostgreSQL connection
    Following Barton Doctrine compliance standards
    """
    try:
        db = get_db_client()

        if "sql" not in request.arguments:
            raise HTTPException(status_code=400, detail="sql parameter is required")

        sql = request.arguments["sql"]
        params = request.arguments.get("params", [])

        result = await db.execute_query(sql, params if params else None)

        return {
            "success": True,
            "result": result,
            "row_count": len(result),
            "executed_at": asyncio.get_event_loop().time()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query failed: {str(e)}")

@router.post("/neon/tables/create")
async def neon_create_table(
    request: ToolExecutionRequest,
    api_key: str = Depends(get_api_key)
):
    """
    Create Neon database table using direct PostgreSQL connection
    Following Barton Doctrine compliance standards
    """
    try:
        db = get_db_client()

        if "table_name" not in request.arguments or "columns" not in request.arguments:
            raise HTTPException(status_code=400, detail="table_name and columns parameters are required")

        table_name = request.arguments["table_name"]
        columns = request.arguments["columns"]

        result = await db.create_table(table_name, columns)

        return {
            "success": True,
            "message": f"Table {table_name} created successfully",
            "result": result,
            "executed_at": asyncio.get_event_loop().time()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Table creation failed: {str(e)}")

@router.get("/neon/schema")
async def neon_get_schema(api_key: str = Depends(get_api_key)):
    """
    Get Neon database schema using direct PostgreSQL connection
    Following Barton Doctrine compliance standards
    """
    try:
        db = get_db_client()
        schema = await db.get_schema()

        return {
            "success": True,
            "schema": schema,
            "retrieved_at": asyncio.get_event_loop().time()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Schema retrieval failed: {str(e)}")

@router.get("/neon/test")
async def neon_test_connection(api_key: str = Depends(get_api_key)):
    """Test Neon database connection"""
    try:
        db = get_db_client()
        result = await db.test_connection()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Connection test failed: {str(e)}")

# Figma Tools
@router.post("/figma/export")
async def figma_export_to_code(
    request: ToolExecutionRequest,
    api_key: str = Depends(get_api_key)
):
    """Export Figma design to code"""
    result = await execute_mcp_tool("figma_export_to_code", request.dict())
    return result

@router.post("/figma/design-system/create")
async def figma_create_design_system(
    request: ToolExecutionRequest,
    api_key: str = Depends(get_api_key)
):
    """Create Figma design system"""
    result = await execute_mcp_tool("figma_create_design_system", request.dict())
    return result

# Health and Status
@router.get("/health")
async def composio_health():
    """Health check for Composio integration"""
    api_key_configured = bool(os.getenv("COMPOSIO_API_KEY"))
    mcp_server_exists = (MCP_SERVER_PATH / "server.js").exists()

    return {
        "status": "healthy" if api_key_configured and mcp_server_exists else "degraded",
        "api_key_configured": api_key_configured,
        "mcp_server_available": mcp_server_exists,
        "server_path": str(MCP_SERVER_PATH),
        "total_endpoints": len([route for route in router.routes])
    }