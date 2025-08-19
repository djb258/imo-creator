# Claude Code Usage (Garage-MCP)

## Global Sub-Agent Storage
- macOS/Linux: `~/.claude/agents/`
- Windows: `C:\Users\{USERNAME}\.claude\agents\`

## Orchestrator vs Sub-Agent
**Orchestrator** → multi-domain, multi-step, fan-out, architecture choice.  
**Sub-agent** → single domain task, focused optimization.

## Garage-MCP Routing
- If repo has `/services/mcp` or `/docs/hdo.schema.json`, inject/use HDO.
- Single task → sub-agent. Compound → overall-orchestrator → stage orchestrator → sub-agents.
- Append to `HDO.log` on each step.
- Any ERROR → `shq.master_error_log` (handled by MCP layer).

## Quick Start Commands
```bash
# List global agents
make agents-global

# Validate altitude plan
make plan-validate

# Seed HDO and run plan
make hdo-seed && make run-plan

# Run database migrations
make db-migrate && make db-ids-migrate

# Check ID generation
make ids-doc-check
```

## Altitude-Based Orchestration
The system follows strict altitude levels for orchestration:
- **30k**: Overall orchestrator routes to domain orchestrators
- **20k**: Input orchestrator coordinates mapper → validator
- **10k**: Middle orchestrator coordinates db → enforcer → conditional apply
- **5k**: Output orchestrator coordinates notifier → reporter

## Sub-Agent Role IDs
Fixed role identifiers for consistent agent binding:
- `input-subagent-mapper`
- `input-subagent-validator`
- `middle-subagent-db`
- `middle-subagent-enforcer`
- `output-subagent-notifier`
- `output-subagent-reporter`

## Error Handling
All errors are centrally logged to `shq.master_error_log` with:
- Unique error_id
- Process context (process_id, blueprint_id)
- Full stack trace
- HDO snapshot at error time
- Automatic escalation based on HEIR doctrine

## Project Configuration
Each project can bind specific agent implementations via `docs/agent.bindings.json`.
This allows swapping implementations while maintaining stable role IDs.