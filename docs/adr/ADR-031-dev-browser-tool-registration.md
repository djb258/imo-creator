# ADR: Dev-Browser / Playwright MCP Tool Registration (TOOL-015)

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 2.1.0 |
| **CC Layer** | CC-01 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-031 |
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

After building a frontend, there is no automated way for the agent to visually verify its own output. The build-verify-fix loop requires human eyes to screenshot the UI, evaluate layout/styling, and report issues back. This leaves a gap in the QA circle.

Playwright MCP (microsoft/playwright-mcp via `@playwright/mcp`) is an official Microsoft MCP server that gives Claude Code direct browser control. It exposes 34 tools including navigation, clicking, typing, screenshotting, and accessibility tree snapshots. The agent can open a browser, navigate to the built UI, take screenshots, evaluate the visual result, and fix issues — closing the visual QA circle without human intervention.

If the Anthropic dev-browser plugin is available, it provides a lighter-weight alternative optimized for Claude Code. Both serve the same doctrinal purpose: circle validation where output feeds back to input.

This aligns with Tool Doctrine: deterministic verification of deterministic output. The browser renders actual pixels; the agent compares against design intent. No LLM-as-spine — the browser is the source of truth, the agent evaluates and acts.

---

## Decision

Register Dev-Browser / Playwright MCP as **TOOL-015** in SNAP_ON_TOOLBOX.yaml at **Tier 0** (free, open-source).

**Evaluation order compliance:**
1. Not on banned list
2. Tier 0 — open-source (Playwright MCP is free, MIT-licensed)
3. No existing tool in the registry covers visual QA verification
4. Fills a gap: closes the build-verify-fix circle for frontend work

**Implementation preference order:**
1. Anthropic dev-browser plugin (if available in marketplace)
2. Playwright MCP (`claude mcp add playwright -- npx @playwright/mcp@latest`)

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Human visual QA only | Slow, blocks iteration, not available 24/7 |
| Screenshot comparison tools (Percy, etc.) | Paid, overkill for agent self-verification |
| Computer Use (Claude Vision) | Higher cost per call, slower than accessibility tree |
| Do Nothing | Leaves visual QA circle open — agent builds blind |

---

## Consequences

### Enables

- Agent self-verifies UI output after every build
- Build → screenshot → evaluate → fix loop without human eyes
- Accessibility tree snapshots for token-efficient verification
- Cross-browser testing capability (Chrome, Firefox, Safari)

### Prevents

- Shipping visually broken UI because agent couldn't see its output
- Human bottleneck in the QA loop
- Blind iteration where code looks correct but renders wrong

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
| Rate Limit | N/A — local browser, no external API | CC-01 |
| Timeout | 30s per page load/screenshot | CC-01 |
| Kill Switch | Browser crash or timeout → abort page, continue pipeline | CC-01 |

---

## Rollback

Remove TOOL-015 entry from SNAP_ON_TOOLBOX.yaml and uninstall MCP server (`claude mcp remove playwright`). No downstream dependencies — tool is optional and additive.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | ARCHITECTURE.md v2.1.0 |
| Tool Registry | SNAP_ON_TOOLBOX.yaml |
| Source (primary) | https://github.com/microsoft/playwright-mcp |
| Source (alt) | Anthropic dev-browser plugin marketplace |
| Work Items | Human-requested registration |
| PR(s) | This commit |

---

## Approval

| Role | Name | Date |
|------|------|------|
| Hub Owner (CC-01) | Human (Sovereign) | 2026-03-12 |
| Reviewer | Claude Opus 4.6 | 2026-03-12 |
