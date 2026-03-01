# Agent Teams Integration Template

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 2.1.0 |
| **CC Layer** | CC-03 (Spoke Interface) |

---

## Hub Identity (CC-02)

| Field | Value |
|-------|-------|
| **Sovereign ID** | |
| **Hub Name** | |
| **Hub ID** | |
| **Orchestration Provider** | Claude Code Agent Teams (native) |

---

## Overview

Agent Teams is Claude Code's native multi-agent capability. It enables parallel execution within Garage pipeline stages by spawning isolated subagents, each working in their own git worktree.

Agent Teams operates as a CC-03 spoke — it provides execution parallelism, not logic. The Garage pipeline remains the authority for sequencing, gating, and certification.

```
┌─────────────────────┐
│  Garage Pipeline     │
│  (Sequential Stages) │
│                      │
│  Stage 5: Worker     │
│  ┌────────────────┐  │
│  │  Lead Agent    │  │    ┌──────────────┐
│  │  (determines   │──────▶│ Subagent 1   │──▶ worktree-1/
│  │  independence)  │  │    │ (file set A) │
│  │                │  │    └──────────────┘
│  │                │──────▶┌──────────────┐
│  │                │  │    │ Subagent 2   │──▶ worktree-2/
│  │                │  │    │ (file set B) │
│  │                │  │    └──────────────┘
│  │                │──────▶┌──────────────┐
│  │                │  │    │ Subagent 3   │──▶ worktree-3/
│  │  ◀── collect ──│  │    │ (file set C) │
│  └────────────────┘  │    └──────────────┘
│                      │
│  Stage 6: Collect    │
│  Stage 7: Audit      │
└─────────────────────┘
```

---

## Two Execution Modes

| Mode | Mechanism | Isolation | Use Case |
|------|-----------|-----------|----------|
| **Subagent Parallel** | `Agent` tool with `isolation: worktree` | Git worktree per subagent | Independent file changes within a single child repo (Worker Stage 5) |
| **Fleet Refit Parallel** | Agent Teams (`TeammateTool`) | Independent Claude instances | Same WORK_PACKET applied to multiple child repos simultaneously |

---

## Subagent Parallel Mode (Worker Stage 5)

### When to Use

- WORK_PACKET targets 3+ files in different directories
- Files are provably independent (no imports, no shared state, no ordering dependency)
- Change type is `fix`, `refactor`, or `feature` with isolated scopes

### When NOT to Use

- Files import each other or share state
- DB migrations involved (must complete before application code)
- UI components that depend on code being changed
- WORK_PACKET targets fewer than 3 files (overhead not worth it)

### Independence Check (MANDATORY before dispatch)

All four conditions must be true:

| # | Condition | Check |
|---|-----------|-------|
| 1 | Files are in different directories | Path prefix comparison |
| 2 | No file imports another target file | Static import analysis |
| 3 | No shared state mutation | No two files write to same config/state |
| 4 | No ordering dependency | No file depends on output of another |

If ANY condition fails, those files MUST be processed sequentially.

### Subagent Dispatch Pattern

```
Lead Agent (Worker):
  1. Read WORK_PACKET.allowed_paths
  2. Run independence check on file targets
  3. Group independent files into subagent batches (max 5 subagents)
  4. Spawn subagents with worktree isolation:
     - Each subagent receives: WORK_PACKET subset + file_targets subset
     - Each subagent operates in isolated worktree
     - Each subagent returns: modified files + execution log
  5. Collect subagent outputs
  6. Merge worktree changes back to working branch
  7. Hand off to Artifact Writer (Stage 6) as normal
```

### Subagent PID Scheme

```
Parent:  wp-20260301-fix-auth
Sub 1:   wp-20260301-fix-auth-sub-1
Sub 2:   wp-20260301-fix-auth-sub-2
Sub 3:   wp-20260301-fix-auth-sub-3
```

### Guard Rails

| Guard | Value |
|-------|-------|
| Max subagents per Worker invocation | 5 |
| Subagent scope | Subset of parent WORK_PACKET.allowed_paths |
| Worktree cleanup | Automatic on subagent completion |
| Failure handling | Any subagent failure halts all; lead collects errors |
| Token budget awareness | Lead monitors aggregate consumption |

---

## Fleet Refit Parallel Mode

### When to Use

- Fleet refit WORK_PACKET targets 2+ child repos
- Same change applied to each repo independently
- No cross-repo dependencies

### When NOT to Use

- Repos have interdependencies (e.g., shared package published by one, consumed by another)
- Change requires sequential rollout (canary → staging → production)

### Fleet Refit Dispatch Pattern

```
Refit Coordinator:
  1. Read WORK_PACKET with execution_type=fleet_refit
  2. Resolve target repos from FLEET_REGISTRY.yaml
  3. Spawn one teammate per target repo (max 5):
     - Each teammate receives: WORK_PACKET + target_repo_alias
     - Each teammate runs Stages 3-5 independently (mount → validate → execute)
     - Each teammate returns: artifact bundle for its repo
  4. Collect all artifact bundles
  5. Each bundle enters Stage 6-10 independently (audit → certify → merge)
```

### Guard Rails

| Guard | Value |
|-------|-------|
| Max teammates per fleet refit | 5 |
| Teammate scope | One child repo per teammate |
| Failure isolation | Teammate failure does not block other teammates |
| Certification | Each repo certified independently |

---

## Environment Configuration

```bash
# Enable Agent Teams (required for fleet refit mode)
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1

# Subagent worktree isolation requires no additional configuration
# It is enabled per-invocation via isolation: worktree parameter
```

---

## Custom Agent Definitions

Place in `.claude/agents/` at the repo root for team-wide availability:

```yaml
# .claude/agents/garage-worker-parallel.md
---
name: garage-worker-parallel
description: Garage Worker subagent for parallel file changes
isolation: worktree
---

You are a Garage Worker subagent. You execute file modifications within
your assigned scope. Rules:

1. ONLY modify files listed in your assigned file_targets
2. Follow the WORK_PACKET instructions exactly
3. Do not expand scope beyond your assigned files
4. Report all changes made in your execution log
5. If you encounter a dependency on another file not in your targets, STOP and report
```

---

## IMO Placement

| Layer | Agent Teams Role | CC Layer |
|-------|-----------------|----------|
| **I — Ingress** | Subagent receives WORK_PACKET subset (read-only) | CC-03 (Spoke) |
| **M — Middle** | Lead Agent determines independence, dispatches, collects | CC-02 (Hub) |
| **O — Egress** | Subagent returns modified files + execution log (read-only) | CC-03 (Spoke) |

Agent Teams is an **execution accelerator** (spoke), not a decision maker. Independence determination and dispatch decisions live in the M layer (Lead Agent / Worker).

---

## Security Requirements

- [ ] Subagents inherit parent session permissions (no escalation)
- [ ] Worktrees are auto-cleaned on completion
- [ ] No cross-subagent file access (worktree isolation enforces this)
- [ ] Scope lock enforced per subagent (WORK_PACKET.allowed_paths subset)
- [ ] Token usage tracked per subagent for cost visibility

---

## Testing

```bash
# Verify Agent Teams is enabled
echo $CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS
# Expected: 1

# Verify worktree support
git worktree list
# Expected: shows main worktree, no orphans

# Test subagent spawn (dry run)
# In Claude Code session:
# > Spawn a subagent with worktree isolation to read a single file
```

---

## Compliance Checklist

- [ ] ADR-022 approved by hub owner
- [ ] `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` set in environment
- [ ] `.claude/agents/` directory created with Garage agent definitions
- [ ] Independence check implemented in Worker lead agent logic
- [ ] Subagent PID scheme documented in audit trail
- [ ] Token budget monitoring configured
- [ ] Worktree cleanup verified (no orphan worktrees after pipeline run)

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Architecture Doctrine | ARCHITECTURE.md v2.1.0 |
| PRD | N/A |
| ADR | ADR-022 |
| Work Item | Agent Teams Garage Integration |
