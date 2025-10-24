# CTB/SYS - System Infrastructure

**Purpose**: External service integrations, infrastructure, APIs, and system utilities

---

## 📁 Directory Structure

```
ctb/sys/
├── api/                    # REST API endpoints
├── composio-mcp/          # Composio MCP server (100+ integrations)
├── firebase/              # Firebase integration & Firestore client
├── neon/                  # Neon PostgreSQL database client
├── github-factory/        # CTB compliance scripts & workflows
│   ├── scripts/          # Core compliance scripts
│   └── COMPOSIO_CTB_INTEGRATION.md
├── global-factory/        # Original CTB factory
│   ├── scripts/          # Original automation scripts
│   └── doctrine/         # CTB doctrine documentation
├── database/             # Database utilities & migrations
├── config/               # System configuration files
├── utils/                # Utility functions (HEIR/ORBT, etc.)
├── gatekeeper/           # Access control & validation
├── validator/            # Schema validation services
└── tests/                # System integration tests
```

---

## 🚀 Quick Start

### Start Composio MCP Server
```bash
# Terminal 1: Start Composio MCP
cd ctb/sys/composio-mcp
node server.js

# Verify it's running
curl http://localhost:3001/health
```

### Start FastAPI Server (if applicable)
```bash
# Terminal 2: Start API server
python main.py

# Or with uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Test Database Connection
```bash
# Set DATABASE_URL in .env
export DATABASE_URL="postgresql://user:pass@host/db"

# Test connection
python ctb/sys/database/test_connection.py
```

---

## 🔧 Key Components

### 1. Composio MCP Server
**Location**: `composio-mcp/`

**Purpose**: Unified integration hub for 100+ services

**Integrated Services**:
- Google Workspace (Gmail, Drive, Sheets, Calendar)
- Apify (web scraping actors)
- GitHub (issues, PRs, repos)
- Instantly.ai (email campaigns)
- Relevance AI (workflows)
- Builder.io (content management)

**Usage**:
```bash
# Start server
cd composio-mcp && node server.js

# Make request (with HEIR/ORBT payload)
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "gmail_send",
    "data": {
      "to": "user@example.com",
      "subject": "Test",
      "body": "Hello"
    },
    "unique_id": "HEIR-2025-10-SYS-GMAIL-01",
    "process_id": "PRC-SYS-1729800000",
    "orbt_layer": 2,
    "blueprint_version": "1.0"
  }'
```

---

### 2. Database Client
**Location**: `database/` or `neon/`

**Purpose**: Direct PostgreSQL connection (Barton Doctrine compliant)

**Key Files**:
- `client.py` - Database client with async operations
- `migrations/` - SQL migration files
- `run_migrations.cjs` - Migration runner

**Usage**:
```python
from ctb.sys.database.client import get_db_client

# Get client
db = get_db_client()

# Execute query
results = await db.execute_query("SELECT * FROM users")

# Run migrations
node ctb/sys/database/migrations/run.cjs
```

---

### 3. GitHub Factory (CTB Compliance)
**Location**: `github-factory/`

**Purpose**: CTB compliance automation

**Scripts**:
- `ctb_metadata_tagger.py` - Tag files with CTB metadata
- `ctb_audit_generator.py` - Calculate compliance score
- `ctb_remediator.py` - Auto-fix compliance issues

**Usage**:
```bash
# Run compliance cycle
python ctb/sys/github-factory/scripts/run_compliance_simple.py ctb/

# Or individual scripts
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py ctb/
python ctb/sys/github-factory/scripts/ctb_audit_generator.py
python ctb/sys/github-factory/scripts/ctb_remediator.py
```

---

### 4. HEIR/ORBT Utilities
**Location**: `utils/heir_orbt.py`

**Purpose**: Generate HEIR IDs and ORBT-compliant payloads

**Usage**:
```python
from ctb.sys.utils.heir_orbt import generate_heir_id, create_heir_orbt_payload

# Generate HEIR ID
heir_id = generate_heir_id("SYS", "API", version=1)
# Output: HEIR-2025-10-SYS-API-01

# Create complete payload
payload = create_heir_orbt_payload(
    tool="gmail_send",
    data={"to": "user@example.com", "subject": "Test"},
    system="SYS",
    mode="EMAIL"
)
```

---

### 5. API Endpoints
**Location**: `api/`

**Purpose**: REST API for system operations

**Key Endpoints**:
- `/api/composio/*` - Composio tool execution
- `/api/neon/*` - Database operations
- `/api/health` - Health check

**Usage**:
```bash
# Health check
curl http://localhost:8000/api/health

# Execute Composio tool
curl -X POST http://localhost:8000/api/composio/tools/execute \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "arguments": {
      "toolkit": "gmail",
      "tool": "send_email",
      "to": "user@example.com",
      "subject": "Test"
    }
  }'
```

---

## 🔐 Environment Variables

**Required**:
```bash
# Composio
COMPOSIO_API_KEY=ak_your_api_key
COMPOSIO_USER_ID=usr_your_user_id

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
NEON_DATABASE_URL=postgresql://user:pass@host:5432/db

# Firebase (if using)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# API
API_KEY=your_api_key_for_internal_use
```

See `ctb/sys/api/.env.example` for complete list.

---

## 🧪 Testing

### Run All Tests
```bash
# Run system integration tests
pytest ctb/sys/tests/

# Run with coverage
pytest ctb/sys/tests/ --cov=ctb/sys
```

### Test Specific Components
```bash
# Test database connection
python ctb/sys/database/tests/test_connection.py

# Test Composio integration
python ctb/sys/composio-mcp/tests/test_mcp_server.py

# Test HEIR/ORBT utilities
pytest ctb/sys/tests/test_heir_orbt.py
```

---

## 📊 Common Tasks

### 1. Add New Composio Integration
1. Check available tools: `curl http://localhost:3001/tools`
2. Add endpoint in `api/composio_tools.py`
3. Test with HEIR/ORBT payload
4. Document in API docs

### 2. Add Database Migration
1. Create SQL file: `ctb/sys/database/migrations/YYYY-MM-DD_description.sql`
2. Add to migration list in `run_migrations.cjs`
3. Run migrations: `node ctb/sys/database/migrations/run.cjs`
4. Verify schema changes

### 3. Add New System Utility
1. Create file in `ctb/sys/utils/`
2. Follow HEIR/ORBT standards if external-facing
3. Add tests in `ctb/sys/tests/`
4. Document in this README

### 4. Troubleshoot Integration
1. Check MCP server logs: `cat logs/composio_mcp.log`
2. Verify environment variables: `env | grep COMPOSIO`
3. Test health endpoint: `curl http://localhost:3001/health`
4. Review API key permissions

---

## 🔗 Dependencies

### External Services
- **Composio**: Integration hub (requires API key)
- **Neon/PostgreSQL**: Database (requires connection string)
- **Firebase**: Optional (requires credentials)

### Internal Dependencies
- `ctb/data/` - Database schemas
- `ctb/ai/` - AI model integrations
- `ctb/meta/` - Configuration and registry

### Python Packages
```bash
pip install asyncpg fastapi uvicorn httpx pydantic
```

### Node Packages
```bash
npm install composio-core @composio/mcp-server
```

---

## 📚 Documentation

- **Composio Integration**: `composio-mcp/README.md`
- **Database Guide**: `database/README.md`
- **API Reference**: `api/README.md`
- **HEIR/ORBT Spec**: `utils/HEIR_ORBT_SPEC.md`
- **CTB Compliance**: `github-factory/COMPOSIO_CTB_INTEGRATION.md`

---

## 🚨 Important Notes

### ⚠️ Database Operations
- **NEVER** use fake Composio tools like `neon_execute_sql`
- **ALWAYS** use direct `pg` client connections
- Follow patterns in `database/client.py`

### ⚠️ HEIR/ORBT Compliance
- **ALL** external API calls MUST use HEIR/ORBT payload format
- Use utilities in `utils/heir_orbt.py`
- Validate payloads before sending

### ⚠️ API Keys
- **NEVER** commit API keys to git
- Store in `.env` file (gitignored)
- Use environment variables in code

---

## 🆘 Troubleshooting

### MCP Server Won't Start
```bash
# Check port availability
netstat -an | grep 3001

# Check Composio API key
echo $COMPOSIO_API_KEY

# View logs
tail -f logs/composio_mcp.log
```

### Database Connection Fails
```bash
# Test connection string
psql "$DATABASE_URL"

# Check environment variable
echo $DATABASE_URL

# Verify network access
ping your-neon-host.com
```

### API Returns 401
```bash
# Check API key
echo $COMPOSIO_API_KEY

# Verify header format
curl -H "Authorization: Bearer $COMPOSIO_API_KEY" ...

# Check MCP server health
curl http://localhost:3001/health
```

---

## 📞 Support

- **CTB Issues**: See `ctb/sys/github-factory/`
- **Composio Issues**: https://docs.composio.dev
- **Database Issues**: See `ctb/data/README.md`
- **General Help**: See `ENTRYPOINT.md` at repo root

---

**Branch**: sys
**Maintainer**: Infrastructure Team
**Last Updated**: 2025-10-23
