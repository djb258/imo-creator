# ADR: Register DeltaHound in SNAP_ON_TOOLBOX.yaml

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 3.5.0 |
| **CC Layer** | CC-01 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-026 |
| **Status** | [ ] Proposed / [x] Accepted / [ ] Superseded / [ ] Deprecated |
| **Date** | 2026-03-05 |

---

## Owning Hub (CC-02)

| Field | Value |
|-------|-------|
| **Sovereign ID** | CC-01 |
| **Hub Name** | imo-creator (Sovereign) |
| **Hub ID** | imo-creator |

---

## CC Layer Scope

| Layer | Affected | Description |
|-------|----------|-------------|
| CC-01 (Sovereign) | [x] | Modifies SNAP_ON_TOOLBOX.yaml (LOCKED constitutional file) |
| CC-02 (Hub) | [ ] | |
| CC-03 (Context) | [ ] | |
| CC-04 (Process) | [ ] | |

---

## IMO Layer Scope

| Layer | Affected |
|-------|----------|
| I — Ingress | [x] |
| M — Middle | [x] |
| O — Egress | [ ] |

---

## Constant vs Variable

| Classification | Value |
|----------------|-------|
| **This decision defines** | [x] Constant (structure/meaning) |
| **Mutability** | [x] ADR-gated |

---

## Context

The fleet now has a homebrew field-monitoring system: a five-Worker Cloudflare pipeline (Field Monitor) that watches structured fields on web pages and emits delta signals when values change. It uses no vendor APIs, no API keys, and runs on Cloudflare Workers free tier + Neon free tier.

This system is **generic infrastructure** — any child repo can consume its signals. It is not domain-specific. Therefore it belongs in the parent SNAP_ON_TOOLBOX.yaml as a Tier 0 generic tool, not in a child repo's REPO_DOMAIN_SPEC.md.

SNAP_ON_TOOLBOX.yaml is a LOCKED file. Registration requires this ADR.

---

## Decision

Register **DeltaHound** as TOOL-012 in `templates/SNAP_ON_TOOLBOX.yaml`, Tier 0, with the following entry:

```yaml
  DeltaHound:
    tool_id: "TOOL-012"
    tier: 0
    status: "active"
    software:
      primary: "Cloudflare Workers + Neon"
      dependencies: []
      vendor: null
      requires_api_key: false
    purpose:
      summary: "Homebrew field-change detection engine — monitors structured fields on any web page, emits delta signals on change"
      what_it_does:
        - "HTTP fetch of target URLs on schedule via url_registry"
        - "Parser extraction of declared fields"
        - "Delta comparison against last-known values"
        - "Confirmation gate (re-fetch before signal)"
        - "Signal emission to consuming repos"
      what_it_does_NOT_do:
        - "Scrape entire pages (targeted field extraction only)"
        - "Recursive crawling (single-page, declared-field only)"
        - "Real-time streaming (scheduled polling)"
    throttle:
      rate_limits:
        - {scope: "per_minute", limit: 60}
        - {scope: "per_day", limit: 10000}
      cost: {model: "free", estimated_cost_per_call: 0.00, notes: "Cloudflare Workers free tier + Neon free tier"}
      backoff: {strategy: "exponential", initial_delay_ms: 1000, max_retries: 3}
    guardrails:
      kill_switch: {trigger: "target_domain_blocks_or_rate_limits", action: "circuit_break_1h"}
      data_quality: {confirmation_required: true, confirmation_delay_minutes: 5}
    accuracy: "95%"
    accuracy_notes: "Depends on parser selector stability; DOM changes may cause false deltas"
```

**Why TOOL-012**: Follows sequential numbering after TOOL-011 (RetellCaller). Generic tool IDs use `TOOL-NNN`; the `TOOL-[DOMAIN]-NNN` format is reserved for child-repo domain-specific tools.

**Why Tier 0**: Zero vendor cost. Zero API keys. Runs entirely on free-tier infrastructure already in the fleet.

**Why generic (parent registry)**: Any child repo can point DeltaHound at URLs relevant to its domain. The tool is domain-agnostic; only the url_registry entries are domain-specific. Consumers are declared per child repo in their REPO_DOMAIN_SPEC.md.

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Register in child repos only | DeltaHound is domain-agnostic infrastructure. Duplicating registration across child repos violates DRY and creates drift. |
| Use a vendor change-detection service (Visualping, ChangeTower) | Cost; homebrew already built; vendor lock-in; surgical doctrine says free first. |
| Do Nothing | Tool exists but is invisible to the governance layer. Child repos cannot reference it. Doctrine violation. |

---

## Consequences

### Enables

- Child repos can declare DeltaHound consumers in REPO_DOMAIN_SPEC.md
- company-lifecycle: carrier appointment changes, license status changes
- outreach: company growth signals (employee count, job postings)
- sales: competitor pricing changes
- Toolbox evaluation order recognizes DeltaHound at Step 2 (Tier 0 check)
- Kill switch and throttle governance apply uniformly

### Prevents

- Ungoverned use of the field monitor pipeline
- Child repos building redundant change-detection tools
- Drift between actual infrastructure and the tool registry

---

## PID Impact (if CC-04 affected)

| Field | Value |
|-------|-------|
| **New PID required** | [ ] Yes / [x] No |
| **PID pattern change** | [ ] Yes / [x] No |
| **Audit trail impact** | None — registration only |

---

## Guard Rails

| Type | Value | CC Layer |
|------|-------|----------|
| Rate Limit | 60/min, 10,000/day | CC-01 |
| Timeout | Exponential backoff, 1s initial, 3 retries | CC-01 |
| Kill Switch | Circuit break 1h on target domain block/rate-limit | CC-01 |

---

## Rollback

Remove the DeltaHound entry from SNAP_ON_TOOLBOX.yaml. Update version. No downstream schema impact — registration only.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | ARCHITECTURE.md, TOOLS.md, SNAP_ON_TOOLBOX.yaml |
| PRD | — |
| Work Items | Field Monitor five-Worker Cloudflare pipeline |
| PR(s) | TBD |

---

## Approval

| Role | Name | Date |
|------|------|------|
| Hub Owner (CC-02) | | |
| Reviewer | | |
