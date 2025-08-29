# Apify-mcp MCP Server

Web scraping and data extraction using Apify platform

## Overview

**Tool Name**: apify-scraper  
**Version**: 1.3.2  
**ORBT Layer**: 5  
**System Code**: APFYSC  
**Port**: 3002

## Operations

- `run_actor` - run actor
- `scrape_url` - scrape url
- `get_dataset` - get dataset
- `list_actors` - list actors

## Environment Variables

- `APIFY_API_KEY` - Required for API authentication

## Usage Example

```json
{
  "operation": "run_actor",
  "unique_id": "HEIR-2024-12-APFYSC-EXEC-01",
  "process_id": "PRC-APFYSC00-1756491210803",
  "orbt_layer": 5,
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
✅ ORBT layer 5 authorization  
✅ Blueprint version tracking  

## Architecture

- **Server**: `server.js` - Express server setup
- **Tool Logic**: `tools/tool_handler.js` - Core business logic
- **Middleware**: `middleware/` - Validation, logging, kill switch
- **Manifests**: `manifests/tool_manifest.json` - Schema definitions
- **Mocks**: `mock/` - Sample payloads and responses

Last updated: 2025-08-29T18:13:30.803Z
