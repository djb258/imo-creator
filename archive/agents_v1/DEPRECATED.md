# DEPRECATED — Agent Master Prompts (v1)

**Status**: DEPRECATED as of 2026-03-09
**Reason**: Agents converted to skill-creator-compliant skill packages

## Migration Map

| Old Location | New Location |
|-------------|-------------|
| `ai/agents/orchestrator/master_prompt.md` | `skills/agent-orchestrator/SKILL.md` |
| `ai/agents/planner/master_prompt.md` | `skills/agent-planner/SKILL.md` |
| `ai/agents/builder/master_prompt.md` | `skills/agent-builder/SKILL.md` |
| `ai/agents/auditor/master_prompt.md` | `skills/agent-auditor/SKILL.md` |
| `ai/agents/db_agent/master_prompt.md` | `skills/agent-db/SKILL.md` |

## Why

- Same format as every other skill (YAML frontmatter, trigger descriptions, references/)
- Claude Code can discover agents via trigger matching
- Schemas and contracts moved to `references/` (progressive disclosure)
- Swap-testable — any LLM can pick up an agent skill cold
- One system instead of two (skills + loose master_prompts)

## What Changed

- Content preserved — all rules, prohibitions, and workflows carried forward
- Heavy detail (schemas, decision trees, lane checks) moved to `references/` files
- Skill format adds: IMO block, Constants/Variables separation, Hub-and-Spoke map
- `worker` fully resolved to `builder` (canonical)

## Do Not Use These Files

These master_prompt.md files are archived for reference only. All active agent
definitions are in `skills/agent-*/SKILL.md`.
