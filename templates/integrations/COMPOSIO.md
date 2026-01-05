# MCP Integration Template

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | |
| **CC Layer** | CC-03 (Spoke Interface) |

---

## Hub Identity (CC-02)

| Field | Value |
|-------|-------|
| **Sovereign ID** | |
| **Hub Name** | |
| **Hub ID** | |
| **MCP Provider** | |

---

## Overview

This template defines the Model Context Protocol (MCP) spoke interface for external service integration.

MCP operates as a CC-03 spoke — it carries data, not logic.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Hub (M Layer) │    │   MCP Bridge    │    │   Composio MCP  │
│   Logic/State   │───▶│   (Ingress)     │───▶│   Server        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │  External APIs  │
                                              │  (Egress)       │
                                              └─────────────────┘
```

---

## Connected Services (CC-03 Interfaces)

| Service | Purpose | Direction | Status | CC Layer |
|---------|---------|-----------|--------|----------|
| | | I (Ingress) | [ ] Connected | CC-03 |
| | | O (Egress) | [ ] Connected | CC-03 |

**Note:** Define services based on your hub's specific integrations.

---

## Environment Configuration

All MCP integrations require environment variables.
**Use centralized secrets management.**

```bash
# MCP Integration (Required)
MCP_API_KEY=
MCP_API_URL=

# LLM Providers (As needed)
<PROVIDER>_API_KEY=
LLM_DEFAULT_PROVIDER=

# MCP Server (Local development)
MCP_URL=http://localhost:<port>
MCP_BEARER_TOKEN=

# Hub Identity (CC-02)
HUB_ID=
```

**Note:** Define environment variables based on your specific MCP provider.

---

## Process ID Generation (CC-04)

All MCP operations MUST generate CC-compliant Process IDs:

```javascript
function generateProcessId(hubId) {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${hubId}-${timestamp}-${random}`;
}
```

Process IDs are minted at CC-04 and are never reused.

---

## IMO Placement

| Layer | MCP Role | CC Layer |
|-------|----------|----------|
| **I — Ingress** | MCP Bridge receives external data | CC-03 (Spoke) |
| **M — Middle** | Hub logic decides what to do with data | CC-02 (Hub) |
| **O — Egress** | MCP Bridge sends data to external services | CC-03 (Spoke) |

MCP is an **interface** (spoke), not a hub. It carries data, not logic.

---

## Security Requirements

- [ ] API keys stored in Doppler (never in code)
- [ ] Different keys for dev/staging/prod
- [ ] Keys rotated on schedule
- [ ] Usage monitored and logged
- [ ] CORS properly configured
- [ ] Bearer tokens for local MCP auth

---

## Testing

```bash
# Test MCP connectivity
curl -X GET <MCP_API_URL>/health \
  -H "x-api-key: $MCP_API_KEY"

# Test local MCP server
curl -X POST http://localhost:<port>/mcp/test \
  -H "Authorization: Bearer $MCP_BEARER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "ping"}'
```

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | CANONICAL_ARCHITECTURE_DOCTRINE.md |
| PRD | |
| ADR | |
| Work Item | |
