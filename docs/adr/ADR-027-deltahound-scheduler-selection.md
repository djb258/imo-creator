# ADR: DeltaHound Sub-Hub 1 Scheduler — GitHub Actions vs Cloudflare Scheduled Workers

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 3.5.0 |
| **CC Layer** | CC-03 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-027 |
| **Status** | [x] Accepted |
| **Date** | 2026-03-05 |

---

## Owning Hub (CC-02)

| Field | Value |
|-------|-------|
| **Sovereign ID** | imo-creator |
| **Hub Name** | DeltaHound (Field Monitor Snap-On Tool) |
| **Hub ID** | TOOL-012 |

---

## CC Layer Scope

| Layer | Affected | Description |
|-------|----------|-------------|
| CC-01 (Sovereign) | [ ] | |
| CC-02 (Hub) | [ ] | |
| CC-03 (Context) | [x] | Tool-level implementation decision — Scheduler sub-hub only |
| CC-04 (Process) | [ ] | |

---

## IMO Layer Scope

| Layer | Affected |
|-------|----------|
| I — Ingress | [x] |
| M — Middle | [ ] |
| O — Egress | [ ] |

---

## Constant vs Variable

| Classification | Value |
|----------------|-------|
| **This decision defines** | [x] Constant (structure/meaning) |
| **Mutability** | [x] ADR-gated |

---

## Context

DeltaHound Sub-Hub 1 (Scheduler) requires a trigger mechanism that reads from Neon `url_registry`, evaluates due-ness, and dispatches job payloads to the Orchestrator Worker endpoint. Two free options were evaluated by five LLMs across four prompt rounds (GPT-5, DeepSeek, and a partial batch). Both options satisfy the locked interface contract from FIELD_MONITOR_PRD_DOC1_v1_5.

The Scheduler sub-hub is **optional**. When a calling sub-hub in IMO-Creator has its own scheduler, this sub-hub is bypassed entirely — the caller posts trigger payloads directly to the Orchestrator Worker endpoint. The interface contract is identical either way.

Evaluation summary:

| Sub-Hub | GPT-5 | DeepSeek | Consensus |
|---------|-------|----------|-----------|
| Sub-Hub 1: Scheduler | GitHub Actions (cron) | Cloudflare Queues + Scheduled Workers | Split — both free, both satisfy contract |
| Sub-Hub 2: Fetcher | Cloudflare Workers | Cloudflare Workers | Cloudflare Workers |
| Sub-Hub 3: Parser Registry | Cloudflare KV + Workers | Cloudflare KV + Workers | Cloudflare KV |
| Sub-Hub 4: Proxy Router | Cloudflare Workers + KV | Cloudflare Workers + KV | Cloudflare Workers |
| Sub-Hub 5: Orchestrator | Cloudflare Workers | Cloudflare Workers + Durable Objects | Workers confirmed; Durable Objects V1→V2 upgrade path |
| Sub-Hub 6: Delta/State Store | Neon (PostgreSQL) | Neon (PostgreSQL) | Neon |

All sub-hubs reached consensus except Sub-Hub 1. This ADR closes that open decision.

---

## Decision

**GitHub Actions selected as the Sub-Hub 1 Scheduler implementation.**

GitHub Actions is already in the IMO-Creator stack, used fleet-wide for CI/CD. Adding Cloudflare Scheduled Workers introduces a second Cloudflare product category with no capability advantage over GitHub Actions at V1 scale. DeltaHound already has Neon outside the Cloudflare network — platform purity does not hold as a selection argument. Stack simplicity favors the tool already owned and understood.

The Orchestrator Worker endpoint receives the same trigger payload regardless of which tool fills the Scheduler role. The contract does not change. The bypass path is unaffected.

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Cloudflare Scheduled Workers | Keeps all compute on one platform, but DeltaHound already has Neon outside Cloudflare — platform purity argument does not hold. Adds a new Cloudflare product category with no capability gain at V1 scale. V1→V2 upgrade path to Cloudflare Scheduled Workers is documented and does not require contract changes. |
| Do Nothing (caller-only triggering) | Defeats the purpose of the optional Scheduler sub-hub. Caller-driven bypass already exists as a first-class path — a standalone Scheduler is still required for IMO-Creator-native deployments. |

---

## Consequences

### Enables

- Monthly cron scheduling via existing GitHub Actions infrastructure at $0/month
- `workflow_dispatch` for on-demand runs without additional tooling
- `dry_run` mode for queue inspection without dispatch
- Bypass path preserved — calling sub-hubs skip Scheduler entirely by posting directly to Orchestrator Worker endpoint

### Prevents

- Sub-millisecond scheduling precision (GitHub Actions cron is minute-granularity — acceptable at V1 monthly cadence)
- Event-driven scheduling within the Cloudflare network without additional tooling

---

## PID Impact (if CC-04 affected)

| Field | Value |
|-------|-------|
| **New PID required** | [x] No |
| **PID pattern change** | [x] No |
| **Audit trail impact** | None |

---

## Guard Rails

| Type | Value | CC Layer |
|------|-------|----------|
| Write prohibition | Scheduler does NOT write to Neon under any condition | CC-03 |
| Bypass preservation | Optional bypass path must remain functional at all times | CC-03 |
| Upgrade gate | V1→V2 upgrade to Cloudflare Scheduled Workers requires new ADR | CC-03 |

---

## Rollback

Remove `.github/workflows/field-monitor-scheduler.yml`. All DeltaHound triggering reverts to caller-driven direct POST to the Orchestrator Worker endpoint. No schema changes required. No Worker changes required. No contract changes required.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | ARCHITECTURE.md |
| PRD | FIELD_MONITOR_PRD_DOC2_v1_0.md — Sub-Hub 1 (Scheduler) |
| Related ADR | ADR-026 — DeltaHound Tool Registration (TOOL-012) |
| Work Items | field-monitor-build-adr027.json |
| PR(s) | TBD |

---

## Approval

| Role | Name | Date |
|------|------|------|
| Hub Owner (CC-02) | Dave | 2026-03-05 |
| Reviewer | — | — |
