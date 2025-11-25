---
title: "10,000ft - UI/UX"
aliases: [ui, ux, 10k, user-interface]
tags:
  - altitude/10k
  - doctrine/master
created: 2025-11-25
updated: 2025-11-25
---

# 10,000ft - UI/UX

> **Altitude**: Interface / What users interact with
> **Audience**: End users, product designers, QA

---

## User Touchpoints

### 1. Web Dashboard (Vercel)

**URL**: Deployed on Vercel (edge)

| Page | Purpose | Actions |
|------|---------|---------|
| `/` | Landing page | Learn about IMO-Creator |
| `/scaffold` | Create new repo | Select template, configure, generate |
| `/validate` | Validate blueprint | Upload manifest, view results |
| `/diagrams` | View generated diagrams | Browse, download SVG/Mermaid |
| `/health` | System status | View service health |

### 2. CLI Tool

**Install**: `pip install imo-creator`

```bash
# Scaffold new repo
imo scaffold my-app --template=default

# Validate existing repo
imo validate ./my-repo

# Audit doctrine compliance
imo audit ./my-repo

# Generate diagrams
imo diagram ./my-repo --format=svg

# Check health
imo health
```

### 3. API Endpoints

**Base**: Render backend

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/scaffold` | POST | Create repo |
| `/api/validate` | POST | Validate manifest |
| `/api/diagrams` | POST | Generate diagrams |
| `/api/composio/integrate` | POST | MCP integration |

### 4. GitHub Actions

Automated workflows users inherit:

| Workflow | Trigger | Output |
|----------|---------|--------|
| `git-ingest.yml` | Weekly/manual | Search indexes |
| `diagram.yml` | Push/manual | SVG diagrams |
| `summary.yml` | Daily/manual | Narrative summaries |

---

## User Flows

### New Repo Flow

```
User                    CLI/Web                 Backend
  │                        │                       │
  ├─ Select template ─────▶│                       │
  │                        ├─ Validate ───────────▶│
  │                        │◀─ OK ─────────────────┤
  ├─ Enter config ────────▶│                       │
  │                        ├─ Scaffold ───────────▶│
  │                        │                       ├─ Create files
  │                        │                       ├─ Git init
  │                        │                       ├─ Push to GitHub
  │                        │◀─ Repo URL ───────────┤
  │◀─ Success + URL ───────┤                       │
```

### Validation Flow

```
User                    CLI/Web                 Backend
  │                        │                       │
  ├─ Upload manifest ─────▶│                       │
  │                        ├─ Parse ──────────────▶│
  │                        │                       ├─ Schema check
  │                        │                       ├─ HEIR check
  │                        │                       ├─ CTB check
  │                        │◀─ Report ─────────────┤
  │◀─ Pass/Fail + Details ─┤                       │
```

---

## Error States

| Error | User Message | Recovery |
|-------|--------------|----------|
| Template not found | "Template 'x' doesn't exist" | List available templates |
| Validation failed | "Manifest has X errors" | Show error details |
| Auth failed | "Invalid API key" | Prompt for key |
| Rate limited | "Too many requests, retry in Xs" | Show countdown |
| Service down | "Service temporarily unavailable" | Show health status |

---

## Accessibility

- Web: WCAG 2.1 AA compliant
- CLI: Screen reader compatible
- Docs: Plain language, code examples

---

## Related Docs

- [vercel.json](../../vercel.json) - Web deployment config
- [20-ctb-ui.md](../20-ctb-ui.md) - UI layer details
- [QUICKSTART.md](../QUICKSTART.md) - Getting started guide
