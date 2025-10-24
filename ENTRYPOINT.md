# IMO Creator - Entry Point

**Welcome to the IMO (Indexed Marketing Operation) Creator**

This is your starting point for navigating the repository, understanding the architecture, and getting started with development.

---

## 🎯 What is IMO Creator?

IMO Creator is an automated system for creating and managing Indexed Marketing Operations (IMOs) using AI-driven workflows, multi-database architecture, and the Christmas Tree Backbone (CTB) organizational structure.

**Key Features**:
- AI-powered IMO generation (Google Gemini)
- Multi-database architecture (Neon PostgreSQL, Firebase, BigQuery)
- 100+ external integrations via Composio MCP
- Compliance-driven development (CTB structure)
- Automated enforcement and remediation
- HEIR/ORBT compliant architecture

---

## 🚀 Quick Start

### First Time Setup

**1. Clone and Install Dependencies**:
```bash
# Clone repository
git clone <repo-url> imo-creator
cd imo-creator

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
npm install
```

**2. Configure Environment**:
```bash
# Copy environment template
cp .env.example .env

# Edit with your credentials
nano .env
```

**Required Environment Variables**:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `COMPOSIO_API_KEY` - Composio API key
- `GOOGLE_API_KEY` - Google Gemini API key
- `FIREBASE_PROJECT_ID` - Firebase project ID

**3. Start Services**:
```bash
# Terminal 1: Start Composio MCP server
cd ctb/sys/composio-mcp
node server.js

# Terminal 2: Start API server
python main.py
```

**4. Verify Installation**:
```bash
# Check MCP server
curl http://localhost:3001/health

# Check API server
curl http://localhost:8000/api/health

# Run compliance check
python ctb/sys/github-factory/scripts/ctb_audit_generator.py
```

---

## 📁 Repository Structure (CTB)

This repository follows the **Christmas Tree Backbone (CTB)** structure:

```
imo-creator/
├── ctb/                        # Christmas Tree Backbone (core structure)
│   ├── sys/                   # 🔧 System Infrastructure
│   │   ├── api/              # REST API endpoints
│   │   ├── composio-mcp/     # Composio MCP server (100+ integrations)
│   │   ├── database/         # Database client and migrations
│   │   ├── firebase/         # Firebase integration
│   │   ├── github-factory/   # CTB compliance automation
│   │   └── global-factory/   # Original CTB factory scripts
│   │
│   ├── ai/                    # 🤖 AI Models & Agents
│   │   ├── models/           # Gemini, OpenAI, Claude configs
│   │   ├── prompts/          # Prompt templates
│   │   ├── agents/           # AI agent configurations
│   │   ├── blueprints/       # Workflow definitions
│   │   └── training/         # Training datasets
│   │
│   ├── data/                  # 💾 Data Layer
│   │   ├── firebase/         # Firestore schemas
│   │   ├── neon/             # PostgreSQL schemas
│   │   ├── zod/              # Validation schemas
│   │   ├── migrations/       # Database migrations
│   │   └── pipelines/        # ETL pipelines
│   │
│   ├── docs/                  # 📚 Documentation
│   │   ├── ctb/              # CTB guides
│   │   ├── api/              # API documentation
│   │   ├── architecture/     # Architecture docs
│   │   ├── guides/           # User/developer guides
│   │   └── integrations/     # Integration guides
│   │
│   ├── ui/                    # 🎨 User Interface
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # React hooks
│   │   └── styles/           # CSS/styling
│   │
│   └── meta/                  # ⚙️ Configuration & Metadata
│       ├── ctb_registry.json # CTB structure registry
│       ├── ctb_tags.json     # File classification (auto-generated)
│       ├── compliance/       # Compliance tracking
│       ├── dependencies/     # Dependency management
│       └── ide/              # IDE configurations
│
├── logs/                      # 📊 Generated Reports
│   ├── CTB_AUDIT_REPORT.md   # Compliance audit results
│   ├── CTB_TAGGING_REPORT.md # File classification results
│   └── CTB_REMEDIATION_SUMMARY.md # Remediation actions
│
├── .github/
│   └── workflows/
│       └── ctb_enforcement.yml # CI/CD compliance enforcement
│
├── global-config.yaml         # Global repository configuration
├── ENTRYPOINT.md             # This file - your starting point
├── CTB_INDEX.md              # CTB migration tracking
└── CTB_COMPLIANCE_SYSTEM_COMPLETE.md # Full system documentation
```

---

## 🗺️ Navigation Guide

### By Role

#### 👨‍💻 **New Developers**
Start here:
1. **This file** (ENTRYPOINT.md) - Overview
2. `ctb/docs/guides/QUICKSTART.md` - 5-minute quick start
3. `ctb/docs/architecture/ARCHITECTURE.md` - System architecture
4. `ctb/sys/README.md` - Infrastructure setup
5. `ctb/docs/guides/DEVELOPMENT.md` - Development workflow

#### 🔧 **DevOps Engineers**
Start here:
1. `ctb/sys/README.md` - Infrastructure overview
2. `ctb/docs/guides/DEPLOYMENT.md` - Deployment guide
3. `.github/workflows/ctb_enforcement.yml` - CI/CD configuration
4. `ctb/meta/README.md` - Configuration management
5. `global-config.yaml` - Global settings

#### 🤖 **AI/ML Engineers**
Start here:
1. `ctb/ai/README.md` - AI systems overview
2. `ctb/ai/models/gemini/` - Gemini model configuration
3. `ctb/ai/prompts/templates/` - Prompt templates
4. `ctb/ai/agents/` - Agent configurations
5. `ctb/ai/training/` - Training datasets

#### 💾 **Data Engineers**
Start here:
1. `ctb/data/README.md` - Data layer overview
2. `ctb/data/neon/schemas/` - PostgreSQL schemas
3. `ctb/data/migrations/` - Database migrations
4. `ctb/sys/database/` - Database client utilities
5. `ctb/data/pipelines/` - ETL pipelines

#### 🎨 **Frontend Developers**
Start here:
1. `ctb/ui/README.md` - UI overview
2. `ctb/ui/components/` - React components
3. `ctb/ui/pages/` - Page components
4. `ctb/data/zod/` - Form validation schemas
5. `ctb/sys/api/` - API endpoints

#### 📝 **Technical Writers**
Start here:
1. `ctb/docs/README.md` - Documentation hub
2. `ctb/docs/guides/` - User guides
3. `ctb/docs/api/` - API documentation
4. `ctb/docs/architecture/` - Architecture diagrams
5. `CTB_INDEX.md` - File migration tracking

---

## 📖 Common Tasks

### 1. Start Development Environment

```bash
# Start all services
docker-compose up

# Or start individually:

# Terminal 1: Composio MCP
cd ctb/sys/composio-mcp && node server.js

# Terminal 2: API Server
python main.py

# Terminal 3: Frontend Dev Server
cd ctb/ui && npm run dev
```

### 2. Run Database Migrations

```bash
# Run all pending migrations
node ctb/sys/database/migrations/run.cjs

# Or with Python
python scripts/run_migrations.py
```

### 3. Run CTB Compliance Check

```bash
# Full compliance cycle
python ctb/sys/github-factory/scripts/run_compliance_simple.py ctb/

# Or run individually:
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py ctb/
python ctb/sys/github-factory/scripts/ctb_audit_generator.py
python ctb/sys/github-factory/scripts/ctb_remediator.py
```

### 4. Run Tests

```bash
# Run all tests
pytest

# Run specific test suites
pytest ctb/sys/tests/          # System tests
pytest ctb/data/tests/         # Data tests
pytest ctb/ai/tests/           # AI tests
```

### 5. Generate IMO

```bash
# Using Python
python scripts/generate_imo.py --input requirements.json

# Using API
curl -X POST http://localhost:8000/api/imo/generate \
  -H "Content-Type: application/json" \
  -d '{"requirements": "..."}'
```

### 6. Deploy to Production

```bash
# See deployment guide
cat ctb/docs/guides/DEPLOYMENT.md

# Quick deploy
./scripts/deploy.sh production
```

---

## 🔍 Finding Information

### "Where do I find...?"

| Looking for... | Go to... |
|----------------|----------|
| **API documentation** | `ctb/docs/api/REST_API.md` |
| **System architecture** | `ctb/docs/architecture/ARCHITECTURE.md` |
| **Database schemas** | `ctb/data/neon/schemas/` or `ctb/data/firebase/schemas/` |
| **AI model configs** | `ctb/ai/models/` |
| **Prompt templates** | `ctb/ai/prompts/templates/` |
| **React components** | `ctb/ui/components/` |
| **Environment setup** | `.env.example` |
| **Configuration** | `global-config.yaml` or `ctb/meta/` |
| **Compliance reports** | `logs/CTB_AUDIT_REPORT.md` |
| **Migration files** | `ctb/data/migrations/` |
| **Integration guides** | `ctb/docs/integrations/` |
| **Troubleshooting** | `ctb/docs/guides/TROUBLESHOOTING.md` |

### "How do I...?"

| Task | Documentation |
|------|---------------|
| **Set up development environment** | `ctb/docs/guides/QUICKSTART.md` |
| **Create a new API endpoint** | `ctb/sys/README.md` + `ctb/docs/api/` |
| **Add a new database table** | `ctb/data/README.md` (see "Add New Table") |
| **Create an AI agent** | `ctb/ai/README.md` (see "Build New Agent") |
| **Write a React component** | `ctb/ui/README.md` |
| **Add a new integration** | `ctb/sys/composio-mcp/README.md` |
| **Run compliance checks** | `CTB_COMPLIANCE_SYSTEM_COMPLETE.md` |
| **Deploy to production** | `ctb/docs/guides/DEPLOYMENT.md` |
| **Troubleshoot errors** | `ctb/docs/guides/TROUBLESHOOTING.md` |

---

## 🌲 CTB Branch Overview

### 🔧 sys - System Infrastructure
**Purpose**: External integrations, infrastructure, APIs, database clients

**Key Components**:
- Composio MCP server (100+ service integrations)
- REST API endpoints
- Database client (PostgreSQL/Neon)
- Firebase integration
- HEIR/ORBT utilities
- CTB compliance automation

**README**: `ctb/sys/README.md`

---

### 🤖 ai - AI Models & Agents
**Purpose**: AI models, prompts, agent orchestration, training data

**Key Components**:
- Google Gemini integration
- OpenAI/Claude integrations (optional)
- Prompt engineering templates
- Multi-agent orchestration
- IMO creator agent
- Compliance checking agent
- Training datasets

**README**: `ctb/ai/README.md`

---

### 💾 data - Data Layer
**Purpose**: Database schemas, migrations, data pipelines, validation

**Key Components**:
- Neon PostgreSQL schemas
- Firebase/Firestore schemas
- BigQuery schemas (optional)
- Database migrations
- Zod validation schemas
- ETL pipelines

**README**: `ctb/data/README.md`

---

### 📚 docs - Documentation
**Purpose**: All documentation, guides, API references, architecture diagrams

**Key Components**:
- Quick start guides
- Architecture documentation
- API reference
- Integration guides
- Troubleshooting guides
- Mermaid diagrams

**README**: `ctb/docs/README.md`

---

### 🎨 ui - User Interface
**Purpose**: Frontend code, React components, pages, styles

**Key Components**:
- React components
- Page layouts
- Custom hooks
- Styling (Tailwind CSS)
- Form components
- Dashboard components

**README**: `ctb/ui/README.md`

---

### ⚙️ meta - Configuration & Metadata
**Purpose**: Configuration files, IDE settings, dependency management, compliance tracking

**Key Components**:
- CTB registry (`ctb_registry.json`)
- File classification tags (`ctb_tags.json`)
- Global configuration (`global-config.yaml`)
- IDE settings (VS Code, Cursor)
- Dependency management
- Compliance history

**README**: `ctb/meta/README.md`

---

## 🏗️ Architecture Overview

### High-Level Architecture

```
┌─────────────┐
│   User/UI   │
│  (Browser)  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│         API Layer (FastAPI)         │
│  - REST endpoints                   │
│  - HEIR/ORBT middleware            │
│  - Request validation              │
└──────┬──────────────────────────────┘
       │
       ├─────────────┬─────────────┬──────────────┐
       │             │             │              │
       ▼             ▼             ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Composio │  │   Neon   │  │ Firebase │  │    AI    │
│   MCP    │  │PostgreSQL│  │Firestore │  │  Models  │
│ (100+    │  │(Primary) │  │(Workben) │  │ (Gemini) │
│services) │  │          │  │          │  │          │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

**Data Flow**:
1. User interacts with UI
2. UI calls REST API
3. API routes to appropriate service:
   - Composio MCP for external integrations
   - Neon PostgreSQL for persistent data
   - Firebase for real-time/session data
   - AI models for intelligent operations
4. Response flows back through API to UI

**See**: `ctb/docs/architecture/architecture.mmd` for detailed Mermaid diagram

---

## 🔐 Security & Credentials

### Environment Variables

**Never commit these to git**:
- `.env` - Local environment variables
- `**/credentials.json` - Service account keys
- `**/*.pem` - Private keys

**Safe to commit**:
- `.env.example` - Template with placeholder values
- `global-config.yaml` - Non-sensitive configuration

### Required Credentials

1. **Neon PostgreSQL**: Connection string with username/password
2. **Composio**: API key from https://app.composio.dev
3. **Google Gemini**: API key from https://makersuite.google.com
4. **Firebase**: Service account JSON (store as env vars, not file)

**See**: `ctb/meta/templates/.env.template` for complete list

---

## 🚨 CTB Compliance

This repository enforces **CTB compliance** with a minimum score of **90/100**.

### Check Compliance

```bash
# Run audit
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# View report
cat logs/CTB_AUDIT_REPORT.md

# View score
cat logs/ctb_audit_report.json | jq '.compliance_score'
```

### Fix Issues

```bash
# Preview fixes
python ctb/sys/github-factory/scripts/ctb_remediator.py --dry-run

# Apply fixes
python ctb/sys/github-factory/scripts/ctb_remediator.py

# Re-audit
python ctb/sys/github-factory/scripts/ctb_audit_generator.py
```

### CI/CD Enforcement

Every push and PR is automatically checked for compliance. PRs below 90/100 will fail CI.

**Workflow**: `.github/workflows/ctb_enforcement.yml`

---

## 📞 Getting Help

### Documentation
- **This file** - Navigation and quick start
- **Branch READMEs** - Detailed guides for each CTB branch
- **API docs** - `ctb/docs/api/REST_API.md`
- **Troubleshooting** - `ctb/docs/guides/TROUBLESHOOTING.md`

### Common Issues
- **Can't connect to database**: Check `DATABASE_URL` in `.env`
- **MCP server won't start**: Verify `COMPOSIO_API_KEY` is set
- **Compliance check fails**: Run remediator to auto-fix
- **Tests failing**: Check environment variables and service status

### Support Channels
- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: See `ctb/docs/README.md` for full documentation map
- **Team Chat**: [Add your team chat link]

---

## 🎯 Next Steps

### New to the Project?

1. ✅ Read this ENTRYPOINT.md (you're here!)
2. ⏭️ Follow quick start guide above
3. ⏭️ Read `ctb/docs/guides/QUICKSTART.md`
4. ⏭️ Review architecture: `ctb/docs/architecture/ARCHITECTURE.md`
5. ⏭️ Explore your branch's README (see CTB Branch Overview above)
6. ⏭️ Run compliance check to familiarize yourself with the system
7. ⏭️ Start with a small task from the backlog

### Ready to Contribute?

1. ✅ Set up development environment
2. ⏭️ Run tests to ensure everything works
3. ⏭️ Pick a task from issues/backlog
4. ⏭️ Create feature branch
5. ⏭️ Make changes (follow CTB structure)
6. ⏭️ Run compliance check
7. ⏭️ Submit PR (CI will check compliance)

---

## 📊 Project Status

| Metric | Status |
|--------|--------|
| **CTB Structure** | ✅ Complete |
| **Compliance System** | ✅ Operational |
| **CI/CD** | ✅ Enabled |
| **Documentation** | ✅ Complete |
| **API Server** | ✅ Functional |
| **MCP Server** | ✅ Functional |
| **Database** | ✅ Configured |
| **AI Integration** | ✅ Configured |

**Current Compliance Score**: Run `python ctb/sys/github-factory/scripts/ctb_audit_generator.py` to check

---

## 📝 Quick Reference Card

```
🚀 Start Dev:     docker-compose up
🧪 Run Tests:     pytest
📊 Compliance:    python ctb/sys/github-factory/scripts/ctb_audit_generator.py
🔄 Migrations:    node ctb/sys/database/migrations/run.cjs
🤖 Generate IMO:  python scripts/generate_imo.py
📚 Docs:          ctb/docs/README.md
⚙️ Config:        global-config.yaml
🔧 API Docs:      ctb/docs/api/REST_API.md
```

---

**Project**: IMO Creator
**Architecture**: Christmas Tree Backbone (CTB)
**Version**: 1.0.0
**Last Updated**: 2025-10-23

**Welcome aboard! 🚀**
