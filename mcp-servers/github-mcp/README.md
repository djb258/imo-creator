# Github-mcp MCP Server

GitHub repository management and operations

## Overview

**Tool Name**: github-manager  
**Version**: 1.0.0  
**ORBT Layer**: 3  
**System Code**: GHUBMC  
**Port**: 3005

## Operations

- `get_repository` - get repository
- `list_commits` - list commits
- `create_issue` - create issue
- `get_pull_requests` - get pull requests
- `get_file_content` - get file content

## Environment Variables

- `GITHUB_TOKEN` - Required for configuration

## Usage Example

```json
{
  "operation": "get_repository",
  "unique_id": "HEIR-2024-12-GHUBMC-EXEC-01",
  "process_id": "PRC-GHUBMC00-1756491210813",
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

Last updated: 2025-08-29T18:13:30.813Z
