# PACKET_CONTRACT.md — Agent Pipeline Packet Envelope

**Authority**: BAR-134
**Version**: 2.0.0
**Effective**: 2026-03-14

---

## 1. JSON Packet Envelope Schema

Every packet in the `sys/runtime/` pipeline MUST conform to this envelope:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `packet_id` | UUID | YES | Unique identifier per packet |
| `bar_id` | String | YES | `BAR-XXX` — ties to Linear ticket |
| `source_agent` | String | YES | Agent that created this packet |
| `target_agent` | String | YES | Agent that should pick this up |
| `created_at` | String | YES | ISO-8601 timestamp |
| `status` | Enum | YES | `pending` ǀ `in-progress` ǀ `complete` ǀ `failed` ǀ `rejected` |
| `payload` | Object | YES | Agent-specific content |
| `foreman_notes` | String | NO | Foreman notes — at front (writing) or back (reviewing) |

### Example Envelope

```json
{
  "packet_id": "a1b2c3d4-0314-2026-bar134-000000000001",
  "bar_id": "BAR-134",
  "source_agent": "foreman",
  "target_agent": "orchestrator",
  "created_at": "2026-03-14T08:20:00Z",
  "status": "pending",
  "foreman_notes": "Optional context for the receiving agent.",
  "payload": {
    "task": "Description of work",
    "deliverables": []
  }
}
```

---

## 2. Architecture

### What Powers What

| Component | Role | Platform |
|-----------|------|----------|
| **Dave** | Operator — defines work, reviews output | Human |
| **Claude.ai** | Foreman — writes packets, reviews auditor reports | Anthropic AI (phone/web) |
| **Composio** | Bridge — commits packets to GitHub from Claude.ai | MCP integration (CC-03) |
| **Claude Code** | Execution engine — runs all 5 agents | Anthropic infrastructure (via Claude.ai) |
| **GitHub** | Mailbox — `sys/runtime/inbox/` and `outbox/` directories | Repository |

### How Agents Get Invoked

Claude.ai **is** the runner. When Claude.ai opens Claude Code on the imo-creator repo, Claude Code reads the inbox, loads the agent's skill file, and executes. No separate runner, no CI-based execution, no API keys to manage.

GitHub Actions (`pipeline-trigger.yml`) exists as a **fallback trigger** — it can detect new packets and invoke agents via `claude-code-action` if Claude.ai is not in the loop.

---

## 3. Pipeline Flow

```
Dave tells Claude.ai what he wants
    │
    ▼
Claude.ai (Foreman) writes packet JSON
    │
    ▼
Composio commits packet to inbox/orchestrator/ on GitHub
    │
    ▼
Claude.ai opens Claude Code on imo-creator
    │
    ▼
Claude Code reads inbox/orchestrator/ → becomes Orchestrator
    reads skill: skills/agent-orchestrator/SKILL.md
    does work → writes outbox/orchestrator/ → drops packet in inbox/planner/
    │
    ▼
Claude Code reads inbox/planner/ → becomes Planner
    reads skill: skills/agent-planner/SKILL.md
    does work → writes outbox/planner/ → drops packet in inbox/builder/
    │
    ▼
Claude Code reads inbox/builder/ → becomes Builder
    reads skill: skills/agent-builder/SKILL.md
    does work → writes outbox/builder/ → drops packet in inbox/db-agent/
    │
    ▼
Claude Code reads inbox/db-agent/ → becomes DB Agent
    reads skill: skills/agent-db/SKILL.md
    does work → writes outbox/db-agent/ → drops packet in inbox/auditor/
    │
    ▼
Claude Code reads inbox/auditor/ → becomes Auditor
    reads skill: skills/agent-auditor/SKILL.md
    does work → writes report to outbox/auditor/ → STOP
    │
    ▼
Dave reviews auditor report in Claude.ai → moves to completed/
```

Each hop commits and pushes so there's a full paper trail in git.

---

## 4. Handoff Rules

| # | Rule |
|---|------|
| 1 | Foreman drops packet in `inbox/orchestrator/` via Composio — **ONLY entry point** |
| 2 | Claude Code runs the full chain: Orchestrator → Planner → Builder → DB Agent → Auditor |
| 3 | No foreman gate between agent stops — pipeline runs end to end |
| 4 | Each agent reads its skill file before processing |
| 5 | Each agent writes output to its outbox AND drops a packet in the next agent's inbox |
| 6 | Auditor is the quality gate — checks against BAR spec, validates all output |
| 7 | Foreman reviews Auditor report in `outbox/auditor/` — **ONLY exit point** |
| 8 | Any agent can flag `status=failed` which halts pipeline |
| 9 | Packets are **immutable** — never edit, write new ones |

---

## 5. Directory Ownership

| Directory | Owner | Reads | Writes |
|-----------|-------|-------|--------|
| `inbox/orchestrator/` | Orchestrator | Orchestrator | Foreman (via Composio) |
| `inbox/planner/` | Planner | Planner | Orchestrator |
| `inbox/builder/` | Builder | Builder | Planner |
| `inbox/db-agent/` | DB Agent | DB Agent | Builder |
| `inbox/auditor/` | Auditor | Auditor | DB Agent |
| `outbox/orchestrator/` | Orchestrator | Planner | Orchestrator |
| `outbox/planner/` | Planner | Builder | Planner |
| `outbox/builder/` | Builder | DB Agent | Builder |
| `outbox/db-agent/` | DB Agent | Auditor | DB Agent |
| `outbox/auditor/` | Auditor | Foreman | Auditor |
| `completed/` | Foreman | Foreman | Foreman |

---

## 6. Status Lifecycle

```
pending → in-progress → complete
                      → failed   (halts pipeline)
                      → rejected (auditor rejects, returns to foreman)
```

---

## 7. Naming Convention

```
{bar_id}_{short_description}_{target_agent}.json
```

Example: `BAR-134_build-agent-pipeline_orchestrator.json`

---

## 8. Fallback Trigger (GitHub Actions)

If Claude.ai is not in the loop, `pipeline-trigger.yml` can detect new packets on push and invoke agents via `claude-code-action`. This is a backup path, not the primary flow.

| Rule | Detail |
|------|--------|
| Trigger | `push` to `master`/`main` with changes in `sys/runtime/inbox/**/*.json` |
| Detection | `git diff HEAD~1 HEAD` — which inbox got a new file? |
| Execution | `anthropics/claude-code-action@v1` (requires `ANTHROPIC_API_KEY` in repo secrets) |
| Manual retry | `workflow_dispatch` with agent name + optional packet path |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-14 |
| Version | 2.0.0 |
| Authority | BAR-134 |
| Status | ACTIVE |
