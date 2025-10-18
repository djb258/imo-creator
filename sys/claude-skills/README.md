# Anthropic Claude Skills Integration

**Doctrine ID**: 04.04.10
**CTB Branch**: `sys/claude-skills`
**Altitude**: 40k (Doctrine Core - AI/SHQ Reasoning Layer)

---

## Purpose

Anthropic Claude Skills provides the AI/SHQ (Strategic Headquarters) reasoning layer for the CTB ecosystem. It enables:

- Extended context processing (200k tokens)
- Multi-step reasoning and complex problem solving
- Code analysis and review
- Content generation with context awareness
- Task planning and decomposition
- Autonomous workflow execution

---

## Integration Flow

```
┌─────────────────────────────────────────┐
│   Developer/System Request              │
│   (Analysis, reasoning, generation)     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Claude Skills API                     │
│   Model: claude-sonnet-4.5-20250929     │
│   Context: 200k tokens                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Composio MCP Integration              │
│   Endpoint: composio://anthropic         │
│   Doctrine ID: 04.04.10                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Results & Insights                    │
│   - Analysis reports                     │
│   - Generated content                    │
│   - Reasoning chains                     │
└─────────────────────────────────────────┘
```

---

## Example Usage

### Code Analysis

```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "Anthropic_Claude_Skills",
    "action": "CLAUDE_ANALYZE",
    "data": {
      "content": "<code_to_analyze>",
      "analysis_type": "security_audit",
      "depth": "comprehensive"
    },
    "unique_id": "HEIR-2025-10-CLAUDE-001",
    "process_id": "PRC-ANALYSIS-001",
    "orbt_layer": 1,
    "blueprint_version": "1.0"
  }'
```

### Multi-Step Reasoning

```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "Anthropic_Claude_Skills",
    "action": "CLAUDE_REASON",
    "data": {
      "task": "Optimize database schema for performance",
      "context": "<schema_definition>",
      "steps": ["analyze", "identify_bottlenecks", "propose_improvements"]
    },
    "unique_id": "HEIR-2025-10-CLAUDE-002",
    "process_id": "PRC-REASON-001",
    "orbt_layer": 2
  }'
```

---

## Toolkit Tools

- `CLAUDE_ANALYZE` - Deep analysis of code, docs, or data
- `CLAUDE_REASON` - Multi-step reasoning tasks
- `CLAUDE_GENERATE` - Content and code generation
- `CLAUDE_REVIEW` - Code and document review
- `CLAUDE_PLAN` - Task planning and decomposition
- `CLAUDE_EXECUTE` - Workflow execution with skills

---

## Configuration

Set your Anthropic API key in the MCP vault:

```bash
curl -X POST http://localhost:3001/vault/set \
  -H "Content-Type: application/json" \
  -d '{
    "key": "ANTHROPIC_API_KEY",
    "value": "sk-ant-your-key-here"
  }'
```

---

## Key Features

| Feature | Description |
|---------|-------------|
| **200k Context** | Process entire codebases in single request |
| **Multi-turn** | Maintain conversation context across requests |
| **Structured Output** | Get JSON-formatted results |
| **Tool Use** | Claude can call other tools autonomously |
| **Reasoning Chains** | View step-by-step thought process |

---

## Common Use Cases

1. **Code Review**: Comprehensive security and quality analysis
2. **Documentation**: Auto-generate docs from code
3. **Architecture Analysis**: Evaluate system design decisions
4. **Bug Investigation**: Deep dive into complex issues
5. **Refactoring Plans**: Plan and execute code improvements

---

## CTB Compliance

- **Doctrine ID**: 04.04.10 (mandatory for all CTB repos)
- **MCP Endpoint**: Global Composio endpoint `composio://anthropic`
- **Branch**: Must exist in all CTB-compliant repositories
- **Enforcement**: Validated by `global-config/scripts/ctb_enforce.sh`

---

## Documentation

- **Full Documentation**: `claude.skills.md` (detailed guide)
- **Tool Manifest**: `claude.manifest.json` (schemas and config)
- **CTB Doctrine**: `global-config/CTB_DOCTRINE.md`
- **MCP Registry**: `config/mcp_registry.json`

---

## Security

- **API Keys**: Stored in MCP vault only (never hardcoded)
- **Audit Logging**: All requests logged to `logs/claude_skills_audit.log`
- **Rate Limiting**: 50 requests/minute (default)
- **Data Privacy**: No PII sent without explicit consent flags

---

**Status**: Active
**Version**: 1.0
**Last Updated**: 2025-10-18
