# API Catalog - Complete Endpoint Reference

**Purpose**: Complete catalog of all API endpoints with full traceability

**Last Updated**: 2025-10-23
**API Version**: 1.0.0
**Base URL**: `http://localhost:8000`

---

## 📋 Table of Contents

- [Base Configuration](#base-configuration)
- [Middleware](#middleware)
- [Health & Status](#health--status)
- [Composio Integration](#composio-integration)
- [Neon Database](#neon-database)
- [Firebase Operations](#firebase-operations)
- [CTB Compliance](#ctb-compliance)
- [IMO Operations](#imo-operations)
- [AI Operations](#ai-operations)
- [Authentication](#authentication)
- [Schema References](#schema-references)

---

## 🔧 Base Configuration

### API Server

**Framework**: FastAPI
**Host**: `0.0.0.0`
**Port**: `8000`
**Protocol**: HTTP (HTTPS in production)
**CORS Enabled**: Yes
**Rate Limiting**: Enabled (100 requests/minute)

### Environment Variables

```bash
API_HOST=0.0.0.0
API_PORT=8000
API_KEY=your_api_key
JWT_SECRET=your_jwt_secret
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## 🛡️ Middleware

### Applied Middleware (Order of Execution)

1. **CORS Middleware**
   - Handler: `fastapi.middleware.cors.CORSMiddleware`
   - Purpose: Handle cross-origin requests
   - Config: `CORS_ORIGINS` from environment

2. **HEIR/ORBT Middleware**
   - Handler: `ctb/sys/utils/heir_orbt.py:HEIRORBTMiddleware`
   - Purpose: Add HEIR/ORBT tracking to all requests
   - Applies to: All `/api/composio/*` endpoints
   - HEIR ID Format: `HEIR-YYYY-MM-SYSTEM-MODE-VN`
   - Process ID Format: `PRC-SYSTEM-EPOCHTIMESTAMP`

3. **Rate Limiting Middleware**
   - Handler: Custom rate limiter
   - Purpose: Prevent API abuse
   - Limit: 100 requests per 60 seconds per IP
   - Response: 429 Too Many Requests

4. **Authentication Middleware**
   - Handler: `api_key_auth` dependency
   - Purpose: Validate API keys
   - Header: `Authorization: Bearer {API_KEY}`
   - Applies to: All endpoints except `/health`

---

## 💚 Health & Status

### GET /api/health

**Purpose**: Health check endpoint
**Handler**: `main.py:health_check()`
**Authentication**: None
**Rate Limit**: Unlimited

**Request**:
```bash
GET http://localhost:8000/api/health
```

**Response Schema**: `HealthResponse`
```json
{
  "status": "healthy",
  "timestamp": "2025-10-23T12:00:00Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "composio_mcp": "running",
    "firebase": "connected"
  }
}
```

**Response Codes**:
- `200 OK`: Service healthy
- `503 Service Unavailable`: Service degraded

**Linked Files**:
- Handler: `main.py`
- Schema: `ctb/data/zod/api/health.ts`

---

### GET /api/status

**Purpose**: Detailed system status
**Handler**: `main.py:system_status()`
**Authentication**: API Key required
**Rate Limit**: 100/min

**Request**:
```bash
GET http://localhost:8000/api/status
Authorization: Bearer {API_KEY}
```

**Response Schema**: `SystemStatus`
```json
{
  "uptime": 3600,
  "database": {
    "status": "connected",
    "pool_size": 5,
    "active_connections": 2
  },
  "composio_mcp": {
    "status": "running",
    "port": 3001,
    "connected_services": 100
  },
  "memory_usage": "45%",
  "cpu_usage": "12%"
}
```

**Response Codes**:
- `200 OK`: Status retrieved
- `401 Unauthorized`: Invalid API key

**Linked Files**:
- Handler: `main.py`
- Schema: `ctb/data/zod/api/status.ts`

---

## 🔌 Composio Integration

### Base Path: `/api/composio`

All Composio endpoints use HEIR/ORBT middleware for tracking.

---

### POST /api/composio/tools/execute

**Purpose**: Execute Composio tool
**Handler**: `ctb/sys/api/composio_tools.py:execute_tool()`
**Authentication**: API Key required
**Rate Limit**: 100/min
**HEIR Tracking**: Yes

**Request Schema**: `ToolExecutionRequest`
```json
{
  "tool": "gmail_send",
  "arguments": {
    "to": "user@example.com",
    "subject": "Test Email",
    "body": "Hello from IMO Creator"
  },
  "user_id": "usr_12345",
  "unique_id": "HEIR-2025-10-SYS-GMAIL-01",
  "process_id": "PRC-SYS-1729800000"
}
```

**Request**:
```bash
POST http://localhost:8000/api/composio/tools/execute
Authorization: Bearer {API_KEY}
Content-Type: application/json

{
  "tool": "gmail_send",
  "arguments": {...}
}
```

**Response Schema**: `ToolExecutionResponse`
```json
{
  "success": true,
  "result": {
    "message_id": "msg_12345",
    "status": "sent"
  },
  "heir_id": "HEIR-2025-10-SYS-GMAIL-01",
  "process_id": "PRC-SYS-1729800000",
  "execution_time_ms": 245
}
```

**Response Codes**:
- `200 OK`: Tool executed successfully
- `400 Bad Request`: Invalid tool or arguments
- `401 Unauthorized`: Invalid API key
- `500 Internal Server Error`: Tool execution failed

**Linked Files**:
- Handler: `ctb/sys/api/composio_tools.py`
- Schema: `ctb/data/zod/api/composio.ts`
- HEIR/ORBT: `ctb/sys/utils/heir_orbt.py`

**Process Flow**:
1. Request received → HEIR/ORBT middleware adds tracking
2. Validate tool name and arguments
3. Forward to Composio MCP server (port 3001)
4. MCP executes tool via connected service
5. Return result with HEIR/ORBT tracking

---

### GET /api/composio/tools

**Purpose**: List available Composio tools
**Handler**: `ctb/sys/api/composio_tools.py:list_tools()`
**Authentication**: API Key required
**Rate Limit**: 100/min

**Request**:
```bash
GET http://localhost:8000/api/composio/tools
Authorization: Bearer {API_KEY}
```

**Response Schema**: `ToolsListResponse`
```json
{
  "tools": [
    {
      "name": "gmail_send",
      "description": "Send email via Gmail",
      "category": "gmail",
      "parameters": ["to", "subject", "body"]
    },
    {
      "name": "github_create_issue",
      "description": "Create GitHub issue",
      "category": "github",
      "parameters": ["repo", "title", "body"]
    }
  ],
  "count": 100
}
```

**Response Codes**:
- `200 OK`: Tools listed
- `401 Unauthorized`: Invalid API key

**Linked Files**:
- Handler: `ctb/sys/api/composio_tools.py`
- Schema: `ctb/data/zod/api/composio.ts`

---

### POST /api/composio/gmail/send

**Purpose**: Send email via Gmail (convenience wrapper)
**Handler**: `ctb/sys/api/composio_tools.py:gmail_send()`
**Authentication**: API Key required
**Rate Limit**: 50/min
**HEIR Tracking**: Yes

**Request Schema**: `GmailSendRequest`
```json
{
  "to": "user@example.com",
  "subject": "Test Email",
  "body": "Email body content",
  "cc": ["cc@example.com"],
  "bcc": ["bcc@example.com"],
  "attachments": []
}
```

**Response Codes**:
- `200 OK`: Email sent
- `400 Bad Request`: Invalid email format
- `401 Unauthorized`: Invalid API key
- `500 Internal Server Error`: Gmail API error

**Linked Files**:
- Handler: `ctb/sys/api/composio_tools.py`
- Schema: `ctb/data/zod/api/gmail.ts`
- HEIR ID: `HEIR-YYYY-MM-SYS-GMAIL-VN`

---

### POST /api/composio/github/create-issue

**Purpose**: Create GitHub issue
**Handler**: `ctb/sys/api/composio_tools.py:github_create_issue()`
**Authentication**: API Key required
**Rate Limit**: 50/min
**HEIR Tracking**: Yes

**Request Schema**: `GitHubIssueRequest`
```json
{
  "repo": "owner/repo",
  "title": "Issue title",
  "body": "Issue description",
  "labels": ["bug", "urgent"],
  "assignees": ["username"]
}
```

**Response Codes**:
- `200 OK`: Issue created
- `400 Bad Request`: Invalid repo format
- `401 Unauthorized`: Invalid API key
- `404 Not Found`: Repository not found

**Linked Files**:
- Handler: `ctb/sys/api/composio_tools.py`
- Schema: `ctb/data/zod/api/github.ts`
- HEIR ID: `HEIR-YYYY-MM-SYS-GITHUB-VN`

---

## 🗄️ Neon Database

### Base Path: `/api/neon`

All database endpoints use direct PostgreSQL client (NOT Composio tools).

---

### POST /api/neon/query

**Purpose**: Execute SQL query
**Handler**: `ctb/sys/api/composio_tools.py:neon_query_database()`
**Authentication**: API Key required
**Rate Limit**: 100/min
**HEIR Tracking**: Yes

**Request Schema**: `DatabaseQueryRequest`
```json
{
  "sql": "SELECT * FROM users WHERE email = $1",
  "params": ["user@example.com"]
}
```

**Request**:
```bash
POST http://localhost:8000/api/neon/query
Authorization: Bearer {API_KEY}
Content-Type: application/json

{
  "sql": "SELECT * FROM users LIMIT 10",
  "params": []
}
```

**Response Schema**: `DatabaseQueryResponse`
```json
{
  "success": true,
  "result": [
    {
      "id": 1,
      "email": "user@example.com",
      "name": "Test User",
      "created_at": "2025-10-23T12:00:00Z"
    }
  ],
  "row_count": 1,
  "execution_time_ms": 15
}
```

**Response Codes**:
- `200 OK`: Query executed
- `400 Bad Request`: Invalid SQL syntax
- `401 Unauthorized`: Invalid API key
- `500 Internal Server Error`: Database error

**Linked Files**:
- Handler: `ctb/sys/api/composio_tools.py`
- Database Client: `ctb/sys/database/client.py`
- Schema: `ctb/data/zod/api/database.ts`

**Security Notes**:
- Parameterized queries only (prevents SQL injection)
- Read-only queries recommended
- DDL operations require admin role

---

### POST /api/neon/tables/create

**Purpose**: Create new table
**Handler**: `ctb/sys/api/composio_tools.py:neon_create_table()`
**Authentication**: API Key + Admin required
**Rate Limit**: 10/min
**HEIR Tracking**: Yes

**Request Schema**: `CreateTableRequest`
```json
{
  "table_name": "products",
  "columns": [
    {
      "name": "id",
      "type": "SERIAL",
      "primary_key": true
    },
    {
      "name": "name",
      "type": "VARCHAR(255)",
      "not_null": true
    },
    {
      "name": "price",
      "type": "DECIMAL(10,2)"
    }
  ],
  "indexes": [
    {
      "name": "idx_products_name",
      "columns": ["name"]
    }
  ]
}
```

**Response Codes**:
- `201 Created`: Table created
- `400 Bad Request`: Invalid schema
- `401 Unauthorized`: Invalid API key
- `403 Forbidden`: Admin role required
- `409 Conflict`: Table already exists

**Linked Files**:
- Handler: `ctb/sys/api/composio_tools.py`
- Database Client: `ctb/sys/database/client.py`
- Schema: `ctb/data/zod/api/database.ts`
- Schema Reference: `ctb/data/SCHEMA_REFERENCE.md`

---

### GET /api/neon/schema

**Purpose**: Get database schema
**Handler**: `ctb/sys/api/composio_tools.py:neon_get_schema()`
**Authentication**: API Key required
**Rate Limit**: 50/min

**Request**:
```bash
GET http://localhost:8000/api/neon/schema
Authorization: Bearer {API_KEY}
```

**Response Schema**: `DatabaseSchemaResponse`
```json
{
  "tables": [
    {
      "name": "users",
      "columns": [
        {
          "name": "id",
          "type": "integer",
          "nullable": false,
          "primary_key": true
        },
        {
          "name": "email",
          "type": "character varying(255)",
          "nullable": false,
          "unique": true
        }
      ],
      "indexes": [
        {
          "name": "idx_users_email",
          "columns": ["email"]
        }
      ]
    }
  ]
}
```

**Response Codes**:
- `200 OK`: Schema retrieved
- `401 Unauthorized`: Invalid API key

**Linked Files**:
- Handler: `ctb/sys/api/composio_tools.py`
- Database Client: `ctb/sys/database/client.py`
- Schema Reference: `ctb/data/SCHEMA_REFERENCE.md`

---

## 🔥 Firebase Operations

### Base Path: `/api/firebase`

---

### GET /api/firebase/collections/{collection}

**Purpose**: Get Firestore collection documents
**Handler**: `ctb/sys/api/firebase_tools.py:get_collection()`
**Authentication**: API Key required
**Rate Limit**: 100/min

**Request**:
```bash
GET http://localhost:8000/api/firebase/collections/users?limit=10
Authorization: Bearer {API_KEY}
```

**Query Parameters**:
- `limit` (optional): Number of documents to return (default: 100)
- `orderBy` (optional): Field to order by
- `direction` (optional): `asc` or `desc`

**Response Schema**: `FirestoreCollectionResponse`
```json
{
  "documents": [
    {
      "id": "user123",
      "data": {
        "email": "user@example.com",
        "name": "Test User",
        "createdAt": "2025-10-23T12:00:00Z"
      }
    }
  ],
  "count": 10
}
```

**Response Codes**:
- `200 OK`: Documents retrieved
- `401 Unauthorized`: Invalid API key
- `404 Not Found`: Collection not found

**Linked Files**:
- Handler: `ctb/sys/api/firebase_tools.py`
- Firebase Client: `ctb/sys/firebase/client.py`
- Schema: `ctb/data/firebase/schemas/`

---

### POST /api/firebase/collections/{collection}

**Purpose**: Create Firestore document
**Handler**: `ctb/sys/api/firebase_tools.py:create_document()`
**Authentication**: API Key required
**Rate Limit**: 50/min

**Request Schema**: `FirestoreDocumentRequest`
```json
{
  "id": "user123",
  "data": {
    "email": "user@example.com",
    "name": "Test User"
  }
}
```

**Response Codes**:
- `201 Created`: Document created
- `400 Bad Request`: Invalid data
- `401 Unauthorized`: Invalid API key
- `409 Conflict`: Document already exists

**Linked Files**:
- Handler: `ctb/sys/api/firebase_tools.py`
- Firebase Client: `ctb/sys/firebase/client.py`
- Schema: `ctb/data/firebase/schemas/`

---

## ✅ CTB Compliance

### Base Path: `/api/ctb`

---

### POST /api/ctb/tag

**Purpose**: Tag files with CTB metadata
**Handler**: `ctb/sys/api/ctb_tools.py:tag_files()`
**Authentication**: API Key required
**Rate Limit**: 10/min
**HEIR Tracking**: Yes

**Request Schema**: `CTBTagRequest`
```json
{
  "target_dir": "ctb/",
  "heir_id": "HEIR-2025-10-SYS-CTB-01"
}
```

**Response Schema**: `CTBTagResponse`
```json
{
  "success": true,
  "tagged_files": 235,
  "report_path": "logs/CTB_TAGGING_REPORT.md",
  "heir_id": "HEIR-2025-10-SYS-CTB-01"
}
```

**Response Codes**:
- `200 OK`: Files tagged
- `401 Unauthorized`: Invalid API key
- `500 Internal Server Error`: Tagging failed

**Linked Files**:
- Handler: `ctb/sys/api/ctb_tools.py`
- Script: `ctb/sys/github-factory/scripts/ctb_metadata_tagger.py`
- Output: `ctb/meta/ctb_tags.json`

---

### POST /api/ctb/audit

**Purpose**: Run CTB compliance audit
**Handler**: `ctb/sys/api/ctb_tools.py:audit_compliance()`
**Authentication**: API Key required
**Rate Limit**: 10/min
**HEIR Tracking**: Yes

**Request Schema**: `CTBAuditRequest`
```json
{
  "heir_id": "HEIR-2025-10-SYS-CTB-02"
}
```

**Response Schema**: `CTBAuditResponse`
```json
{
  "success": true,
  "compliance_score": 92,
  "status": "EXCELLENT",
  "issues": [
    {
      "severity": "MEDIUM",
      "message": "3 files in wrong location"
    }
  ],
  "report_path": "logs/CTB_AUDIT_REPORT.md",
  "heir_id": "HEIR-2025-10-SYS-CTB-02"
}
```

**Response Codes**:
- `200 OK`: Audit completed
- `401 Unauthorized`: Invalid API key

**Linked Files**:
- Handler: `ctb/sys/api/ctb_tools.py`
- Script: `ctb/sys/github-factory/scripts/ctb_audit_generator.py`
- Output: `logs/ctb_audit_report.json`

---

### POST /api/ctb/remediate

**Purpose**: Auto-fix CTB compliance issues
**Handler**: `ctb/sys/api/ctb_tools.py:remediate_issues()`
**Authentication**: API Key required
**Rate Limit**: 5/min
**HEIR Tracking**: Yes

**Request Schema**: `CTBRemediateRequest`
```json
{
  "dry_run": false,
  "heir_id": "HEIR-2025-10-SYS-CTB-03"
}
```

**Response Schema**: `CTBRemediateResponse`
```json
{
  "success": true,
  "actions_performed": [
    "Created missing directories",
    "Generated CTB registry"
  ],
  "report_path": "logs/CTB_REMEDIATION_SUMMARY.md",
  "heir_id": "HEIR-2025-10-SYS-CTB-03"
}
```

**Response Codes**:
- `200 OK`: Remediation completed
- `401 Unauthorized`: Invalid API key

**Linked Files**:
- Handler: `ctb/sys/api/ctb_tools.py`
- Script: `ctb/sys/github-factory/scripts/ctb_remediator.py`
- Output: `logs/ctb_remediation_log.json`

---

## 📊 IMO Operations

### Base Path: `/api/imo`

---

### POST /api/imo/generate

**Purpose**: Generate new IMO
**Handler**: `ctb/sys/api/imo_tools.py:generate_imo()`
**Authentication**: API Key required
**Rate Limit**: 20/min
**HEIR Tracking**: Yes

**Request Schema**: `IMOGenerateRequest`
```json
{
  "requirements": "Create marketing operation for email campaign",
  "target_audience": "B2B SaaS customers",
  "budget": 5000,
  "heir_id": "HEIR-2025-10-AI-IMO-01"
}
```

**Response Schema**: `IMOGenerateResponse`
```json
{
  "success": true,
  "imo": {
    "id": "imo_12345",
    "name": "B2B Email Campaign",
    "description": "Email campaign targeting B2B SaaS customers",
    "components": ["email_template", "audience_segment", "analytics"],
    "metrics": ["open_rate", "click_rate", "conversion_rate"],
    "budget": 5000
  },
  "heir_id": "HEIR-2025-10-AI-IMO-01",
  "process_id": "PRC-AI-1729800000"
}
```

**Response Codes**:
- `201 Created`: IMO generated
- `400 Bad Request`: Invalid requirements
- `401 Unauthorized`: Invalid API key
- `500 Internal Server Error`: Generation failed

**Linked Files**:
- Handler: `ctb/sys/api/imo_tools.py`
- AI Agent: `ctb/ai/agents/imo-creator/`
- Database: `users` table (stores IMOs)

---

### GET /api/imo/list

**Purpose**: List all IMOs
**Handler**: `ctb/sys/api/imo_tools.py:list_imos()`
**Authentication**: API Key required
**Rate Limit**: 50/min

**Request**:
```bash
GET http://localhost:8000/api/imo/list?limit=10&offset=0
Authorization: Bearer {API_KEY}
```

**Query Parameters**:
- `limit` (optional): Number of IMOs to return (default: 50)
- `offset` (optional): Pagination offset (default: 0)
- `status` (optional): Filter by status

**Response Schema**: `IMOListResponse`
```json
{
  "imos": [
    {
      "id": "imo_12345",
      "name": "B2B Email Campaign",
      "status": "active",
      "created_at": "2025-10-23T12:00:00Z"
    }
  ],
  "count": 1,
  "total": 25
}
```

**Response Codes**:
- `200 OK`: IMOs listed
- `401 Unauthorized`: Invalid API key

**Linked Files**:
- Handler: `ctb/sys/api/imo_tools.py`
- Database: `users` table

---

### GET /api/imo/{imo_id}

**Purpose**: Get IMO details
**Handler**: `ctb/sys/api/imo_tools.py:get_imo()`
**Authentication**: API Key required
**Rate Limit**: 100/min

**Request**:
```bash
GET http://localhost:8000/api/imo/imo_12345
Authorization: Bearer {API_KEY}
```

**Response Schema**: `IMODetailResponse`
```json
{
  "id": "imo_12345",
  "name": "B2B Email Campaign",
  "description": "Email campaign targeting B2B SaaS customers",
  "components": ["email_template", "audience_segment", "analytics"],
  "metrics": {
    "open_rate": 0.25,
    "click_rate": 0.05,
    "conversion_rate": 0.01
  },
  "budget": 5000,
  "status": "active",
  "created_at": "2025-10-23T12:00:00Z",
  "updated_at": "2025-10-23T14:00:00Z"
}
```

**Response Codes**:
- `200 OK`: IMO retrieved
- `401 Unauthorized`: Invalid API key
- `404 Not Found`: IMO not found

**Linked Files**:
- Handler: `ctb/sys/api/imo_tools.py`
- Database: `users` table

---

## 🤖 AI Operations

### Base Path: `/api/ai`

---

### POST /api/ai/chat

**Purpose**: Chat with AI assistant
**Handler**: `ctb/sys/api/ai_tools.py:chat()`
**Authentication**: API Key required
**Rate Limit**: 50/min
**HEIR Tracking**: Yes

**Request Schema**: `AIChatRequest`
```json
{
  "message": "How do I create a marketing campaign?",
  "context": {
    "previous_messages": []
  },
  "heir_id": "HEIR-2025-10-AI-CHAT-01"
}
```

**Response Schema**: `AIChatResponse`
```json
{
  "success": true,
  "response": "To create a marketing campaign, follow these steps...",
  "model": "gemini-2.5-flash",
  "tokens_used": 150,
  "heir_id": "HEIR-2025-10-AI-CHAT-01"
}
```

**Response Codes**:
- `200 OK`: Response generated
- `400 Bad Request`: Invalid message
- `401 Unauthorized`: Invalid API key
- `429 Too Many Requests`: Rate limit exceeded

**Linked Files**:
- Handler: `ctb/sys/api/ai_tools.py`
- AI Model: `ctb/ai/models/gemini/`
- Prompts: `ctb/ai/prompts/templates/`

---

### POST /api/ai/generate

**Purpose**: Generate content with AI
**Handler**: `ctb/sys/api/ai_tools.py:generate()`
**Authentication**: API Key required
**Rate Limit**: 30/min
**HEIR Tracking**: Yes

**Request Schema**: `AIGenerateRequest`
```json
{
  "prompt": "Generate a marketing email for B2B SaaS product",
  "model": "gemini-2.5-flash",
  "temperature": 0.7,
  "max_tokens": 1000,
  "heir_id": "HEIR-2025-10-AI-GEN-01"
}
```

**Response Schema**: `AIGenerateResponse`
```json
{
  "success": true,
  "content": "Subject: Transform Your Business with...",
  "model": "gemini-2.5-flash",
  "tokens_used": 245,
  "heir_id": "HEIR-2025-10-AI-GEN-01"
}
```

**Response Codes**:
- `200 OK`: Content generated
- `400 Bad Request`: Invalid prompt
- `401 Unauthorized`: Invalid API key

**Linked Files**:
- Handler: `ctb/sys/api/ai_tools.py`
- AI Model: `ctb/ai/models/gemini/`

---

## 🔐 Authentication

### POST /api/auth/login

**Purpose**: User login
**Handler**: `ctb/sys/api/auth.py:login()`
**Authentication**: None (public endpoint)
**Rate Limit**: 10/min per IP

**Request Schema**: `LoginRequest`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Schema**: `LoginResponse`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_12345",
    "email": "user@example.com",
    "name": "Test User"
  },
  "expires_at": "2025-10-24T12:00:00Z"
}
```

**Response Codes**:
- `200 OK`: Login successful
- `401 Unauthorized`: Invalid credentials
- `429 Too Many Requests`: Rate limit exceeded

**Linked Files**:
- Handler: `ctb/sys/api/auth.py`
- Database: `users` table
- Schema: `ctb/data/zod/api/auth.ts`

---

### POST /api/auth/refresh

**Purpose**: Refresh JWT token
**Handler**: `ctb/sys/api/auth.py:refresh_token()`
**Authentication**: Valid refresh token required
**Rate Limit**: 20/min

**Request Schema**: `RefreshTokenRequest`
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Codes**:
- `200 OK`: Token refreshed
- `401 Unauthorized`: Invalid token

**Linked Files**:
- Handler: `ctb/sys/api/auth.py`
- Utility: `ctb/sys/utils/jwt.py`

---

## 📚 Schema References

All request/response schemas are defined in:

**Zod Schemas** (TypeScript):
- `ctb/data/zod/api/` - API schemas
- `ctb/data/zod/models/` - Data model schemas
- `ctb/data/zod/forms/` - Form validation schemas

**Pydantic Models** (Python):
- `ctb/sys/api/models/` - Request/response models
- `ctb/data/models/` - Database models

**Complete Schema Reference**:
- See `ctb/data/SCHEMA_REFERENCE.md` for database schemas
- See `ctb/docs/api/REST_API.md` for detailed API documentation

---

## 🔍 Endpoint Quick Reference

| Method | Path | Purpose | Auth | Rate Limit |
|--------|------|---------|------|------------|
| GET | `/api/health` | Health check | None | Unlimited |
| GET | `/api/status` | System status | API Key | 100/min |
| POST | `/api/composio/tools/execute` | Execute Composio tool | API Key | 100/min |
| GET | `/api/composio/tools` | List tools | API Key | 100/min |
| POST | `/api/composio/gmail/send` | Send email | API Key | 50/min |
| POST | `/api/composio/github/create-issue` | Create GitHub issue | API Key | 50/min |
| POST | `/api/neon/query` | Query database | API Key | 100/min |
| POST | `/api/neon/tables/create` | Create table | Admin | 10/min |
| GET | `/api/neon/schema` | Get schema | API Key | 50/min |
| GET | `/api/firebase/collections/{collection}` | Get Firestore docs | API Key | 100/min |
| POST | `/api/firebase/collections/{collection}` | Create Firestore doc | API Key | 50/min |
| POST | `/api/ctb/tag` | Tag files | API Key | 10/min |
| POST | `/api/ctb/audit` | Audit compliance | API Key | 10/min |
| POST | `/api/ctb/remediate` | Remediate issues | API Key | 5/min |
| POST | `/api/imo/generate` | Generate IMO | API Key | 20/min |
| GET | `/api/imo/list` | List IMOs | API Key | 50/min |
| GET | `/api/imo/{imo_id}` | Get IMO | API Key | 100/min |
| POST | `/api/ai/chat` | Chat with AI | API Key | 50/min |
| POST | `/api/ai/generate` | Generate content | API Key | 30/min |
| POST | `/api/auth/login` | User login | None | 10/min |
| POST | `/api/auth/refresh` | Refresh token | Refresh Token | 20/min |

---

## 🚨 Error Responses

All endpoints return errors in this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional error details"
    }
  },
  "heir_id": "HEIR-2025-10-SYS-ERROR-01",
  "timestamp": "2025-10-23T12:00:00Z"
}
```

**Common Error Codes**:
- `INVALID_API_KEY`: API key is missing or invalid
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INVALID_REQUEST`: Request validation failed
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `INTERNAL_ERROR`: Server error
- `DATABASE_ERROR`: Database operation failed
- `EXTERNAL_SERVICE_ERROR`: External service (Composio, AI) failed

---

## 📊 Monitoring & Logging

All API requests are logged with:
- Request ID (HEIR ID)
- Process ID
- Endpoint
- Method
- User/API Key
- Response time
- Status code
- Error details (if applicable)

**Log Location**: `logs/api.log`

**Log Format**:
```json
{
  "timestamp": "2025-10-23T12:00:00Z",
  "heir_id": "HEIR-2025-10-SYS-API-01",
  "process_id": "PRC-SYS-1729800000",
  "method": "POST",
  "path": "/api/composio/tools/execute",
  "status_code": 200,
  "response_time_ms": 245,
  "user_id": "user_12345"
}
```

---

## 🔄 API Versioning

**Current Version**: `v1`
**Version Header**: `X-API-Version: 1.0.0`
**Deprecation Policy**: 6 months notice before removing endpoints

**Version in URL** (future):
- `http://localhost:8000/v1/api/...`
- `http://localhost:8000/v2/api/...`

---

**Maintainer**: Infrastructure Team
**Last Updated**: 2025-10-23
**Next Review**: 2025-11-23
