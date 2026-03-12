# ADR: UI/UX Pro Max Tool Registration (TOOL-014)

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 2.1.0 |
| **CC Layer** | CC-01 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-030 |
| **Status** | [x] Accepted |
| **Date** | 2026-03-12 |

---

## Owning Hub (CC-02)

| Field | Value |
|-------|-------|
| **Sovereign ID** | CC-01 |
| **Hub Name** | imo-creator (Sovereign) |
| **Hub ID** | Garage |

---

## CC Layer Scope

| Layer | Affected | Description |
|-------|----------|-------------|
| CC-01 (Sovereign) | [x] | SNAP_ON_TOOLBOX.yaml updated |
| CC-02 (Hub) | [ ] | |
| CC-03 (Context) | [ ] | |
| CC-04 (Process) | [ ] | |

---

## IMO Layer Scope

| Layer | Affected |
|-------|----------|
| I — Ingress | [ ] |
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

When building frontends, design decisions (color palettes, typography, layout patterns, UX guidelines) are typically made by a human designer. Without designer input, AI agents guess — producing inconsistent, amateur-looking output.

UI/UX Pro Max (nextlevelbuilder/ui-ux-pro-max-skill) is a Claude Code skill that provides a deterministic design intelligence database: 67+ UI styles, 161 color palettes, 57 font pairings, 99 UX guidelines, 25 chart type recommendations, and 161 industry-specific reasoning rules. Instead of guessing, the agent looks up proven design patterns and applies them.

This aligns with Tool Doctrine: deterministic first, LLM as tail only. The skill provides structured lookup tables — the agent queries the database rather than generating design choices from scratch. Design decisions become deterministic lookups, not LLM generation.

---

## Decision

Register UI/UX Pro Max as **TOOL-014** in SNAP_ON_TOOLBOX.yaml at **Tier 0** (free, open-source skill).

**Evaluation order compliance:**
1. Not on banned list
2. Tier 0 — open-source, no API key, no cost
3. No existing tool in the registry covers design system intelligence
4. Fills a gap: non-designers get designer-grade output through deterministic lookup

**Usage doctrine:**
- Activates alongside any frontend build task
- Provides design system brain — color, typography, UX patterns
- Claude queries the database instead of guessing design choices

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Human designer for every UI | Not available for every task; slows iteration |
| LLM-generated design choices | Violates determinism-first doctrine; inconsistent results |
| Hardcoded design tokens only | Too rigid; doesn't cover industry-specific patterns |
| Do Nothing | Non-designers produce inconsistent, amateur UI output |

---

## Consequences

### Enables

- Deterministic design decisions from proven palettes and pairings
- Non-designers get designer-grade output
- Industry-specific design reasoning (SaaS, fintech, healthcare, etc.)
- Consistent design language across all frontend builds

### Prevents

- LLM-guessed color/typography choices (inconsistent)
- Ad-hoc design decisions without reference data
- Amateur-looking UI from AI-generated frontends

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
| Rate Limit | N/A — local skill, no API calls | CC-01 |
| Timeout | N/A — lookup-based, near-instant | CC-01 |
| Kill Switch | N/A — passive reference database | CC-01 |

---

## Rollback

Remove TOOL-014 entry from SNAP_ON_TOOLBOX.yaml. No downstream dependencies — skill is optional and additive.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | ARCHITECTURE.md v2.1.0 |
| Tool Registry | SNAP_ON_TOOLBOX.yaml |
| Source | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill |
| Work Items | Human-requested registration |
| PR(s) | This commit |

---

## Approval

| Role | Name | Date |
|------|------|------|
| Hub Owner (CC-01) | Human (Sovereign) | 2026-03-12 |
| Reviewer | Claude Opus 4.6 | 2026-03-12 |
