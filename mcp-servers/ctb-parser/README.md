# Ctb-parser MCP Server

CTB (Component Tree Blueprint) structure parsing and validation

## Overview

**Tool Name**: ctb-parser  
**Version**: 1.0.0  
**ORBT Layer**: 4  
**System Code**: CTBPSR  
**Port**: 3003

## Operations

- `parse_ctb` - parse ctb
- `validate_ctb` - validate ctb
- `convert_ctb` - convert ctb
- `generate_blueprint` - generate blueprint

## Environment Variables

No environment variables required.

## Usage Example

```json
{
  "operation": "parse_ctb",
  "unique_id": "HEIR-2024-12-CTBPSR-EXEC-01",
  "process_id": "PRC-CTBPSR00-1756491210806",
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

Last updated: 2025-08-29T18:13:30.806Z
