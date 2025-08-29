# Email-validator MCP Server

Email validation and verification services

## Overview

**Tool Name**: email-validator  
**Version**: 1.0.0  
**ORBT Layer**: 6  
**System Code**: EMLVLD  
**Port**: 3004

## Operations

- `validate_email` - validate email
- `validate_domain` - validate domain
- `bulk_validate` - bulk validate
- `get_mx_records` - get mx records

## Environment Variables

No environment variables required.

## Usage Example

```json
{
  "operation": "validate_email",
  "unique_id": "HEIR-2024-12-EMLVLD-EXEC-01",
  "process_id": "PRC-EMLVLD00-1756491210808",
  "orbt_layer": 6,
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
✅ ORBT layer 6 authorization  
✅ Blueprint version tracking  

## Architecture

- **Server**: `server.js` - Express server setup
- **Tool Logic**: `tools/tool_handler.js` - Core business logic
- **Middleware**: `middleware/` - Validation, logging, kill switch
- **Manifests**: `manifests/tool_manifest.json` - Schema definitions
- **Mocks**: `mock/` - Sample payloads and responses

Last updated: 2025-08-29T18:13:30.808Z
