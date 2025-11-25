---
title: CTB Layer - AI
aliases: [ai, ctb-ai, llm, mcp, subagents]
tags:
  - ctb/ai
  - imo/middle
  - doctrine/master
created: 2025-11-25
updated: 2025-11-25
---

# CTB Layer: AI

> **Layer**: ai
> **Path**: `/src/ai`
> **Tests**: `/tests/ai`

---

## Purpose

The **ai** layer handles all LLM interactions, prompt management, subagent orchestration, and AI-powered features. This layer abstracts provider differences and implements the Composio MCP integration.

---

## IMO Phase Mapping

| IMO Phase | Responsibility |
|-----------|----------------|
| **INPUT** | Prompt parsing, context assembly |
| **MIDDLE** | LLM routing, subagent dispatch, MCP tool calls |
| **OUTPUT** | Response parsing, structured output extraction |

---

## Modules

| Module | File Pattern | Purpose |
|--------|--------------|---------|
| **Providers** | `providers/*.py` | LLM provider clients |
| **Prompts** | `prompts/*.py` | Prompt templates and management |
| **Subagents** | `subagents/*.py` | Subagent definitions and dispatch |
| **MCP** | `mcp/*.py` | MCP protocol implementation |
| **Tools** | `tools/*.py` | Tool definitions for LLM use |

---

## File Naming Conventions

```
/src/ai/
├── __init__.py
├── providers/
│   ├── __init__.py
│   ├── base.py            # Base provider interface
│   ├── openai.py          # OpenAI client
│   ├── anthropic.py       # Anthropic client
│   └── router.py          # Provider selection logic
├── prompts/
│   ├── __init__.py
│   ├── templates.py       # Prompt templates
│   ├── context.py         # Context assembly
│   └── repo_scaffold.py   # Scaffold-specific prompts
├── subagents/
│   ├── __init__.py
│   ├── registry.py        # Subagent registry
│   ├── dispatcher.py      # Subagent orchestration
│   └── definitions/
│       ├── database_specialist.py
│       ├── devops_engineer.py
│       ├── frontend_architect.py
│       └── security_auditor.py
├── mcp/
│   ├── __init__.py
│   ├── server.py          # MCP server implementation
│   ├── protocol.py        # MCP protocol handlers
│   ├── registry.py        # Tool registry
│   └── adapters/
│       ├── neon.py        # Neon MCP adapter
│       ├── firebase.py    # Firebase MCP adapter
│       └── composio.py    # Composio hub adapter
└── tools/
    ├── __init__.py
    ├── heir_check.py      # heir.check tool
    ├── sidecar_event.py   # sidecar.event tool
    ├── intake_validate.py # intake.mapping.validate tool
    └── fs_ops.py          # File system tools
```

---

## Dependencies

| Depends On | Reason |
|------------|--------|
| **system** | Config for API keys, telemetry for logging |
| **data** | Schemas for structured output, clients for tool execution |

| Depended By | Reason |
|-------------|--------|
| **app** | Uses AI for intelligent features |

---

## LLM Providers

| Provider | Client | Default | Use Case |
|----------|--------|---------|----------|
| OpenAI | `providers/openai.py` | Yes | General tasks, function calling |
| Anthropic | `providers/anthropic.py` | No | Complex reasoning, long context |

Provider selection is controlled by `LLM_DEFAULT_PROVIDER` env var and can be overridden per-request.

---

## MCP Tools

Registered in `/config/mcp_registry.json`:

| Tool | Doctrine ID | Implementation |
|------|-------------|----------------|
| `heir.check` | - | `tools/heir_check.py` |
| `sidecar.event` | - | `tools/sidecar_event.py` |
| `intake.mapping.validate` | - | `tools/intake_validate.py` |
| `neon.query` | 04.04.01 | `mcp/adapters/neon.py` |
| `firebase.write` | 04.04.02 | `mcp/adapters/firebase.py` |

---

## Kill Switch Behavior

| Failure | AI Layer Response |
|---------|-------------------|
| Provider API error | Retry 3x with backoff → fallback provider |
| Rate limit | Queue request, return 429 with retry-after |
| Context too long | Truncate context, log warning |
| Tool execution fails | Return error in structured format |
| MCP protocol error | Fallback to webhook spokes |

---

## Subagent Registry

Located at `/garage-mcp/docs/subagents.registry.json`:

| Subagent | Role | Tools |
|----------|------|-------|
| database-specialist | DB operations | neon.query, firebase.write |
| devops-engineer | Infrastructure | deploy, container ops |
| frontend-architect | UI/UX | scaffold, component gen |
| security-auditor | Security review | heir.check, audit |

---

## Testing Requirements

```bash
# Run AI layer tests
pytest tests/ai/ -v

# Required coverage
# - Providers: 85%+
# - Prompts: 90%+
# - MCP protocol: 90%+
# - Tools: 85%+

# Mock tests (no API calls)
pytest tests/ai/ -m "not integration"

# Integration tests (require API keys)
pytest tests/ai/ -m integration
```

---

## Related Docs

- [10-imo.md](./10-imo.md) - IMO definition
- [subagents.registry.json](../garage-mcp/docs/subagents.registry.json) - Subagent definitions
- [mcp_registry.json](../config/mcp_registry.json) - MCP tool registry
