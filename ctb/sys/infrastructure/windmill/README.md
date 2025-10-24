<!--

# CTB Metadata
# Generated: 2025-10-23T14:32:36.762819
# CTB Version: 1.3.3
# Division: System Infrastructure
# Category: infrastructure
# Compliance: 100%
# HEIR ID: HEIR-2025-10-SYS-INFRAS-01

-->

# Windmill Integration

**Doctrine ID**: 04.04.09
**CTB Branch**: `sys/windmill`
**Altitude**: 40k (Doctrine Core - System Infrastructure)

---

## Purpose

Windmill provides a developer-first platform for scripts, workflows, and internal tool deployment within the CTB ecosystem. It enables:

- Multi-language script execution (Python, TypeScript, Bash, Go, SQL)
- Workflow orchestration with code
- Internal app deployment
- Job scheduling and cron tasks
- Resource and secret management
- Developer-friendly UI for operations teams

---

## Integration Flow

```
┌─────────────────────────────────────────┐
│   Developer/Operator                    │
│   (Write scripts in preferred language) │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Windmill Execution Engine             │
│   - Python/TS/Bash/Go/SQL support        │
│   - Dependency management                │
│   - Parallel execution                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Composio MCP Integration              │
│   Endpoint: http://localhost:3001/tool  │
│   Doctrine ID: 04.04.09                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Results & Logs                        │
│   - Execution history                    │
│   - Output artifacts                     │
│   - Error tracking                       │
└─────────────────────────────────────────┘
```

---

## Example Usage

### Run Python Script

```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "Windmill",
    "action": "RUN_SCRIPT",
    "data": {
      "language": "python",
      "code": "import requests\nprint(\"Data processed\")",
      "args": {"url": "https://api.example.com"}
    },
    "unique_id": "HEIR-2025-10-WINDMILL-001",
    "process_id": "PRC-SCRIPT-001",
    "orbt_layer": 1,
    "blueprint_version": "1.0"
  }'
```

### Schedule Recurring Job

```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "Windmill",
    "action": "SCHEDULE_TASK",
    "data": {
      "script_path": "scripts/data_sync.py",
      "schedule": "0 2 * * *",
      "enabled": true
    },
    "unique_id": "HEIR-2025-10-WINDMILL-002",
    "process_id": "PRC-SCHEDULE-001",
    "orbt_layer": 1
  }'
```

### Deploy Internal App

```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "Windmill",
    "action": "DEPLOY_APP",
    "data": {
      "name": "Admin Dashboard",
      "components": ["table", "chart", "form"],
      "data_source": "neon"
    },
    "unique_id": "HEIR-2025-10-WINDMILL-003",
    "process_id": "PRC-DEPLOY-001",
    "orbt_layer": 1
  }'
```

---

## Toolkit Tools

- `RUN_SCRIPT` - Execute scripts in Python, TypeScript, Bash, Go, SQL
- `DEPLOY_APP` - Deploy internal tools and dashboards
- `CREATE_FLOW` - Build multi-step workflows
- `SCHEDULE_TASK` - Set up cron jobs and recurring tasks
- `LIST_SCRIPTS` - View all available scripts
- `GET_LOGS` - Retrieve execution logs and output
- `MANAGE_VARIABLES` - Configure environment variables and secrets
- `EXECUTE_WORKFLOW` - Run complex multi-step workflows

---

## Supported Languages

| Language | Use Case | Example |
|----------|----------|---------|
| **Python** | Data processing, APIs, ML | `def main(): return process_data()` |
| **TypeScript** | API integration, Node.js tasks | `export async function main() {}` |
| **Bash** | System operations, file processing | `#!/bin/bash\necho "Processing"` |
| **Go** | High-performance tasks | `func main() { fmt.Println("Done") }` |
| **SQL** | Database queries, reports | `SELECT * FROM users WHERE active=true` |

---

## Local Development

Windmill runs on port 8000:

```bash
# Start Windmill locally
cd windmill/
docker-compose up -d

# Access UI at http://localhost:8000
# API at http://localhost:8000/api
```

---

## Common Use Cases

1. **Data ETL Pipelines**: Transform and load data between systems
2. **Automated Reporting**: Generate and distribute reports on schedule
3. **System Administration**: Automate ops tasks with bash/python
4. **Internal Tools**: Build custom dashboards and admin panels
5. **API Orchestration**: Chain multiple API calls in workflows

---

## CTB Compliance

- **Doctrine ID**: 04.04.09 (mandatory for all CTB repos)
- **MCP Endpoint**: Registered in `config/mcp_registry.json`
- **Branch**: Must exist in all CTB-compliant repositories
- **Enforcement**: Validated by `global-config/scripts/ctb_enforce.sh`

---

## Documentation

- Full integration docs: `sys/windmill/` directory in this branch
- CTB Doctrine: `global-config/CTB_DOCTRINE.md`
- MCP Registry: `config/mcp_registry.json`
- Windmill Docs: https://www.windmill.dev/docs

---

**Status**: Active
**Version**: 1.0
**Last Updated**: 2025-10-18
