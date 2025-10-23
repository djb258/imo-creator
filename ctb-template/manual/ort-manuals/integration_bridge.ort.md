---
role: integration_bridge
version: 1.0.0
altitude: 20k
driver: composio-mcp
status: active
---

# Integration Bridge ORT Manual

## Overview

**Role**: INTEGRATION_BRIDGE
**Purpose**: External system integrations, API gateway, tool orchestration with MCP compliance
**Altitude**: 20k ft (Orchestration Layer)
**Current Driver**: Composio MCP

## Operate

### Normal Operations

**Health Check**:
```bash
# Check integration bridge status
curl http://localhost:3001/mcp/health

# Expected: {"status": "healthy", "tools": 100+, "latency_ms": 150}
```

**Daily Operations**:
1. Monitor MCP server uptime
2. Review tool execution logs
3. Check API rate limits (Composio quota)
4. Verify external service integrations

### Registered Tools

```bash
# List all registered tools
curl http://localhost:3001/mcp/tools

# Check specific tool
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{"tool": "gemini_status"}'
```

## Repair

### Failure Mode 1: MCP Server Down

**Symptoms**: Status "disconnected", all tool calls fail

**Repair**:
1. Check MCP server process: `ps aux | grep node`
2. Review logs: `tail -f logs/mcp_server.log`
3. Restart server: `npm run start:mcp`
4. Verify health endpoint

**Resolution**: 2-5 minutes

### Failure Mode 2: API Rate Limit Exceeded

**Symptoms**: 429 errors, "quota_exceeded"

**Repair**:
1. Check Composio dashboard for quota usage
2. Implement exponential backoff
3. Cache frequent requests
4. Consider upgrading Composio plan

**Resolution**: Immediate (backoff) or 1-2 days (upgrade)

### Failure Mode 3: Tool Registration Failure

**Symptoms**: "Unknown tool" errors

**Repair**:
1. Check `/config/mcp_registry.json`
2. Verify tool manifest in `/sys/composio-mcp/tools/`
3. Restart MCP server to reload registry
4. Test tool registration

**Resolution**: 5-10 minutes

## Build

**Setup**:
```bash
# Install Composio SDK
npm install composio-core

# Configure
export COMPOSIO_API_KEY=ak_t-xxx
export COMPOSIO_API_URL=https://backend.composio.dev

# Start MCP server
cd mcp-servers/composio-mcp
node server.js

# Verify
curl http://localhost:3001/mcp/health
```

**Tool Registration**:
1. Create tool manifest in `/sys/composio-mcp/tools/{tool_name}/`
2. Add to MCP registry: `/config/mcp_registry.json`
3. Restart server
4. Test tool execution

## Train

**Key Concepts**:
- MCP (Model Context Protocol) architecture
- Composio tool orchestration
- HEIR/ORBT tracking for external calls
- Barton Doctrine: Composio required for all external integrations

**Practice**: Register new tool and execute via MCP

---

**Driver Manifest**: `/drivers/integration_bridge/driver_manifest.json`
**Status**: `/manual/troubleshooting/system_diagnostics.json#integration_bridge`
**Tool Registry**: `/config/mcp_registry.json`
**Composio Dashboard**: https://app.composio.dev
