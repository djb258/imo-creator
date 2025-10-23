# API Catalog - Complete Endpoint Reference

**Service**: IMO Creator Backend API
**Base URL (Local)**: http://localhost:8000
**Base URL (Production)**: https://imo-creator-backend.onrender.com
**Framework**: FastAPI
**Version**: 1.3.3
**Last Updated**: 2025-10-23

---

## 🌐 Base Configuration

### Server Details

```yaml
Host: 0.0.0.0 (configurable via HOST env var)
Port: 8000 (configurable via PORT env var)
Title: Blueprint API
Framework: FastAPI
ASGI Server: Uvicorn
```

### CORS Configuration

**Allowed Origins**:
- `http://localhost:7002` (configurable via ALLOW_ORIGIN env var)
- `http://localhost:3000`
- `http://127.0.0.1:3000`

**Settings**:
- Allow Credentials: `true`
- Allow Methods: `["*"]` (all methods)
- Allow Headers: `["*"]` (all headers)

**Implementation**: `ctb/sys/server/main.py:29-37`

### Middleware Stack

1. **CORSMiddleware** - Cross-origin resource sharing
   - Applied to all routes
   - Configured for local development and production

---

## 📋 Endpoint Catalog

### 1. Root / Health Endpoints

#### `GET /`
**Description**: Root endpoint with API overview
**Handler**: `root()`
**Location**: `ctb/sys/server/main.py:595-611`

**Response**:
```json
{
  "message": "IMO-Creator Backend API",
  "endpoints": [
    "/health",
    "/blueprints/{slug}/manifest",
    "/blueprints/{slug}/score",
    "/blueprints/{slug}/visuals",
    "/llm",
    "/api/ssot/save",
    "/api/subagents",
    "/api/composio/_21risk",
    "/api/composio/_2chat",
    "/api/composio/ably",
    "/api/composio/builder",
    "/api/composio/million_verifier",
    "/api/composio/million_verifier/tool"
  ]
}
```

**HEIR ID**: N/A (informational endpoint)
**Schema**: N/A

---

#### `GET /health`
**Description**: Health check endpoint
**Handler**: `health()`
**Location**: `ctb/sys/server/main.py:480-482`

**Response**:
```json
{
  "status": "ok",
  "service": "imo-creator-backend"
}
```

**Status Codes**:
- `200`: Service is healthy

**Use Cases**:
- Load balancer health checks
- Monitoring and uptime verification
- Deployment verification

**HEIR ID**: N/A (health check)
**Schema**: N/A

---

### 2. Blueprint Management Endpoints

#### `GET /blueprints/{slug}/manifest`
**Description**: Get manifest YAML for a blueprint
**Handler**: `get_manifest(slug: str)`
**Location**: `ctb/sys/server/main.py:42-50`
**Response Format**: `text/plain` (YAML)

**Path Parameters**:
- `slug` (string, required): Blueprint identifier

**Response**:
- Success: Returns manifest.yaml content as plain text
- Failure: Plain text error message

**Status Codes**:
- `200`: Manifest found and returned
- `404`: Manifest not found

**File Path**: `ctb/docs/guides/blueprints/{slug}/manifest.yaml`

**Example**:
```bash
GET /blueprints/gmail_outreach/manifest
```

**HEIR ID**: Generated from blueprint SSOT
**Schema**: Blueprint manifest YAML schema

---

#### `PUT /blueprints/{slug}/manifest`
**Description**: Update manifest YAML for a blueprint
**Handler**: `put_manifest(slug: str, body: bytes)`
**Location**: `ctb/sys/server/main.py:52-68`

**Path Parameters**:
- `slug` (string, required): Blueprint identifier

**Request Body**: Raw YAML (validated before saving)

**Response**:
```json
{
  "message": "Manifest saved for {slug}",
  "path": "ctb/docs/guides/blueprints/{slug}/manifest.yaml"
}
```

**Status Codes**:
- `200`: Manifest saved successfully
- `400`: Invalid YAML format

**Validation**: YAML syntax validation via `yaml.safe_load()`

**File Operations**:
- Creates blueprint directory if not exists
- Writes manifest.yaml to `ctb/docs/guides/blueprints/{slug}/`

**HEIR ID**: Derived from blueprint SSOT
**Schema**: Blueprint manifest YAML schema

---

#### `POST /blueprints/{slug}/score`
**Description**: Run scorer and return progress JSON
**Handler**: `score_blueprint(slug: str)`
**Location**: `ctb/sys/server/main.py:70-96`

**Path Parameters**:
- `slug` (string, required): Blueprint identifier

**Response**:
```json
{
  "score": 85,
  "total_tasks": 20,
  "completed_tasks": 17,
  "progress_percentage": 85,
  "last_updated": "2025-10-23T12:00:00Z"
}
```

**Status Codes**:
- `200`: Scoring completed successfully
- `404`: No manifest found for blueprint
- `500`: Scorer execution error

**Script Execution**: Runs `ctb/tools/blueprint_score.py {slug}`

**Timeout**: 10 seconds

**Output File**: `ctb/docs/guides/blueprints/{slug}/progress.json`

**HEIR ID**: Embedded in progress.json
**Schema**: Progress JSON schema

---

#### `POST /blueprints/{slug}/visuals`
**Description**: Generate visual diagrams for blueprint
**Handler**: `generate_visuals(slug: str)`
**Location**: `ctb/sys/server/main.py:98-132`

**Path Parameters**:
- `slug` (string, required): Blueprint identifier

**Response**:
```json
{
  "message": "Visuals generated",
  "paths": {
    "tree_overview.mmd": "ctb/docs/guides/blueprints/{slug}/tree_overview.mmd",
    "ladder_input.mmd": "ctb/docs/guides/blueprints/{slug}/ladder_input.mmd",
    "ladder_middle.mmd": "ctb/docs/guides/blueprints/{slug}/ladder_middle.mmd",
    "ladder_output.mmd": "ctb/docs/guides/blueprints/{slug}/ladder_output.mmd"
  }
}
```

**Status Codes**:
- `200`: Visuals generated successfully
- `404`: No manifest found
- `500`: Visual generator error

**Script Execution**: Runs `ctb/tools/blueprint_visual.py {slug}`

**Generated Files**:
- `tree_overview.mmd`: Overview diagram
- `ladder_input.mmd`: Input layer diagram
- `ladder_middle.mmd`: Processing layer diagram
- `ladder_output.mmd`: Output layer diagram

**Timeout**: 10 seconds

**HEIR ID**: Embedded in visual metadata
**Schema**: Mermaid diagram schema

---

### 3. LLM Integration Endpoint

#### `POST /llm`
**Description**: LLM endpoint with concurrent provider support (Anthropic Claude / OpenAI)
**Handler**: `llm_endpoint(request: Request)`
**Location**: `ctb/sys/server/main.py:134-338`

**Request Body**:
```json
{
  "provider": "anthropic|openai",
  "model": "claude-3-5-sonnet-20240620|gpt-4o-mini",
  "system": "You are a helpful assistant",
  "prompt": "Hello, how are you?",
  "json": false,
  "max_tokens": 1024
}
```

**Parameters**:
- `provider` (string, optional): "anthropic" or "openai" (auto-detected if omitted)
- `model` (string, optional): Model identifier (defaults per provider)
- `system` (string, optional): System prompt
- `prompt` (string, required): User prompt
- `json` (boolean, optional): Force JSON response mode
- `max_tokens` (integer, optional): Maximum tokens to generate (default: 1024)

**Response (Text Mode)**:
```json
{
  "text": "I'm doing well, thank you!",
  "model": "claude-3-5-sonnet-20240620",
  "provider": "anthropic"
}
```

**Response (JSON Mode)**:
```json
{
  "json": {"key": "value"},
  "model": "gpt-4o-mini",
  "provider": "openai"
}
```

**Status Codes**:
- `200`: LLM response generated successfully
- `400`: Missing required parameters
- `502`: API key not configured or provider error

**Provider Selection Algorithm**:
1. Explicit `provider` parameter
2. Infer from `model` name (claude/gpt detection)
3. Use `LLM_DEFAULT_PROVIDER` env var
4. Use whichever API key is available
5. Return helpful error if no keys configured

**Environment Variables**:
- `ANTHROPIC_API_KEY`: Anthropic Claude API key
- `OPENAI_API_KEY`: OpenAI API key
- `LLM_DEFAULT_PROVIDER`: Default provider ("anthropic" or "openai")

**Default Models**:
- Anthropic: `claude-3-5-sonnet-20240620`
- OpenAI: `gpt-4o-mini`

**Timeout**: 30 seconds per API call

**HEIR ID**: N/A (stateless LLM calls)
**Schema**: Provider-specific API schemas

---

### 4. SSOT Processing Endpoints

#### `POST /api/ssot/save`
**Description**: SSOT processing with doctrine-safe IDs
**Handler**: `save_ssot(request: Request)`
**Location**: `ctb/sys/server/main.py:418-430`

**Request Body**:
```json
{
  "ssot": {
    "meta": {
      "app_name": "imo-creator",
      "stage": "overview"
    },
    "data": {
      "key": "value"
    }
  }
}
```

**Response**:
```json
{
  "ok": true,
  "ssot": {
    "meta": {
      "app_name": "imo-creator",
      "stage": "overview",
      "_created_at_ms": 1730000000000
    },
    "doctrine": {
      "unique_id": "shq-03-imo-20251023-120000-Abc123XyZ",
      "process_id": "shq.03.imo.V1.20251023.overview",
      "schema_version": "HEIR/1.0",
      "blueprint_version_hash": "sha256hash..."
    },
    "data": {
      "key": "value"
    }
  }
}
```

**Status Codes**:
- `200`: SSOT processed successfully
- `500`: Processing error

**Processing Steps**:
1. `ensure_ids()`: Generate unique_id and process_id if missing
2. `stamp_version_hash()`: Calculate SHA-256 hash of canonicalized SSOT

**ID Generation**:
- **Unique ID Format**: `{db}-{subhive}-{app}-{timestamp}-{random16}`
  - Example: `shq-03-imo-20251023-120000-Abc123XyZ`

- **Process ID Format**: `{db}.{subhive}.{app}.V{ver}.{ymd}.{stage}`
  - Example: `shq.03.imo.V1.20251023.overview`

**Environment Variables**:
- `DOCTRINE_DB`: Database identifier (default: "shq")
- `DOCTRINE_SUBHIVE`: Subhive identifier (default: "03")
- `DOCTRINE_APP`: Application identifier (default: "imo")
- `DOCTRINE_VER`: Version (default: "1")

**Functions**:
- `generate_unique_id()`: `ctb/sys/server/main.py:353-361`
- `generate_process_id()`: `ctb/sys/server/main.py:363-372`
- `ensure_ids()`: `ctb/sys/server/main.py:374-391`
- `stamp_version_hash()`: `ctb/sys/server/main.py:407-416`

**HEIR ID**: Generated as `doctrine.unique_id`
**Schema**: SSOT HEIR/1.0 schema

---

### 5. Subagent Registry Endpoint

#### `GET /api/subagents`
**Description**: Subagent registry with garage-mcp integration
**Handler**: `get_subagents()`
**Location**: `ctb/sys/server/main.py:432-478`

**Response**:
```json
{
  "items": [
    {
      "id": "validate-ssot",
      "bay": "frontend",
      "desc": "Validate SSOT against HEIR schema"
    },
    {
      "id": "heir-check",
      "bay": "backend",
      "desc": "Run HEIR checks on blueprint"
    },
    {
      "id": "register-blueprint",
      "bay": "backend",
      "desc": "Persist + emit registration event"
    }
  ]
}
```

**Status Codes**:
- `200`: Subagent list returned

**Fallback Behavior**: Returns static list if Garage-MCP unavailable

**Environment Variables**:
- `GARAGE_MCP_URL`: Garage-MCP base URL
- `GARAGE_MCP_TOKEN`: Authentication token
- `SUBAGENT_REGISTRY_PATH`: Registry path (default: "/registry/subagents")

**Timeout**: 5 seconds

**HEIR ID**: N/A (registry endpoint)
**Schema**: Subagent registry schema

---

### 6. Composio Toolkit Endpoints

#### `GET /api/composio/_21risk`
**Description**: 21RISK toolkit information
**Handler**: `composio_21risk()`
**Location**: `ctb/sys/server/main.py:484-493`

**Response**:
```json
{
  "toolkit": "_21RISK",
  "category": "Risk Management & Compliance",
  "tools": 9,
  "status": "active",
  "description": "Risk management and compliance operations"
}
```

**HEIR ID**: N/A (toolkit metadata)
**Schema**: Composio toolkit schema

---

#### `GET /api/composio/_2chat`
**Description**: 2CHAT toolkit information
**Handler**: `composio_2chat()`
**Location**: `ctb/sys/server/main.py:495-504`

**Response**:
```json
{
  "toolkit": "_2CHAT",
  "category": "Chat & Communication",
  "tools": 5,
  "status": "active",
  "description": "WhatsApp and communication management"
}
```

**HEIR ID**: N/A (toolkit metadata)
**Schema**: Composio toolkit schema

---

#### `GET /api/composio/ably`
**Description**: ABLY toolkit information
**Handler**: `composio_ably()`
**Location**: `ctb/sys/server/main.py:506-515`

**Response**:
```json
{
  "toolkit": "ABLY",
  "category": "Real-time Messaging & Presence",
  "tools": 6,
  "status": "active",
  "description": "Real-time messaging and presence tracking"
}
```

**HEIR ID**: N/A (toolkit metadata)
**Schema**: Composio toolkit schema

---

#### `GET /api/composio/builder`
**Description**: Builder.io toolkit information
**Handler**: `composio_builder()`
**Location**: `ctb/sys/server/main.py:517-526`

**Response**:
```json
{
  "toolkit": "Builder.io",
  "category": "Visual Development & UI/UX",
  "tools": 0,
  "status": "active",
  "description": "Visual development and UI generation"
}
```

**HEIR ID**: N/A (toolkit metadata)
**Schema**: Composio toolkit schema

---

#### `GET /api/composio/million_verifier`
**Description**: Million Verifier toolkit information
**Handler**: `composio_million_verifier()`
**Location**: `ctb/sys/server/main.py:528-543`

**Response**:
```json
{
  "toolkit": "Million Verifier",
  "category": "Email Validation & Verification",
  "tools": 4,
  "status": "active",
  "description": "Email verification and validation services",
  "available_tools": [
    "VERIFY_EMAIL",
    "BATCH_VERIFY",
    "GET_CREDITS",
    "GET_RESULTS"
  ]
}
```

**HEIR ID**: N/A (toolkit metadata)
**Schema**: Composio toolkit schema

---

#### `POST /api/composio/million_verifier/tool`
**Description**: Million Verifier tool execution with HEIR/ORBT compliance
**Handler**: `million_verifier_tool_endpoint(request: Request)`
**Location**: `ctb/sys/server/main.py:545-593`

**Request Body**:
```json
{
  "tool": "VERIFY_EMAIL",
  "data": {
    "email": "test@example.com"
  },
  "unique_id": "HEIR-2025-10-MV-VERIFY-01",
  "process_id": "PRC-MV-1730000000",
  "orbt_layer": 2,
  "blueprint_version": "1.0"
}
```

**Parameters**:
- `tool` (string, required): Tool name ("VERIFY_EMAIL", "BATCH_VERIFY", "GET_CREDITS", "GET_RESULTS")
- `data` (object, required): Tool-specific data
- `unique_id` (string, required): HEIR unique identifier
- `process_id` (string, required): Process identifier
- `orbt_layer` (integer, optional): ORBT layer (default: 2)
- `blueprint_version` (string, optional): Blueprint version (default: "1.0")

**Response**:
```json
{
  "successful": true,
  "data": {
    "email": "test@example.com",
    "valid": true,
    "disposable": false,
    "result": "ok"
  },
  "heir_tracking": {
    "unique_id": "HEIR-2025-10-MV-VERIFY-01",
    "process_id": "PRC-MV-1730000000",
    "orbt_layer": 2
  }
}
```

**Status Codes**:
- `200`: Tool executed successfully
- `400`: Missing required parameters
- `500`: Tool execution error

**HEIR/ORBT Compliance**: ✅ Required for all calls

**Handler Function**: `handle_million_verifier_tool()` from `ctb/sys/tools/million_verifier.py`

**HEIR ID**: Provided in request as `unique_id`
**Schema**: Million Verifier tool schema with HEIR/ORBT wrapper

---

## 📊 Endpoint Summary Table

| Endpoint | Method | Handler | HEIR Required | Schema Link |
|----------|--------|---------|---------------|-------------|
| `/` | GET | `root()` | ❌ | N/A |
| `/health` | GET | `health()` | ❌ | N/A |
| `/blueprints/{slug}/manifest` | GET | `get_manifest()` | ⚠️ | Blueprint YAML |
| `/blueprints/{slug}/manifest` | PUT | `put_manifest()` | ⚠️ | Blueprint YAML |
| `/blueprints/{slug}/score` | POST | `score_blueprint()` | ⚠️ | Progress JSON |
| `/blueprints/{slug}/visuals` | POST | `generate_visuals()` | ⚠️ | Mermaid diagrams |
| `/llm` | POST | `llm_endpoint()` | ❌ | Provider schemas |
| `/api/ssot/save` | POST | `save_ssot()` | ✅ | SSOT HEIR/1.0 |
| `/api/subagents` | GET | `get_subagents()` | ❌ | Subagent registry |
| `/api/composio/_21risk` | GET | `composio_21risk()` | ❌ | Toolkit metadata |
| `/api/composio/_2chat` | GET | `composio_2chat()` | ❌ | Toolkit metadata |
| `/api/composio/ably` | GET | `composio_ably()` | ❌ | Toolkit metadata |
| `/api/composio/builder` | GET | `composio_builder()` | ❌ | Toolkit metadata |
| `/api/composio/million_verifier` | GET | `composio_million_verifier()` | ❌ | Toolkit metadata |
| `/api/composio/million_verifier/tool` | POST | `million_verifier_tool_endpoint()` | ✅ | Million Verifier + HEIR |

**Legend**:
- ✅ HEIR Required: Must include HEIR/ORBT payload
- ⚠️ HEIR Embedded: HEIR IDs generated/embedded in response
- ❌ No HEIR: Informational/metadata endpoints

---

## 🔒 Authentication & Security

### Current Authentication
- **Status**: No authentication currently implemented
- **CORS**: Configured for local development and specific origins

### Recommended Implementation
For production deployment, implement:
1. API key authentication via headers
2. JWT token-based authentication
3. Rate limiting per endpoint
4. Request signing for sensitive operations

### Security Headers
- CORS headers configured via middleware
- Content-Type validation on POST/PUT endpoints
- YAML/JSON validation before processing

---

## 🧪 Testing Endpoints

### Health Check
```bash
curl http://localhost:8000/health
```

### LLM Endpoint
```bash
curl -X POST http://localhost:8000/llm \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hello, how are you?",
    "provider": "anthropic",
    "max_tokens": 100
  }'
```

### SSOT Processing
```bash
curl -X POST http://localhost:8000/api/ssot/save \
  -H "Content-Type: application/json" \
  -d '{
    "ssot": {
      "meta": {"app_name": "test-app", "stage": "dev"},
      "data": {"test": "value"}
    }
  }'
```

### Million Verifier Tool
```bash
curl -X POST http://localhost:8000/api/composio/million_verifier/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "VERIFY_EMAIL",
    "data": {"email": "test@example.com"},
    "unique_id": "HEIR-2025-10-TEST-01",
    "process_id": "PRC-TEST-001",
    "orbt_layer": 2,
    "blueprint_version": "1.0"
  }'
```

---

## 📚 Related Documentation

- **Main Server**: `ctb/sys/server/main.py`
- **API README**: `ctb/sys/README.md`
- **Architecture**: `ctb/docs/architecture/architecture.mmd`
- **Dependencies**: `ctb/meta/DEPENDENCIES.md`
- **SSOT Schema**: `ctb/docs/guides/docs/HEIR_SCHEMA.md`

---

## 🔄 Maintenance Notes

### Adding New Endpoints

1. Add route handler to `ctb/sys/server/main.py`
2. Document in this API_CATALOG.md
3. Add to root endpoint (`/`) listing
4. Update tests in `ctb/sys/tests/test_api_smoke.py`
5. Add HEIR/ORBT compliance if applicable

### Deprecating Endpoints

1. Mark as deprecated in this catalog
2. Add deprecation warning to response
3. Provide migration path in documentation
4. Remove after 2 version cycles

---

**Maintainer**: CTB/SYS Team
**Review Schedule**: Monthly
**Next Review**: 2025-11-23
**Total Endpoints**: 15
**HEIR-Compliant Endpoints**: 2 (13%)
