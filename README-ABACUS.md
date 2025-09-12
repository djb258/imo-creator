# Abacus.AI × Composio MCP Integration

## Overview
This integration enables Abacus.AI to consume Composio tools via MCP (Model Context Protocol) over SSE (Server-Sent Events).

## Quick Start

### 1. Configure Environment
Update `.env` with your credentials:
```env
COMPOSIO_API_KEY=your_composio_api_key
COMPOSIO_MCP_URL=https://mcp.composio.dev/sse
HIVE_USER_UUID=6b9518ed-5771-4153-95bd-c72ce46e84ef
NEON_PG_URI=postgresql://user:pass@host:5432/db?sslmode=require  # Optional
VERCEL_TOKEN=your_vercel_token  # Optional
ABACUS_API_BASE=https://api.abacus.ai
ABACUS_API_KEY=s2_7e9f22ed4e4946c3a5aac815e5709419
```

### 2. Register with Abacus

#### Option A: Automatic Registration (if API keys are set)
```bash
npm run abacus:register
```

#### Option B: Manual Registration (Recommended)
1. Log into your **Abacus.AI account** and navigate to the **Deep Agent Homepage**
2. Click **"Configure MCP"** button, OR go to **Deep Agent Settings** → **MCP Server Config** from the top-right menu
3. In the **JSON Config settings page**, paste the contents of `config/abacus.mcp.server.json`
4. **Replace `${COMPOSIO_API_KEY}`** with your actual Composio API key (e.g., `ak_t-F0AbvfZHUZSUrqAGNn`)
5. **Replace `${MCP_DISABLE_WRITE}` and `${ALLOWED_TOOLS}`** with your desired values (or remove the guardrails section)
6. Click **Save** - Abacus will query the server to list available tools
7. Verify "composio" server appears with tools listed

### 3. Create Audit Table (Optional but Recommended)
```bash
psql $NEON_PG_URI < sql/shq_composio_call_log.sql
```

### 4. Run Smoke Tests
```bash
npm run smoke
```

Expected output:
```
📊 SMOKE TEST RESULTS
================================================================================
Tool                          Status    Request ID                    Latency
--------------------------------------------------------------------------------
NEON_EXECUTE_SQL              ✅ PASS   req_1234567_abc123            45ms
VERCEL_LIST_DEPLOYMENTS       ⏭️  SKIP   -                            -
   └─ VERCEL_TOKEN not configured
WRITE_BLOCK_TEST              ✅ PASS   req_1234568_def456            2ms
AUDIT_LOG_CHECK               ✅ PASS   -                            -
   └─ Found 2 log entries today
================================================================================

Summary: 3 passed, 0 failed, 1 skipped

✅ Abacus → Composio wired; kill switch = disable Composio server or strip tools.
```

## Architecture

### Core Components

1. **`src/composio/runTool.ts`**
   - Main execution function with guardrails
   - Timeout enforcement (15s default)
   - Retry logic with exponential backoff
   - Audit logging to PostgreSQL
   - Kill switches (MCP_DISABLE_WRITE, ALLOWED_TOOLS)

2. **`config/abacus.mcp.server.json`**
   - MCP server configuration for Abacus
   - SSE connection details
   - Tool capabilities declaration

3. **`sql/shq_composio_call_log.sql`**
   - Audit table DDL
   - Tracks all tool executions with request_id
   - User UUID tracking (6b9518ed-5771-4153-95bd-c72ce46e84ef)

## Guardrails

### 1. Write Operation Blocking
Set `MCP_DISABLE_WRITE=true` to block all write operations:
```bash
MCP_DISABLE_WRITE=true npm run smoke
```

### 2. Tool Whitelisting
Restrict to specific tools via `ALLOWED_TOOLS`:
```bash
ALLOWED_TOOLS=NEON_EXECUTE_SQL,VERCEL_LIST_DEPLOYMENTS npm run smoke
```

### 3. ESLint Rules
Prevent direct HTTP calls outside `src/composio/*`:
```bash
npm run abacus:lint
```

## Monitoring

### Check Today's Activity
```sql
SELECT tool, status, request_id, latency_ms, error_message
FROM shq.composio_call_log 
WHERE user_uuid = '6b9518ed-5771-4153-95bd-c72ce46e84ef'
  AND ts >= CURRENT_DATE
ORDER BY ts DESC;
```

### Tool Usage Statistics
```sql
SELECT tool, 
       COUNT(*) as total_calls,
       COUNT(CASE WHEN status = 'success' THEN 1 END) as successful,
       AVG(latency_ms) as avg_latency_ms
FROM shq.composio_call_log
WHERE ts >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY tool
ORDER BY total_calls DESC;
```

## CI/CD

GitHub Actions workflow (`.github/workflows/abacus-mcp.yml`) runs on push/PR:
1. ESLint guardrail checks
2. Smoke tests (with write operations disabled)
3. Audit log verification
4. Automatic Abacus registration (on main branch)

## Troubleshooting

### Issue: "Tool not found" errors
**Solution**: Ensure Composio API key is valid and the tool exists in Composio

### Issue: Audit logs not appearing
**Solution**: 
1. Check NEON_PG_URI is correct
2. Run DDL: `psql $NEON_PG_URI < sql/shq_composio_call_log.sql`
3. Verify with: `npm run smoke`

### Issue: Write operations not blocked
**Solution**: Ensure `MCP_DISABLE_WRITE=true` is set

### Issue: Abacus doesn't list tools
**Solution**:
1. Re-run: `npm run abacus:register`
2. Or manually import `config/abacus.mcp.server.json` in Abacus UI
3. Verify Composio API key is valid

## Emergency Kill Switch

To immediately disable all Composio operations:

### Option 1: Disable in Abacus
Go to **Abacus → Deep Agent → MCP Servers** and disable/remove "composio"

### Option 2: Environment Variables
```bash
# Block all write operations
MCP_DISABLE_WRITE=true

# Restrict to empty tool list (effectively disables all)
ALLOWED_TOOLS=

# Or restrict to specific read-only tools
ALLOWED_TOOLS=NEON_EXECUTE_SQL
```

## Done Criteria ✅

- [x] Abacus lists the "composio" MCP server and its tools
- [x] `shq.composio_call_log` has today's rows with UUID 6b9518ed-5771-4153-95bd-c72ce46e84ef
- [x] `npm run smoke` exits 0
- [x] Message: "Abacus → Composio wired; kill switch = disable Composio server or strip tools"

## Step-by-Step Abacus Setup

### Quick Setup (Copy & Paste Ready)

1. **Copy this JSON** (from `config/abacus.mcp.ready.json`):
```json
{
  "composio": {
    "description": "Composio MCP Server - Universal tool integration via SSE",
    "type": "sse", 
    "url": "https://mcp.composio.dev/sse",
    "headers": {
      "x-api-key": "ak_t-F0AbvfZHUZSUrqAGNn",
      "x-entity-id": "6b9518ed-5771-4153-95bd-c72ce46e84ef"
    },
    "capabilities": {
      "tools": true,
      "resources": false,
      "prompts": false
    },
    "config": {
      "timeout_ms": 15000,
      "max_retries": 2,
      "retry_delay_ms": 1000
    }
  }
}
```

2. **In Abacus**: Go to **Deep Agent Homepage** → **Configure MCP**
3. **Paste** the JSON into the config page
4. **Save** - Abacus will connect and list available Composio tools
5. **Test** in Deep Agent chat: *"List my Vercel deployments using Composio tools"*

### Verification
- ✅ "composio" server should appear in MCP Server Config
- ✅ Tools should be listed (up to 50 tools supported)
- ✅ Deep Agent can call Composio tools in chat
- ✅ Run `npm run smoke` locally to verify integration

## Support

- **Composio Docs**: https://docs.composio.dev/mcp
- **Abacus Support**: https://abacus.ai/support
- **Issue Tracking**: Create issue in this repository