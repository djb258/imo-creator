# CLAUDE.md — UT (Ultimate Tool)

## IDENTITY

| Field | Value |
|-------|-------|
| Hub ID | `ut` |
| Hub Name | Ultimate Tool |
| Authority | CC-02 (Hub) |
| Parent | imo-creator (CC-01 Sovereign) |
| CTB Placement | `app/garage/ut/` |
| Purpose | Sovereign Cloudflare platform with 25 sub-hubs for browser automation, knowledge ingestion, and data processing |

---

## GEOMETRY

| Layer | Definition |
|-------|------------|
| Hub | Claude Code — all logic, all decisions, all orchestration |
| Rim | Cloudflare Worker REST API (Hono) — ingress/egress surface only |

---

## IMO TOPOLOGY

| Layer | Rule |
|-------|------|
| Ingress (I) | Schema validation only. No decisions. No logic. |
| Middle (M) | All logic, all decisions, all state, all tools. |
| Egress (O) | Read-only views only. No logic. No mutations. |

---

## SUB-HUBS

### External (01-05) — Browser Layer

External sub-hubs cannot run inside Cloudflare. They require a browser or external runtime.

| Number | Name | Driver | Category |
|--------|------|--------|----------|
| 01 | browser-control | Puppeteer / Playwright | External |
| 02 | crawl-orchestration | Crawl scheduler | External |
| 03 | knowledge-ingestion | Content extractor | External |
| 04 | auth-management | Session / cookie manager | External |
| 05 | fallback-scraping | Raw HTTP fallback | External |

### CF Native (06-25) — Cloudflare Services

CF Native sub-hubs have zero external dependencies. They run entirely within Cloudflare. Sub-hubs 16-19 implement the 7-gate funnel workflow, owned by 19-orchestrator.

| Number | Name | Driver | Category |
|--------|------|--------|----------|
| 06 | api-layer | Hono REST API | CF Native |
| 07 | vector-brain | Vectorize | CF Native |
| 08 | doc-storage | R2 | CF Native |
| 09 | llm-router | Workers AI | CF Native |
| 10 | runtime | Workers / DO | CF Native |
| 11 | structured-data | D1 | CF Native |
| 12 | embedding | Workers AI | CF Native |
| 13 | error-queue | Queues | CF Native |
| 14 | observability | Logpush / Analytics | CF Native |
| 15 | scheduling | Cron Triggers | CF Native |
| 16 | fetcher | HTTP fetch | CF Native |
| 17 | parser-registry | Parser selection | CF Native |
| 18 | proxy-router | Proxy rotation | CF Native |
| 19 | orchestrator | Funnel orchestrator | CF Native |
| 20 | cache-layer | Workers KV | CF Native |
| 21 | dedup-engine | D1 + Workers | CF Native |
| 22 | webhook-gateway | Workers + Hono | CF Native |
| 23 | rate-limiter | Workers KV + Durable Objects | CF Native |
| 24 | content-transformer | Workers | CF Native |
| 25 | access-control | Workers + D1 | CF Native |

---

## RULES

| Rule | Violation |
|------|-----------|
| No logic in spokes | Doctrine violation |
| No sideways calls between sub-hubs | Doctrine violation |
| Each sub-hub is sovereign — knows nothing about the others | Doctrine violation |
| External sub-hubs (01-05) cannot run inside Cloudflare | Doctrine violation |
| CF Native sub-hubs (06-25) have zero external dependencies | Doctrine violation |
| LLM is tail, not spine | Doctrine violation |
| Deterministic solution evaluated first | Doctrine violation |
| ADR required for every tool | PR rejected |

---

## CANONICAL REFERENCE

| Template | imo-creator Path | Version |
|----------|------------------|---------|
| Architecture | law/doctrine/ARCHITECTURE.md | 2.1.0 |
| Tools | law/integrations/TOOLS.md | 1.1.0 |
| OSAM | law/semantic/OSAM.md | 1.1.0 |
| PRD | fleet/car-template/docs/PRD_HUB.md | 1.0.0 |
| ADR | fleet/adr-templates/ADR.md | 1.0.0 |
| Checklist | fleet/checklists/HUB_COMPLIANCE.md | 1.0.0 |

---

## LOCKED FILES (READ-ONLY)

The following files are law within UT. Claude Code may READ them. Claude Code may NEVER modify them.

| File | Purpose |
|------|---------|
| `app/garage/ut/README.md` | UT overview and sub-hub registry |
| `app/garage/ut/IMO_CONTROL.json` | UT control contract — hub identity, topology, invariants |

Sub-hub contract files (when created) are also locked:

| Pattern | Purpose |
|---------|---------|
| `app/garage/ut/sub-hubs/{NN}-{name}/contract.json` | Sub-hub identity and boundary contract |
| `app/garage/ut/sub-hubs/{NN}-{name}/CLAUDE.md` | Sub-hub doctrine file |

---

## WHAT CLAUDE CODE CAN DO IN THIS HUB

| Action | Permitted |
|--------|-----------|
| Read locked files | YES |
| Read sub-hub contracts | YES |
| Create new sub-hub implementation files (with human approval) | YES |
| Create ADR drafts (for human review) | YES |
| Modify locked files | NO |
| Add sub-hubs beyond the declared 25 | NO |
| Allow sideways calls between sub-hubs | NO |
| Place logic in Ingress or Egress | NO |
| Use LLM as primary decision maker | NO |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Last Modified | 2026-03-08 |
| Status | ACTIVE |
| Authority | Human only |
