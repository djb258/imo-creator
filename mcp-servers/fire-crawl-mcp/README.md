# Fire-crawl-mcp MCP Server

Advanced web scraping and data extraction using FireCrawl

## Overview

**Tool Name**: fire-crawl-scraper  
**Version**: 1.0.0  
**ORBT Layer**: 5  
**System Code**: FRCWL  
**Port**: 3010

## Operations

- `scrape_single` - scrape single
- `crawl_website` - crawl website
- `batch_scrape` - batch scrape
- `extract_data` - extract data
- `get_credits` - get credits

## Environment Variables

- `FIRECRAWL_API_KEY` - Required for API authentication

## Usage Example

```json
{
  "operation": "scrape_single",
  "unique_id": "HEIR-2024-12-FRCWL-EXEC-01",
  "process_id": "PRC-FRCWL000-1756491210811",
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

Last updated: 2025-08-29T18:13:30.811Z
