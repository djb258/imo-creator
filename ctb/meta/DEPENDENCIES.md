<!--

# CTB Metadata
# Generated: 2025-10-23T14:32:35.131453
# CTB Version: 1.3.3
# Division: Configuration & Tests
# Category: DEPENDENCIES.md
# Compliance: 100%
# HEIR ID: HEIR-2025-10-MET-DEPEND-01

-->

# CTB Dependencies Map

**Version**: 1.3.3
**Last Updated**: 2025-10-23
**Purpose**: Document all inter-division and external dependencies across the CTB structure

---

## 📊 Division Dependency Graph

```
External Services
    ↓
CTB/SYS (Foundation - 40k altitude)
    ↓ provides APIs, MCP server, infrastructure
    ├─→ CTB/AI (20k altitude)
    ├─→ CTB/DATA (20k altitude)
    ├─→ CTB/UI (10k altitude)
    └─→ CTB/META (10k altitude)

CTB/AI (20k altitude)
    ↑ depends on CTB/SYS for MCP server, APIs
    ↓ provides agents, orchestration
    └─→ CTB/UI (for agent UIs)

CTB/DATA (20k altitude)
    ↑ depends on CTB/SYS for database connections
    ↓ provides schemas, data access
    ├─→ CTB/AI (agents query data)
    └─→ CTB/UI (displays data)

CTB/DOCS (20k altitude)
    ↑ references all divisions
    ↓ provides documentation
    └─→ All divisions (documentation consumers)

CTB/UI (10k altitude)
    ↑ depends on CTB/SYS (APIs)
    ↑ depends on CTB/AI (agents)
    ↑ depends on CTB/DATA (data display)

CTB/META (10k altitude)
    ↑ references all divisions (configuration)
    ↓ provides config, compliance
    └─→ All divisions (use configurations)
```

---

## 🔧 Division: CTB/SYS

**Location**: `ctb/sys/`
**Altitude**: 40k (Foundation)
**Purpose**: System infrastructure, APIs, servers, tools

### Depends On

**None** - Foundation layer with no internal CTB dependencies

### External Dependencies

```json
{
  "python": ">=3.11.9",
  "packages": [
    "fastapi>=0.104.0",
    "uvicorn>=0.24.0",
    "pydantic>=2.4.0",
    "requests>=2.31.0",
    "python-dotenv>=1.0.0"
  ],
  "services": [
    "Composio MCP Server (localhost:3001)",
    "Node.js runtime (for MCP server)"
  ]
}
```

### Used By

- **ctb/ai/** - Uses MCP server for external service integrations, uses APIs for orchestration
- **ctb/data/** - Uses database connection utilities, migration runners
- **ctb/ui/** - Consumes REST APIs for data and operations
- **ctb/meta/** - Uses CI/CD workflows, enforcement scripts

### Critical Files

- `ctb/sys/server/main.py` - FastAPI entry point
- `ctb/sys/api/composio_tools.py` - Composio MCP integration
- `ctb/sys/scripts/ctb_verify.sh` - CTB verification
- `ctb/sys/global-factory/` - CTB enforcement scripts

---

## 🤖 Division: CTB/AI

**Location**: `ctb/ai/`
**Altitude**: 20k (Core Logic)
**Purpose**: AI agents, orchestration, HEIR/ORBT utilities

### Depends On

**ctb/sys/**:
- Composio MCP server for external service integrations
- REST APIs for coordination and data access
- HEIR/ORBT utilities for process tracking

### External Dependencies

```json
{
  "python": ">=3.11.9",
  "packages": [
    "openai>=1.0.0",
    "anthropic>=0.5.0",
    "langchain>=0.1.0",
    "composio-core>=6.0.0"
  ],
  "services": [
    "Composio MCP Server (localhost:3001)",
    "OpenAI API (optional)",
    "Anthropic Claude API (optional)"
  ]
}
```

### Used By

- **ctb/ui/** - Displays agent status, orchestrates workflows via UI
- **ctb/sys/** - Agents call system APIs for operations

### Critical Files

- `ctb/ai/orbt-utils/heir_generator.py` - HEIR ID generation
- `ctb/ai/shq-reasoning/shq_core.py` - Strategic HQ reasoning
- `ctb/ai/agents/` - Agent definitions

### Integration Points

```python
# AI agents call Composio via ctb/sys MCP server
import requests

def call_composio_tool(tool_name, data, heir_id, process_id):
    response = requests.post('http://localhost:3001/tool', json={
        'tool': tool_name,
        'data': data,
        'unique_id': heir_id,
        'process_id': process_id,
        'orbt_layer': 2,
        'blueprint_version': '1.0'
    })
    return response.json()
```

---

## 🗄️ Division: CTB/DATA

**Location**: `ctb/data/`
**Altitude**: 20k (Core Logic)
**Purpose**: Databases, schemas, migrations, data warehouses

### Depends On

**ctb/sys/**:
- Database connection utilities (via direct `pg` client, NOT Composio)
- Migration runners
- Environment variable management

### External Dependencies

```json
{
  "python": ">=3.11.9",
  "packages": [
    "psycopg2-binary>=2.9.0",
    "sqlalchemy>=2.0.0",
    "alembic>=1.12.0"
  ],
  "databases": [
    "Neon PostgreSQL (production)",
    "Firebase Firestore (document store)",
    "BigQuery (analytics)"
  ],
  "tools": [
    "ChartDB (schema visualization)"
  ]
}
```

### Used By

- **ctb/sys/** - APIs query database for operations
- **ctb/ai/** - Agents read/write data for context and results
- **ctb/ui/** - Displays data to users

### Critical Files

- `ctb/data/schemas/chartdb_schemas/` - Database schemas
- `ctb/data/migrations/` - Database migration scripts
- `ctb/data/seeds/` - Seed data for testing

### Integration Points

```python
# Direct database connection (CORRECT METHOD)
from psycopg2 import connect
import os

conn = connect(os.getenv('DATABASE_URL'))
cursor = conn.cursor()
cursor.execute('SELECT * FROM users')
results = cursor.fetchall()
conn.close()

# ❌ NEVER use Composio for database operations
# neon_execute_sql does not exist!
```

---

## 📖 Division: CTB/DOCS

**Location**: `ctb/docs/`
**Altitude**: 20k (Core Logic)
**Purpose**: Documentation, guides, diagrams, API specs

### Depends On

**All divisions** (for documentation content):
- References ctb/sys/ for API documentation
- References ctb/ai/ for agent documentation
- References ctb/data/ for schema documentation
- References ctb/ui/ for component documentation
- References ctb/meta/ for configuration documentation

### External Dependencies

```json
{
  "tools": [
    "Mermaid (diagrams)",
    "Markdown (documentation)",
    "OpenAPI/Swagger (API specs)"
  ]
}
```

### Used By

- **All divisions** - Consume documentation
- **Developers** - Reference guides and diagrams
- **AI Agents** - Read documentation for context

### Critical Files

- `ctb/docs/composio/COMPOSIO_INTEGRATION.md` - CRITICAL integration guide
- `ctb/docs/barton/BARTON_OUTREACH_CORE_UPDATES.md` - HEIR/ORBT patterns
- `ctb/docs/architecture/architecture.mmd` - System architecture
- `ctb/docs/guides/blueprints/` - Workflow blueprints

---

## 🎨 Division: CTB/UI

**Location**: `ctb/ui/`
**Altitude**: 10k (Application)
**Purpose**: User interface, React components, pages

### Depends On

**ctb/sys/**:
- REST APIs for data and operations
- WebSocket connections for real-time updates

**ctb/ai/**:
- Agent status and orchestration APIs
- Workflow execution interfaces

**ctb/data/**:
- Data display and visualization
- Database query results

### External Dependencies

```json
{
  "node": ">=18.0.0",
  "packages": [
    "react>=18.0.0",
    "next.js>=14.0.0",
    "tailwindcss>=3.0.0",
    "axios>=1.5.0"
  ]
}
```

### Used By

**End Users** - Interact with application

### Critical Files

- `ctb/ui/components/` - Reusable React components
- `ctb/ui/pages/` - Page components
- `ctb/ui/assets/` - Static assets

### Integration Points

```javascript
// Call ctb/sys APIs
import axios from 'axios';

const response = await axios.post('http://localhost:8000/api/endpoint', {
  data: {...}
});

// Call AI agents via ctb/sys
const agentResponse = await axios.post('http://localhost:8000/agents/execute', {
  agent: 'gmail_agent',
  task: 'send_email',
  params: {...}
});
```

---

## ⚙️ Division: CTB/META

**Location**: `ctb/meta/`
**Altitude**: 10k (Application)
**Purpose**: Configuration, metadata, registry, compliance

### Depends On

**All divisions** (for compliance and configuration):
- Audits ctb/sys/ for infrastructure compliance
- Audits ctb/ai/ for HEIR/ORBT compliance
- Audits ctb/data/ for schema compliance
- Audits ctb/docs/ for documentation completeness
- Audits ctb/ui/ for component structure

### External Dependencies

```json
{
  "python": ">=3.11.9",
  "packages": [
    "pyyaml>=6.0",
    "jsonschema>=4.0.0"
  ]
}
```

### Used By

- **All divisions** - Use configuration files
- **CI/CD** - Uses compliance scripts
- **Developers** - Reference registry and configs

### Critical Files

- `ctb/meta/config/composio_ctb_tasks.json` - CTB task definitions
- `ctb/meta/registry/ctb_registry.json` - Auto-generated registry
- `ctb/meta/DEPENDENCIES.md` - This file
- `ctb/meta/config/package.json` - Node.js dependencies

---

## 🌐 External Service Dependencies

### Composio MCP Server

**Location**: `../scraping-tool/imo-creator/mcp-servers/composio-mcp/`
**Port**: 3001
**Purpose**: Integration hub for 100+ external services

**Connected Services**:
- Gmail (3 accounts)
- Google Drive (3 accounts)
- Google Calendar (1 account)
- Google Sheets (1 account)
- GitHub
- Slack
- And 100+ more via Composio

**Used By**: ctb/sys/, ctb/ai/

**Critical**: MUST be running for any external service integrations

```bash
# Start Composio MCP server
cd ../scraping-tool/imo-creator/mcp-servers/composio-mcp
node server.js
```

### Databases

**Neon PostgreSQL**:
- **Purpose**: Primary relational database
- **Connection**: `DATABASE_URL` environment variable
- **Used By**: ctb/data/, ctb/sys/
- **Access**: Direct `pg` client (NOT via Composio)

**Firebase Firestore**:
- **Purpose**: Real-time document store
- **Connection**: Firebase Admin SDK
- **Used By**: ctb/sys/, ctb/ai/
- **Access**: Firebase Admin SDK

**BigQuery**:
- **Purpose**: Data warehouse, analytics
- **Connection**: Google Cloud SDK
- **Used By**: ctb/data/
- **Access**: Google Cloud SDK

### Deployment Services

**Render**:
- **Purpose**: FastAPI deployment
- **Config**: `render.yaml`, `Procfile`
- **Serves**: ctb/sys/server/main.py

**Vercel**:
- **Purpose**: Frontend deployment (if applicable)
- **Serves**: ctb/ui/

---

## 📦 Python Package Dependencies

### System-Wide (requirements.txt)

```txt
# Web Framework
fastapi>=0.104.0
uvicorn>=0.24.0
pydantic>=2.4.0

# HTTP & Utilities
requests>=2.31.0
python-dotenv>=1.0.0
pyyaml>=6.0

# Database
psycopg2-binary>=2.9.0
sqlalchemy>=2.0.0
alembic>=1.12.0

# Firebase
firebase-admin>=6.2.0

# AI & ML
openai>=1.0.0
anthropic>=0.5.0
langchain>=0.1.0

# Composio
composio-core>=6.0.0

# Testing
pytest>=7.4.0
pytest-asyncio>=0.21.0
```

### Division-Specific

**ctb/sys/**:
- fastapi, uvicorn, requests

**ctb/ai/**:
- openai, anthropic, langchain, composio-core

**ctb/data/**:
- psycopg2-binary, sqlalchemy, alembic

**ctb/meta/**:
- pyyaml, jsonschema

---

## 📦 Node.js Package Dependencies

### MCP Server (package.json in composio-mcp/)

```json
{
  "dependencies": {
    "composio-core": "^6.0.0",
    "@modelcontextprotocol/sdk": "^1.0.0",
    "express": "^4.18.0",
    "dotenv": "^16.0.0"
  }
}
```

### UI (if applicable)

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "next": "^14.0.0",
    "tailwindcss": "^3.0.0",
    "axios": "^1.5.0"
  }
}
```

---

## 🔄 Data Flow Dependencies

### Request Flow

```
User Request
    ↓
CTB/UI (10k) - User interface
    ↓ HTTP request
CTB/SYS (40k) - FastAPI server
    ↓ MCP call
Composio MCP Server (port 3001)
    ↓ API call
External Service (Gmail, Drive, etc.)
    ↓ response
Composio MCP Server
    ↓ response
CTB/SYS
    ↓ response
CTB/UI
    ↓
User sees result
```

### Data Storage Flow

```
User Input (CTB/UI)
    ↓
API Request (CTB/SYS)
    ↓
Business Logic (CTB/AI or CTB/SYS)
    ↓
Database Write (CTB/DATA)
    ↓ direct pg client
Neon PostgreSQL / Firebase / BigQuery
```

### AI Agent Flow

```
Agent Trigger (CTB/UI or CTB/SYS)
    ↓
Agent Orchestration (CTB/AI)
    ↓ HEIR/ORBT tracking
MCP Tool Call (via CTB/SYS)
    ↓ Composio MCP
External Service Action
    ↓ result
Agent Processing (CTB/AI)
    ↓ store result
Database (CTB/DATA)
```

---

## ⚠️ Dependency Rules

### Critical Rules

1. **NO Circular Dependencies**: Lower altitude divisions NEVER depend on higher altitude divisions
   - ❌ ctb/sys/ cannot depend on ctb/ui/
   - ✅ ctb/ui/ can depend on ctb/sys/

2. **Database Access**: ALWAYS use direct connections for databases
   - ❌ NEVER use Composio MCP for database operations
   - ✅ ALWAYS use direct `pg` client, Firebase SDK, or Google Cloud SDK

3. **MCP Server**: MUST be running for any Composio integrations
   - Check: `curl http://localhost:3001/mcp/health`

4. **HEIR/ORBT**: ALL Composio calls MUST include tracking payload
   ```json
   {
     "unique_id": "HEIR-YYYY-MM-SYSTEM-MODE-VN",
     "process_id": "PRC-SYSTEM-TIMESTAMP",
     "orbt_layer": 1-4,
     "blueprint_version": "1.0"
   }
   ```

5. **Environment Variables**: NEVER commit `.env` files
   - Use `.env.example` templates
   - Use MCP Vault for secrets

---

## 🔍 Dependency Verification

### Check All Dependencies

```bash
# Python dependencies
pip list

# Node.js dependencies (MCP server)
cd ../scraping-tool/imo-creator/mcp-servers/composio-mcp
npm list

# Database connection
psql $DATABASE_URL -c "SELECT version();"

# MCP server
curl http://localhost:3001/mcp/health

# FastAPI server
curl http://localhost:8000/health
```

### Verify CTB Structure

```bash
# Run compliance audit (checks dependencies)
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# Check registry
cat ctb/meta/registry/ctb_registry.json
```

---

## 📚 Related Documentation

- **Entry Point**: `ENTRYPOINT.md` (root)
- **CTB Doctrine**: `ctb/sys/global-factory/CTB_DOCTRINE.md`
- **Composio Integration**: `ctb/docs/composio/COMPOSIO_INTEGRATION.md`
- **Architecture Diagram**: `ctb/docs/architecture/architecture.mmd`
- **Division READMEs**: `ctb/{division}/README.md`

---

## 🔄 Updating This File

When adding new dependencies:

1. Identify which division(s) affected
2. Document in relevant division section
3. Update dependency graph if structure changes
4. Add to Python or Node.js package lists
5. Document integration points with code examples
6. Update data flow diagrams if applicable
7. Commit with message: `docs: Update DEPENDENCIES.md with [new dependency]`

---

**Maintainer**: CTB Meta Team
**Review Schedule**: Monthly
**Next Review**: 2025-11-23
