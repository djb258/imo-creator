# BAR-104 — Architecture Shift Audit Report

**Date**: 2026-03-11
**Scope**: Full fleet sweep — all repos, all docs, all configs
**Trigger**: BAR-100 (CF-primary architecture), BAR-102 (Hyperdrive vault-sync)
**Author**: AI (Claude Code) + Human review required for LOCKED files

---

## Architecture Shift Summary

| Layer | Before (Pre-BAR-100) | After (BAR-100) |
|-------|---------------------|-----------------|
| Working DB | Neon PostgreSQL (hot-path) | **CF D1** (edge SQLite) |
| Hot reads | Neon via Hyperdrive | **CF KV** (edge key-value) |
| Message queues | Neon tables / pg_notify | **CF Queues** (async) |
| File storage | Various | **CF R2** (zero egress) |
| Vault / Archive | Neon (also working) | **Neon** (vault-only) |
| Vault sync | N/A (Neon was both) | **Hyperdrive** (nightly, BAR-102) |
| UI platform | Lovable.dev | **Figma UI** |
| Compute | Supabase Edge Functions | **CF Workers** |
| Orchestration | n8n @ Hostinger | **CF Workers + Queues** |
| Email tooling | Instantly / HeyReach | **Mailgun** (HeyReach TBD) |

---

## Retired Platforms (REMOVE all references)

| Platform | Replacement | Status |
|----------|-------------|--------|
| Lovable.dev | Figma UI | **RETIRED** |
| Supabase | CF D1/KV/Workers | **RETIRED** |
| Vercel | CF Workers/Pages | **RETIRED** |
| Hostinger (n8n VPS) | CF Workers + Queues | **RETIRED** |
| Instantly.ai | Mailgun | **RETIRED** |

---

## Files Updated (AI-applied)

### imo-creator (Sovereign)

| File | Change |
|------|--------|
| `docs/operations/CF_INFRASTRUCTURE_REGISTRY.yaml` | Added 4 D1 hot mirrors, updated Hyperdrive section header to "Vault Sync Pipes", updated total to 20 |
| `skills/neon/SKILL.md` | Reframed as vault-only, updated Fleet Reference, decision matrix |
| `skills/cloudflare/SKILL.md` | Updated decision matrix, KV consistency note, Neon connection section |
| `docs/operations/DOPPLER_REGISTRY.md` | Renamed "Neon Database Registry" → "Neon Vault Registry", added Role column |
| `docs/operations/COMPOSIO_MCP_REGISTRY.md` | Split routing: working queries → D1, vault queries → Neon |
| `templates/config/repo_organization_standard.yaml` | Updated database section: working=D1, vault=Neon |
| `dashboard/src/data/processes.ts` | All hub services updated from "Neon PostgreSQL" → "CF D1/KV (working) + Neon (vault)" |
| `IMO_CONTROL.json` | platform_target: lovable.dev → figma-ui |
| `commands/claude-code-setup.md` | Updated database detection, MCP routing table |

### svgagency-api (Worker)

| File | Change |
|------|--------|
| `src/index.ts` | Added D1_SOVEREIGN, D1_SPINE, D1_OUTREACH_OPS, D1_STORAGE to Env; uncommented R2_FILES; updated comments |

---

## LOCKED FILES — HUMAN REVIEW REQUIRED

These files are LOCKED per CLAUDE.md. AI cannot modify them. They contain stale references that need ADR-driven updates:

### SNAP_ON_TOOLBOX.yaml (CONSTITUTIONAL)

| Line | Current | Should Be |
|------|---------|-----------|
| 427 | `ui: {name: "Lovable.dev", role: "UI + Edge Functions"}` | `ui: {name: "Figma UI", role: "Design + Prototyping"}` |
| 428 | `compute: {name: "Supabase Edge Functions", role: "Fast serverless compute"}` | `compute: {name: "CF Workers", role: "Edge compute (BAR-100)"}` |
| 430 | `orchestration: {name: "n8n", role: "Self-hosted @ Hostinger"}` | `orchestration: {name: "CF Workers + Queues", role: "Native orchestration"}` |

### CONSTITUTION.md

| Line | Current | Should Be |
|------|---------|-----------|
| 15 | `Enforcement mechanisms — Pre-commit, CI, Claude Code, Lovable.dev` | `Enforcement mechanisms — Pre-commit, CI, Claude Code, Figma UI` |

### templates/integrations/hostinger/ (entire directory)

Should be archived or removed. Hostinger is retired.

### templates/TEMPLATES_MANIFEST.yaml

| Lines | Current | Action |
|-------|---------|--------|
| 605-610 | Hostinger integration entries | Archive or remove |

---

## Child Repo Audit Summary

### barton-outreach-core (~45 files need update)

**Critical**:
- `CLAUDE.md` — lines 8, 706, 948: Neon described as working database
- `.claude/settings.local.json` — HARDCODED CREDENTIALS (ep-ancient-waterfall + password)
- `.github/workflows/doctrine-audit.yml` — Neon Authority Declaration enforced in CI
- All 6 hub `SCHEMA.md` files — `AUTHORITY: Neon PostgreSQL (Production)`
- `templates/SNAP_ON_TOOLBOX.yaml` — Lovable.dev, Hostinger (LOCKED in child — needs sync from imo-creator)
- `docs/prd/PRD_OUTREACH_SPOKE.md` — Instantly/HeyReach references

### company-lifecycle-cl (~60 files need update)

**Critical**:
- `CLAUDE.md` — line 79: Database described as Neon
- `neon/*.js` and `pipeline/*.js` — 30+ files with HARDCODED CREDENTIALS
- `doppler.yaml` — lines 16-24: Neon as primary DB
- All `docs/schema/*.md` files — "Source of Truth: Neon PostgreSQL"
- `heir.doctrine.yaml` — Neon listed as primary DB
- `CONSTITUTION.md` — Lovable.dev enforcement reference
- `skills/neon/` and `skills/lovable/` — stale skills

### ctb-sales-navigator (~50 files need update)

**Critical**:
- `skills/sales-neon/SKILL.md` — Explicitly says "No Cloudflare Workers, D1, or Hyperdrive"
- `skills/sales-lovable/SKILL.md` — Entire Lovable skill needs archiving
- `DOCTRINE.md` — Lovable.dev as Presentation Layer
- `heir.doctrine.yaml` — Lovable UI as service
- Column registry — BIGSERIAL type needs D1 equivalent

### client (~55 files need update)

**Critical**:
- 5 scripts with HARDCODED CREDENTIALS (ep-frosty-brook + password)
- `src/ui/barton-lib/agents/database-agent.ts` — HARDCODED CREDENTIAL + Neon-wired agent
- `CLAUDE.md` — Neon described as output target
- `skills/client-neon/SKILL.md` — Entire skill describes Neon as sole persistence
- `config/mcp-servers.json` — Instantly.ai integration

### barton-storage (~75 files need update)

**Critical**:
- `.mcp.json` — HARDCODED CREDENTIAL (ep-rapid-dream + password)
- `backend/db/schema.sql` — All SERIAL PRIMARY KEY (PG-specific)
- `ctb/structure/CTB_Backbone.md` — Frontend: Lovable.dev, Database: Neon
- Multiple Supabase Edge Functions importing `postgres` directly
- `supabase/config.toml` — "Claude thinks. Neon remembers. Lovable orchestrates."

---

## Security Alerts — Hardcoded Credentials

| Repo | File | Hostname | Severity |
|------|------|----------|----------|
| imo-creator | `.claude/settings.local.json` | ep-ancient-waterfall | HIGH |
| barton-outreach-core | `.claude/settings.local.json` | ep-ancient-waterfall | HIGH |
| company-lifecycle-cl | `neon/*.js`, `pipeline/*.js` (30+ files) | ep-ancient-waterfall | CRITICAL |
| client | `scripts/*.js` (4 files), `database-agent.ts` | ep-frosty-brook, ep-ancient-waterfall | CRITICAL |
| barton-storage | `.mcp.json` | ep-rapid-dream | HIGH |

**Action**: All hardcoded credentials must be replaced with Doppler environment variables. Rotate all exposed passwords immediately.

---

## Document Control

| Field | Value |
|-------|-------|
| BAR Reference | BAR-104 |
| Created | 2026-03-11 |
| Scope | Full fleet |
| Status | IN PROGRESS — child repo updates pending |
| Next Step | Apply CLAUDE.md + heir.doctrine.yaml updates to each child repo |
