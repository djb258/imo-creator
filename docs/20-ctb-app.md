---
title: CTB Layer - App
aliases: [app, ctb-app, business-logic, workflows]
tags:
  - ctb/app
  - imo/middle
  - doctrine/master
created: 2025-11-25
updated: 2025-11-25
---

# CTB Layer: App

> **Layer**: app
> **Path**: `/src/app`
> **Tests**: `/tests/app`

---

## Purpose

The **app** layer contains core business logic, workflows, and orchestration. This is where the primary value creation happens - scaffolding repos, validating blueprints, generating diagrams.

---

## IMO Phase Mapping

| IMO Phase | Responsibility |
|-----------|----------------|
| **INPUT** | Request routing, endpoint handlers |
| **MIDDLE** | Business logic, workflow orchestration, blueprint execution |
| **OUTPUT** | Response formatting, artifact generation |

---

## Modules

| Module | File Pattern | Purpose |
|--------|--------------|---------|
| **Routes** | `routes/*.py` | API endpoint definitions |
| **Services** | `services/*.py` | Business logic services |
| **Workflows** | `workflows/*.py` | Multi-step orchestration |
| **Generators** | `generators/*.py` | Diagram/index generation |
| **Scaffold** | `scaffold/*.py` | Repo scaffolding logic |

---

## File Naming Conventions

```
/src/app/
├── __init__.py
├── routes/
│   ├── __init__.py
│   ├── health.py          # Health check routes
│   ├── blueprints.py      # Blueprint CRUD routes
│   ├── scaffold.py        # Repo scaffolding routes
│   └── composio.py        # Composio integration routes
├── services/
│   ├── __init__.py
│   ├── blueprint_service.py    # Blueprint validation
│   ├── scaffold_service.py     # Repo creation
│   ├── diagram_service.py      # Diagram generation
│   └── gitingest_service.py    # Index generation
├── workflows/
│   ├── __init__.py
│   ├── scaffold_workflow.py    # Full repo scaffold flow
│   ├── validate_workflow.py    # Blueprint validation flow
│   └── sync_workflow.py        # Obsidian/Linear sync
├── generators/
│   ├── __init__.py
│   ├── mermaid.py         # Mermaid diagram gen
│   ├── plantuml.py        # PlantUML diagram gen
│   ├── svg.py             # SVG rendering
│   └── search_index.py    # Semantic search index
└── scaffold/
    ├── __init__.py
    ├── templates.py       # Scaffold templates
    ├── file_writer.py     # File generation
    └── git_ops.py         # Git init/push operations
```

---

## Dependencies

| Depends On | Reason |
|------------|--------|
| **system** | Auth, config, telemetry |
| **data** | Clients, models, schemas |

| Depended By | Reason |
|-------------|--------|
| **ai** | Uses services for tool implementations |
| **ui** | Calls routes via API |

---

## Core Workflows

### Scaffold Workflow
```
Request → Validate Blueprint → Create Repo → Write Files → Git Init → Push → Emit Event
```

### Validate Workflow
```
Request → Parse Manifest → Schema Check → HEIR Check → Return Result
```

### Diagram Workflow
```
Trigger → Scan Repo → Generate Mermaid → Render SVG → Commit to .github/generated/
```

---

## Kill Switch Behavior

| Failure | App Layer Response |
|---------|---------------------|
| Route not found | 404 response |
| Service error | 500 + error detail + sidecar log |
| Workflow step fails | Rollback completed steps → error response |
| Generator fails | Partial output + warning |

---

## Testing Requirements

```bash
# Run app layer tests
pytest tests/app/ -v

# Required coverage
# - Routes: 90%+
# - Services: 85%+
# - Workflows: 80%+ (complex orchestration)
# - Generators: 85%+

# E2E tests
pytest tests/app/ -m e2e
```

---

## Related Docs

- [10-imo.md](./10-imo.md) - IMO definition
- [imo_architecture.md](./imo_architecture.md) - Architecture overview
- [composio_connection.md](./composio_connection.md) - Composio integration
