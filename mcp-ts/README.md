# MCP Backend Server (TypeScript/Node.js)

Mission Control Processor (MCP) Backend for orchestrating GitHub repositories, Whimsical diagrams, Plasmic UIs, and LLM enhancements - implemented in TypeScript/Node.js.

## 🚀 Live Deployment
**Production URL:** https://imo-creator.onrender.com

## 📋 Overview
The MCP Backend provides a modular Express.js service that handles:

1. **GitHub Webhook Processing** - Receives repository change notifications
2. **CTB Structure Parsing** - Analyzes CTB blueprints from repositories  
3. **Whimsical Integration** - Updates diagrams with CTB structure visualization
4. **LLM Enhancement** - Analyzes CTB structures and suggests improvements
5. **Plasmic UI Generation** - Creates UI components from enhanced structures

## 🔧 Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Navigate to TypeScript MCP backend directory
cd mcp-ts/

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your API keys

# Start development server with hot reload
npm run dev

# Or start production build
npm run build
npm start
```

The server will run at `http://localhost:8000`

### Development Commands
```bash
# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Run tests (when implemented)
npm test
```

## 📡 API Endpoints

### Health & Status
- `GET /health` - Health check endpoint with service status
- `GET /` - API information and endpoint list

### GitHub Integration
- `POST /webhooks/github` - GitHub webhook receiver (requires HMAC signature)

### CTB Operations  
- `GET /api/ctb/parse?repo_url={url}&branch={branch}` - Parse CTB from repository
- `GET /api/ctb/validate?repo_url={url}` - Validate CTB structure
- `GET /api/ctb/summary?repo_url={url}` - Get CTB summary

### Whimsical Integration
- `POST /api/whimsical/update` - Update Whimsical diagram with CTB data
- `GET /api/whimsical/project/:id` - Get Whimsical project information

### LLM Enhancement
- `POST /api/llm/analyze` - Analyze CTB structure and provide feedback
- `POST /api/llm/enhance` - Generate enhanced CTB structure

## 🔐 Environment Variables

Configure these environment variables in your deployment:

### Server Configuration
```bash
NODE_ENV=production
PORT=8000
HOST=0.0.0.0
LOG_LEVEL=info
ALLOWED_ORIGINS=*
```

### GitHub Integration
```bash
GITHUB_TOKEN=ghp_your_token_here
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here
```

### Whimsical Integration  
```bash
WHIMSICAL_API_KEY=your_whimsical_api_key
WHIMSICAL_API_URL=https://whimsical.com/api/v1
```

### LLM Integration
```bash
LLM_API_KEY=sk-your_openai_or_anthropic_key
LLM_MODEL=gpt-4  # or claude-3-5-sonnet-20241022
LLM_API_URL=https://api.openai.com/v1
```

### Plasmic Integration
```bash
PLASMIC_PROJECT_ID=your_plasmic_project_id
PLASMIC_AUTH_TOKEN=your_plasmic_auth_token
```

## 🛠️ Technical Details

### Framework & Libraries
- **Express.js**: Fast, minimalist web framework
- **TypeScript**: Type safety and modern JavaScript features
- **axios**: HTTP client for external API calls
- **js-yaml**: YAML parsing for CTB structures
- **winston**: Structured logging
- **helmet**: Security middleware

### Key Features
- **Type Safety**: Full TypeScript implementation
- **Async Processing**: Non-blocking webhook processing
- **Request Validation**: Input validation and sanitization
- **Structured Logging**: Request tracking with correlation IDs
- **Error Handling**: Comprehensive exception handling
- **Security**: Helmet middleware and CORS configuration

### Architecture
```
mcp-ts/
├── src/
│   ├── server.ts           # Express app and server setup
│   ├── middleware/         # Custom middleware
│   │   └── errorHandler.ts # Error handling middleware
│   ├── routes/            # API route handlers
│   │   ├── health.ts      # Health check endpoints
│   │   ├── github.ts      # GitHub webhook processing
│   │   ├── ctb.ts         # CTB operations
│   │   ├── whimsical.ts   # Whimsical integration
│   │   └── llm.ts         # LLM enhancement
│   ├── services/          # Business logic services
│   │   ├── ctbService.ts  # CTB parsing and validation
│   │   ├── llmService.ts  # LLM integration
│   │   └── whimsicalService.ts # Whimsical API client
│   └── types/             # TypeScript type definitions
├── dist/                  # Compiled JavaScript (built)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── render.yaml           # Render.com deployment config
└── README.md            # This file
```

## 🚀 Deployment

### Render.com (Current)
The MCP backend can be deployed on Render.com with the provided `render.yaml` configuration.

**Deployment Steps:**
1. Connect your GitHub repository to Render
2. Set root directory to `mcp-ts/`
3. Configure environment variables in Render dashboard
4. Deploy automatically from `feature/mcp-backend` branch

**Deployment Configuration:**
- **Runtime**: Node.js
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment**: Node.js 18+

### Alternative Deployments
```bash
# Docker (future)
docker build -t mcp-backend-ts .
docker run -p 8000:8000 --env-file .env mcp-backend-ts

# Vercel
vercel deploy

# Railway
railway up
```

## 🧪 Testing

### Manual Testing
```bash
# Test health endpoint
curl https://imo-creator.onrender.com/health

# Test CTB parsing
curl "https://imo-creator.onrender.com/api/ctb/summary?repo_url=https://github.com/user/repo"

# Test GitHub webhook (with valid signature)
curl -X POST https://imo-creator.onrender.com/webhooks/github \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: push" \
  -H "X-Hub-Signature-256: sha256=..." \
  -d '{"repository": {"html_url": "https://github.com/user/repo"}}'
```

### API Examples
```javascript
// Analyze CTB structure
const response = await fetch('/api/llm/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    repo_url: 'https://github.com/user/repo',
    branch: 'main'
  })
});

// Update Whimsical diagram
const updateResponse = await fetch('/api/whimsical/update', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    project_id: 'your-project-id',
    ctb_structure: { /* CTB structure object */ }
  })
});
```

## 🔄 Migration from Python

This TypeScript implementation replaces the Python version to avoid:
- ✅ **No Rust compilation issues** (pydantic-core, aiohttp)
- ✅ **Better Python 3.13 compatibility** problems
- ✅ **Simpler deployment** process
- ✅ **Leverages existing Node.js ecosystem** in the project
- ✅ **Type safety** with TypeScript
- ✅ **Faster cold starts** on serverless platforms

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Kill process using port 8000
npx kill-port 8000
# Or use different port
PORT=3001 npm run dev
```

**TypeScript Compilation Errors:**
```bash
# Check TypeScript configuration
npm run type-check

# Clean build
rm -rf dist/
npm run build
```

**API Key Issues:**
- Verify environment variables are set correctly
- Check API key formats and permissions
- Review service configuration in health endpoint

### Logs & Monitoring
- Structured JSON logs with request correlation IDs
- Health check endpoint provides service status
- Winston logger with configurable log levels
- Request/response logging with Morgan

## 📜 License
This project is part of the IMO Creator ecosystem. See main project LICENSE for details.