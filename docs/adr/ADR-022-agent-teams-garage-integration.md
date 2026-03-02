# ADR: Agent Teams Integration for Garage Pipeline

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 2.1.0 |
| **CC Layer** | CC-03 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-022 |
| **Status** | [x] Proposed / [ ] Accepted / [ ] Superseded / [ ] Deprecated |
| **Date** | 2026-03-01 |

---

## Owning Hub (CC-02)

| Field | Value |
|-------|-------|
| **Sovereign ID** | imo-creator |
| **Hub Name** | Garage Control Plane |
| **Hub ID** | garage-control-plane |

---

## CC Layer Scope

| Layer | Affected | Description |
|-------|----------|-------------|
| CC-01 (Sovereign) | [ ] | |
| CC-02 (Hub) | [x] | Garage pipeline gains parallel execution capability within stages |
| CC-03 (Context) | [x] | New spoke interface for Agent Teams coordination |
| CC-04 (Process) | [x] | Subagent PIDs tracked within parent WORK_PACKET scope |

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
| **This decision defines** | [x] Variable (behavior tuning) |
| **Mutability** | [x] Configuration |

---

## Context

The Garage pipeline (v3.4.0) processes child repo work through a deterministic 10-stage pipeline. Each stage executes sequentially. The Worker stage (Stage 5) processes file changes one at a time. Fleet-wide refits process one child repo at a time.

This creates bottlenecks in two scenarios:
1. **Worker stage**: When a WORK_PACKET targets 10+ independent files across different directories, sequential execution is slow.
2. **Fleet refit**: When the same fix must be applied to 4+ child repos, sequential processing multiplies wall-clock time by the repo count.

Claude Code now ships native Agent Teams support (TeammateTool) and git worktree isolation for subagents. These provide parallel execution without external frameworks, using mechanisms already built into the tool the Garage runs on.

---

## Decision

Adopt Claude Code's native Agent Teams and subagent worktree isolation as a **parallel execution layer within existing Garage stages**. This does NOT replace the sequential stage pipeline — it adds parallelism WITHIN stages where work is provably independent.

**Two mechanisms, two use cases:**

| Mechanism | Use Case | Isolation | Scope |
|-----------|----------|-----------|-------|
| **Subagents** (`isolation: worktree`) | Worker parallelizing independent file changes within a single child repo | Git worktree per subagent | Within Stage 5 |
| **Agent Teams** (`TeammateTool`) | Fleet refit applying same WORK_PACKET to multiple child repos simultaneously | Independent Claude instances | Across Stage 3-5 per repo |

**Key constraint**: The lead agent (Worker or Refit Coordinator) MUST determine independence before spawning. If changes have dependencies (e.g., DB migration before application code), those changes remain sequential. Only provably independent work is parallelized.

**Independence criteria** (all must be true for parallel dispatch):
1. Target files are in different directories
2. No file imports or references another target file
3. No shared state mutation (e.g., both writing to same config)
4. No ordering dependency (e.g., schema before code that uses schema)

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| claude-flow (ruvnet/claude-flow) | 9,400-file framework with swarm/consensus model conflicts with deterministic pipeline doctrine. LLM-as-spine violates "determinism first" principle. |
| Custom multi-process orchestration | Reinvents what Claude Code already provides natively. Additional maintenance burden. |
| Do Nothing | Leaves known bottleneck in Worker stage and fleet refit scenarios. |

---

## Consequences

### Enables

- Worker stage processes independent files in parallel (estimated 2-5x speedup for multi-file WORK_PACKETs)
- Fleet refits process multiple child repos simultaneously
- Subagent worktrees provide automatic isolation — no merge conflict risk for independent changes
- Zero new dependencies — uses Claude Code built-in capability

### Prevents

- Cannot parallelize dependent changes (by design — independence check is mandatory)
- Cannot nest teams (Claude Code limitation — one team per session)
- Increased token consumption (~4x per subagent vs sequential)

---

## PID Impact (if CC-04 affected)

| Field | Value |
|-------|-------|
| **New PID required** | [x] Yes |
| **PID pattern change** | [ ] No |
| **Audit trail impact** | Subagent PIDs are scoped under parent WORK_PACKET PID: `{wp-id}-sub-{N}` |

---

## Guard Rails

| Type | Value | CC Layer |
|------|-------|----------|
| Max Subagents | 5 per Worker invocation | CC-02 |
| Max Team Size | 5 teammates per fleet refit | CC-02 |
| Independence Check | Mandatory before any parallel dispatch | CC-02 |
| Worktree Cleanup | Automatic on subagent completion (Claude Code native) | CC-04 |
| Scope Lock | Each subagent inherits parent WORK_PACKET.allowed_paths subset | CC-03 |
| Token Budget | Lead agent monitors aggregate token usage | CC-02 |

---

## Rollback

Disable Agent Teams by removing the environment variable:
```bash
unset CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS
```

Subagent worktree isolation requires no configuration to disable — simply stop spawning subagents. The Garage pipeline falls back to fully sequential execution with zero code changes.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | ARCHITECTURE.md v2.1.0 |
| PRD | N/A (infrastructure enhancement) |
| Work Items | Agent Teams Garage integration |
| PR(s) | (this PR) |

---

## Approval

| Role | Name | Date |
|------|------|------|
| Hub Owner (CC-02) | | |
| Reviewer | | |
