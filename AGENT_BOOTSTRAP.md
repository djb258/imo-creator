# 🤖 AI Agent Bootstrap Guide

## 📋 REPOSITORY PURPOSE

This is a **Render-deployed FastAPI backend** with **Composio MCP integration** for accessing 100+ services through a single unified API.

**Deployment URL**: `https://YOUR_RENDER_APP_NAME.onrender.com` (replace with your actual Render URL)
**Primary API Key**: `ak_t-F0AbvfZHUZSUrqAGNn`
**Python Version**: 3.11.9

---

## 🚀 INSTANT AGENT ONBOARDING

### What This Repository Does
1. **FastAPI Backend**: Production-ready REST API deployed on Render
2. **Composio Integration**: Direct access to 100+ services (Gmail, GitHub, Slack, etc.)
3. **LLM Routing**: Multi-provider LLM endpoint (OpenAI, Anthropic)
4. **HEIR/ORBT Compliance**: Doctrine-safe ID generation and payload formatting
5. **AI-Ready Endpoints**: All endpoints designed for programmatic access

### How AI Agents Should Use This Repository
- **Read RENDER_COMPOSIO_DEPLOYMENT_GUIDE.md** for complete API reference
- **Use the deployment URL** to make HTTP requests
- **Include required headers** (especially for Composio endpoints)
- **Follow HEIR/ORBT format** for tool execution payloads

---

## ⚡ QUICK START FOR AI AGENTS

### 1. Health Check (Verify Deployment)
```bash
curl https://YOUR_RENDER_APP_NAME.onrender.com/health
```
**Expected Response**:
```json
{
  "status": "ok",
  "service": "imo-creator-backend"
}
```

### 2. Get Available Endpoints
```bash
curl https://YOUR_RENDER_APP_NAME.onrender.com/
```
**Expected Response**:
```json
{
  "message": "IMO-Creator Backend API",
  "endpoints": [
    "/health",
    "/blueprints/{slug}/manifest",
    "/llm",
    "/api/ssot/save",
    "/api/composio/million_verifier/tool",
    ...
  ]
}
```

### 3. Test LLM Endpoint (If API Keys Configured)
```bash
curl -X POST https://YOUR_RENDER_APP_NAME.onrender.com/llm \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Say hello!",
    "max_tokens": 100
  }'
```

### 4. Test Composio Integration
```bash
curl -X POST https://YOUR_RENDER_APP_NAME.onrender.com/api/composio/million_verifier/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "GET_CREDITS",
    "data": {},
    "unique_id": "HEIR-2025-10-AGENT-TEST-01",
    "process_id": "PRC-AGENT-TEST-001",
    "orbt_layer": 2,
    "blueprint_version": "1.0"
  }'
```

---

## 🔑 CRITICAL INFORMATION

### API Keys & Authentication
- **Composio API Key**: `ak_t-F0AbvfZHUZSUrqAGNn`
- **Header Name**: `X-API-Key` (for direct Composio calls)
- **CORS**: Configured for `https://imo-creator.vercel.app` (add more as needed)

### Composio Direct Access
- **Backend URL**: `https://backend.composio.dev/api/v1`
- **API URL**: `https://api.composio.dev/api/v1`
- **Authentication**: All requests use same API key

### Environment Variables (Set in Render)
```bash
COMPOSIO_API_KEY=ak_t-F0AbvfZHUZSUrqAGNn
MCP_API_URL=https://backend.composio.dev
BACKEND_URL=https://YOUR_RENDER_APP_NAME.onrender.com
ALLOW_ORIGIN=https://imo-creator.vercel.app
```

---

## 📖 ESSENTIAL FILES TO READ

1. **RENDER_COMPOSIO_DEPLOYMENT_GUIDE.md** - Complete deployment and API reference
2. **render.yaml** - Render deployment configuration
3. **src/server/main.py** - Core FastAPI application with all endpoints
4. **requirements.txt** - Python dependencies
5. **config/mcp_endpoints.json** - Composio service registry

---

## 🎯 COMMON AGENT TASKS

### Task: Call an LLM
```python
import requests

response = requests.post(
    "https://YOUR_RENDER_APP_NAME.onrender.com/llm",
    json={
        "provider": "openai",  # or "anthropic"
        "model": "gpt-4o-mini",
        "prompt": "Your prompt here",
        "max_tokens": 1024
    }
)
print(response.json()["text"])
```

### Task: Execute Composio Tool
```python
import requests

response = requests.post(
    "https://YOUR_RENDER_APP_NAME.onrender.com/api/composio/million_verifier/tool",
    json={
        "tool": "VERIFY_EMAIL",
        "data": {
            "email": "test@example.com"
        },
        "unique_id": "HEIR-2025-10-VERIFY-01",
        "process_id": "PRC-VERIFY-001",
        "orbt_layer": 2,
        "blueprint_version": "1.0"
    }
)
print(response.json())
```

### Task: Save SSOT with Doctrine Compliance
```python
import requests

response = requests.post(
    "https://YOUR_RENDER_APP_NAME.onrender.com/api/ssot/save",
    json={
        "ssot": {
            "meta": {
                "app_name": "my-app",
                "stage": "overview"
            },
            "data": {
                "project_name": "Example Project"
            }
        }
    }
)
ssot = response.json()["ssot"]
print(f"Generated ID: {ssot['doctrine']['unique_id']}")
```

### Task: Access Composio Directly (Bypass Render)
```python
import requests

# List connected accounts
response = requests.get(
    "https://backend.composio.dev/api/v1/connectedAccounts",
    headers={
        "X-API-Key": "ak_t-F0AbvfZHUZSUrqAGNn",
        "Content-Type": "application/json"
    }
)
accounts = response.json()
print(f"Found {len(accounts)} connected accounts")
```

---

## 🔧 HEIR/ORBT PAYLOAD FORMAT

All Composio tool executions require this format:

```json
{
  "tool": "TOOL_NAME",
  "data": {
    "param1": "value1",
    "param2": "value2"
  },
  "unique_id": "HEIR-YYYY-MM-CATEGORY-ID-##",
  "process_id": "PRC-CATEGORY-ID-###",
  "orbt_layer": 2,
  "blueprint_version": "1.0"
}
```

### ID Generation Examples
- **unique_id**: `HEIR-2025-10-EMAIL-VERIFY-01`, `HEIR-2025-10-GITHUB-ISSUE-01`
- **process_id**: `PRC-EMAIL-VERIFY-001`, `PRC-GITHUB-ISSUE-001`

---

## 🌐 AVAILABLE COMPOSIO SERVICES

### Google Workspace (3 accounts connected)
- **Gmail**: `service@svg.agency`, `djb258@gmail.com`, `dbarton@svg.agency`
- **Google Drive**: Full API access
- **Google Calendar**: `service@svg.agency`
- **Google Sheets**: `service@svg.agency`

### GitHub (2 accounts connected)
- Repository management
- Issue and PR operations
- Commit and branch operations

### Other Services (100+ available)
- Slack, Linear, Notion
- Database operations
- Web scraping
- Email validation (Million Verifier)
- Builder.io, Figma
- Many more...

---

## 📚 DEPLOYMENT INFORMATION

### Render Configuration
- **Platform**: Render.com
- **Environment**: Python 3.11.9
- **Framework**: FastAPI + Uvicorn
- **Auto-Deploy**: Enabled on `master` branch
- **Health Check**: `/health` endpoint

### Deployment Process
1. Push to GitHub `master` branch
2. Render automatically detects changes
3. Runs `pip install -r requirements.txt`
4. Starts with `python main.py`
5. Available at `https://YOUR_RENDER_APP_NAME.onrender.com`

---

## 🐛 TROUBLESHOOTING FOR AGENTS

### Issue: "Connection refused"
- Check if deployment is active in Render dashboard
- Render free tier spins down after inactivity (may take 30s to wake up)
- Verify deployment URL is correct

### Issue: "CORS error"
- Your origin must be added to `ALLOW_ORIGIN` environment variable
- Update in Render dashboard: Settings → Environment → Add Variable

### Issue: "API key invalid"
- Verify using correct key: `ak_t-F0AbvfZHUZSUrqAGNn`
- For Composio direct calls, use header: `X-API-Key`
- For Render endpoints, most don't require API key (except direct Composio calls)

### Issue: "Tool not found"
- Check available tools: `GET https://api.composio.dev/api/v1/tools` with X-API-Key header
- Verify tool name matches exactly (case-sensitive)

---

## 💡 BEST PRACTICES FOR AI AGENTS

1. **Always start with health check** to verify deployment is awake
2. **Use HEIR/ORBT format** for all Composio tool calls
3. **Generate unique IDs** for each request (follow naming convention)
4. **Handle errors gracefully** - Render free tier has cold starts
5. **Read RENDER_COMPOSIO_DEPLOYMENT_GUIDE.md** for detailed API documentation

---

## 🚀 NEXT STEPS FOR AI AGENTS

1. **Verify deployment**: `curl https://YOUR_RENDER_APP_NAME.onrender.com/health`
2. **Read complete API docs**: Open `RENDER_COMPOSIO_DEPLOYMENT_GUIDE.md`
3. **Test endpoints**: Use examples from Quick Start section
4. **Explore Composio services**: Check connected accounts and available tools
5. **Build integrations**: Use FastAPI endpoints to access all services

---

## 📞 SUPPORT & RESOURCES

- **Composio Dashboard**: https://app.composio.dev/
- **Composio Docs**: https://docs.composio.dev/
- **Render Dashboard**: https://dashboard.render.com/
- **FastAPI Docs**: https://fastapi.tiangolo.com/

---

**Last Updated**: 2025-10-16
**Deployment Status**: Production Ready ✅
**AI Agent Friendly**: Yes ✅
**Composio Integration**: Active ✅

---

## 🔄 AGENT ONBOARDING CHECKLIST

- [ ] Read this file completely
- [ ] Read RENDER_COMPOSIO_DEPLOYMENT_GUIDE.md
- [ ] Test `/health` endpoint
- [ ] Test `/` endpoint to see available routes
- [ ] Understand HEIR/ORBT payload format
- [ ] Test at least one Composio tool
- [ ] Verify API key works for direct Composio calls
- [ ] Ready to build! 🚀
