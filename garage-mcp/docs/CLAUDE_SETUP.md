# Claude Code Usage (Garage‑MCP)

## Global Sub‑Agent Storage
- macOS/Linux: `~/.claude/agents/`
- Windows: `C:\Users\{USERNAME}\.claude\agents\`

## Orchestrator vs Sub‑Agent
**Orchestrator** → multi‑domain, multi‑step, fan‑out, architecture choice.  
**Sub‑agent** → single domain task, focused optimization.

## Garage‑MCP Routing
- If repo has `/services/mcp` or `/docs/hdo.schema.json`, inject/use HDO.
- Single task → sub‑agent. Compound → overall‑orchestrator → stage orchestrator → sub‑agents.
- Append to `HDO.log` on each step.
- Any ERROR → `shq.master_error_log` (handled by MCP layer).

## Altitude-based Orchestration

### Fixed Call Sequence by Altitude:
- **30k**: overall‑orchestrator → route
- **20k**: input‑orchestrator → mapper → validator  
- **10k**: middle‑orchestrator → db(plan) → enforcer → (conditional) db(apply)
- **5k**: output‑orchestrator → notifier → reporter

### Stable Role IDs (implementations swappable per project):
- `input‑subagent‑mapper`
- `input‑subagent‑validator`
- `middle‑subagent‑db`
- `middle‑subagent‑enforcer`
- `output‑subagent‑notifier`
- `output‑subagent‑reporter`

## Error Handling
- ANY exception in `orchestra.invoke` → INSERT row into `shq.master_error_log` then re‑raise concise error with `error_id`.
- Orchestrators **delegate only**; sub‑agents do IO.

## Handy Commands
```bash
# List global agents
make agents-global

# Validate plan structure  
make plan-validate

# Seed HDO and run orchestration plan
make hdo-seed && make run-plan

# Migrate database with SHQ error tables
make db-migrate && make db-ids-migrate

# Check ID generation system
make ids-doc-check
```

## Usage Examples

### Single Domain Task
```
Use @database-specialist directly for focused optimization
```

### Complex Multi-Stage Task  
```
Invoke overall-orchestrator for compound tasks requiring multiple domains
```

### HDO Integration
- HDO (Hierarchical Data Object) tracks execution state
- Process IDs follow HEIR numbering convention
- Idempotency keys prevent duplicate execution
- Log entries capture each orchestration step