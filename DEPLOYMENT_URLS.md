# IMO-Creator Production URLs

When cloning this repository, these are the production endpoints your applications will use:

## Frontend (Vercel)
- **URL**: https://imo-creator.vercel.app
- **UI Pages**:
  - Overview: https://imo-creator.vercel.app/
  - Input: https://imo-creator.vercel.app/docs/blueprints/ui/input.html
  - Middle: https://imo-creator.vercel.app/docs/blueprints/ui/middle.html
  - Output: https://imo-creator.vercel.app/docs/blueprints/ui/output.html

## Backend (Render)
- **API Base**: https://composio-imo-creator-url.onrender.com
- **Health Check**: https://composio-imo-creator-url.onrender.com/health
- **Composio MCP Server**: https://composio-imo-creator-url.onrender.com/api

## Key API Endpoints

### SSOT Management
```bash
# Save SSOT with ID generation
curl -X POST https://composio-imo-creator-url.onrender.com/api/ssot/save \
  -H "Content-Type: application/json" \
  -d '{"ssot":{"meta":{"app_name":"Your App","stage":"overview"}}}'
```

### Subagent Registry
```bash
# List available subagents
curl https://composio-imo-creator-url.onrender.com/api/subagents
```

### MCP Registry
```bash
# Access global MCP registry
curl https://imo-creator.vercel.app/config/mcp_registry.json

# Access Composio-specific registry
curl https://imo-creator.vercel.app/branches/composio/mcp_registry.json
```

## Composio Integration
- **API Key**: `ak_t-F0AbvfZHUZSUrqAGNn` (embedded in configs)
- **MCP Endpoint**: https://composio-imo-creator-url.onrender.com
- **Tool Access**: All Composio tools accessible via `/api/composio/{tool}` routes

## Environment Variables for New Repos

When creating new repositories based on IMO-Creator, use these URLs:

```bash
# Backend API
BACKEND_URL=https://composio-imo-creator-url.onrender.com
API_BASE_URL=https://composio-imo-creator-url.onrender.com/api

# Frontend
FRONTEND_URL=https://imo-creator.vercel.app

# Composio Integration
COMPOSIO_API_KEY=ak_t-F0AbvfZHUZSUrqAGNn
MCP_SERVER_URL=https://composio-imo-creator-url.onrender.com

# CORS Configuration
ALLOW_ORIGIN=https://imo-creator.vercel.app
```

## Auto-Configuration

The `config/mcp_registry.json` file contains these URLs and will be automatically copied to new repos during scaffolding, ensuring zero-configuration setup for Composio MCP integration.