# Composio Connection Guide

## Overview
Composio serves as the primary integration hub for the IMO-Creator system, following the Input → Middle → Output doctrine. All integrations route through Composio first, with fallback spokes (n8n, Make, Zapier, Pipedream) only used if MCP is unavailable.

## Environment Variables

**🎯 ONLY ONE KEY REQUIRED:**

- `COMPOSIO_API_KEY` - Your Composio API key for authentication (`ak_t-F0AbvfZHUZSUrqAGNn`)

**All other configuration is pre-embedded in the repository:**

- `MCP_API_URL` - Pre-configured to `https://backend.composio.dev`
- `MCP_TIMEOUT` - Pre-configured to 5000ms
- All deployment tokens are **NOT NEEDED** - platforms auto-deploy from main branch
- Registry, endpoints, and routing logic are embedded in the repo

## Connection Snippet (Node.js/Express)

```javascript
import { ComposioClient } from 'composio-sdk';
import registry from '../branches/composio/mcp_registry.json' assert { type: 'json' };

const client = new ComposioClient(process.env.COMPOSIO_API_KEY);

export default async function handler(req, res) {
  try {
    // Route through Composio by default
    const result = await client.routeIntegration(req.body.app, req.body.payload);
    res.json({ success: true, data: result });
  } catch (error) {
    // Fallback to spoke systems if Composio fails
    console.error('Composio routing failed:', error);
    const fallbackResult = await handleFallback(req.body.app, req.body.payload);
    res.json({ success: true, fallback: true, data: fallbackResult });
  }
}

async function handleFallback(app, payload) {
  const tool = registry.find(t => t.tool.toLowerCase() === app.toLowerCase());
  if (!tool || tool.type !== 'Fallback') {
    throw new Error(`No fallback available for: ${app}`);
  }

  return fetch(tool.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(res => res.json());
}
```

## Connection Snippet (Python/FastAPI)

```python
import os
import json
import httpx
from fastapi import FastAPI, HTTPException
from composio import ComposioClient

app = FastAPI()
client = ComposioClient(api_key=os.getenv("COMPOSIO_API_KEY"))

# Load registry
with open("branches/composio/mcp_registry.json") as f:
    registry = json.load(f)

@app.post("/integrate")
async def integrate(app_name: str, payload: dict):
    try:
        # Route through Composio by default
        result = await client.route_integration(app_name, payload)
        return {"success": True, "data": result}
    except Exception as e:
        # Fallback to spoke systems
        print(f"Composio routing failed: {e}")
        fallback_result = await handle_fallback(app_name, payload)
        return {"success": True, "fallback": True, "data": fallback_result}

async def handle_fallback(app_name: str, payload: dict):
    tool = next((t for t in registry if t["tool"].lower() == app_name.lower()), None)
    if not tool or tool["type"] != "Fallback":
        raise HTTPException(404, f"No fallback available for: {app_name}")

    async with httpx.AsyncClient() as client:
        response = await client.post(tool["endpoint"], json=payload)
        return response.json()
```

## Deployment Architecture

### Frontend (Vercel)
- **Deploys from**: `main` branch (auto-connect via GitHub integration)
- **Includes**: Static UI, API edge functions, Composio client
- **Setup**: Connect Vercel project to this repo, set COMPOSIO_API_KEY
- **Environment**: Production edge runtime (all other vars pre-configured)

### Backend (Render)
- **Deploys from**: `main` branch (auto-connect via GitHub integration)
- **Includes**: MCP services, FastAPI server, webhook handlers
- **Setup**: Connect Render service to this repo (API key embedded in render.yaml)
- **Environment**: Python/Node.js runtime (zero additional configuration)

### Integration Flow
```
┌──────────┐     ┌────────────┐     ┌──────────┐
│  Vercel  │────▶│  Composio  │────▶│   MCP    │
│   Edge   │     │    Hub     │     │ Services │
└──────────┘     └────────────┘     └──────────┘
                        │
                        ▼
                 ┌──────────────┐
                 │  Fallbacks   │
                 │ (n8n, Make,  │
                 │ Zapier, etc) │
                 └──────────────┘
```

## Doctrine Rules

### Primary Rule
**All integrations MUST route through Composio first.** This ensures:
- Centralized monitoring and logging
- Consistent authentication handling
- Unified error handling and retries
- Single point of configuration

### Fallback Rules
Fallback spokes (n8n, Make, Zapier, Pipedream) are used when:
1. Composio service is unavailable (503 error)
2. MCP endpoint timeout exceeds threshold
3. Specific tool explicitly configured for fallback-only mode
4. Development/testing requires bypass (with explicit flag)

### Registry Management
- Registry updates require approval via PR
- Each tool must have unique `doctrine_id`
- Status values: `active`, `deprecated`, `maintenance`
- Endpoint URLs must be HTTPS in production

## Testing Integration

### Local Testing
```bash
# Start local Composio mock
npm run composio:mock

# Test integration routing
curl -X POST http://localhost:3000/api/integrate \
  -H "Content-Type: application/json" \
  -d '{"app": "Neon", "payload": {"query": "SELECT * FROM users"}}'
```

### Production Testing
```bash
# Test Vercel edge function
curl -X POST https://your-app.vercel.app/api/integrate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_TOKEN" \
  -d '{"app": "Firebase", "payload": {"collection": "users", "action": "list"}}'

# Test Render backend
curl -X POST https://your-app.onrender.com/integrate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_TOKEN" \
  -d '{"app": "Apify", "payload": {"actor": "web-scraper", "input": {...}}}'
```

## Monitoring & Observability

### Health Checks
- Composio health: `GET /api/health/composio`
- MCP status: `GET /api/health/mcp`
- Fallback status: `GET /api/health/fallbacks`

### Metrics to Track
- Integration success rate per tool
- Average response time per endpoint
- Fallback activation frequency
- Error rates by doctrine_id

## Security Considerations

1. **API Keys**: Never commit API keys. Use environment variables
2. **CORS**: Configure allowed origins in Vercel/Render settings
3. **Rate Limiting**: Implement per-app rate limits
4. **Webhook Validation**: Verify webhook signatures for fallback spokes
5. **SSL/TLS**: All endpoints must use HTTPS in production

## Troubleshooting

### Common Issues

**Issue**: Composio connection timeout
```javascript
// Solution: Increase timeout and add retry logic
const client = new ComposioClient({
  apiKey: process.env.COMPOSIO_API_KEY,
  timeout: 10000, // 10 seconds
  retries: 3
});
```

**Issue**: Fallback webhook not responding
```javascript
// Solution: Add health check before routing
async function checkFallbackHealth(endpoint) {
  try {
    const response = await fetch(`${endpoint}/health`, {
      method: 'GET',
      timeout: 2000
    });
    return response.ok;
  } catch {
    return false;
  }
}
```

**Issue**: Registry out of sync
```bash
# Solution: Force refresh from main branch
git fetch origin main
git checkout origin/main -- branches/composio/mcp_registry.json
```

## Migration Guide

For existing IMO-Creator repos to adopt Composio:

1. **Install dependencies**
```bash
npm install composio-sdk
# or
pip install composio
```

2. **Copy branch structure**
```bash
cp -r branches/composio /your-repo/branches/
cp -r branches/n8n /your-repo/branches/
# ... copy other fallback branches
```

3. **Update environment files**
```bash
echo "COMPOSIO_API_KEY=" >> .env
echo "VERCEL_TOKEN=" >> .env
echo "RENDER_TOKEN=" >> .env
```

4. **Deploy configurations**
```bash
vercel --prod
render deploy
```

## Support & Resources

- [Composio Documentation](https://docs.composio.dev)
- [MCP Registry Schema](./branches/composio/mcp_registry.json)
- [IMO Architecture Guide](./imo_architecture.md)
- [HEIR Compliance Rules](../heir.doctrine.yaml)