# IMO-Creator v2.0
**Intelligent Multi-Orchestration Creator**  
*Repository compliance orchestration system with Factory/Mechanic patterns and Deep Wiki generation*

## 🎯 System Overview

IMO-Creator is a comprehensive repository orchestration platform that transforms any codebase into a compliant, documented, and maintainable project. It operates through two primary patterns:

- **🏭 Factory Pattern**: Creates new compliant applications from scratch with 100% compliance
- **🔧 Mechanic Pattern**: Retrofits existing repositories with compliance upgrades and fixes
- **🌲 Deep Wiki System**: Auto-generates comprehensive documentation with branch specifications
- **🎛️ Repo-Lens Integration**: Web UI for repository discovery, management, and orchestration

## 📊 System Architecture Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           IMO-Creator v2.0 Ecosystem                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐                │
│  │  Repo-Lens  │───▶│   Cockpit    │───▶│ Garage-MCP      │                │
│  │   /lens     │    │   /cockpit   │    │ (Claude Agents) │                │
│  │             │    │              │    │                 │                │
│  │ • Browse    │    │ • Status     │    │ • HEIR Coord    │                │
│  │ • Filter    │    │ • Missions   │    │ • Error Intake  │                │
│  │ • Select    │    │ • Health     │    │ • Live Dev      │                │
│  └─────────────┘    │ • Wiki Link  │    └─────────────────┘                │
│                     └──────────────┘                                        │
│           │                 │                       ▲                       │
│           ▼                 ▼                       │                       │
│  ┌─────────────────┐ ┌─────────────────┐           │                       │
│  │ Factory Pattern │ │ Mechanic Pattern│           │                       │
│  │                 │ │                 │           │                       │
│  │ factory/ui/     │ │ mechanic/recall/│           │                       │
│  │ init.sh         │ │ recall.sh       │           │                       │
│  │                 │ │                 │           │                       │
│  │ Creates:        │ │ Processes:      │           │                       │
│  │ • New app       │ │ • Existing repo │           │                       │
│  │ • Compliance    │ │ • Adds missing  │           │                       │
│  │ • Deep Wiki     │ │ • Upgrades wiki │           │                       │
│  │ • 100% score    │ │ • Fixes issues  │           │                       │
│  └─────────────────┘ └─────────────────┘           │                       │
│           │                 │                       │                       │
│           └─────────────────┼───────────────────────┘                       │
│                             ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Deep Wiki System                                 │   │
│  │                                                                     │   │
│  │  tools/deep_wiki_generator.sh                                      │   │
│  │  ├─ Branch Specifications (YAML)                                   │   │
│  │  ├─ Schema Validation (JSON Schema)                                │   │
│  │  ├─ Toolbox Profiles (db, deploy, messaging...)                   │   │
│  │  ├─ Auto-generated Pages (20+ interlinked docs)                   │   │
│  │  ├─ Mermaid Diagrams (Input→Middle→Output flow)                   │   │
│  │  └─ GitHub Workflow Validation                                     │   │
│  │                                                                     │   │
│  │  Generated Structure:                                               │   │
│  │  docs/                                                              │   │
│  │  ├── wiki/                    # Main documentation                  │   │
│  │  ├── branches/                # YAML-driven architecture specs     │   │
│  │  └── toolbox/                 # Tool profiles and capabilities     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                   Local Workspace Management                        │   │
│  │                                                                     │   │
│  │  .imo/local/ (never committed)                                     │   │
│  │  ├── registry.json          # Per-machine repo tracking            │   │
│  │  └── missions.json          # Task queue per repository            │   │
│  │                                                                     │   │
│  │  WORKSPACE_ROOT/             # Configurable workspace location     │   │
│  │  └── owner/                                                        │   │
│  │      └── repo/               # Cloned repositories                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 User Workflow Journey

### 1️⃣ Repository Discovery (`/lens`)
- Browse GitHub repositories with live filtering  
- View repository metadata (language, stars, last updated)
- Access direct links to GitHub, Wiki, and Status pages

### 2️⃣ Action Selection
**Option A: Fix Existing Repository** 🔧
- Click "Open in Mechanic" → Context handoff to Cockpit  
- Or "Queue Recall" → Background processing via `mechanic/recall/recall.sh`

**Option B: Create New Application** 🏭  
- Click "Open in Factory" → Context handoff to Cockpit
- Executes `factory/ui/init.sh` for fresh compliant application

### 3️⃣ Command Center (`/cockpit`)
- **Repository Status**: Local path, last operations, compliance score
- **Health Monitoring**: Live endpoint health checks (if deployed)
- **Missions Queue**: Track scaffold/recall/upgrade tasks
- **Deep Wiki Access**: Direct link to generated documentation
- **Mode Context**: Factory vs Mechanic workflow awareness

### 4️⃣ Garage-MCP Integration
- Automatic Claude subagent coordination via HEIR altitude system:
  - **30k ft**: Strategic decisions and planning
  - **20k ft**: Tactical analysis and problem-solving  
  - **10k ft**: Implementation and coding
  - **5k ft**: Validation and testing

## 🏭 Factory Pattern Deep Dive

**Purpose**: Create new compliant applications from scratch

**Execution**: `bash factory/ui/init.sh <app-name>`

**Creates**:
```
apps/<app-name>/
├── src/
│   ├── index.js              # Main application with logging shim
│   └── imo-logger.ts         # Centralized error reporting
├── tests/
│   └── health.test.js        # Basic health check tests  
├── docs/
│   ├── wiki/                 # Deep Wiki system (20+ pages)
│   ├── branches/             # YAML architecture specifications
│   └── toolbox/              # Tool profiles and patterns
├── .env.example              # Environment schema
├── .imo-compliance.json      # Compliance configuration
├── imo-compliance-check.py   # Self-validation script
└── package.json              # Scripts and dependencies
```

**Compliance Features**:
- ✅ 100% compliance score out of the box
- ✅ Centralized error logging to IMO Master endpoint  
- ✅ Environment schema validation
- ✅ Test structure with health checks
- ✅ Deep Wiki with branch specifications
- ✅ GitHub Actions workflow validation
- ✅ Self-monitoring compliance scripts

## 🔧 Mechanic Pattern Deep Dive

**Purpose**: Retrofit existing repositories with compliance upgrades

**Execution**: `bash mechanic/recall/recall.sh /path/to/existing-repo`

**Upgrades Applied**:
1. **Compliance Analysis**: Run `tools/repo_compliance_check.py` for baseline score
2. **Missing File Detection**: Identify gaps in standard project structure
3. **Deep Wiki Generation**: Create or upgrade to branch specification system
4. **Environment Schema**: Add `.env.example` with required/optional keys
5. **Monitoring Setup**: Install compliance tracking and health checks
6. **Self-Validation**: Copy compliance check script for ongoing monitoring

**Before/After Example**:
```
Before (50% compliance):           After (85%+ compliance):
repo/                              repo/
├── src/                          ├── src/
│   └── main.py                   │   ├── main.py  
└── README.md                     │   └── imo-logger.ts     # Added
                                  ├── tests/                # Added  
                                  │   └── test_basic.py     # Added
                                  ├── docs/                 # Added
                                  │   ├── wiki/            # Deep Wiki
                                  │   ├── branches/        # Architecture  
                                  │   └── toolbox/         # Tool profiles
                                  ├── .env.example          # Added
                                  ├── .imo-compliance.json  # Added
                                  ├── imo-compliance-check.py # Added
                                  ├── LICENSE               # Added
                                  └── CONTRIBUTING.md       # Added
```

## 🌲 Deep Wiki System Architecture

The Deep Wiki system is IMO-Creator's signature feature - automatically generating comprehensive, interconnected documentation for every processed repository.

### Branch Specification System
```yaml
# docs/branches/main-processing.yml
branch_id: myapp-main  
title: MyApp → Main Processing
altitude: "10k"                    # Strategic altitude (30k/20k/10k/5k)
contracts: ["/health", "/api/v1"]  # API endpoints

input:
  sources: ["api", "queue", "webhook"]
  schema: ["request", "payload"] 
  guards: ["env:check", "rate-limit"]

middle:
  steps: ["validate", "transform", "process", "store"]
  validators: ["schema-validate", "business-rules"]

output:
  destinations: ["response", "webhook", "queue"]  
  sLAs: ["<200ms p95", "99.9% uptime"]

tools_profile: ["db", "deploy", "logging"]
metrics: ["request_count", "latency_p95", "error_rate"]  
risks: ["database-timeout", "memory-leak"]
```

### Generated Wiki Structure (20+ Pages)
```
docs/wiki/
├── 00-overview/index.md           # System overview with Mermaid diagrams
├── branches/                      # Branch-driven architecture docs  
│   ├── README.md                  # Branch system overview
│   └── <branch-id>/
│       ├── index.md               # Branch detail page
│       └── README.md              # Branch navigation
├── 10-input/index.md              # Input layer documentation  
├── 20-middle/index.md             # Middle layer processing
├── 30-output/index.md             # Output layer handling
├── 40-agents/index.md             # Agent system coordination
├── 50-environment/index.md        # Environment and configuration
├── 60-operations/index.md         # Deployment and operations
└── 70-troubleshooting/index.md    # Common issues and solutions
```

### Toolbox Profiles System
```yaml
# docs/toolbox/profiles.yml
profiles:
  db:
    deps: ["@neondatabase/serverless", "prisma"]
    services: ["neon", "postgres"] 
    patterns: ["connection-pool", "migrations"]
    
  deploy:
    deps: ["vercel", "@vercel/node"]
    services: ["vercel", "render", "aws"]
    patterns: ["serverless", "containers"]
```

## 🎛️ Repo-Lens Web Interface

### Navigation Routes
- **`/lens`** - Repository browser and action selector
- **`/cockpit?repo=owner/repo&mode=factory|mechanic`** - Per-repository command center

### API Endpoints
```
/api/lens/
├── list                    # GET - Fetch filtered GitHub repositories
├── open                    # POST - Context handoff to cockpit  
└── recall                  # POST - Background mechanic processing

/api/cockpit/
├── status                  # GET - Repository health and registry info
└── missions                # GET/POST/DELETE - Task queue operations
```

## 🚀 Quick Start Guide

### Prerequisites
```bash
# Required environment variables
GITHUB_TOKEN=ghp_xxxxx              # GitHub Personal Access Token
GITHUB_OWNER=your-username          # GitHub username for repo listing
IMO_MASTER_ERROR_ENDPOINT=https://... # Centralized logging endpoint  
IMO_ERROR_API_KEY=your-key          # API key for error logging

# Optional configuration  
GITHUB_FILTER=imo                   # Filter repos by name substring
WORKSPACE_ROOT=/home/user/repos     # Local workspace location  
DEFAULT_MODE=factory                # Default cockpit mode
```

### Local Development
```bash  
# Clone and setup
git clone https://github.com/djb258/imo-creator.git
cd imo-creator
npm install

# Set environment variables (create .env file)
# Start development server
npm run dev

# Access interfaces
open http://localhost:3000/lens     # Repository browser
open http://localhost:3000/cockpit  # Command center
```

### Factory Usage (New Application)
```bash
# Via Web UI: /lens → "Open in Factory" → /cockpit
# Or direct shell:
bash factory/ui/init.sh my-new-app

# Creates: apps/my-new-app/ with full compliance
# Compliance Score: 100%
# Generated: Deep Wiki, tests, logging, env schema
```

### Mechanic Usage (Existing Repository)  
```bash
# Via Web UI: /lens → "Open in Mechanic" → /cockpit  
# Or direct shell:
bash mechanic/recall/recall.sh /path/to/existing-repo

# Upgrades: Adds missing files, deep wiki, compliance monitoring
# Typical Improvement: 45% → 85% compliance score
```

### Deep Wiki Generation
```bash
# Standalone wiki generation for any repository
bash tools/deep_wiki_generator.sh /path/to/repo repo-name

# Generates: Branch specs, toolbox profiles, 20+ wiki pages
# Creates: Schema validation, GitHub workflow validation  
# Output: Ready-to-use documentation system
```

## 📈 Compliance Scoring System

IMO-Creator uses a comprehensive scoring system to measure repository compliance:

### Core Compliance Metrics
- **📄 Documentation**: README, CONTRIBUTING, LICENSE files
- **🧪 Testing**: Test directory structure and basic test files
- **🔒 Security**: Environment schema, secret management
- **🎯 CI/CD**: GitHub Actions workflows, automated validation
- **📊 Monitoring**: Health checks, error logging, compliance tracking
- **🌲 Deep Wiki**: Branch specifications, architecture documentation

### Scoring Examples
```
Fresh Repository (Mechanic Input):     IMO-Compliant Repository (Output):
┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│ Compliance Score: 45%           │    │ Compliance Score: 85%+          │
│                                 │    │                                 │
│ ❌ Missing LICENSE              │    │ ✅ LICENSE present              │
│ ❌ No test structure            │    │ ✅ tests/ with basic tests      │
│ ❌ No environment schema        │    │ ✅ .env.example configured     │
│ ❌ No CI/CD workflow           │    │ ✅ GitHub Actions setup         │
│ ❌ No error logging            │    │ ✅ IMO logging integration      │
│ ❌ Basic README only           │    │ ✅ Comprehensive Deep Wiki      │
│ ❌ No compliance monitoring    │    │ ✅ Self-monitoring scripts      │
│                                 │    │                                 │
│ Common Issues:                  │    │ IMO-Enhanced Features:          │
│ • Manual setup required        │    │ • Automated deployment ready    │
│ • No documentation standards   │    │ • Branch-driven documentation   │
│ • Missing dev tooling          │    │ • Integrated health monitoring  │
└─────────────────────────────────┘    └─────────────────────────────────┘
```

## 🏗️ Advanced Architecture Concepts

### HEIR (Hierarchical Error Integration & Resolution)
IMO-Creator implements a 4-altitude coordination system:
- **30,000ft**: Strategic planning and architectural decisions
- **20,000ft**: Tactical analysis and problem decomposition  
- **10,000ft**: Implementation and coding execution
- **5,000ft**: Validation, testing, and quality assurance

### Garage-MCP Integration
Model Context Protocol integration enables:
- **Claude Subagent Orchestration**: Coordinated AI assistance at each altitude
- **Context Preservation**: Maintains project context across sessions
- **Error Intake System**: Centralized error collection and analysis
- **Live Development Environment**: Real-time AI-assisted development

## 🔧 Troubleshooting & Common Issues

### Environment Setup
```bash
# Verify environment variables
node -e "console.log(process.env.GITHUB_TOKEN ? '✅ GitHub token set' : '❌ Missing GITHUB_TOKEN')"

# Check workspace permissions  
mkdir -p "$WORKSPACE_ROOT" && echo "✅ Workspace writable" || echo "❌ Workspace permission issue"

# Validate GitHub access
curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user
```

### Common Error Solutions
1. **"Missing GITHUB_TOKEN"** → Set environment variable in deployment platform
2. **"Repository not found"** → Check GITHUB_OWNER matches your username
3. **"Permission denied"** → Verify WORKSPACE_ROOT directory permissions
4. **"Wiki generation failed"** → Ensure Node.js available for `scripts/gen-wiki.mjs`

## 🚀 Deployment Options

### Vercel (Recommended)
```bash
# Deploy with environment variables
vercel --env GITHUB_TOKEN=ghp_xxx --env GITHUB_OWNER=username

# Or set via Vercel dashboard:
# Project Settings → Environment Variables
```

### Local Development
```bash
# Development server with auto-reload
npm run dev

# Production build and start  
npm run build && npm start
```

## 📚 Additional Resources

### File Structure Reference
```
imo-creator/
├── factory/ui/init.sh              # Factory pattern implementation
├── mechanic/recall/recall.sh       # Mechanic pattern implementation  
├── tools/
│   ├── deep_wiki_generator.sh      # Deep Wiki generation
│   ├── repo_compliance_check.py    # Compliance scoring
│   └── repo_compliance_fixer.py    # Automated fixes
├── src/
│   ├── lens/github.mjs             # GitHub API integration
│   ├── registry/registry.mjs       # Local workspace tracking
│   ├── missions/missions.mjs       # Task queue system
│   └── health/status.mjs           # Health monitoring
├── pages/
│   ├── lens/index.js               # Repository browser UI
│   ├── cockpit/index.js            # Command center UI  
│   └── api/                        # API endpoints
└── apps/                           # Generated applications (Factory output)
```

### Contributing
IMO-Creator is designed for extensibility:
- **Add new compliance rules** in `tools/repo_compliance_check.py`
- **Extend Deep Wiki templates** in `tools/deep_wiki_generator.sh`  
- **Create custom toolbox profiles** in generated `docs/toolbox/profiles.yml`
- **Add health check integrations** in `src/health/status.mjs`

---

## 🎯 IMO-Creator Philosophy

**"Every repository deserves to be compliant, documented, and maintainable."**

IMO-Creator embodies the principle that software quality should be systematic, not accidental. By providing Factory and Mechanic patterns with Deep Wiki generation, it ensures that both new projects and existing codebases can achieve enterprise-grade compliance standards with minimal manual effort.

The system scales from individual repositories to organization-wide compliance orchestration, making it suitable for everything from side projects to production enterprise systems.

**Get Started**: Visit `/lens` to begin transforming your repositories today.

