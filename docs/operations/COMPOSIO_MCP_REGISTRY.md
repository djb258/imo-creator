# Composio MCP — Operations Registry

## Overview

All external software integrations (except hardwired services) route through a **single Composio MCP server** (`composio-sovereign`). This is the centralized CC-03 spoke pipe — one connection, all apps, all hubs.

**Hardwired exceptions** (connect directly, NOT through Composio):
- **Cloudflare** — direct API (D1/KV/Queues/R2 = working layer, BAR-100)
- **Neon** — direct PostgreSQL connection (vault-only, BAR-100; nightly sync via Hyperdrive, BAR-102)
- **Doppler** — direct CLI / API

Everything else goes Composio-first.

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   imo-creator (CC-01)                      │
│               composio-sovereign MCP server                │
│                                                            │
│   ┌────────────┐  ┌────────────┐  ┌────────────┐          │
│   │  Gmail     │  │  Slack     │  │  Google    │          │
│   │            │  │            │  │  Sheets    │          │
│   ├────────────┤  ├────────────┤  ├────────────┤          │
│   │  Google    │  │  GitHub    │  │  [Future]  │          │
│   │  Calendar  │  │            │  │  HubSpot   │          │
│   └────────────┘  └────────────┘  └────────────┘          │
│         │               │               │                  │
│         └───────────────┼───────────────┘                  │
│                         │                                  │
│              ┌──────────┴──────────┐                       │
│              │  composio-sovereign │                       │
│              │  (Single MCP Pipe)  │                       │
│              └──────────┬──────────┘                       │
│                         │                                  │
└─────────────────────────┼──────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
    ┌─────┴─────┐  ┌─────┴─────┐  ┌─────┴─────┐
    │ Claude    │  │ Claude    │  │ Child     │
    │ Code      │  │ Desktop   │  │ Repos     │
    │ (CLI)     │  │ (GUI)     │  │ (via key) │
    └───────────┘  └───────────┘  └───────────┘
```

### Routing Rule

| Request Type | Route |
|-------------|-------|
| DNS, CDN, Workers, D1, KV, Queues, R2 | Cloudflare (direct — working layer) |
| Working database queries | CF D1 (direct binding — BAR-100) |
| Vault database queries | Neon (direct PostgreSQL — vault-only) |
| Secrets management | Doppler (direct CLI) |
| **Everything else** | **Composio-first** |

---

## Server Identity

| Field | Value |
|-------|-------|
| Server Name | `composio-sovereign` |
| Server ID | `0179ebf7-bc3a-4b06-ba25-18901ed47fea` |
| MCP URL | `https://backend.composio.dev/v3/mcp/0179ebf7-bc3a-4b06-ba25-18901ed47fea` |
| Setup URL | `https://backend.composio.dev/composio/server/0179ebf7-bc3a-4b06-ba25-18901ed47fea` |
| CC Layer | CC-03 (Spoke Interface) |
| Snap-On ID | TOOL-007 |
| Tier | 1 (Cheap — $30/month fixed) |
| Rate Limit | 60 req/app/min |
| Provisioned | 2026-03-11 |

---

## Connected Toolkits

| Toolkit | Purpose | Auth Status | OAuth Required |
|---------|---------|-------------|----------------|
| Gmail | Email send/read/draft | Pending | Yes |
| Slack | Team messaging | Pending | Yes |
| Google Sheets | Spreadsheet read/write | Pending | Yes |
| Google Calendar | Calendar events | Pending | Yes |
| GitHub | Repo/PR/issue management | Pending | Yes |

### Planned Toolkits (Not Yet Added)

| Toolkit | Purpose | Priority |
|---------|---------|----------|
| HubSpot | CRM integration | High |
| Mailgun | Transactional email | High |
| HeyReach | LinkedIn outreach | Medium |
| Linear | Project management | Medium |

---

## MCP Configuration Locations

### Claude Code (CLI)

**File**: `~/.claude.json` (user-level)

```json
{
  "mcpServers": {
    "composio-sovereign": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://backend.composio.dev/composio/server/0179ebf7-bc3a-4b06-ba25-18901ed47fea"
      ],
      "env": {}
    }
  }
}
```

### Claude Desktop (GUI)

**File**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "composio-sovereign": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://backend.composio.dev/composio/server/0179ebf7-bc3a-4b06-ba25-18901ed47fea"
      ],
      "env": {
        "npm_config_yes": "true"
      }
    }
  }
}
```

Both use the same server ID. One pipe, two clients.

---

## Doppler Secrets

All Composio secrets live in the sovereign vault (`imo-creator` Doppler project, `dev` config).

| Vault Name | Value Pattern | Push To | Status |
|------------|--------------|---------|--------|
| `GLOBAL_COMPOSIO_API_KEY` | `ak_t-...` | outreach, sales | SET |
| `GLOBAL_COMPOSIO_API_URL` | `https://backend.composio.dev` | outreach, sales | SET |
| `GLOBAL_COMPOSIO_MCP_URL` | *(needs update — see below)* | outreach, sales | SET |

### Child-Scoped Composio Secrets

| Vault Name | Child | Status |
|------------|-------|--------|
| `OUTREACH_COMPOSIO_API_ENDPOINT` | barton-outreach-core | SET |
| `OUTREACH_COMPOSIO_BASE_URL` | barton-outreach-core | SET |
| `OUTREACH_COMPOSIO_ENTITY_ID` | barton-outreach-core | SET |
| `OUTREACH_COMPOSIO_HOSTED_URL` | barton-outreach-core | SET |

### Action Required: Update MCP URL

`GLOBAL_COMPOSIO_MCP_URL` in Doppler is currently set to `http://localhost:3001/tool` (old local dev URL). Should be updated to the hosted MCP URL:

```bash
doppler secrets set GLOBAL_COMPOSIO_MCP_URL="https://backend.composio.dev/v3/mcp/0179ebf7-bc3a-4b06-ba25-18901ed47fea" \
  --project imo-creator --config dev
```

---

## How To: Add a New Toolkit

1. Use the Composio Python SDK:
   ```bash
   pip install composio  # if not installed
   ```

2. Update the MCP server:
   ```python
   from composio import Composio

   composio = Composio(api_key="<from Doppler: GLOBAL_COMPOSIO_API_KEY>")

   # Get existing server
   server = composio.mcp.get(id="0179ebf7-bc3a-4b06-ba25-18901ed47fea")

   # Update with additional toolkits
   composio.mcp.update(
       id="0179ebf7-bc3a-4b06-ba25-18901ed47fea",
       toolkits=["gmail", "slack", "googlesheets", "googlecalendar", "github", "hubspot"]
   )
   ```

3. No config changes needed in Claude Code or Desktop — same server ID, new capabilities.

4. Authenticate the new app via Composio dashboard or OAuth flow.

5. Update this document's Connected Toolkits table.

---

## How To: Authenticate an App

After the MCP server is active (requires Claude Code/Desktop restart):

1. **Via Claude Code**: Use the Composio MCP tools — the first call to an unauthenticated app will trigger an OAuth flow URL.

2. **Via Composio Dashboard**: Go to `https://app.composio.dev` → Connected Accounts → Add Connection → Select app → Complete OAuth.

3. **Via CLI**:
   ```bash
   composio auth login  # authenticate Composio itself
   composio apps auth <app_name>  # authenticate specific app
   ```

---

## How To: Use from Child Repos

Child repos access Composio through the **GLOBAL** secrets pushed down from the sovereign vault:

1. Child receives `COMPOSIO_API_KEY` and `COMPOSIO_API_URL` via Doppler sync
2. Child's M layer (hub logic) calls Composio API with the shared key
3. Composio routes to the correct app based on the action requested
4. Response flows back through the M layer

```
Child Hub (M layer) → COMPOSIO_API_KEY → Composio API → External App
                                                      ← Response
```

The MCP server (`composio-sovereign`) is for AI agent access. Child repos doing programmatic integration use the REST API with the shared key.

---

## IMO Placement (Doctrine Reference)

Per `templates/integrations/COMPOSIO.md` (LOCKED — read only):

| Layer | MCP Role | CC Layer |
|-------|----------|----------|
| **I — Ingress** | MCP Bridge receives external data | CC-03 (Spoke) |
| **M — Middle** | Hub logic decides what to do with data | CC-02 (Hub) |
| **O — Egress** | MCP Bridge sends data to external services | CC-03 (Spoke) |

MCP is a **spoke** (CC-03). It carries data, not logic. All decisions happen in the hub's M layer.

---

## Verification

After restart, verify the MCP connection:

```bash
# In Claude Code — check MCP servers
claude mcp list

# Test a simple call (after OAuth)
# Ask Claude: "List my Gmail labels" or "What GitHub repos do I have?"
```

---

## Compliance Checklist

- [x] Composio API key in Doppler sovereign vault
- [x] MCP server created with initial toolkits (5)
- [x] Claude Code config updated (`composio-sovereign`)
- [x] Claude Desktop config updated (`composio-sovereign`)
- [x] Naming consistent across both clients
- [ ] OAuth authentication completed for each app
- [ ] `GLOBAL_COMPOSIO_MCP_URL` updated in Doppler to hosted URL
- [ ] Additional toolkits added (HubSpot, Mailgun, HeyReach, Linear)
- [ ] Child repo programmatic access verified
- [ ] Rate limit monitoring configured

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-11 |
| Last Modified | 2026-03-11 |
| Authority | Operations (Human + AI) |
| Related Files | `templates/integrations/COMPOSIO.md` (LOCKED template), `FLEET_SECRETS_MANIFEST.yaml`, `~/.claude.json`, `%APPDATA%/Claude/claude_desktop_config.json` |
