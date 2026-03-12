# ADR: shadcn/ui MCP Tool Registration (TOOL-016)

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 2.1.0 |
| **CC Layer** | CC-01 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-032 |
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

When building React UIs with shadcn/ui, the agent guesses component props, variants, and slots from training data. This produces hallucinated APIs — components used with props that don't exist, or missing props that do. The result is code that compiles but doesn't render correctly, or doesn't compile at all.

shadcn/ui ships an official MCP server as a subcommand of the `shadcn` CLI (`npx shadcn@latest mcp`). It allows the agent to browse available components from any shadcn-compatible registry, search for specific components, and install them directly into the project. The agent gets the exact API surface — props, variants, slots — from the registry instead of guessing.

This aligns with Tool Doctrine: determinism over hallucination. The registry is the source of truth, not training data. No LLM-as-spine — the registry provides the facts, the agent applies them.

---

## Decision

Register shadcn/ui MCP as **TOOL-016** in SNAP_ON_TOOLBOX.yaml at **Tier 0** (free, official).

**Evaluation order compliance:**
1. Not on banned list
2. Tier 0 — official shadcn CLI feature, free
3. No existing tool in the registry covers component API lookup
4. Fills a gap: deterministic component API instead of hallucinated props

**Install command:**
```
claude mcp add shadcn-ui -- npx shadcn@latest mcp
```

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Guess from training data | Hallucination risk — props/variants may not exist |
| Read node_modules source | Slow, requires parsing TSX, not structured for lookup |
| @jpisnice/shadcn-ui-mcp-server | Third-party; official server exists and is maintained by shadcn team |
| Manual docs lookup | Breaks agent flow, not MCP-integrated |

---

## Consequences

### Enables

- Deterministic component API lookup during UI builds
- Direct component installation from natural language
- Registry-first approach — exact props, variants, slots
- Works with any shadcn-compatible registry (not just default)

### Prevents

- Hallucinated component props that don't exist
- Trial-and-error compilation cycles from wrong API usage
- Outdated component knowledge from stale training data

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
| Rate Limit | N/A — registry lookups are free and fast | CC-01 |
| Timeout | 15s per lookup | CC-01 |
| Kill Switch | Registry unreachable → fallback to local node_modules | CC-01 |

---

## Rollback

Remove TOOL-016 entry from SNAP_ON_TOOLBOX.yaml and uninstall MCP server (`claude mcp remove shadcn-ui`). No downstream dependencies — tool is optional and additive.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | ARCHITECTURE.md v2.1.0 |
| Tool Registry | SNAP_ON_TOOLBOX.yaml |
| Source | https://ui.shadcn.com/docs/mcp |
| Work Items | Human-requested registration |
| PR(s) | This commit |

---

## Approval

| Role | Name | Date |
|------|------|------|
| Hub Owner (CC-01) | Human (Sovereign) | 2026-03-12 |
| Reviewer | Claude Opus 4.6 | 2026-03-12 |
