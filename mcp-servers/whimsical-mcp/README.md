# Whimsical-mcp MCP Server

Whimsical diagram and flowchart management

## Overview

**Tool Name**: whimsical-diagram-manager  
**Version**: 1.0.0  
**ORBT Layer**: 4  
**System Code**: WHMSCL  
**Port**: 3000

## Operations

- `create_flowchart` - create flowchart
- `update_diagram` - update diagram
- `export_diagram` - export diagram
- `list_workspaces` - list workspaces

## Environment Variables

- `WHIMSICAL_API_KEY` - Required for API authentication

## Usage Example

```json
{
  "operation": "create_flowchart",
  "unique_id": "HEIR-2024-12-WHMSCL-EXEC-01",
  "process_id": "PRC-WHMSCL00-1756491210828",
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

Last updated: 2025-08-29T18:13:30.828Z
