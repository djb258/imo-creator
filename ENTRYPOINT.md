# 🎯 IMO Creator - Entry Point Guide

**Welcome to IMO Creator** - AI-powered interface creation tool with Google Workspace integration

**Repository Structure**: Christmas Tree Backbone (CTB) v1.3.3
**Deployment**: Render + Vercel hybrid architecture
**Integration Hub**: Composio MCP server managing 100+ services

---

## 🚀 Quick Start (5 Minutes)

### 1. Start Essential Services

```bash
# Terminal 1: Start Composio MCP Server (MANDATORY)
cd "C:\Users\CUSTOM PC\Desktop\Cursor Builds\scraping-tool\imo-creator\mcp-servers\composio-mcp"
node server.js

# Terminal 2: Start FastAPI Server
cd "C:\Users\CUSTOM PC\Desktop\Cursor Builds\imo-creator"
python main.py

# Terminal 3: Test Integration
curl http://localhost:3001/mcp/health
curl http://localhost:8000/health
```

### 2. Verify Setup

```bash
# Check Composio integrations
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{"tool": "get_composio_stats", "data": {}, "unique_id": "HEIR-2025-10-TEST-01", "process_id": "PRC-TEST-001", "orbt_layer": 2, "blueprint_version": "1.0"}'

# Should return: Connected accounts, available tools
```

### 3. Start Coding

See **Common Tasks** section below for development workflows.

---

## 📁 CTB Structure at a Glance

```
imo-creator/
├── ENTRYPOINT.md           # ← YOU ARE HERE (start here)
├── CLAUDE.md               # AI bootstrap guide
├── CTB_INDEX.md            # Complete file mapping
├── main.py                 # Entry point → delegates to ctb/sys/server/main.py
│
├── ctb/                    # Christmas Tree Backbone
│   ├── sys/                # 🔧 System Infrastructure (40k altitude)
│   │   ├── api/           # REST API endpoints
│   │   ├── server/        # FastAPI main application
│   │   ├── services/      # Background services
│   │   ├── scripts/       # Automation scripts
│   │   ├── tools/         # Developer tools
│   │   ├── infrastructure/# External tools (activepieces, windmill)
│   │   ├── global-factory/# CTB enforcement scripts
│   │   └── README.md      # START HERE for infrastructure
│   │
│   ├── ai/                 # 🤖 AI Agents & Orchestration (20k altitude)
│   │   ├── agents/        # AI agent definitions
│   │   ├── orbt-utils/    # HEIR/ORBT utilities
│   │   ├── shq-reasoning/ # Strategic HQ reasoning layer
│   │   └── README.md      # START HERE for AI/agents
│   │
│   ├── data/               # 🗄️ Data & Databases (20k altitude)
│   │   ├── schemas/       # Database schemas
│   │   ├── migrations/    # Database migrations
│   │   ├── seeds/         # Seed data
│   │   └── README.md      # START HERE for databases
│   │
│   ├── docs/               # 📖 Documentation & Guides (20k altitude)
│   │   ├── guides/        # Developer guides & blueprints
│   │   ├── api/           # API documentation
│   │   ├── architecture/  # Architecture diagrams
│   │   ├── composio/      # Composio integration docs
│   │   └── README.md      # START HERE for documentation
│   │
│   ├── ui/                 # 🎨 User Interface (10k altitude)
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── assets/        # Static assets
│   │
│   └── meta/               # ⚙️ Metadata & Configuration (10k altitude)
│       ├── config/        # Configuration files
│       ├── registry/      # CTB registry data
│       ├── ide/           # IDE settings
│       ├── DEPENDENCIES.md# Inter-branch dependencies
│       └── README.md      # START HERE for configuration
│
├── .github/workflows/      # CI/CD automation
└── logs/                   # Application logs
```

---

## 🛡️ CTB Enforcement Summary

**Automated Compliance**: Every commit is automatically checked and tagged for CTB compliance.

### Compliance Threshold

| Score  | Grade | Status  | Policy |
|--------|-------|---------|--------|
| 90–100 | 🌟 EXCELLENT | PASS | Merge allowed |
| 70–89  | ✅ GOOD/FAIR | PASS | Merge allowed |
| 60–69  | ⚠️ NEEDS WORK | BLOCKED | Fix before commit |
| 0–59   | ❌ FAIL | BLOCKED | Fix before commit |

**Current Threshold**: 70/100

### Auto-Enforcement

1. **Pre-Commit Hook** → Tags & scores files locally
2. **GitHub Actions** → Verifies compliance on PRs
3. **Weekly Composio Run** → Monitors compliance trends
4. **CTB Remediator** → Auto-fixes drifted files

### Quick Compliance Check

```bash
# Check current compliance score
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# Auto-fix compliance issues
python ctb/sys/github-factory/scripts/ctb_remediator.py

# View detailed enforcement guide
cat CTB_ENFORCEMENT.md
```

### Benefits

✅ **Zero manual Barton ID management**
✅ **No non-compliant code merged**
✅ **Every commit automatically tagged**
✅ **Guaranteed CTB compliance**

📖 **Full Details**: See `CTB_ENFORCEMENT.md` for complete setup instructions, troubleshooting, and FAQ.

---

## 🎯 Common Tasks

### For New Developers

```bash
# 1. Read essential documentation
cat ENTRYPOINT.md              # This file (navigation)
cat ctb/docs/composio/COMPOSIO_INTEGRATION.md  # CRITICAL: All integrations
cat ctb/sys/README.md          # Infrastructure overview
cat ctb/ai/README.md           # AI agents guide

# 2. View system architecture
cat ctb/docs/architecture/architecture.mmd

# 3. Check dependencies
cat ctb/meta/DEPENDENCIES.md

# 4. Start development servers (see Quick Start above)
```

### For Adding New Features

```bash
# 1. Determine which CTB division
# - API endpoint → ctb/sys/api/
# - AI agent → ctb/ai/agents/
# - Database schema → ctb/data/schemas/
# - UI component → ctb/ui/components/
# - Documentation → ctb/docs/guides/

# 2. Read division README
cat ctb/{division}/README.md

# 3. Follow existing patterns
# Example: Adding Gmail integration
cat ctb/docs/composio/COMPOSIO_INTEGRATION.md  # See Gmail examples

# 4. Test with curl before implementing
curl -X POST http://localhost:3001/tool -H "Content-Type: application/json" -d '{...}'

# 5. Update documentation
# Add to relevant ctb/docs/ file
```

### For Working with Composio Integrations

```bash
# 1. ALWAYS read integration guide first
cat ctb/docs/composio/COMPOSIO_INTEGRATION.md

# 2. Start Composio MCP server
cd ../scraping-tool/imo-creator/mcp-servers/composio-mcp
node server.js

# 3. Use HEIR/ORBT payload format for ALL calls
# Example payload:
{
  "tool": "gmail_send_email",
  "data": {...},
  "unique_id": "HEIR-2025-10-GMAIL-SEND-01",
  "process_id": "PRC-GMAIL-1730000000",
  "orbt_layer": 2,
  "blueprint_version": "1.0"
}

# 4. Test integration
curl -X POST http://localhost:3001/tool -H "Content-Type: application/json" -d '{...}'
```

### For Database Operations

```bash
# 1. Read database guide
cat ctb/data/README.md

# 2. NEVER use Composio for database operations
# ❌ WRONG: composio neon_execute_sql (does not exist)
# ✅ CORRECT: Direct pg client connection

# 3. Run migrations
psql $DATABASE_URL < ctb/data/migrations/001_initial_schema.sql

# 4. Seed test data
psql $DATABASE_URL < ctb/data/seeds/test_data.sql

# 5. Test connection
psql $DATABASE_URL -c "SELECT version();"
```

### For CTB Compliance

```bash
# 1. Run compliance cycle
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py
python ctb/sys/github-factory/scripts/ctb_audit_generator.py
python ctb/sys/github-factory/scripts/ctb_remediator.py

# 2. Check compliance score
cat CTB_AUDIT_REPORT.md | grep "Compliance Score"

# 3. View issues
cat CTB_AUDIT_REPORT.md | grep -A 20 "## Issues"

# 4. Review registry
cat ctb/meta/registry/ctb_registry.json
```

### For Deployment

```bash
# 1. Test locally first
python main.py
curl http://localhost:8000/health

# 2. Verify Composio integrations work
curl http://localhost:3001/mcp/health

# 3. Check deployment config
cat render.yaml
cat Procfile

# 4. Run compliance check (must be ≥ 90%)
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# 5. Commit and push
git add .
git commit -m "Your message"
git push origin master
```

---

## 📖 Essential Documentation

### Primary Guides (READ FIRST)

1. **`ENTRYPOINT.md`** (this file) - Navigation and quick start
2. **`ctb/docs/composio/COMPOSIO_INTEGRATION.md`** - CRITICAL: All external service integrations
3. **`ctb/docs/barton/BARTON_OUTREACH_CORE_UPDATES.md`** - HEIR/ORBT and database patterns
4. **`CLAUDE.md`** - AI agent bootstrap guide

### Division READMEs (Topic-Specific)

- **`ctb/sys/README.md`** - Infrastructure, APIs, servers, scripts
- **`ctb/ai/README.md`** - AI agents, HEIR/ORBT, orchestration
- **`ctb/data/README.md`** - Databases, schemas, migrations
- **`ctb/docs/README.md`** - Documentation, diagrams, blueprints
- **`ctb/meta/README.md`** - Configuration, registry, dependencies

### Architecture & Design

- **`ctb/docs/architecture/architecture.mmd`** - System architecture diagram
- **`ctb/meta/DEPENDENCIES.md`** - Inter-division dependencies
- **`CTB_INDEX.md`** - Complete file mapping (old → new structure)

---

## 🔍 Finding Things

### By Feature

```bash
# Gmail integration
grep -r "gmail" ctb/docs/composio/

# Database schemas
ls ctb/data/schemas/

# AI agents
ls ctb/ai/agents/

# API endpoints
grep -r "@app\." ctb/sys/api/

# Workflow blueprints
ls ctb/docs/guides/blueprints/
```

### By File Type

```bash
# Python files
find ctb/ -name "*.py"

# Documentation
find ctb/docs/ -name "*.md"

# Configuration
find ctb/meta/config/ -name "*.json" -o -name "*.yaml"

# Diagrams
find ctb/docs/ -name "*.mmd"

# Tests
find ctb/ -path "*/tests/*.py"
```

### By Division

```bash
# Infrastructure files
ls -R ctb/sys/

# AI & agents
ls -R ctb/ai/

# Database files
ls -R ctb/data/

# Documentation
ls -R ctb/docs/

# Configuration
ls -R ctb/meta/
```

---

## ⚠️ Critical Rules

### NEVER Do These

❌ Create custom Google API integrations (use Composio MCP)
❌ Set up individual OAuth flows (all handled by Composio)
❌ Use environment variables for Google services (use MCP interface)
❌ Ignore HEIR/ORBT payload format for Composio calls
❌ Use Composio for database operations (use direct `pg` client)
❌ Commit `.env` files (use `.env.example`)
❌ Skip CTB compliance checks before deploying

### ALWAYS Do These

✅ Start Composio MCP server before development
✅ Use HEIR/ORBT payload format for ALL Composio calls
✅ Read `COMPOSIO_INTEGRATION.md` before integrating services
✅ Test integrations with curl before implementing
✅ Follow CTB structure (put files in correct divisions)
✅ Run compliance checks before committing
✅ Update documentation when adding features

---

## 🛠️ Development Workflow

### Standard Development Cycle

```bash
# 1. Start services
# Terminal 1: Composio MCP
cd ../scraping-tool/imo-creator/mcp-servers/composio-mcp && node server.js

# Terminal 2: FastAPI
python main.py

# 2. Create feature branch
git checkout -b feature/my-feature

# 3. Develop feature
# - Put files in correct CTB division
# - Follow existing patterns
# - Use HEIR/ORBT for Composio calls

# 4. Test locally
curl http://localhost:8000/your-endpoint
curl -X POST http://localhost:3001/tool -d '{...}'

# 5. Run compliance check
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# 6. Update documentation
# Add to relevant ctb/docs/ file

# 7. Commit and push
git add .
git commit -m "feat: Add my feature"
git push origin feature/my-feature

# 8. Create pull request
# Compliance checks run automatically
```

---

## 🚨 Troubleshooting

### Servers Not Starting

```bash
# MCP server issues
cd ../scraping-tool/imo-creator/mcp-servers/composio-mcp
npm install
node server.js

# FastAPI issues
pip install -r requirements.txt
python main.py

# Port conflicts
lsof -i :3001  # MCP server
lsof -i :8000  # FastAPI
```

### Integration Failures

```bash
# 1. Check MCP server is running
curl http://localhost:3001/mcp/health

# 2. Verify connected accounts
curl -X POST http://localhost:3001/tool -d '{"tool": "manage_connected_account", "data": {"action": "list"}, ...}'

# 3. Check COMPOSIO_INTEGRATION.md for working examples
cat ctb/docs/composio/COMPOSIO_INTEGRATION.md

# 4. Test with simple curl command first
```

### Database Connection Issues

```bash
# 1. Test connection
pg_isready -d $DATABASE_URL

# 2. Check environment variable
echo $DATABASE_URL

# 3. Verify credentials in .env
cat .env | grep DATABASE_URL

# 4. See database guide
cat ctb/data/README.md
```

### Import Errors

```bash
# Ensure CTB root is in Python path
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Or run from repository root
cd /path/to/imo-creator
python main.py
```

---

## 📊 CTB Altitude System

**40k Altitude** (Foundation):
- `ctb/sys/` - System infrastructure, APIs, servers

**20k Altitude** (Core Logic):
- `ctb/ai/` - AI agents and orchestration
- `ctb/data/` - Databases and data layer
- `ctb/docs/` - Documentation and guides

**10k Altitude** (Application):
- `ctb/ui/` - User interface components
- `ctb/meta/` - Configuration and metadata

**5k Altitude** (Deployment):
- `.github/workflows/` - CI/CD automation
- `render.yaml` - Deployment configuration

---

## 🔗 External Resources

### Composio & MCP
- **Composio Docs**: https://docs.composio.dev
- **MCP Specification**: https://modelcontextprotocol.io

### Infrastructure
- **Render**: https://render.com
- **Vercel**: https://vercel.com
- **FastAPI**: https://fastapi.tiangolo.com

### Development Tools
- **Mermaid Diagrams**: https://mermaid.js.org
- **OpenAPI**: https://swagger.io/specification/

---

## 🎓 Learning Path

### Level 1: Getting Started (30 minutes)
1. Read this ENTRYPOINT.md
2. Start servers and verify health
3. Read `COMPOSIO_INTEGRATION.md`
4. Test a simple Composio call

### Level 2: Understanding Structure (1 hour)
1. Review CTB structure diagram
2. Read division READMEs (sys, ai, data, docs, meta)
3. Explore `architecture.mmd`
4. Check `DEPENDENCIES.md`

### Level 3: Building Features (2-4 hours)
1. Follow development workflow
2. Add a simple API endpoint
3. Integrate a Composio service
4. Run compliance checks
5. Update documentation

### Level 4: Mastery (Ongoing)
1. Understand HEIR/ORBT system
2. Create workflow blueprints
3. Build complex AI agent orchestrations
4. Contribute to CTB enforcement scripts

---

## 📞 Getting Help

### Documentation
1. Check relevant division README
2. Search `ctb/docs/` for topic
3. Review working examples in code
4. Check `COMPOSIO_INTEGRATION.md`

### Debugging
1. Check server logs
2. Test with curl commands
3. Verify environment variables
4. Review compliance reports

### Architecture Questions
1. Review `architecture.mmd`
2. Check `DEPENDENCIES.md`
3. Read `CTB_INDEX.md`
4. Consult Barton Doctrine docs

---

**Version**: 1.3.3
**Last Updated**: 2025-10-23
**Status**: Production Ready
**CTB Compliance**: ✅ 100%

---

**🎯 TL;DR**: Start Composio MCP (port 3001) → Start FastAPI (port 8000) → Read `COMPOSIO_INTEGRATION.md` → Build features → Run compliance → Deploy
