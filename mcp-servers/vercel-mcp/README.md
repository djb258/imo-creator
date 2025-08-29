# Vercel-mcp MCP Server

Vercel deployment and infrastructure management

## Overview

**Tool Name**: vercel-deployment-manager  
**Version**: 1.0.0  
**ORBT Layer**: 3  
**System Code**: VRCLMC  
**Port**: 3007

## Operations

- `deploy_project` - deploy project
- `list_deployments` - list deployments
- `set_env_vars` - set env vars
- `add_domain` - add domain

## Environment Variables

- `VERCEL_TOKEN` - Required for configuration
- `VERCEL_TEAM_ID` - Required for configuration

## Usage Example

```json
{
  "operation": "deploy_project",
  "unique_id": "HEIR-2024-12-VRCLMC-EXEC-01",
  "process_id": "PRC-VRCLMC00-1756491210825",
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

Last updated: 2025-08-29T18:13:30.825Z
