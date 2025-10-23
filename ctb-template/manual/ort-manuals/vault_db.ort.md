---
role: vault_db
version: 1.0.0
altitude: 5k
driver: neon
status: active
---

# Vault DB ORT Manual

## Overview

**Role**: VAULT_DB
**Purpose**: Production data vault with schema enforcement, audit logs, immutable records
**Altitude**: 5k ft (Data Layer)
**Current Driver**: Neon Serverless PostgreSQL

## Operate

### Normal Operations

**Health Check**:
```bash
# Check vault status
ts-node /manual/scripts/status_check.ts

# Expected: {"vault_db": {"status": "healthy", "latency_ms": 100}}
```

**Access Policy**:
- ❌ **Direct writes FORBIDDEN** (Barton Doctrine)
- ✅ **Validator layer REQUIRED** for all access
- ✅ **Gatekeeper approval MANDATORY** for writes

### Critical Rules

1. **NO direct access to vault_db** - Always go through validator
2. **All writes must pass gatekeeper** - Enforced by policy
3. **Audit logging required** - Every write generates audit entry
4. **Schema enforcement** - Zod validation before writes

## Repair

### Failure Mode 1: Connection Failure

**Symptoms**: Status "disconnected", SQL errors

**Repair**:
1. Verify Neon credentials
2. Check connection string format
3. Test network connectivity to Neon endpoint
4. Verify SSL certificate validity

**Resolution**: 5-10 minutes

### Failure Mode 2: Schema Violation

**Symptoms**: Rejected writes, validation errors

**Repair**:
1. Review Zod schema definitions
2. Check data types and constraints
3. Update schema if requirements changed
4. Re-validate rejected records

**Resolution**: 10-20 minutes

### Failure Mode 3: Audit Log Overflow

**Symptoms**: Slow writes, storage warnings

**Repair**:
1. Archive old audit logs
2. Implement log rotation policy
3. Review audit retention requirements
4. Consider BigQuery archival

**Resolution**: 30-60 minutes

## Build

**Setup**:
```bash
# Install Neon client
npm install @neondatabase/serverless

# Configure connection
export DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname

# Run migrations
npm run migrate:up

# Test connection
psql $DATABASE_URL -c "SELECT version();"
```

**Schema Management**:
- Use Prisma or Drizzle for schema definition
- All schemas must have Zod validation
- Migrations require gatekeeper approval

## Train

**Key Concepts**:
- Barton Doctrine access policy (no direct writes)
- Validator layer requirements
- Gatekeeper approval workflow
- Audit logging and compliance

**Practice**: Simulate schema violation and recovery

---

**Driver Manifest**: `/drivers/vault_db/driver_manifest.json`
**Status**: `/manual/troubleshooting/system_diagnostics.json#vault_db`
**Access Policy**: `/ctb-template/.barton_policy.json`
