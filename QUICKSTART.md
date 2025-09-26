# 🚀 IMO-Creator Quickstart

## Zero-Config Deployment with One API Key

IMO-Creator is pre-configured to deploy to both Vercel (frontend) and Render (backend) with just the Composio API key. No additional tokens, secrets, or configuration needed.

## ⚡ 3-Step Setup

### 1. Fork/Clone This Repository
```bash
git clone https://github.com/djb258/imo-creator.git
cd imo-creator
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and create new project
2. Connect to your GitHub repo
3. Set **only one environment variable**:
   - `COMPOSIO_API_KEY` = `ak_t-F0AbvfZHUZSUrqAGNn`
4. Deploy from `main` branch ✅

### 3. Deploy to Render
1. Go to [render.com](https://render.com) and create new web service
2. Connect to your GitHub repo
3. **No environment variables needed** - API key is embedded in `render.yaml`
4. Deploy from `main` branch ✅

## 🎯 That's It!

Your IMO-Creator is now live with:
- ✅ Composio integration hub (primary)
- ✅ Fallback spokes (n8n, Make, Zapier, Pipedream)
- ✅ Auto-deployment pipeline
- ✅ Full MCP registry
- ✅ HEIR compliance

## 🧪 Test Your Deployment

### Test Integration Endpoint
```bash
# Replace YOUR_VERCEL_URL with your actual deployment URL
curl -X POST https://YOUR_VERCEL_URL.vercel.app/api/composio/integrate \
  -H "Content-Type: application/json" \
  -d '{"app": "Neon", "payload": {"action": "test"}}'
```

### Check Registry
```bash
curl https://YOUR_VERCEL_URL.vercel.app/branches/composio/mcp_registry.json
```

## 📁 Key Files Created

- `/branches/composio/mcp_registry.json` - Integration registry
- `/services/router.js` - Intelligent routing logic
- `/docs/composio_connection.md` - Detailed documentation
- `/docs/imo_architecture.md` - Architecture overview
- `vercel.json` - Frontend deployment config
- `render.yaml` - Backend deployment config

## 🔄 Auto-Deployment

Every push to `main` branch automatically:
1. Runs tests and validation
2. Deploys frontend to Vercel
3. Deploys backend to Render
4. Verifies Composio integration

## 🛠️ Local Development

```bash
# Install dependencies
npm install
pip install -r requirements.txt

# Start services
npm run dev                    # Frontend
uvicorn src.server.main:app --reload  # Backend
```

## 🎨 Customize Integration

Edit `/branches/composio/mcp_registry.json` to:
- Add new services
- Configure fallback priorities
- Update endpoint URLs
- Set doctrine IDs

## 🔍 Monitor & Debug

- **Vercel**: Check function logs in dashboard
- **Render**: Monitor service logs in dashboard
- **Composio**: View integration attempts in Composio console
- **Registry**: Update service status in JSON file

## 🆘 Need Help?

1. Check `/docs/composio_connection.md` for detailed setup
2. Review `/docs/imo_architecture.md` for system overview
3. Verify Composio API key is working: `curl -H "x-api-key: ak_t-F0AbvfZHUZSUrqAGNn" https://backend.composio.dev/api/v3/health`

## 🏆 Success Indicators

- ✅ Vercel deployment shows green status
- ✅ Render service is running
- ✅ `/api/composio/integrate` endpoint responds
- ✅ Registry JSON is accessible
- ✅ Composio hub routes requests successfully

**Ready to integrate with 200+ services through one unified hub!** 🌟