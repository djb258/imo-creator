# IMO-Creator Production URLs

When cloning this repository, these are the production endpoints your applications will use:

## Frontend (Vercel)
- **URL**: https://imo-creator.vercel.app
- **UI Pages**:
  - Overview: https://imo-creator.vercel.app/
  - Input: https://imo-creator.vercel.app/docs/blueprints/ui/input.html
  - Middle: https://imo-creator.vercel.app/docs/blueprints/ui/middle.html
  - Output: https://imo-creator.vercel.app/docs/blueprints/ui/output.html

## Composio Integration (Hosted by Composio)
- **API Base**: https://backend.composio.dev
- **Alternative API**: https://api.composio.dev
- **API Key**: ak_t-F0AbvfZHUZSUrqAGNn
- **Documentation**: https://docs.composio.dev

## Key API Endpoints

### Composio Tool Execution
```bash
# Execute a tool through Composio's hosted service
curl -X POST https://backend.composio.dev/api/v1/actions/{action_name}/execute \
  -H "X-API-Key: ak_t-F0AbvfZHUZSUrqAGNn" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "param1": "value1"
    },
    "appName": "your_app",
    "entityId": "default"
  }'
```

### List Available Actions
```bash
# Get all available Composio actions
curl https://backend.composio.dev/api/v1/actions \
  -H "X-API-Key: ak_t-F0AbvfZHUZSUrqAGNn"
```

### Gemini Integration
```bash
# Use Gemini through Composio (if integrated)
curl -X POST https://backend.composio.dev/api/v1/actions/GEMINI_GENERATE/execute \
  -H "X-API-Key: ak_t-F0AbvfZHUZSUrqAGNn" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "prompt": "Your prompt here",
      "model": "gemini-2.5-flash"
    },
    "appName": "gemini",
    "entityId": "default"
  }'
```

## Google Gemini Direct Access

- **API Key**: AIzaSyDp-XJ_6HFZc57f2RaAFXBPXQMOjliF2WY
- **Model**: gemini-2.5-flash
- **Direct API**: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent

## MCP Registry
```bash
# Access global MCP registry
curl https://imo-creator.vercel.app/config/mcp_registry.json

# Access Composio-specific registry
curl https://imo-creator.vercel.app/branches/composio/mcp_registry.json
```

## Environment Variables for New Repos

When creating new repositories based on IMO-Creator, use these URLs:

```bash
# Composio Integration (Hosted Service)
COMPOSIO_API_KEY=ak_t-F0AbvfZHUZSUrqAGNn
COMPOSIO_API_URL=https://backend.composio.dev
COMPOSIO_BASE_URL=https://backend.composio.dev
COMPOSIO_ENTITY_ID=default

# Google Gemini
GOOGLE_API_KEY=AIzaSyDp-XJ_6HFZc57f2RaAFXBPXQMOjliF2WY
GEMINI_MODEL=gemini-2.5-flash

# Frontend
FRONTEND_URL=https://imo-creator.vercel.app

# CORS Configuration
ALLOW_ORIGIN=https://imo-creator.vercel.app
```

## Auto-Configuration

The `config/mcp_registry.json` file contains these URLs and will be automatically copied to new repos during scaffolding, ensuring zero-configuration setup for Composio integration.

## Local Development

For local development with localhost testing:
```bash
# Local MCP server (optional for testing)
LOCAL_MCP_URL=http://localhost:3001

# Still use Composio's hosted service for production features
COMPOSIO_API_URL=https://backend.composio.dev
```

## Architecture

```
┌─────────────────────────┐
│   Your Application      │
│   (Browser/Server)      │
└────────────┬────────────┘
             │
             │ HTTPS API Calls
             │
┌────────────▼────────────┐
│  Composio Hosted API    │
│  backend.composio.dev   │
│                         │
│  • 100+ Integrations    │
│  • Google Gemini        │
│  • Gmail, Drive, etc    │
└─────────────────────────┘
```

**All services are accessed through Composio's hosted infrastructure. No self-hosting required!**
