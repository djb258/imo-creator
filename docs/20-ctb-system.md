---
title: CTB Layer - System
aliases: [system, ctb-system, infrastructure]
tags:
  - ctb/system
  - imo/input
  - imo/middle
  - imo/output
  - doctrine/master
created: 2025-11-25
updated: 2025-11-25
---

# CTB Layer: System

> **Layer**: system
> **Path**: `/src/system`
> **Tests**: `/tests/system`

---

## Purpose

The **system** layer handles infrastructure, configuration, and cross-cutting concerns. This layer provides the foundation that all other layers depend on.

---

## IMO Phase Mapping

| IMO Phase | Responsibility |
|-----------|----------------|
| **INPUT** | Request validation, auth middleware, rate limiting |
| **MIDDLE** | Sidecar telemetry, HEIR compliance, process ID generation |
| **OUTPUT** | Health checks, observability, DLQ management |

---

## Modules

| Module | File Pattern | Purpose |
|--------|--------------|---------|
| **Config** | `config.py`, `config.ts` | Environment loading, secrets management |
| **Auth** | `auth/*.py` | Token validation, API key verification |
| **Telemetry** | `sidecar/*.py` | Event emission, logging, tracing |
| **HEIR** | `heir/*.py` | ID generation, compliance checks |
| **Health** | `health.py` | Liveness/readiness probes |
| **DLQ** | `dlq/*.py` | Dead letter queue management |

---

## File Naming Conventions

```
/src/system/
├── __init__.py
├── config.py              # Environment and secrets
├── constants.py           # System-wide constants
├── auth/
│   ├── __init__.py
│   ├── middleware.py      # Auth middleware
│   ├── tokens.py          # Token validation
│   └── api_keys.py        # API key management
├── heir/
│   ├── __init__.py
│   ├── ids.py             # Doctrine ID generation
│   ├── checks.py          # Compliance validation
│   └── schema.py          # HEIR schema version
├── sidecar/
│   ├── __init__.py
│   ├── events.py          # Event definitions
│   ├── emitter.py         # Telemetry emission
│   └── logger.py          # Structured logging
├── dlq/
│   ├── __init__.py
│   ├── writer.py          # Write failed payloads
│   └── reader.py          # Reprocess DLQ items
└── health.py              # Health check endpoints
```

---

## Dependencies

| Depends On | Reason |
|------------|--------|
| None | System is the foundation layer |

| Depended By | Reason |
|-------------|--------|
| **data** | Uses config, telemetry |
| **app** | Uses auth, health |
| **ai** | Uses config for LLM keys |
| **ui** | Uses constants |

---

## Kill Switch Behavior

| Failure | System Response |
|---------|-----------------|
| Config load fails | Halt startup, log critical error |
| Auth fails | Return 401, emit `auth.failed` event |
| Sidecar unreachable | Buffer events locally, retry |
| HEIR check fails | Block operation, return 422 |

---

## Testing Requirements

```bash
# Run system layer tests
pytest tests/system/ -v

# Required coverage
# - Config loading: 100%
# - Auth middleware: 90%+
# - HEIR compliance: 100%
# - Sidecar emission: 85%+
```

---

## Related Docs

- [10-imo.md](./10-imo.md) - IMO definition
- [heir.doctrine.yaml](../heir.doctrine.yaml) - HEIR rules
