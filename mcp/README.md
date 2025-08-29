# MCP Backend - Mission Control Processor

A FastAPI-based orchestration server for the IMO Creator ecosystem. MCP handles GitHub webhooks, processes CTB structures, enhances them with LLM analysis, and updates Whimsical diagrams.

## 🎯 Overview

**MCP Backend** serves as the central orchestrator for:
- **GitHub** → **MCP** → **Whimsical** → **Plasmic** workflow
- Automated CTB structure processing and validation
- LLM-powered analysis and enhancement suggestions  
- One-way data flow to Whimsical (visualization only)
- GitHub PR integration and status reporting

### Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   GitHub    │───▶│     MCP     │───▶│  Whimsical  │───▶│   Plasmic   │
│  (Source)   │    │(Orchestrator)│    │(Visualize)  │    │(UI Generate)│
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
```bash
cd mcp
pip install -r requirements.txt
```

2. **Set environment variables:**
```bash
export MCP_DEBUG=true
export MCP_GITHUB_TOKEN=ghp_your_token_here
export MCP_WHIMSICAL_API_KEY=your_whimsical_key
export MCP_LLM_API_KEY=your_llm_api_key
```

3. **Start the server:**
```bash
python main.py
```

4. **Access the API:**
- Server: http://localhost:8000
- Docs: http://localhost:8000/docs (debug mode only)
- Health: http://localhost:8000/health

### Production Deployment (Render.com)

1. **Connect GitHub repository to Render**
2. **Use the provided `render.yaml` configuration**
3. **Set environment variables in Render dashboard:**
   - `MCP_GITHUB_WEBHOOK_SECRET`
   - `MCP_GITHUB_TOKEN`
   - `MCP_WHIMSICAL_API_KEY` 
   - `MCP_LLM_API_KEY`
4. **Deploy automatically on push to main branch**

## 📋 API Endpoints

### Health & Status
- `GET /` - Service information
- `GET /health` - Basic health check
- `GET /health/status` - Detailed status with dependency checks
- `GET /health/ready` - Readiness probe (K8s compatible)
- `GET /health/live` - Liveness probe (K8s compatible)

### GitHub Webhooks
- `POST /webhooks/github` - Handle GitHub webhook events
- `POST /webhooks/test` - Test webhook processing (debug only)

### Manual CTB Processing  
- `POST /render/ctb` - Manually process repository CTB structure
- `GET /render/validate` - Validate CTB structure without processing
- `GET /render/summary` - Get CTB structure summary
- `POST /render/test` - Test CTB processing pipeline (debug only)

## 🔧 Configuration

### Environment Variables

All environment variables can be prefixed with `MCP_`:

#### Server Configuration
- `MCP_ENVIRONMENT` - Environment (development/staging/production)
- `MCP_DEBUG` - Enable debug mode (default: false)
- `MCP_PORT` - Server port (default: 8000)
- `MCP_LOG_LEVEL` - Logging level (default: INFO)

#### GitHub Integration
- `MCP_GITHUB_TOKEN` - GitHub personal access token
- `MCP_GITHUB_WEBHOOK_SECRET` - GitHub webhook secret for validation
- `MCP_GITHUB_API_URL` - GitHub API URL (default: https://api.github.com)

#### Whimsical Integration
- `MCP_WHIMSICAL_API_KEY` - Whimsical API key
- `MCP_WHIMSICAL_API_URL` - Whimsical API URL

#### LLM Integration
- `MCP_LLM_API_KEY` - OpenAI/Custom GPT API key
- `MCP_LLM_MODEL` - Model to use (default: gpt-4)
- `MCP_LLM_API_URL` - LLM API URL
- `MCP_LLM_MAX_TOKENS` - Max tokens per request (default: 2000)
- `MCP_LLM_TEMPERATURE` - Temperature setting (default: 0.3)

#### Plasmic Integration (Optional)
- `MCP_PLASMIC_PROJECT_ID` - Plasmic project ID
- `MCP_PLASMIC_AUTH_TOKEN` - Plasmic authentication token

### Configuration File

Create `.env` file in the `mcp/` directory:

```env
MCP_DEBUG=true
MCP_GITHUB_TOKEN=ghp_your_token_here
MCP_WHIMSICAL_API_KEY=your_whimsical_key
MCP_LLM_API_KEY=your_openai_key
MCP_LLM_MODEL=gpt-4
```

## 🔄 Workflow

### Automatic Processing (GitHub Webhooks)

1. **GitHub Push/PR** → Triggers webhook to `/webhooks/github`
2. **Webhook Validation** → Verifies GitHub signature
3. **CTB Parsing** → Extracts CTB structure from repository
4. **LLM Enhancement** → Analyzes and suggests improvements
5. **Whimsical Update** → Pushes enhanced structure to diagram
6. **Status Report** → Posts results back to GitHub PR (optional)

### Manual Processing

```bash
# Process a repository manually
curl -X POST "http://localhost:8000/render/ctb" \
  -G \
  -d "repo_url=https://github.com/user/repo.git" \
  -d "branch=main" \
  -d "whimsical_url=https://whimsical.com/project/ABC123"

# Validate CTB structure
curl -X GET "http://localhost:8000/render/validate" \
  -G \
  -d "repo_url=https://github.com/user/repo.git" \
  -d "branch=main"
```

## 🏗️ Project Structure

```
mcp/
├── main.py                 # FastAPI application entry point
├── config.py              # Configuration management
├── requirements.txt        # Python dependencies
├── render.yaml            # Render.com deployment config
│
├── routes/                # API route handlers
│   ├── health.py          # Health check endpoints
│   ├── webhooks.py        # GitHub webhook handlers
│   └── render.py          # Manual processing endpoints
│
├── services/              # Business logic services
│   ├── ctb_parser.py      # CTB structure parsing
│   ├── whimsical.py       # Whimsical API integration
│   ├── llm.py            # LLM analysis and enhancement
│   └── github.py          # GitHub API operations
│
├── models/               # Pydantic data models
│   └── webhook.py        # Webhook and response models
│
└── utils/               # Utility modules
    ├── logger.py        # Logging configuration
    └── repo.py          # Repository operations
```

## 🔗 Integrations

### CTB Structure System Integration

MCP integrates directly with the existing CTB structure system:

```python
# Import existing CTB system
from ctb_structure import CTBNode, ctb_from_yaml, validate_ctb_structure

# Parse CTB from repository
ctb_structure = await ctb_parser.parse_repo_ctb(repo_url, branch)

# Validate structure
errors = validate_ctb_structure(ctb_structure)
```

### Repository Setup

For repositories to work with MCP, they need:

1. **CTB Blueprint**: `/ctb/ctb_blueprint.yaml` 
2. **Diagram Metadata**: `/ctb/diagram.meta.yaml`

Example `diagram.meta.yaml`:
```yaml
whimsical_project_url: "https://whimsical.com/project/ABC123"
diagram_id: "main-ctb-diagram"
last_updated: "2024-08-29T12:00:00Z"
```

### Whimsical Integration

MCP converts CTB structures to Whimsical-compatible format:

- **40k nodes** → Central star with large styling
- **20k nodes** → Primary branches  
- **30k-1k nodes** → Hierarchical sub-nodes
- **IMO/ORBT blocks** → Node metadata and tooltips
- **Connections** → Hierarchical relationships

### LLM Enhancement

The LLM service analyzes CTB structures and provides:

- **Completeness Analysis** → Identifies missing elements
- **Enhancement Suggestions** → Proposes new nodes/branches
- **IMO/ORBT Improvements** → Suggests better operational details
- **Structural Optimization** → Recommends hierarchy improvements

## 🛠️ Development

### Adding New Services

1. Create service in `services/` directory
2. Add configuration variables to `config.py`
3. Import and use in route handlers
4. Add tests and documentation

### Testing

```bash
# Run development server
python main.py

# Test webhook processing
curl -X POST "http://localhost:8000/webhooks/test"

# Test CTB processing
curl -X POST "http://localhost:8000/render/test"
```

### Logging

MCP uses structured logging with request tracking:

```python
from utils.logger import get_logger

logger = get_logger(__name__)
logger.info("Processing started", extra={"repo": repo_url})
```

## 📊 Monitoring

### Health Checks

- `/health` - Basic service health
- `/health/status` - Detailed dependency status  
- `/health/ready` - Kubernetes readiness probe
- `/health/live` - Kubernetes liveness probe

### Metrics

Basic metrics available at `/health/metrics` (debug mode):
- Uptime
- Memory usage
- Process information

### Logging

Logs are structured and include:
- Request IDs for tracing
- Service integration status
- Performance metrics
- Error details with context

## 🔒 Security

### GitHub Webhook Validation

All GitHub webhooks are validated using HMAC-SHA256:

```python
# Webhook signature verification
def verify_github_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected = 'sha256=' + hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(signature, expected)
```

### API Authentication

- GitHub API: Personal access token
- Whimsical API: Bearer token authentication
- LLM API: API key authentication
- All secrets managed via environment variables

## 🚨 Troubleshooting

### Common Issues

**Repository Clone Failures:**
- Check GitHub token permissions
- Verify repository URL and branch
- Check network connectivity

**CTB Parsing Errors:**
- Validate YAML syntax in `ctb_blueprint.yaml`
- Ensure CTB structure follows IMO Creator standards
- Check file permissions and encoding

**Whimsical Integration Issues:**
- Verify API key validity
- Check project URL format
- Confirm Whimsical project exists and is accessible

**LLM Analysis Failures:**
- Verify API key and model availability
- Check token limits and usage
- Review prompt format and content

### Debug Mode

Enable debug mode for detailed logging:
```bash
export MCP_DEBUG=true
export MCP_LOG_LEVEL=DEBUG
```

### Log Analysis

Check logs for processing flow:
```bash
# View live logs
tail -f logs/mcp.log

# Filter for specific requests
grep "request_id_here" logs/mcp.log
```

## 📈 Scaling & Performance

### Performance Considerations

- Repository cloning uses shallow clones (`--depth=1`)
- Background task processing prevents webhook timeouts
- Connection pooling for HTTP clients
- Structured logging for performance monitoring

### Scaling Options

- **Horizontal**: Deploy multiple MCP instances with load balancer
- **Vertical**: Increase memory/CPU for larger repositories
- **Caching**: Add Redis for repository and analysis caching
- **Queue**: Add Celery/RQ for heavy processing tasks

---

**MCP Backend v1.0.0** - Part of the IMO Creator ecosystem  
Built with FastAPI, deployed on Render.com, integrated with GitHub, Whimsical, and LLM services.