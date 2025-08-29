# N8n-mcp MCP Server

N8N workflow automation management

## Overview

**Tool Name**: n8n-workflow-manager  
**Version**: 1.0.0  
**ORBT Layer**: 4  
**System Code**: N8NWFL  
**Port**: 3009

## Operations

- `list_workflows` - list workflows
- `execute_workflow` - execute workflow
- `activate_workflow` - activate workflow
- `trigger_webhook` - trigger webhook

## Environment Variables

- `N8N_API_KEY` - Required for API authentication
- `N8N_BASE_URL` - Required for configuration
- `N8N_WEBHOOK_URL` - Required for configuration

## Usage Example

```json
{
  "operation": "list_workflows",
  "unique_id": "HEIR-2024-12-N8NWFL-EXEC-01",
  "process_id": "PRC-N8NWFL00-1756491210815",
  "orbt_layer": 4,
  "blueprint_version": "v1.0.0-abcd1234"
}
```

## Health Check

- **Endpoint**: `GET /mcp/health`
- **Status Page**: `GET /mcp/status`
- **Kill Switch**: `POST /mcp/kill-switch/activate`

## Development

```bash
# Install dependencies
npm install

# Start server
npm start

# Start with hot reload
npm run dev

# Run in mock mode
USE_MOCK=true npm start
```

## HEIR/ORBT Compliance

✅ Kill switch integration  
✅ Mantis logging  
✅ HEIR unique ID generation  
✅ ORBT layer 4 authorization  
✅ Blueprint version tracking  

## Architecture

- **Server**: `server.js` - Express server setup
- **Tool Logic**: `tools/tool_handler.js` - Core business logic
- **Middleware**: `middleware/` - Validation, logging, kill switch
- **Manifests**: `manifests/tool_manifest.json` - Schema definitions
- **Mocks**: `mock/` - Sample payloads and responses

Last updated: 2025-08-29T18:13:30.815Z
