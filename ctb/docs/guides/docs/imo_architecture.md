# IMO-Creator Architecture

## Overview

IMO-Creator follows the **Input → Middle → Output (IMO)** doctrine, a structured approach to data processing and integration management. This architecture ensures clean separation of concerns, centralized routing, and reliable fallback mechanisms.

## Core Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          INPUT LAYER                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Vercel     │    │   Render     │    │   API Edge   │      │
│  │  (Frontend)  │    │  (Backend)   │    │  Functions   │      │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘      │
│         │                    │                    │              │
└─────────┼────────────────────┼────────────────────┼─────────────┘
          │                    │                    │
          └────────────────────┼────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MIDDLE LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    COMPOSIO HUB                          │   │
│  │  (Primary Integration Router - MCP Protocol)             │   │
│  └─────────────────┬────────────────────────────────────────┘   │
│                    │                                             │
│     ┌──────────────┼──────────────┐                            │
│     │              │              │                            │
│     ▼              ▼              ▼                            │
│  ┌──────┐    ┌──────────┐    ┌────────────┐                  │
│  │ n8n  │    │ Make.com │    │ Zapier     │     (Fallback     │
│  │Spoke │    │  Spoke   │    │   Spoke    │      Spokes)      │
│  └──────┘    └──────────┘    └────────────┘                  │
│     │              │              │                            │
│  ┌──────────┐                           ┌──────────┐         │
│  │Pipedream │                           │ Custom   │         │
│  │  Spoke   │                           │  Spokes  │         │
│  └──────────┘                           └──────────┘         │
└─────────┼──────────────────────────────────────────┼──────────┘
          │                                          │
          └──────────────────┬──────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         OUTPUT LAYER                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │     Neon     │    │   Firebase   │    │    Apify     │      │
│  │  (Postgres)  │    │  (NoSQL/RT)  │    │  (Scraping)  │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   BigQuery   │    │   External   │    │    Custom    │      │
│  │  (Analytics) │    │     APIs     │    │  Databases   │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└──────────────────────────────────────────────────────────────────┘
```

## Layer Descriptions

### Input Layer
The entry point for all requests and user interactions:
- **Vercel**: Hosts the frontend UI and edge API functions
- **Render**: Hosts backend services, MCP servers, and processing logic
- **API Edge Functions**: Serverless functions for rapid request handling

### Middle Layer (Composio Hub)
The intelligent routing and integration layer:
- **Composio Hub**: Primary integration router using MCP protocol
  - Routes to appropriate services based on registry
  - Handles authentication and authorization
  - Provides unified error handling and retries
  - Maintains connection state and health checks

- **Fallback Spokes**: Secondary integration options when MCP is unavailable
  - n8n: Open-source workflow automation
  - Make.com: Visual integration platform
  - Zapier: Popular automation service
  - Pipedream: Developer-centric workflows
  - Custom spokes: Organization-specific integrations

### Output Layer
The destination services and data stores:
- **Neon**: PostgreSQL database for structured data
- **Firebase**: Real-time database and authentication
- **Apify**: Web scraping and automation
- **BigQuery**: Analytics and data warehouse
- **External APIs**: Third-party service integrations
- **Custom Databases**: Organization-specific data stores

## Routing Logic

### Primary Flow (MCP via Composio)
```javascript
Request → Input Layer → Composio Hub → MCP Registry Check → Output Service
                              ↓
                    [If service active in registry]
                              ↓
                    Route via MCP protocol
```

### Fallback Flow
```javascript
Request → Input Layer → Composio Hub → MCP Registry Check
                              ↓
                    [If MCP unavailable]
                              ↓
                    Check fallback spokes
                              ↓
                    Route via webhook/API
```

## Registry Structure

The central MCP registry (`/config/mcp_registry.json`) defines both static engine capabilities and repo-specific usage:

### Engine Capabilities (Global)
Static tool definitions managed centrally in IMO-Creator:
```json
{
  "engine_version": "1.0.0",
  "last_updated": "2025-09-26T00:00:00Z",
  "engine_capabilities": [
    {
      "tool": "Neon",
      "type": "MCP",
      "endpoint": "https://neon.mcp",
      "doctrine_id": "04.04.01",
      "status": "active"
    }
  ]
}
```

### Repo Usage (Local)
Repo-specific patterns populated during scaffolding:
```json
{
  "repo_usage": {
    "inputs": ["CSV Intake", "Webhook"],
    "middle": ["Firebase.write", "Neon.query"],
    "outputs": ["Neon", "Slack"]
  }
}
```

**Important**: The `/branches/composio/mcp_registry.json` is now deprecated in favor of `/config/mcp_registry.json` which provides both global engine capabilities and repo-specific usage tracking.

## Deployment Configuration

### Frontend (Vercel)
- **Branch**: `main`
- **Build**: Automatic on push
- **Config**: `vercel.json`
- **Environment**: Edge runtime
- **Features**:
  - Static site hosting
  - API edge functions
  - Global CDN
  - Preview deployments

### Backend (Render)
- **Branch**: `main`
- **Services**:
  - Main backend (FastAPI/Node.js)
  - MCP server
  - Sidecar logger
- **Config**: `render.yaml`
- **Features**:
  - Persistent services
  - Background jobs
  - Database hosting
  - Auto-scaling

## Environment Variables

### Required for All Deployments
```bash
COMPOSIO_API_KEY        # Composio authentication
VERCEL_TOKEN           # Vercel deployment
RENDER_TOKEN           # Render deployment
MCP_API_URL           # Composio backend URL
```

### Service-Specific
```bash
# Vercel
VERCEL_CONNECTED_ACCOUNT_ID
VERCEL_PROJECT_ID
VERCEL_ORG_ID

# Render
RENDER_SERVICE_ID
RENDER_MCP_SERVICE_ID
RENDER_SIDECAR_SERVICE_ID

# LLM Providers
ANTHROPIC_API_KEY
OPENAI_API_KEY
LLM_DEFAULT_PROVIDER

# Doctrine
DOCTRINE_DB
DOCTRINE_SUBHIVE
DOCTRINE_APP
DOCTRINE_VER
```

## Doctrine Compliance

### HEIR Rules
All components must follow HEIR (Hierarchical Error-handling, ID management, and Reporting):
1. **Unique IDs**: Every transaction gets a doctrine-compliant ID
2. **Process IDs**: Track request flow across services
3. **Error Hierarchy**: Structured error reporting with fallback paths
4. **Audit Trail**: Complete logging via sidecar

### IMO Rules
1. **Input Validation**: All requests validated at entry
2. **Middle Routing**: Composio-first, fallback-second
3. **Output Confirmation**: Verify successful data delivery

## Integration Patterns

### Synchronous Pattern
```
Client → Vercel → Composio → Service → Response
```
- Best for: Quick operations, user-facing APIs
- Timeout: 30 seconds max

### Asynchronous Pattern
```
Client → Render → Queue → Composio → Service
         ↓
    Webhook callback
```
- Best for: Long-running operations, batch processing
- Uses: Background jobs, webhooks

### Streaming Pattern
```
Client ← SSE/WebSocket ← Composio ← Service
```
- Best for: Real-time updates, live data
- Uses: Firebase realtime, progress tracking

## Security Considerations

### API Security
- All endpoints require authentication
- API keys stored as environment variables
- CORS configured per deployment
- Rate limiting on all public endpoints

### Data Security
- End-to-end encryption for sensitive data
- No credentials in code or logs
- Secure webhook validation
- Regular key rotation

## Monitoring & Observability

### Health Checks
- `/health` - Basic service health
- `/api/health/composio` - Composio connection
- `/api/health/mcp` - MCP services status
- `/api/health/fallbacks` - Fallback availability

### Metrics
- Request latency per service
- Success/failure rates
- Fallback activation frequency
- Registry hit/miss ratio

### Logging
- Structured JSON logging
- Correlation IDs across services
- Error aggregation
- Performance tracking

## Development Workflow

### Local Development
```bash
# Start all services
npm run dev           # Frontend
uvicorn src.server.main:app --reload  # Backend
python -m packages.mcp.server  # MCP
python -m packages.sidecar.server  # Sidecar
```

### Testing
```bash
# Run all tests
npm test              # JavaScript tests
pytest tests/         # Python tests
```

### Deployment
```bash
# Deploy to production
git push origin main  # Triggers CI/CD
```

## Troubleshooting Guide

### Common Issues

1. **Composio Connection Failed**
   - Check `COMPOSIO_API_KEY` is set
   - Verify `MCP_API_URL` is correct
   - Test with curl to Composio endpoint

2. **Fallback Not Activating**
   - Check registry status field
   - Verify webhook URLs are accessible
   - Check fallback service credentials

3. **Deployment Failures**
   - Verify all secrets in GitHub
   - Check branch is `main`
   - Review build logs in Vercel/Render

## Migration Guide

### For Existing Projects
1. Clone this repository
2. Copy `/branches/` directory structure
3. Update `vercel.json` and `render.yaml`
4. Set environment variables
5. Update API endpoints to use `/api/composio/integrate`
6. Deploy to `main` branch

### For New Projects
1. Use this repo as template
2. Configure Composio account
3. Set up Vercel and Render projects
4. Add GitHub secrets
5. Push to trigger deployment

## Best Practices

1. **Always route through Composio first** - Maintains consistency
2. **Keep registry updated** - Regular audits of service status
3. **Monitor fallback usage** - High usage indicates MCP issues
4. **Version your changes** - Use semantic versioning for releases
5. **Document integrations** - Keep `/docs/` current
6. **Test fallback paths** - Regular testing of all spokes
7. **Secure credentials** - Never commit secrets
8. **Use correlation IDs** - Track requests across services

## Support & Resources

- [Composio Documentation](https://docs.composio.dev)
- [MCP Protocol Spec](./composio_connection.md)
- [Registry Schema](../branches/composio/mcp_registry.json)
- [HEIR Compliance](../heir.doctrine.yaml)
- [Deployment Guide](./composio_connection.md#deployment-architecture)