# CTB/SYS - System Infrastructure

**Division**: System Infrastructure (40k Altitude)
**Purpose**: Core APIs, services, CI/CD, tools, and infrastructure components

---

## 📁 Directory Structure

```
ctb/sys/
├── api/                    # REST API endpoints
├── server/                 # FastAPI main application
├── services/               # Background services
├── scripts/                # Automation scripts
├── tools/                  # Developer tools
├── libs/                   # Shared libraries
├── utils/                  # Utility functions
├── infrastructure/         # External tools (activepieces, windmill, garage-mcp)
├── ci-cd/                  # GitHub Actions workflows
├── claude-skills/          # Claude AI skill definitions
├── global-factory/         # CTB enforcement scripts
└── github-factory/         # Compliance automation scripts
```

---

## 🚀 Quick Start

### 1. Start the Main API Server

```bash
# From repository root
python main.py

# Or directly
python ctb/sys/server/main.py
```

**Default URL**: http://localhost:8000
**API Docs**: http://localhost:8000/docs
**Health Check**: http://localhost:8000/health

### 2. Start Composio MCP Server

```bash
# Navigate to Composio MCP location
cd ../scraping-tool/imo-creator/mcp-servers/composio-mcp

# Start server
node server.js
```

**Default URL**: http://localhost:3001
**Health Check**: http://localhost:3001/mcp/health

### 3. Run CTB Compliance Scripts

```bash
# Verify CTB structure
bash ctb/sys/scripts/ctb_verify.sh

# Enforce CTB compliance
bash ctb/sys/scripts/ctb_enforce.sh

# Run full compliance cycle
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py
python ctb/sys/github-factory/scripts/ctb_audit_generator.py
python ctb/sys/github-factory/scripts/ctb_remediator.py
```

---

## 🔧 Local Development Commands

### API Development

```bash
# Run with auto-reload
HOST=0.0.0.0 PORT=8000 RELOAD=true python main.py

# Run tests
pytest ctb/sys/tests/

# Lint code
pylint ctb/sys/api/
pylint ctb/sys/server/
```

### Infrastructure Tools

```bash
# ActivePieces (workflow automation)
cd ctb/sys/infrastructure/activepieces
# See README for setup

# Windmill (workflow engine)
cd ctb/sys/infrastructure/windmill
# See README for setup

# Garage MCP (development environment)
cd ctb/sys/infrastructure/garage-mcp
make help
```

---

## 🔌 Key Components

### API Layer (`ctb/sys/api/`)

- **composio_tools.py**: Composio MCP integration endpoints
- **hello.js**: Health check endpoints
- **llm.js**: LLM integration endpoints
- **subagents.js**: Subagent orchestration

### Server (`ctb/sys/server/`)

- **main.py**: FastAPI application entry point
- Blueprint system for extensible APIs
- CORS configuration
- Error handling

### Global Factory (`ctb/sys/global-factory/`)

CTB enforcement and propagation system:
- `CTB_DOCTRINE.md`: Complete doctrine documentation
- `ctb_verify.sh`: Structure verification
- `ctb_enforce.sh`: Compliance enforcement
- `ctb_init.sh`: Branch initialization
- All YAML configurations

### GitHub Factory (`ctb/sys/github-factory/scripts/`)

Automated compliance scripts:
- `ctb_metadata_tagger.py`: Inject compliance metadata
- `ctb_audit_generator.py`: Generate audit reports
- `ctb_remediator.py`: Auto-fix compliance issues

---

## 📝 Environment Variables

Required environment variables (see `.env.example`):

```bash
# API Configuration
HOST=0.0.0.0
PORT=8000
RELOAD=false

# Composio MCP
COMPOSIO_API_KEY=your_key_here
COMPOSIO_MCP_URL=http://localhost:3001

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname
NEON_DATABASE_URL=postgresql://neon_user:pass@host/dbname

# Security
MCP_VAULT_ENABLED=true
ALLOW_ORIGIN=http://localhost:7002
```

---

## 🏗️ Architecture

**System Infrastructure** provides:
- RESTful API layer for all services
- MCP server integration (Composio)
- Background job processing
- CI/CD automation
- Development tooling
- Infrastructure orchestration

**Data Flow**:
```
External Request
    ↓
FastAPI Server (main.py)
    ↓
API Layer (composio_tools.py)
    ↓
Composio MCP Server (port 3001)
    ↓
External Services (Gmail, Drive, GitHub, etc.)
```

---

## 🧪 Testing

```bash
# Run all tests
pytest ctb/sys/tests/

# Run with coverage
pytest ctb/sys/tests/ --cov=ctb/sys --cov-report=html

# Run specific test
pytest ctb/sys/tests/test_api_smoke.py
```

---

## 📚 Related Documentation

- **Main Docs**: `ctb/docs/guides/docs/ARCHITECTURE.md`
- **Composio Integration**: `ctb/docs/composio/COMPOSIO_INTEGRATION.md`
- **CTB Doctrine**: `ctb/sys/global-factory/CTB_DOCTRINE.md`
- **Global Manifest**: `ctb/sys/global-factory/global_manifest.yaml`
- **Dependencies**: `ctb/meta/DEPENDENCIES.md`

---

## 🔗 Dependencies

**Depends On**:
- None (foundation layer)

**Used By**:
- `ctb/ai/` - Uses MCP server and APIs
- `ctb/data/` - Uses database connections
- `ctb/ui/` - Consumes REST APIs
- `ctb/meta/` - Uses CI/CD workflows

---

## 🚨 Common Issues

### Port Already in Use

```bash
# Find process on port 8000
lsof -i :8000

# Kill process
kill -9 <PID>
```

### MCP Server Not Responding

```bash
# Check if server is running
curl http://localhost:3001/mcp/health

# Restart server
cd ../scraping-tool/imo-creator/mcp-servers/composio-mcp
node server.js
```

### Import Errors

```bash
# Ensure CTB root is in Python path
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

---

**Last Updated**: 2025-10-23
**CTB Version**: 1.3.3
**Maintainer**: System Infrastructure Team
