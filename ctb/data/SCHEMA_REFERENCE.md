# Schema Reference - Complete Database Catalog

**Database**: IMO Creator
**Primary Database**: Neon PostgreSQL
**CTB Version**: 1.3.3
**Last Updated**: 2025-10-23

---

## 🗄️ Database Overview

### Active Databases

| Database | Type | Purpose | Connection Method | CTB Division |
|----------|------|---------|-------------------|--------------|
| Neon PostgreSQL | Relational | Primary application database | Direct `pg` client | ctb/data |
| Firebase Firestore | Document Store | Real-time data, sessions | Firebase Admin SDK | ctb/sys |
| BigQuery | Analytics Warehouse | Data analytics, reporting | Google Cloud SDK | ctb/data/warehouses |
| ChartDB | Schema Visualization | Database schema documentation | Automated workflow | ctb/data/schemas |

### Connection Details

**Neon PostgreSQL**:
- Environment Variable: `DATABASE_URL` or `NEON_DATABASE_URL`
- Format: `postgresql://user:password@host:5432/dbname`
- SSL Mode: Required
- **CRITICAL**: Use direct `pg` client, NOT Composio MCP

**Firebase Firestore**:
- Environment Variables: `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`
- SDK: Firebase Admin SDK
- Authentication: Service Account JSON

**BigQuery**:
- Environment Variables: `BIGQUERY_PROJECT_ID`, `BIGQUERY_DATASET`, `BIGQUERY_CREDENTIALS_PATH`
- SDK: Google Cloud SDK
- Authentication: Service Account JSON

---

## 📋 STAMPED Schema Legend

All database schemas follow the **STAMPED** documentation standard:

### S - Structure
- Table name and column definitions
- Data types and constraints
- Indexes and keys

### T - Traceability
- Barton/HEIR ID for table
- Creation date and author
- Last modified timestamp

### A - Authentication & Authorization
- Access control requirements
- Permission levels
- Row-level security (if applicable)

### M - Migration
- Migration file reference
- Schema version
- Rollback procedures

### P - Purpose
- Business purpose of table
- Use cases and workflows
- Related entities

### E - Enforcement
- Data validation rules
- CTB compliance requirements
- Audit logging

### D - Dependencies
- Foreign key relationships
- Dependent tables
- External service integrations

---

## 📊 Schema Catalog

### Table Index

| # | Table Name | Barton ID | Purpose | Status | Migration |
|---|------------|-----------|---------|--------|-----------|
| 1 | `shq_master_error_log` | BID-DATA-001 | Error logging and tracking | Active | 2025-08-19_create_shq_master_error_log.sql |
| 2 | `ids` | BID-DATA-002 | HEIR/ORBT ID registry | Active | 2025-08-19_ids.sql |
| 3 | `users` | BID-DATA-003 | User account management | Planned | 001_create_users.sql |
| 4 | `blueprints` | BID-DATA-004 | Blueprint storage | Planned | 002_create_blueprints.sql |
| 5 | `ssot_registry` | BID-DATA-005 | SSOT document storage | Planned | 003_create_ssot_registry.sql |
| 6 | `composio_logs` | BID-DATA-006 | Composio MCP call logs | Planned | 004_create_composio_logs.sql |
| 7 | `schema_migrations` | BID-DATA-999 | Migration version tracking | Active | Built-in |

---

## 🔍 Detailed Schema Definitions

### 1. shq_master_error_log

**Barton ID**: `BID-DATA-001`
**HEIR ID**: `HEIR-2025-08-SHQ-ERROR-01`
**Status**: Active
**Created**: 2025-08-19
**Author**: Dave Barton

#### S - Structure

```sql
CREATE TABLE shq_master_error_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_code VARCHAR(50) NOT NULL,
    error_message TEXT NOT NULL,
    error_stack TEXT,
    context JSONB,
    severity VARCHAR(20) DEFAULT 'error',
    source_system VARCHAR(100),
    source_component VARCHAR(100),
    unique_id VARCHAR(255),
    process_id VARCHAR(255),
    orbt_layer INTEGER,
    user_id UUID,
    session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP,
    resolution_notes TEXT,

    -- Indexes
    INDEX idx_error_code (error_code),
    INDEX idx_unique_id (unique_id),
    INDEX idx_process_id (process_id),
    INDEX idx_created_at (created_at),
    INDEX idx_severity (severity),
    INDEX idx_source_system (source_system)
);
```

**Columns**:
- `id` (UUID): Primary key, auto-generated
- `error_code` (VARCHAR): Application error code
- `error_message` (TEXT): Human-readable error message
- `error_stack` (TEXT): Stack trace for debugging
- `context` (JSONB): Additional context data
- `severity` (VARCHAR): "critical", "error", "warning", "info"
- `source_system` (VARCHAR): System that generated error
- `source_component` (VARCHAR): Component within system
- `unique_id` (VARCHAR): HEIR unique identifier
- `process_id` (VARCHAR): HEIR process identifier
- `orbt_layer` (INTEGER): ORBT layer (1-4)
- `user_id` (UUID): Associated user (if applicable)
- `session_id` (VARCHAR): Session identifier
- `created_at` (TIMESTAMP): Error timestamp
- `resolved_at` (TIMESTAMP): Resolution timestamp
- `resolution_notes` (TEXT): How error was resolved

#### T - Traceability

- **Migration File**: `2025-08-19_create_shq_master_error_log.sql`
- **Source Path**: `./imo-creator/garage-mcp/packages/sql/`
- **Commit**: `1617b8ef`
- **ChartDB Schema**: `ctb/data/schemas/chartdb_schemas/schemas/2025-08-19_create_shq_master_error_log.json`

#### A - Authentication & Authorization

- **Read Access**: Administrators, DevOps, Support team
- **Write Access**: Application services (automated)
- **Delete Access**: Administrators only (after 90 days)
- **Row-Level Security**: None (all authenticated users can read)

#### M - Migration

**Creation Migration**:
```bash
psql $DATABASE_URL < ctb/data/migrations/2025-08-19_create_shq_master_error_log.sql
```

**Rollback**:
```sql
DROP TABLE IF EXISTS shq_master_error_log;
```

**Version**: 1.0

#### P - Purpose

**Business Purpose**: Centralized error logging for all IMO Creator components

**Use Cases**:
1. Error tracking and debugging
2. System health monitoring
3. User issue investigation
4. Compliance and audit trails
5. Performance analysis
6. HEIR/ORBT process tracking

**Workflows**:
- Applications log errors via API
- Monitoring system queries for critical errors
- Support team investigates user-reported issues
- DevOps analyzes error patterns

**Related Entities**:
- `users`: Associated user context
- `blueprints`: Blueprint execution errors
- `composio_logs`: External service errors

#### E - Enforcement

**Validation Rules**:
- `error_code` must be non-empty
- `severity` must be one of: "critical", "error", "warning", "info"
- `unique_id` should follow HEIR format if provided
- `process_id` should follow HEIR process format if provided

**CTB Compliance**:
- HEIR/ORBT tracking via `unique_id`, `process_id`, `orbt_layer`
- Audit logging enabled
- Retention policy: 90 days for errors, 365 days for critical

**Data Quality**:
- No NULL values for `error_code`, `error_message`
- JSON validation for `context` field
- Timestamp validation for `created_at`

#### D - Dependencies

**Foreign Keys**: None (designed for loose coupling)

**Dependent Tables**: None

**External Integrations**:
- Sentry (optional): Export critical errors
- Firebase: Real-time error notifications
- Composio MCP: Log external service errors

**Linked Processes**:
- HEIR Process: `shq.03.imo.V1.{date}.error_tracking`
- ORBT Layer: 3 (Output - logging results)

---

### 2. ids

**Barton ID**: `BID-DATA-002`
**HEIR ID**: `HEIR-2025-08-SHQ-IDS-01`
**Status**: Active
**Created**: 2025-08-19
**Author**: Dave Barton

#### S - Structure

```sql
CREATE TABLE ids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unique_id VARCHAR(255) UNIQUE NOT NULL,
    process_id VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    schema_version VARCHAR(50) DEFAULT 'HEIR/1.0',
    blueprint_version VARCHAR(50),
    orbt_layer INTEGER,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    last_accessed TIMESTAMP DEFAULT NOW(),
    access_count INTEGER DEFAULT 0,

    -- Indexes
    INDEX idx_unique_id (unique_id),
    INDEX idx_process_id (process_id),
    INDEX idx_entity_type (entity_type),
    INDEX idx_created_at (created_at)
);
```

**Columns**:
- `id` (UUID): Primary key, auto-generated
- `unique_id` (VARCHAR): HEIR unique identifier (UNIQUE)
- `process_id` (VARCHAR): HEIR process identifier
- `entity_type` (VARCHAR): Type of entity (blueprint, ssot, user, etc.)
- `entity_id` (VARCHAR): Entity's internal ID
- `schema_version` (VARCHAR): HEIR schema version
- `blueprint_version` (VARCHAR): Blueprint version
- `orbt_layer` (INTEGER): ORBT layer (1-4)
- `metadata` (JSONB): Additional metadata
- `created_at` (TIMESTAMP): Creation timestamp
- `last_accessed` (TIMESTAMP): Last access timestamp
- `access_count` (INTEGER): Number of times accessed

#### T - Traceability

- **Migration File**: `2025-08-19_ids.sql`
- **Source Path**: `./imo-creator/garage-mcp/packages/sql/`
- **Commit**: `1617b8ef`
- **ChartDB Schema**: `ctb/data/schemas/chartdb_schemas/schemas/2025-08-19_ids.json`

#### A - Authentication & Authorization

- **Read Access**: All authenticated users
- **Write Access**: Application services only
- **Delete Access**: Administrators only (never recommended)
- **Row-Level Security**: None

#### M - Migration

**Creation Migration**:
```bash
psql $DATABASE_URL < ctb/data/migrations/2025-08-19_ids.sql
```

**Rollback**:
```sql
DROP TABLE IF EXISTS ids;
```

**Version**: 1.0

#### P - Purpose

**Business Purpose**: Central registry for all HEIR/ORBT identifiers in the system

**Use Cases**:
1. Track all unique IDs generated
2. Prevent ID collisions
3. Audit trail for entity creation
4. HEIR/ORBT compliance verification
5. Process tracking and lineage

**Workflows**:
- Generate new HEIR ID → Register in `ids` table
- Look up entity by HEIR ID
- Track entity access patterns
- Validate HEIR ID format

**Related Entities**:
- All tables with HEIR tracking
- `blueprints`: Blueprint HEIR IDs
- `ssot_registry`: SSOT HEIR IDs
- `composio_logs`: External call HEIR IDs

#### E - Enforcement

**Validation Rules**:
- `unique_id` must be unique across entire table
- `unique_id` format: `{db}-{subhive}-{app}-{timestamp}-{random16}`
- `process_id` format: `{db}.{subhive}.{app}.V{ver}.{date}.{stage}`
- `schema_version` default: "HEIR/1.0"

**CTB Compliance**:
- All HEIR IDs must be registered
- Automatic access tracking
- Audit logging for all operations

**Data Quality**:
- No NULL values for `unique_id`, `process_id`, `entity_type`
- Unique constraint on `unique_id`
- JSON validation for `metadata`

#### D - Dependencies

**Foreign Keys**: None (central registry)

**Dependent Tables**:
- All tables using HEIR tracking should reference this table
- Soft reference via `unique_id` (not enforced FK)

**External Integrations**:
- HEIR/ORBT generator utilities: `ctb/ai/orbt-utils/heir_generator.py`
- SSOT processing: `ctb/sys/server/main.py` (SSOT save endpoint)

**Linked Processes**:
- HEIR Process: `shq.03.imo.V1.{date}.id_registry`
- ORBT Layer: 4 (Orchestration - managing IDs)

---

### 3. users (Planned)

**Barton ID**: `BID-DATA-003`
**HEIR ID**: `HEIR-2025-10-SHQ-USERS-01`
**Status**: Planned
**Target Date**: Q4 2025

#### S - Structure

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(20) DEFAULT 'active',
    unique_id VARCHAR(255) UNIQUE,
    process_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,

    -- Indexes
    INDEX idx_email (email),
    INDEX idx_unique_id (unique_id),
    INDEX idx_role (role),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);
```

#### P - Purpose

**Business Purpose**: User account management and authentication

**Use Cases**:
1. User registration and login
2. Role-based access control
3. User profile management
4. Activity tracking

#### E - Enforcement

**CTB Compliance**: HEIR ID required for all users

**Security**:
- Password hashing required (bcrypt/argon2)
- Email validation
- Rate limiting on login attempts

---

### 4. blueprints (Planned)

**Barton ID**: `BID-DATA-004`
**HEIR ID**: `HEIR-2025-10-SHQ-BLUEPRINTS-01`
**Status**: Planned
**Target Date**: Q4 2025

#### S - Structure

```sql
CREATE TABLE blueprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manifest JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    unique_id VARCHAR(255) UNIQUE NOT NULL,
    process_id VARCHAR(255) NOT NULL,
    blueprint_version_hash VARCHAR(64),
    schema_version VARCHAR(50) DEFAULT 'HEIR/1.0',
    owner_id UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP,

    -- Indexes
    INDEX idx_slug (slug),
    INDEX idx_unique_id (unique_id),
    INDEX idx_status (status),
    INDEX idx_owner_id (owner_id)
);
```

#### P - Purpose

**Business Purpose**: Store and manage workflow blueprints

**Use Cases**:
1. Blueprint creation and editing
2. Version control for blueprints
3. Blueprint discovery and search
4. Execution tracking

#### E - Enforcement

**CTB Compliance**: HEIR/ORBT tracking required

**Data Quality**:
- Manifest must be valid YAML/JSON
- Version hash for change detection

---

### 5. ssot_registry (Planned)

**Barton ID**: `BID-DATA-005`
**HEIR ID**: `HEIR-2025-10-SHQ-SSOT-01`
**Status**: Planned
**Target Date**: Q4 2025

#### S - Structure

```sql
CREATE TABLE ssot_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unique_id VARCHAR(255) UNIQUE NOT NULL,
    process_id VARCHAR(255) NOT NULL,
    ssot JSONB NOT NULL,
    schema_version VARCHAR(50) DEFAULT 'HEIR/1.0',
    blueprint_version_hash VARCHAR(64),
    app_name VARCHAR(255),
    stage VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),

    -- Indexes
    INDEX idx_unique_id (unique_id),
    INDEX idx_process_id (process_id),
    INDEX idx_app_name (app_name),
    INDEX idx_stage (stage),
    INDEX idx_created_at (created_at)
);
```

#### P - Purpose

**Business Purpose**: Single Source of Truth (SSOT) document storage

**Use Cases**:
1. Store SSOT documents with HEIR IDs
2. Version tracking
3. Audit trail
4. Data lineage

---

### 6. composio_logs (Planned)

**Barton ID**: `BID-DATA-006`
**HEIR ID**: `HEIR-2025-10-SHQ-COMPOSIO-01`
**Status**: Planned
**Target Date**: Q4 2025

#### S - Structure

```sql
CREATE TABLE composio_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_name VARCHAR(255) NOT NULL,
    unique_id VARCHAR(255) NOT NULL,
    process_id VARCHAR(255) NOT NULL,
    orbt_layer INTEGER NOT NULL,
    blueprint_version VARCHAR(50),
    request_data JSONB,
    response_data JSONB,
    status VARCHAR(50),
    execution_time_ms INTEGER,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),

    -- Indexes
    INDEX idx_tool_name (tool_name),
    INDEX idx_unique_id (unique_id),
    INDEX idx_process_id (process_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);
```

#### P - Purpose

**Business Purpose**: Log all Composio MCP tool calls for auditing and debugging

**Use Cases**:
1. Track external service calls
2. Debugging integration issues
3. Performance monitoring
4. Billing and usage tracking

#### E - Enforcement

**CTB Compliance**: HEIR/ORBT tracking required for all calls

---

### 7. schema_migrations

**Barton ID**: `BID-DATA-999`
**Status**: Active (Built-in)

#### S - Structure

```sql
CREATE TABLE schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT NOW()
);
```

#### P - Purpose

**Business Purpose**: Track which migrations have been applied

**Use Cases**:
1. Migration version control
2. Prevent duplicate migrations
3. Rollback support

---

## 📈 Schema Statistics

| Metric | Value |
|--------|-------|
| Total Tables | 7 |
| Active Tables | 3 |
| Planned Tables | 4 |
| Tables with HEIR Tracking | 7 (100%) |
| Tables with Indexes | 7 (100%) |
| Tables with JSONB | 6 (85%) |
| Average Columns per Table | 12 |

---

## 🔗 Schema Relationships

### Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ BLUEPRINTS : owns
    USERS ||--o{ SSOT_REGISTRY : creates
    USERS ||--o{ SHQ_MASTER_ERROR_LOG : generates

    IDS ||--o{ USERS : tracks
    IDS ||--o{ BLUEPRINTS : tracks
    IDS ||--o{ SSOT_REGISTRY : tracks
    IDS ||--o{ COMPOSIO_LOGS : tracks

    BLUEPRINTS ||--o{ SSOT_REGISTRY : contains
    COMPOSIO_LOGS ||--o{ SHQ_MASTER_ERROR_LOG : logs_errors

    USERS {
        uuid id PK
        varchar email UK
        varchar unique_id UK
        varchar role
    }

    IDS {
        uuid id PK
        varchar unique_id UK
        varchar process_id
        varchar entity_type
    }

    BLUEPRINTS {
        uuid id PK
        varchar slug UK
        varchar unique_id UK
        jsonb manifest
    }

    SSOT_REGISTRY {
        uuid id PK
        varchar unique_id UK
        jsonb ssot
    }

    SHQ_MASTER_ERROR_LOG {
        uuid id PK
        varchar error_code
        varchar unique_id
        varchar process_id
    }

    COMPOSIO_LOGS {
        uuid id PK
        varchar tool_name
        varchar unique_id
        varchar process_id
    }
```

---

## 🚀 Migration Strategy

### Current Migrations

```bash
ctb/data/migrations/
├── 2025-08-19_create_shq_master_error_log.sql
├── 2025-08-19_ids.sql
└── (Future migrations)
```

### Running Migrations

**Direct Method (Recommended)**:
```bash
# Apply specific migration
psql $DATABASE_URL < ctb/data/migrations/2025-08-19_create_shq_master_error_log.sql

# Apply all migrations
for f in ctb/data/migrations/*.sql; do
  echo "Applying $f..."
  psql $DATABASE_URL < "$f"
done
```

**Python Method**:
```python
from psycopg2 import connect
import os
from pathlib import Path

conn = connect(os.getenv('DATABASE_URL'))
cursor = conn.cursor()

migrations_dir = Path('ctb/data/migrations')
for migration_file in sorted(migrations_dir.glob('*.sql')):
    sql = migration_file.read_text()
    cursor.execute(sql)
    print(f"Applied: {migration_file.name}")

conn.commit()
cursor.close()
conn.close()
```

---

## 🔒 Security & Compliance

### Data Protection

1. **Encryption at Rest**: Enabled via Neon PostgreSQL
2. **Encryption in Transit**: SSL/TLS required for all connections
3. **Access Control**: Row-level security planned for sensitive tables
4. **Audit Logging**: All write operations logged

### HEIR/ORBT Compliance

**Required for All Tables**:
- ✅ `unique_id` column (HEIR unique identifier)
- ✅ `process_id` column (HEIR process identifier)
- ✅ Registration in `ids` table
- ✅ Audit trail in relevant log tables

**ORBT Layers**:
1. **Input Layer**: User-facing tables (`users`, `blueprints`)
2. **Processing Layer**: Business logic tables (`ssot_registry`)
3. **Output Layer**: Logging tables (`shq_master_error_log`)
4. **Orchestration Layer**: Registry tables (`ids`)

---

## 📚 Related Documentation

- **Data README**: `ctb/data/README.md`
- **API Catalog**: `ctb/sys/api/API_CATALOG.md`
- **Dependencies**: `ctb/meta/DEPENDENCIES.md`
- **ChartDB Schemas**: `ctb/data/schemas/chartdb_schemas/`
- **Migration Guide**: `ctb/data/README.md#migrations`

---

## 🔄 Maintenance

### Schema Updates

1. Create migration file in `ctb/data/migrations/`
2. Update this SCHEMA_REFERENCE.md
3. Update ChartDB schema (automatic via workflow)
4. Run migration on test database
5. Test thoroughly
6. Apply to production

### ChartDB Automation

Schemas are automatically updated via GitHub Actions:
- Trigger: Schema changes or weekly schedule
- Output: `ctb/data/schemas/chartdb_schemas/schemas/`
- Workflow: `.github/workflows/chartdb_automation.yml`

---

**Maintainer**: CTB/DATA Team
**Review Schedule**: Monthly
**Next Review**: 2025-11-23
**Schema Version**: 1.0
**Total Tables**: 7 (3 active, 4 planned)
