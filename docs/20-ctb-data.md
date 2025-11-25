---
title: CTB Layer - Data
aliases: [data, ctb-data, persistence, schemas]
tags:
  - ctb/data
  - imo/input
  - imo/middle
  - imo/output
  - doctrine/master
created: 2025-11-25
updated: 2025-11-25
---

# CTB Layer: Data

> **Layer**: data
> **Path**: `/src/data`
> **Tests**: `/tests/data`

---

## Purpose

The **data** layer handles all data access, transformation, and persistence. This includes database operations, external API clients, and data validation schemas.

---

## IMO Phase Mapping

| IMO Phase | Responsibility |
|-----------|----------------|
| **INPUT** | Schema validation, intake parsing |
| **MIDDLE** | Data transformation, normalization, diffing |
| **OUTPUT** | Database writes, B2 uploads, external API calls |

---

## Modules

| Module | File Pattern | Purpose |
|--------|--------------|---------|
| **Schemas** | `schemas/*.py` | Pydantic/JSON Schema definitions |
| **Models** | `models/*.py` | Database ORM models |
| **Clients** | `clients/*.py` | External service clients |
| **Intake** | `intake/*.py` | Data ingestion and parsing |
| **Workbench** | `workbench/*.py` | DuckDB + B2 operations |

---

## File Naming Conventions

```
/src/data/
├── __init__.py
├── schemas/
│   ├── __init__.py
│   ├── blueprint.py       # Blueprint manifest schema
│   ├── mcp_registry.py    # MCP registry schema
│   └── heir.py            # HEIR ID schema
├── models/
│   ├── __init__.py
│   ├── base.py            # Base model class
│   ├── repo.py            # Repository model
│   └── artifact.py        # Artifact model
├── clients/
│   ├── __init__.py
│   ├── neon.py            # Neon PostgreSQL client
│   ├── firebase.py        # Firebase client
│   ├── b2.py              # Backblaze B2 client
│   ├── apify.py           # Apify client
│   └── bigquery.py        # BigQuery client
├── intake/
│   ├── __init__.py
│   ├── parser.py          # Input parsing
│   ├── validator.py       # Schema validation
│   └── normalizer.py      # Data normalization
└── workbench/
    ├── __init__.py
    ├── duckdb_ops.py      # DuckDB operations
    ├── diff_engine.py     # Delta computation
    └── sync.py            # B2 sync operations
```

---

## Dependencies

| Depends On | Reason |
|------------|--------|
| **system** | Config for credentials, telemetry for logging |

| Depended By | Reason |
|-------------|--------|
| **app** | Uses clients, models for business logic |
| **ai** | Uses schemas for prompt validation |

---

## Kill Switch Behavior

| Failure | Data Layer Response |
|---------|---------------------|
| Schema validation fails | Return 400 with validation errors |
| DB connection fails | Retry 3x → DLQ + alert |
| B2 upload fails | Retry 3x → local cache + alert |
| External API timeout | Retry with backoff → fallback |

---

## External Services

| Service | Client | Doctrine ID | Fallback |
|---------|--------|-------------|----------|
| Neon | `clients/neon.py` | 04.04.01 | None (primary DB) |
| Firebase | `clients/firebase.py` | 04.04.02 | Neon |
| Apify | `clients/apify.py` | 04.04.03 | Manual scrape |
| B2 | `clients/b2.py` | - | Local storage |
| BigQuery | `clients/bigquery.py` | - | Neon aggregates |

---

## Testing Requirements

```bash
# Run data layer tests
pytest tests/data/ -v

# Required coverage
# - Schema validation: 100%
# - Client operations: 85%+
# - Intake parsing: 95%+
# - Workbench ops: 80%+

# Integration tests (require credentials)
pytest tests/data/ -m integration
```

---

## Related Docs

- [10-imo.md](./10-imo.md) - IMO definition
- [workbench_config_schema.json](./workbench_config_schema.json) - Workbench schema
- [BACKBLAZE_B2_SETUP.md](./BACKBLAZE_B2_SETUP.md) - B2 setup guide
