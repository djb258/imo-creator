# MCP Backend Server

Mission Control Processor (MCP) Backend for orchestrating GitHub repositories, Whimsical diagrams, Plasmic UIs, and LLM enhancements.

## 🚀 Live Deployment
**Production URL:** https://imo-creator.onrender.com

## 📋 Overview
The MCP Backend provides a modular FastAPI service that handles:

1. **GitHub Webhook Processing** - Receives repository change notifications
2. **CTB Structure Parsing** - Analyzes CTB blueprints from repositories  
3. **Whimsical Integration** - Updates diagrams with CTB structure visualization
4. **LLM Enhancement** - Analyzes CTB structures and suggests improvements
5. **Plasmic UI Generation** - Creates UI components from enhanced structures

## 🔧 Local Development

### Prerequisites
- Python 3.13+
- pip or pipenv

### Setup
```bash
# Navigate to MCP backend directory
cd mcp/

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp ../.env.example .env
# Edit .env with your API keys

# Start the server
python main.py
```

The server will run at `http://localhost:8000`

## 📡 API Endpoints

### Health & Status
- `GET /health` - Health check endpoint
- `GET /api/status` - Detailed service status

### GitHub Integration
- `POST /webhooks/github` - GitHub webhook receiver (requires HMAC signature)

### CTB Operations  
- `GET /api/ctb/parse?repo_url={url}&branch={branch}` - Parse CTB from repository
- `GET /api/ctb/validate?repo_url={url}` - Validate CTB structure
- `GET /api/ctb/summary?repo_url={url}` - Get CTB summary

### Whimsical Integration
- `POST /api/whimsical/update` - Update Whimsical diagram with CTB data

### LLM Enhancement
- `POST /api/llm/analyze` - Analyze CTB structure and suggest improvements

## 🔐 Environment Variables

Configure these environment variables in your deployment:

### GitHub Integration
```bash
MCP_GITHUB_WEBHOOK_SECRET=your_webhook_secret_here
MCP_GITHUB_TOKEN=ghp_your_token_here
```

### Whimsical Integration  
```bash
MCP_WHIMSICAL_API_KEY=your_whimsical_api_key
```

### LLM Integration
```bash
MCP_LLM_API_KEY=sk-your_openai_or_anthropic_key
MCP_LLM_MODEL=gpt-4  # or claude-3-5-sonnet-20241022
```

### Plasmic Integration
```bash
MCP_PLASMIC_PROJECT_ID=your_plasmic_project_id
MCP_PLASMIC_AUTH_TOKEN=your_plasmic_auth_token
```

## 🛠️ Technical Details

### Framework & Libraries
- **FastAPI**: Modern async web framework
- **httpx**: HTTP client for external API calls  
- **ruamel.yaml**: YAML processing (Python 3.13 compatible)
- **pydantic**: Data validation and serialization
- **uvicorn**: ASGI server

### Key Features
- **Async Processing**: Non-blocking webhook processing
- **Background Tasks**: Long-running operations don't block webhook responses
- **Request Validation**: Pydantic models for all API requests/responses  
- **Structured Logging**: Request tracking and debugging
- **Error Handling**: Comprehensive exception handling and user-friendly errors

## 🚀 Deployment

The MCP backend is deployed on Render.com with automatic deployments from the `feature/mcp-backend` branch.

**Deployment Configuration:**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python main.py`
- **Environment**: Python 3.13
- **Port**: Auto-detected from application

## 🧪 Testing

### Manual Testing
```bash
# Test health endpoint
curl https://imo-creator.onrender.com/health

# Test CTB parsing (replace with actual repo URL)
curl "https://imo-creator.onrender.com/api/ctb/summary?repo_url=https://github.com/user/repo"
```