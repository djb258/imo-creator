# Anthropic Claude Skills Integration

**Doctrine ID**: 04.04.10
**Version**: 1.0
**Integration Type**: AI/SHQ Reasoning Layer
**Composio Alias**: Anthropic_Claude_Skills

---

## Overview

The Anthropic Claude Skills integration provides a structured AI reasoning layer for the CTB Doctrine system. This integration enables advanced Claude capabilities through the Composio MCP framework, allowing repositories to leverage Claude's Skills API for complex reasoning, analysis, and automation tasks.

## Purpose

This integration serves as the **AI/SHQ (Strategic Headquarters) layer** within the CTB architecture:

- **40k Altitude** - Strategic reasoning and doctrine-level decisions
- **Reasoning Engine** - Advanced prompt chaining and analysis
- **Context Management** - Long-form context processing
- **Automation Gateway** - AI-driven workflow orchestration

## Architecture

```
┌─────────────────────────────────────────┐
│   Anthropic Claude Skills (04.04.10)   │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   Claude Sonnet 4.5 Engine        │ │
│  │   - Extended Context (200k tokens)│ │
│  │   - Skills API Integration        │ │
│  │   - Multi-turn Reasoning          │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   Composio MCP Bridge             │ │
│  │   - composio://anthropic endpoint │ │
│  │   - Tool orchestration            │ │
│  │   - State management              │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   CTB Integration Layer           │ │
│  │   - HEIR/ORBT compliance          │ │
│  │   - Doctrine enforcement          │ │
│  │   - Audit logging                 │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Features

### Core Capabilities

1. **Extended Context Processing**
   - 200k token context window
   - Long-form document analysis
   - Multi-file reasoning

2. **Skills API Integration**
   - Structured task decomposition
   - Advanced reasoning chains
   - Tool use orchestration

3. **CTB Doctrine Compliance**
   - HEIR-compliant unique IDs
   - ORBT layer tracking
   - Audit trail generation

4. **Composio MCP Integration**
   - Global endpoint: `composio://anthropic`
   - Seamless tool chaining
   - State persistence

### Toolkit Tools

The Anthropic Claude Skills integration provides the following toolkit capabilities:

- `CLAUDE_ANALYZE` - Deep analysis of code, docs, or data
- `CLAUDE_REASON` - Multi-step reasoning tasks
- `CLAUDE_GENERATE` - Content and code generation
- `CLAUDE_REVIEW` - Code and document review
- `CLAUDE_PLAN` - Task planning and decomposition
- `CLAUDE_EXECUTE` - Workflow execution with skills

## Installation

### Prerequisites

- Composio CLI installed
- Anthropic API key configured
- MCP server running on localhost:3001

### Registration

```bash
# Register Anthropic Claude Skills in Composio
composio tools register anthropic --alias Anthropic_Claude_Skills

# Verify registration
composio tools list | grep Anthropic_Claude_Skills

# Test integration
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "Anthropic_Claude_Skills",
    "action": "CLAUDE_ANALYZE",
    "data": {
      "content": "Test analysis request",
      "analysis_type": "code_review"
    },
    "unique_id": "HEIR-2025-10-CLAUDE-TEST-01",
    "process_id": "PRC-CLAUDE-001",
    "orbt_layer": 1,
    "blueprint_version": "1.0"
  }'
```

## Configuration

### MCP Registry Entry

Add to `config/mcp_registry.json`:

```json
{
  "tool": "Anthropic_Claude_Skills",
  "doctrine_id": "04.04.10",
  "endpoint": "composio://anthropic",
  "scope": "global",
  "toolkit_tools": [
    "CLAUDE_ANALYZE",
    "CLAUDE_REASON",
    "CLAUDE_GENERATE",
    "CLAUDE_REVIEW",
    "CLAUDE_PLAN",
    "CLAUDE_EXECUTE"
  ],
  "ctb_branch": "sys/claude-skills",
  "version": "1.0",
  "status": "active"
}
```

### Environment Variables

```bash
# Anthropic API Configuration
ANTHROPIC_API_KEY=${MCP:ANTHROPIC_API_KEY}
ANTHROPIC_MODEL=claude-sonnet-4.5-20250929
ANTHROPIC_MAX_TOKENS=200000

# Composio Integration
COMPOSIO_ANTHROPIC_ENABLED=true
COMPOSIO_ANTHROPIC_ENDPOINT=composio://anthropic
```

## Usage

### Basic Analysis

```typescript
import { mcp } from './mcp_vault_resolver';

// Perform code analysis using Claude Skills
const result = await mcp.callTool('Anthropic_Claude_Skills', {
  action: 'CLAUDE_ANALYZE',
  data: {
    content: codeToAnalyze,
    analysis_type: 'security_audit',
    depth: 'comprehensive'
  },
  unique_id: 'HEIR-2025-10-ANALYSIS-001',
  orbt_layer: 2
});
```

### Multi-Step Reasoning

```typescript
// Complex reasoning task with Skills API
const reasoning = await mcp.callTool('Anthropic_Claude_Skills', {
  action: 'CLAUDE_REASON',
  data: {
    task: 'Optimize database schema for performance',
    context: schemaDefinition,
    steps: ['analyze', 'identify_bottlenecks', 'propose_improvements'],
    output_format: 'structured_plan'
  },
  unique_id: 'HEIR-2025-10-REASON-001',
  orbt_layer: 3
});
```

### Workflow Execution

```typescript
// Execute complex workflow with Claude orchestration
const workflow = await mcp.callTool('Anthropic_Claude_Skills', {
  action: 'CLAUDE_EXECUTE',
  data: {
    workflow_definition: workflowYaml,
    input_data: taskPayload,
    orchestration_mode: 'autonomous',
    checkpoints: true
  },
  unique_id: 'HEIR-2025-10-EXEC-001',
  orbt_layer: 4
});
```

## CTB Integration

### Branch Structure

```
sys/claude-skills/
├── claude.skills.md          # This documentation
├── claude.manifest.json      # Tool manifest and metadata
├── examples/
│   ├── analysis_example.ts
│   ├── reasoning_example.ts
│   └── workflow_example.ts
├── schemas/
│   ├── claude_request.schema.json
│   └── claude_response.schema.json
└── tests/
    ├── integration.test.ts
    └── skills.test.ts
```

### Doctrine Compliance

All Claude Skills interactions must follow HEIR/ORBT protocol:

- **unique_id**: HEIR-compliant format (e.g., `HEIR-YYYY-MM-MODULE-DESC-NN`)
- **process_id**: Process tracking ID (e.g., `PRC-CLAUDE-001`)
- **orbt_layer**: Altitude level (1=40k, 2=20k, 3=10k, 4=5k)
- **blueprint_version**: Version tracking for reproducibility

### Audit Logging

All Claude Skills invocations are logged to:

- **Local**: `logs/claude_skills_audit.log`
- **Firebase**: `claude_skills_audit_log` collection
- **Format**: JSON with timestamp, doctrine_id, action, result, duration

## Security

### API Key Management

- **NEVER** hardcode Anthropic API keys
- Use MCP vault: `${MCP:ANTHROPIC_API_KEY}`
- Rotate keys via MCP vault, not environment files
- Audit all API key access attempts

### Rate Limiting

- Default: 50 requests/minute
- Extended: 100 requests/minute (enterprise)
- Automatic backoff on 429 responses

### Data Privacy

- All Claude interactions logged for audit
- No PII sent without explicit consent flags
- GDPR/CCPA compliance via data retention policies

## Troubleshooting

### Tool Not Registered

```bash
# Error: Anthropic_Claude_Skills not found in Composio
# Solution:
composio tools register anthropic --alias Anthropic_Claude_Skills
composio tools list | grep Anthropic_Claude_Skills
```

### API Key Issues

```bash
# Error: Invalid API key
# Solution:
# Add to MCP vault
curl -X POST http://localhost:3001/vault/set \
  -H "Content-Type: application/json" \
  -d '{"key": "ANTHROPIC_API_KEY", "value": "sk-ant-..."}'

# Verify
curl -X POST http://localhost:3001/vault/get \
  -H "Content-Type: application/json" \
  -d '{"key": "ANTHROPIC_API_KEY"}'
```

### Connection Failures

```bash
# Check Composio MCP server status
curl http://localhost:3001/mcp/health

# Verify Anthropic endpoint
composio tools info Anthropic_Claude_Skills
```

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-18 | Initial integration with CTB Doctrine v1.3 |

## References

- [CTB Doctrine v1.3](../../global-config/CTB_DOCTRINE.md)
- [Anthropic API Documentation](https://docs.anthropic.com)
- [Composio MCP Integration](https://docs.composio.dev)
- [HEIR/ORBT Protocol](../../heir.doctrine.yaml)

## Support

For issues with Anthropic Claude Skills integration:

1. Check `logs/claude_skills_audit.log` for errors
2. Verify Composio registration: `composio tools list`
3. Test MCP endpoint: `curl http://localhost:3001/mcp/health`
4. Review CTB enforcement logs: `cat logs/ctb_enforcement.log`

---

**Doctrine ID**: 04.04.10
**Status**: Active
**Maintained By**: CTB Doctrine Enforcement System
**Last Updated**: 2025-10-18
