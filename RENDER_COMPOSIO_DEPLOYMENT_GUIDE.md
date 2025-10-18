# 🚀 Render + Composio Deployment Guide - AI Agent Ready

## 📋 OVERVIEW

This guide provides everything needed to deploy a new repository where AI agents (ChatGPT Dev Mode, Claude, etc.) can connect directly to your Render deployment with full Composio integration.

**Repository Type**: FastAPI Backend + Composio MCP Integration
**Deployment Platform**: Render.com
**Primary API Key**: `ak_t-F0AbvfZHUZSUrqAGNn`
**Composio Backend**: `https://backend.composio.dev`
**Python Version**: 3.11.9

---

## 🔧 QUICK START DEPLOYMENT

### 1. Required Files (Copy to New Repository)

```
your-new-repo/
├── main.py                    # FastAPI entry point
├── src/
│   └── server/
│       └── main.py           # Core FastAPI application
├── Procfile                  # Render process definition
├── render.yaml               # Render configuration
├── runtime.txt               # Python version
├── requirements.txt          # Python dependencies
├── .env.example             # Environment template
└── config/
    └── mcp_endpoints.json   # Composio API configuration
```

### 2. Render Configuration Files

#### **Procfile**
```
web: python main.py
```

#### **runtime.txt**
```
python-3.11.9
```

#### **requirements.txt**
```
fastapi==0.111.0
uvicorn==0.30.0
gunicorn==22.0.0
PyYAML==6.0.2
pytest==8.3.2
requests==2.31.0
python-dotenv==1.0.0
pydantic==2.8.2
httpx==0.27.0
composio==0.8.14
python-multipart==0.0.9
```

#### **render.yaml**
```yaml
services:
  - type: web
    name: imo-creator-backend
    env: python
    plan: free
    branch: master
    region: oregon
    buildCommand: pip install -r requirements.txt
    startCommand: python main.py
    autoDeploy: true
    healthCheckPath: /health
    envVars:
      - key: COMPOSIO_API_KEY
        value: ak_t-F0AbvfZHUZSUrqAGNn
      - key: MCP_API_URL
        value: https://backend.composio.dev
      - key: ALLOW_ORIGIN
        value: "https://imo-creator.vercel.app"
      - key: PORT
        sync: false
```

---

## 🔑 ENVIRONMENT VARIABLES (Complete Reference)

### **Critical Variables (Required)**
```bash
# Composio Integration - REQUIRED
COMPOSIO_API_KEY=ak_t-F0AbvfZHUZSUrqAGNn
MCP_API_URL=https://backend.composio.dev
BACKEND_URL=https://YOUR_RENDER_APP_NAME.onrender.com
API_BASE_URL=https://YOUR_RENDER_APP_NAME.onrender.com/api

# CORS Configuration - REQUIRED
ALLOW_ORIGIN=https://imo-creator.vercel.app
PORT=8000  # Render sets this automatically
```

### **Optional Variables (Enhanced Features)**
```bash
# LLM Providers (Optional)
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
LLM_DEFAULT_PROVIDER=openai

# Doctrine ID Generation
DOCTRINE_DB=shq
DOCTRINE_SUBHIVE=03
DOCTRINE_APP=imo
DOCTRINE_VER=1

# Garage-MCP Integration
GARAGE_MCP_URL=https://YOUR_RENDER_APP_NAME.onrender.com
GARAGE_MCP_TOKEN=ak_t-F0AbvfZHUZSUrqAGNn
SUBAGENT_REGISTRY_PATH=/api/subagents

# Builder.io Integration
BUILDER_IO_API_KEY=9502e3493ccf42339f36d16b4a482c70
BUILDER_IO_SPACE_ID=your_space_id
```

---

## 🌐 API ENDPOINTS FOR AI AGENTS

### **Health Check**
```bash
GET https://YOUR_RENDER_APP_NAME.onrender.com/health

Response:
{
  "status": "ok",
  "service": "imo-creator-backend"
}
```

### **Root Information**
```bash
GET https://YOUR_RENDER_APP_NAME.onrender.com/

Response:
{
  "message": "IMO-Creator Backend API",
  "endpoints": [
    "/health",
    "/blueprints/{slug}/manifest",
    "/blueprints/{slug}/score",
    "/blueprints/{slug}/visuals",
    "/llm",
    "/api/ssot/save",
    "/api/subagents",
    "/api/composio/_21risk",
    "/api/composio/_2chat",
    "/api/composio/ably",
    "/api/composio/builder",
    "/api/composio/million_verifier",
    "/api/composio/million_verifier/tool"
  ]
}
```

### **LLM Endpoint (Multi-Provider)**
```bash
POST https://YOUR_RENDER_APP_NAME.onrender.com/llm

Headers:
  Content-Type: application/json

Body:
{
  "provider": "openai",  // or "anthropic"
  "model": "gpt-4o-mini",  // or "claude-3-5-sonnet-20240620"
  "system": "You are a helpful assistant",
  "prompt": "Your prompt here",
  "json": false,
  "max_tokens": 1024
}

Response:
{
  "text": "Model response",
  "model": "gpt-4o-mini",
  "provider": "openai"
}
```

### **SSOT Processing Endpoint**
```bash
POST https://YOUR_RENDER_APP_NAME.onrender.com/api/ssot/save

Headers:
  Content-Type: application/json

Body:
{
  "ssot": {
    "meta": {
      "app_name": "your-app",
      "stage": "overview"
    },
    "data": {
      "your": "data"
    }
  }
}

Response:
{
  "ok": true,
  "ssot": {
    "meta": {...},
    "doctrine": {
      "unique_id": "shq-03-imo-20251016-123456-ABC123",
      "process_id": "shq.03.imo.V1.20251016.overview",
      "schema_version": "HEIR/1.0",
      "blueprint_version_hash": "abc123def456..."
    },
    "data": {...}
  }
}
```

### **Composio Tool Endpoints**
```bash
# Million Verifier Tool Execution
POST https://YOUR_RENDER_APP_NAME.onrender.com/api/composio/million_verifier/tool

Headers:
  Content-Type: application/json

Body:
{
  "tool": "VERIFY_EMAIL",
  "data": {
    "email": "test@example.com"
  },
  "unique_id": "HEIR-2025-10-VERIFY-01",
  "process_id": "PRC-VERIFY-001",
  "orbt_layer": 2,
  "blueprint_version": "1.0"
}
```

---

## 🔌 COMPOSIO API DIRECT ACCESS

### **Authentication**
All Composio API calls use the same API key:
```bash
X-API-Key: ak_t-F0AbvfZHUZSUrqAGNn
```

### **Base URLs**
```bash
# Composio Backend API
https://backend.composio.dev/api/v1

# Composio API (alternate)
https://api.composio.dev/api/v1
```

### **Example: List Connected Accounts**
```bash
curl -X GET https://backend.composio.dev/api/v1/connectedAccounts \
  -H "X-API-Key: ak_t-F0AbvfZHUZSUrqAGNn" \
  -H "Content-Type: application/json"
```

### **Example: Execute Composio Action**
```bash
curl -X POST https://api.composio.dev/api/v1/actions/execute \
  -H "X-API-Key: ak_t-F0AbvfZHUZSUrqAGNn" \
  -H "Content-Type: application/json" \
  -d '{
    "actionId": "github_create_issue",
    "params": {
      "owner": "username",
      "repo": "repository",
      "title": "Issue title",
      "body": "Issue description"
    }
  }'
```

### **Example: List Available Tools**
```bash
curl -X GET https://api.composio.dev/api/v1/tools \
  -H "X-API-Key: ak_t-F0AbvfZHUZSUrqAGNn"
```

---

## 🤖 AI AGENT INTEGRATION GUIDE

### **For ChatGPT Dev Mode**

1. **Configure Custom GPT Actions**:
   - Add your Render deployment URL as the API base
   - Use `/health` endpoint for testing
   - Add authentication header: `X-API-Key: ak_t-F0AbvfZHUZSUrqAGNn`

2. **Example OpenAPI Schema**:
```yaml
openapi: 3.0.0
info:
  title: IMO-Creator API
  version: 1.0.0
servers:
  - url: https://YOUR_RENDER_APP_NAME.onrender.com
paths:
  /health:
    get:
      summary: Health check
      responses:
        '200':
          description: Service is healthy
  /llm:
    post:
      summary: Call LLM provider
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                prompt:
                  type: string
                provider:
                  type: string
                  enum: [openai, anthropic]
      responses:
        '200':
          description: LLM response
```

### **For Claude Code**

1. **Direct API Access**:
```python
import requests

# Health check
response = requests.get("https://YOUR_RENDER_APP_NAME.onrender.com/health")
print(response.json())

# LLM call
response = requests.post(
    "https://YOUR_RENDER_APP_NAME.onrender.com/llm",
    json={
        "provider": "anthropic",
        "model": "claude-3-5-sonnet-20240620",
        "prompt": "Your prompt here"
    }
)
print(response.json())
```

2. **Composio Integration**:
```python
import requests

# Execute Composio tool
response = requests.post(
    "https://YOUR_RENDER_APP_NAME.onrender.com/api/composio/million_verifier/tool",
    json={
        "tool": "VERIFY_EMAIL",
        "data": {"email": "test@example.com"},
        "unique_id": "HEIR-2025-10-TEST-01",
        "process_id": "PRC-TEST-001",
        "orbt_layer": 2,
        "blueprint_version": "1.0"
    }
)
print(response.json())
```

---

## 🎯 COMPOSIO CONNECTED SERVICES

### **Google Workspace** (3 accounts connected)
- **Gmail**: service@svg.agency, djb258@gmail.com, dbarton@svg.agency
- **Google Drive**: 3 accounts (full API access)
- **Google Calendar**: service@svg.agency
- **Google Sheets**: service@svg.agency

### **GitHub** (2 accounts connected)
- Full repository access
- Issue and PR management
- Commit operations

### **Other Available Services** (100+ total)
- Slack integration
- Linear integration
- Notion integration
- Database operations
- Web scraping
- Email validation

---

## 📦 DEPLOYMENT STEPS

### **1. Create New Repository**
```bash
git init your-new-repo
cd your-new-repo

# Copy these files from imo-creator:
# - main.py
# - src/server/main.py
# - Procfile
# - render.yaml
# - runtime.txt
# - requirements.txt
# - .env.example
# - config/mcp_endpoints.json

git add .
git commit -m "Initial deployment setup"
git remote add origin https://github.com/yourusername/your-new-repo.git
git push -u origin master
```

### **2. Deploy to Render**

#### **Option A: Using render.yaml (Recommended)**
1. Go to https://dashboard.render.com/
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect `render.yaml` and configure automatically
5. Click "Apply" to deploy

#### **Option B: Manual Setup**
1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: your-app-name
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
   - **Branch**: master
5. Add environment variables:
   - `COMPOSIO_API_KEY`: `ak_t-F0AbvfZHUZSUrqAGNn`
   - `MCP_API_URL`: `https://backend.composio.dev`
   - `ALLOW_ORIGIN`: `https://imo-creator.vercel.app`
6. Click "Create Web Service"

### **3. Verify Deployment**
```bash
# Test health endpoint
curl https://YOUR_RENDER_APP_NAME.onrender.com/health

# Test root endpoint
curl https://YOUR_RENDER_APP_NAME.onrender.com/

# Test LLM endpoint (if API keys configured)
curl -X POST https://YOUR_RENDER_APP_NAME.onrender.com/llm \
  -H "Content-Type: application/json" \
  -d '{"provider": "openai", "model": "gpt-4o-mini", "prompt": "Hello!"}'
```

### **4. Update Environment Variables**
Once deployed, update these in Render dashboard:
- `BACKEND_URL`: https://YOUR_RENDER_APP_NAME.onrender.com
- `API_BASE_URL`: https://YOUR_RENDER_APP_NAME.onrender.com/api
- `GARAGE_MCP_URL`: https://YOUR_RENDER_APP_NAME.onrender.com

---

## 🔒 SECURITY NOTES

1. **API Key Exposure**: The Composio API key (`ak_t-F0AbvfZHUZSUrqAGNn`) is included in this guide for convenience. Consider rotating it if this repository becomes public.

2. **CORS Configuration**: Currently set to allow `https://imo-creator.vercel.app`. Add additional origins as needed:
```python
# In src/server/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://imo-creator.vercel.app",
        "https://your-new-frontend.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

3. **Environment Variables**: Never commit `.env` files. Always use `.env.example` as template.

---

## 🐛 TROUBLESHOOTING

### **Issue: Render deployment fails**
- Check Python version matches `runtime.txt` (3.11.9)
- Verify all dependencies in `requirements.txt` are available
- Check Render build logs for specific errors

### **Issue: Health check fails**
- Verify `PORT` environment variable is set (Render sets this automatically)
- Check that `main.py` is using `os.getenv("PORT", 8000)`
- Ensure FastAPI app is running on `0.0.0.0` (all interfaces)

### **Issue: CORS errors**
- Add your frontend URL to `ALLOW_ORIGIN` environment variable
- Update CORS middleware in `src/server/main.py`

### **Issue: Composio API calls fail**
- Verify `COMPOSIO_API_KEY` is set correctly
- Test API key directly: `curl -H "X-API-Key: ak_t-F0AbvfZHUZSUrqAGNn" https://backend.composio.dev/api/v1/connectedAccounts`
- Check Composio dashboard for service status

---

## 📚 ADDITIONAL RESOURCES

### **Composio Documentation**
- Composio Dashboard: https://app.composio.dev/
- API Documentation: https://docs.composio.dev/
- Connected Accounts: https://app.composio.dev/connections

### **Render Documentation**
- Dashboard: https://dashboard.render.com/
- Docs: https://render.com/docs
- Support: https://render.com/support

### **FastAPI Documentation**
- Official Docs: https://fastapi.tiangolo.com/
- Deployment Guide: https://fastapi.tiangolo.com/deployment/

---

## 🚀 NEXT STEPS

1. **Deploy to Render** using the steps above
2. **Test all endpoints** with curl or Postman
3. **Configure AI agents** to connect to your deployment
4. **Add additional integrations** via Composio dashboard
5. **Monitor deployment** in Render dashboard

---

**Last Updated**: 2025-10-16
**Composio API Key**: `ak_t-F0AbvfZHUZSUrqAGNn`
**Deployment Platform**: Render.com
**Status**: Production Ready ✅
