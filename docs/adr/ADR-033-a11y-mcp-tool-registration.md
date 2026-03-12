# ADR: a11y-mcp Tool Registration (TOOL-017)

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 2.1.0 |
| **CC Layer** | CC-01 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-033 |
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

Frontend builds currently have no automated accessibility gate. WCAG violations ship silently because the agent cannot audit its own output for accessibility compliance. Manual accessibility testing is slow and inconsistent.

`a11y-mcp` is an open-source MCP server that wraps axe-core (the industry-standard WCAG rule engine) behind the MCP protocol. It gives the agent two tools: a detailed audit (with WCAG tag filtering and HTML snippet inclusion) and a summary for quick pass/fail checks. The agent can audit any page URL and receive structured violation reports with element selectors and fix suggestions.

This aligns with Tool Doctrine: deterministic verification of deterministic output. axe-core evaluates against published WCAG rules — no interpretation, no LLM judgment. Violations are facts, not opinions.

---

## Decision

Register a11y-mcp as **TOOL-017** in SNAP_ON_TOOLBOX.yaml at **Tier 0** (free, open-source).

**Evaluation order compliance:**
1. Not on banned list
2. Tier 0 — open-source, MIT/MPL-2.0 licensed
3. No existing tool in the registry covers accessibility auditing
4. Fills a gap: automated WCAG compliance gate after UI builds

**Install command:**
```
claude mcp add a11y -- npx a11y-mcp
```

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Manual accessibility testing | Slow, inconsistent, blocks iteration |
| a11y-mcp-server | Less actively maintained than a11y-mcp |
| mcp-accessibility-scanner | Playwright-based — redundant if Playwright MCP (TOOL-015) already installed |
| axe-core CLI directly | Not MCP-integrated, requires separate scripting |
| Do Nothing | WCAG violations ship undetected |

---

## Consequences

### Enables

- Automated WCAG compliance gate after every UI build
- Structured violation reports with element selectors and fix suggestions
- WCAG tag filtering (wcag2a, wcag2aa, wcag21aa, best-practice)
- Agentic fix loop: audit → fix violations → re-audit → confirm

### Prevents

- Shipping inaccessible UI without detection
- Manual accessibility bottleneck
- WCAG violations accumulating unnoticed across builds

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
| Rate Limit | 20 audits per session | CC-01 |
| Timeout | 30s per page audit | CC-01 |
| Kill Switch | Puppeteer crash or timeout → log and skip | CC-01 |

---

## Rollback

Remove TOOL-017 entry from SNAP_ON_TOOLBOX.yaml and uninstall MCP server (`claude mcp remove a11y`). No downstream dependencies — tool is optional and additive.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | ARCHITECTURE.md v2.1.0 |
| Tool Registry | SNAP_ON_TOOLBOX.yaml |
| Source | https://github.com/priyankark/a11y-mcp |
| Engine | axe-core (Deque Systems) |
| Work Items | Human-requested registration |
| PR(s) | This commit |

---

## Approval

| Role | Name | Date |
|------|------|------|
| Hub Owner (CC-01) | Human (Sovereign) | 2026-03-12 |
| Reviewer | Claude Opus 4.6 | 2026-03-12 |
