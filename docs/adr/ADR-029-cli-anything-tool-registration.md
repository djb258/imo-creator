# ADR: CLI-Anything Tool Registration (TOOL-013)

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 2.1.0 |
| **CC Layer** | CC-01 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-029 |
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

We frequently encounter software that has no existing API, MCP server, or Composio toolkit — GUI-only applications, legacy tools, or niche utilities. When an agent needs to interact with such software, there is currently no structured path to make it controllable.

CLI-Anything (HKUDS/CLI-Anything) is an open-source tool that generates CLI wrappers for any software given its codebase. It produces PEP 420 namespace packages with REPL mode, JSON output, undo/redo, and a test suite — making GUI applications agent-controllable via structured text commands.

This aligns with Tool Doctrine: deterministic first, structured interfaces, composable. The tool produces CLI harnesses that are deterministic and self-describing. It does NOT use LLM as spine — it generates structured command interfaces from code analysis.

---

## Decision

Register CLI-Anything as **TOOL-013** in SNAP_ON_TOOLBOX.yaml at **Tier 0** (free, open-source).

**Evaluation order compliance:**
1. Not on banned list
2. Tier 0 — open-source, no API key, no cost
3. No existing tool in the registry covers this capability
4. Fills a gap: making uncontrollable software agent-accessible

**Usage doctrine:**
- Check Composio toolkit registry FIRST
- Check MCP server registry SECOND
- Check REST API availability THIRD
- CLI-Anything is LAST RESORT when no structured interface exists

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Manual CLI wrapper writing | Slow, error-prone, not scalable |
| Composio only | Only covers 500+ pre-built integrations, not arbitrary software |
| MCP servers only | Only available for popular tools, not legacy/niche |
| Do Nothing | Leaves agents unable to interact with GUI-only software |

---

## Consequences

### Enables

- Agents can generate CLI wrappers for any software with a codebase
- GUI-only tools become pipeline-composable
- Structured JSON output from previously unstructured software
- Test suites generated alongside CLI harnesses

### Prevents

- Ad-hoc screen scraping or brittle automation
- LLM-driven GUI interaction (banned pattern)

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
| Rate Limit | N/A — local tool, no API calls | CC-01 |
| Timeout | 300s per generation run | CC-01 |
| Kill Switch | Generation failure → abort, do not retry | CC-01 |

---

## Rollback

Remove TOOL-013 entry from SNAP_ON_TOOLBOX.yaml. No downstream dependencies — tool is optional and additive.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | ARCHITECTURE.md v2.1.0 |
| Tool Registry | SNAP_ON_TOOLBOX.yaml |
| Source | https://github.com/HKUDS/CLI-Anything |
| Work Items | Human-requested registration |
| PR(s) | This commit |

---

## Approval

| Role | Name | Date |
|------|------|------|
| Hub Owner (CC-01) | Human (Sovereign) | 2026-03-12 |
| Reviewer | Claude Opus 4.6 | 2026-03-12 |
