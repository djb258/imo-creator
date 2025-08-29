# Render-mcp MCP Server

Render cloud infrastructure management

## Overview

**Tool Name**: render-infrastructure-manager  
**Version**: 1.0.0  
**ORBT Layer**: 3  
**System Code**: RDRMC  
**Port**: 3008

## Operations

- `list_services` - list services
- `create_service` - create service
- `deploy_service` - deploy service
- `get_logs` - get logs
- `scale_service` - scale service

## Environment Variables

- `RENDER_API_KEY` - Required for API authentication

## Usage Example

```json
{
  "operation": "list_services",
  "unique_id": "HEIR-2024-12-RDRMC-EXEC-01",
  "process_id": "PRC-RDRMC000-1756491210822",
  "orbt_layer": 3,
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
✅ ORBT layer 3 authorization  
✅ Blueprint version tracking  

## Architecture

- **Server**: `server.js` - Express server setup
- **Tool Logic**: `tools/tool_handler.js` - Core business logic
- **Middleware**: `middleware/` - Validation, logging, kill switch
- **Manifests**: `manifests/tool_manifest.json` - Schema definitions
- **Mocks**: `mock/` - Sample payloads and responses

Last updated: 2025-08-29T18:13:30.822Z
