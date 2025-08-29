# Plasmic-mcp MCP Server

Plasmic UI component management and code generation

## Overview

**Tool Name**: plasmic-component-manager  
**Version**: 1.0.0  
**ORBT Layer**: 4  
**System Code**: PLSMIC  
**Port**: 3006

## Operations

- `sync_components` - sync components
- `get_component` - get component
- `generate_code` - generate code
- `list_components` - list components

## Environment Variables

- `PLASMIC_API_KEY` - Required for API authentication
- `PLASMIC_PROJECT_ID` - Required for configuration

## Usage Example

```json
{
  "operation": "sync_components",
  "unique_id": "HEIR-2024-12-PLSMIC-EXEC-01",
  "process_id": "PRC-PLSMIC00-1756491210818",
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

Last updated: 2025-08-29T18:13:30.818Z
