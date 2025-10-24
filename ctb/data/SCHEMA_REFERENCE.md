# Schema Reference - Complete Database Catalog

**Purpose**: Complete catalog of all database objects with full traceability

**Last Updated**: 2025-10-23
**Schema Version**: 1.0.0

---

## 📋 Table of Contents

- [Overview](#overview)
- [STAMPED Schema Legend](#stamped-schema-legend)
- [Neon PostgreSQL Tables](#neon-postgresql-tables)
- [Firebase/Firestore Collections](#firebasefirestore-collections)
- [BigQuery Tables](#bigquery-tables-optional)
- [Views](#views)
- [Indexes](#indexes)
- [Triggers](#triggers)
- [Schema Enforcement](#schema-enforcement)
- [Migration Tracking](#migration-tracking)

---

## 🎯 Overview

### Database Systems

1. **Neon PostgreSQL** (Primary)
   - Purpose: Persistent relational data
   - Tables: 15+
   - Schemas: `public`, `shq`

2. **Firebase/Firestore** (Workbench)
   - Purpose: Real-time data, sessions
   - Collections: 10+
   - Security Rules: Enforced

3. **BigQuery** (Analytics - Optional)
   - Purpose: Data warehouse, analytics
   - Datasets: `imo_analytics`
   - Tables: 5+

---

## 📖 STAMPED Schema Legend

**STAMPED** = Schema Template Architecture for Marketing Platform Engineering Database

### Barton ID Format

**Format**: `BART-{SYSTEM}-{TABLE}-{VERSION}`

**Example**: `BART-SHQ-USERS-V1`

**Components**:
- `BART`: Barton ID prefix
- `SYSTEM`: Database system (`SHQ`, `FIRE`, `BQ`)
- `TABLE`: Table/collection name
- `VERSION`: Schema version (V1, V2, etc.)

### STAMPED Fields

All STAMPED-compliant tables include these tracking fields:

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| `heir_id` | VARCHAR(50) | HEIR tracking ID | Yes |
| `process_id` | VARCHAR(50) | Process tracking ID | Yes |
| `created_at` | TIMESTAMP | Creation timestamp | Yes |
| `updated_at` | TIMESTAMP | Last update timestamp | Yes |
| `created_by` | VARCHAR(100) | Creator user/system | Yes |
| `orbt_layer` | INTEGER | ORBT layer (1-4) | Yes |
| `blueprint_version` | VARCHAR(20) | Blueprint version | Yes |
| `compliance_score` | INTEGER | CTB compliance score | No |
| `enforcement_level` | VARCHAR(20) | Enforcement level | No |

### Enforcement Levels

| Level | Description | Validation |
|-------|-------------|------------|
| `STRICT` | All fields required, strict validation | Pre-insert/update triggers |
| `STANDARD` | Standard validation, optional fields allowed | Application-level |
| `RELAXED` | Minimal validation, flexible schema | Warnings only |
| `NONE` | No enforcement | Disabled |

---

## 🗄️ Neon PostgreSQL Tables

### Schema: `public`

---

#### 1. users

**Barton ID**: `BART-SHQ-USERS-V1`
**Purpose**: User accounts and authentication
**Enforcement**: STRICT
**STAMPED Compliant**: Yes

**Source Files**:
- Schema: `ctb/data/neon/schemas/users.sql`
- Migration: `ctb/data/migrations/neon/2025-10-20_create_users_table.sql`
- Model: `ctb/data/zod/models/user.ts`

**Linked Processes**:
- `PRC-AUTH-LOGIN`: User authentication
- `PRC-AUTH-REGISTER`: User registration
- `PRC-USER-UPDATE`: Profile updates

**Linked Endpoints**:
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/users/{user_id}`
- `PUT /api/users/{user_id}`

**Schema Definition**:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',

  -- STAMPED fields
  heir_id VARCHAR(50) NOT NULL,
  process_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100) NOT NULL,
  orbt_layer INTEGER DEFAULT 3,
  blueprint_version VARCHAR(20) DEFAULT '1.0',

  -- Indexes
  CONSTRAINT users_email_unique UNIQUE (email),
  CONSTRAINT users_heir_id_unique UNIQUE (heir_id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_heir_id ON users(heir_id);
CREATE INDEX idx_users_role ON users(role);
```

**Constraints**:
- Email must be valid format
- Password must be hashed (bcrypt)
- Role must be one of: `user`, `admin`, `moderator`
- HEIR ID must follow format: `HEIR-YYYY-MM-USER-AUTH-VN`

**Validation Schema**:
```typescript
// ctb/data/zod/models/user.ts
export const UserSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  name: z.string().min(1).max(255).optional(),
  role: z.enum(['user', 'admin', 'moderator']),
  heir_id: z.string().regex(/^HEIR-\d{4}-\d{2}-USER-AUTH-\d{2}$/),
  process_id: z.string().regex(/^PRC-AUTH-\d{10}$/),
  created_at: z.date(),
  updated_at: z.date(),
});
```

---

#### 2. imos

**Barton ID**: `BART-SHQ-IMOS-V1`
**Purpose**: Indexed Marketing Operations
**Enforcement**: STANDARD
**STAMPED Compliant**: Yes

**Source Files**:
- Schema: `ctb/data/neon/schemas/imos.sql`
- Migration: `ctb/data/migrations/neon/2025-10-21_create_imos_table.sql`
- Model: `ctb/data/zod/models/imo.ts`

**Linked Processes**:
- `PRC-IMO-CREATE`: IMO generation
- `PRC-IMO-UPDATE`: IMO updates
- `PRC-IMO-DELETE`: IMO deletion

**Linked Endpoints**:
- `POST /api/imo/generate`
- `GET /api/imo/list`
- `GET /api/imo/{imo_id}`
- `PUT /api/imo/{imo_id}`
- `DELETE /api/imo/{imo_id}`

**Schema Definition**:
```sql
CREATE TABLE imos (
  id SERIAL PRIMARY KEY,
  imo_id VARCHAR(50) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  requirements TEXT,
  target_audience VARCHAR(255),
  budget DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'draft',
  components JSONB,
  metrics JSONB,

  -- STAMPED fields
  heir_id VARCHAR(50) NOT NULL,
  process_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100) NOT NULL,
  orbt_layer INTEGER DEFAULT 3,
  blueprint_version VARCHAR(20) DEFAULT '1.0',
  compliance_score INTEGER DEFAULT 0,

  CONSTRAINT imos_imo_id_unique UNIQUE (imo_id),
  CONSTRAINT imos_heir_id_unique UNIQUE (heir_id)
);

CREATE INDEX idx_imos_user_id ON imos(user_id);
CREATE INDEX idx_imos_status ON imos(status);
CREATE INDEX idx_imos_heir_id ON imos(heir_id);
CREATE INDEX idx_imos_created_at ON imos(created_at DESC);
```

**Constraints**:
- IMO ID format: `imo_{uuid}`
- Status must be one of: `draft`, `active`, `paused`, `completed`, `archived`
- Budget must be positive
- HEIR ID format: `HEIR-YYYY-MM-IMO-CREATE-VN`
- Components and metrics must be valid JSON

**Validation Schema**:
```typescript
// ctb/data/zod/models/imo.ts
export const IMOSchema = z.object({
  id: z.number().int().positive(),
  imo_id: z.string().regex(/^imo_[a-f0-9-]+$/),
  user_id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  budget: z.number().positive().optional(),
  status: z.enum(['draft', 'active', 'paused', 'completed', 'archived']),
  heir_id: z.string().regex(/^HEIR-\d{4}-\d{2}-IMO-CREATE-\d{2}$/),
  process_id: z.string().regex(/^PRC-IMO-\d{10}$/),
});
```

---

#### 3. composio_executions

**Barton ID**: `BART-SHQ-COMPEXEC-V1`
**Purpose**: Composio tool execution log
**Enforcement**: STANDARD
**STAMPED Compliant**: Yes

**Source Files**:
- Schema: `ctb/data/neon/schemas/composio_executions.sql`
- Migration: `ctb/data/migrations/neon/2025-10-22_create_composio_executions.sql`
- Model: `ctb/data/zod/models/composio_execution.ts`

**Linked Processes**:
- `PRC-COMP-EXEC`: Composio tool execution
- `PRC-COMP-RETRY`: Execution retry
- `PRC-COMP-AUDIT`: Execution audit

**Linked Endpoints**:
- `POST /api/composio/tools/execute`
- `GET /api/composio/executions/{execution_id}`
- `GET /api/composio/executions/list`

**Schema Definition**:
```sql
CREATE TABLE composio_executions (
  id SERIAL PRIMARY KEY,
  execution_id VARCHAR(50) UNIQUE NOT NULL,
  tool_name VARCHAR(100) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  arguments JSONB NOT NULL,
  result JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  error_message TEXT,
  execution_time_ms INTEGER,

  -- STAMPED fields
  heir_id VARCHAR(50) NOT NULL,
  process_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100) NOT NULL,
  orbt_layer INTEGER DEFAULT 2,
  blueprint_version VARCHAR(20) DEFAULT '1.0',

  CONSTRAINT composio_executions_execution_id_unique UNIQUE (execution_id),
  CONSTRAINT composio_executions_heir_id_unique UNIQUE (heir_id)
);

CREATE INDEX idx_composio_executions_tool_name ON composio_executions(tool_name);
CREATE INDEX idx_composio_executions_status ON composio_executions(status);
CREATE INDEX idx_composio_executions_created_at ON composio_executions(created_at DESC);
CREATE INDEX idx_composio_executions_heir_id ON composio_executions(heir_id);
```

**Constraints**:
- Status must be: `pending`, `running`, `success`, `failed`, `timeout`
- Tool name must match available Composio tools
- Arguments must be valid JSON
- HEIR ID format: `HEIR-YYYY-MM-SYS-COMP-VN`

---

#### 4. ctb_compliance_log

**Barton ID**: `BART-SHQ-CTBLOG-V1`
**Purpose**: CTB compliance audit log
**Enforcement**: STRICT
**STAMPED Compliant**: Yes

**Source Files**:
- Schema: `ctb/data/neon/schemas/ctb_compliance_log.sql`
- Migration: `ctb/data/migrations/neon/2025-10-23_create_ctb_compliance_log.sql`
- Model: `ctb/data/zod/models/ctb_compliance.ts`

**Linked Processes**:
- `PRC-CTB-TAG`: File tagging
- `PRC-CTB-AUDIT`: Compliance audit
- `PRC-CTB-REMEDIATE`: Issue remediation

**Linked Endpoints**:
- `POST /api/ctb/tag`
- `POST /api/ctb/audit`
- `POST /api/ctb/remediate`
- `GET /api/ctb/history`

**Schema Definition**:
```sql
CREATE TABLE ctb_compliance_log (
  id SERIAL PRIMARY KEY,
  log_id VARCHAR(50) UNIQUE NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  compliance_score INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL,
  issues JSONB,
  recommendations JSONB,
  actions_performed JSONB,
  report_path VARCHAR(255),

  -- STAMPED fields
  heir_id VARCHAR(50) NOT NULL,
  process_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100) NOT NULL DEFAULT 'ctb_system',
  orbt_layer INTEGER DEFAULT 1,
  blueprint_version VARCHAR(20) DEFAULT '1.0',
  enforcement_level VARCHAR(20) DEFAULT 'STRICT',

  CONSTRAINT ctb_compliance_log_log_id_unique UNIQUE (log_id),
  CONSTRAINT ctb_compliance_log_heir_id_unique UNIQUE (heir_id),
  CONSTRAINT ctb_compliance_score_range CHECK (compliance_score >= 0 AND compliance_score <= 100)
);

CREATE INDEX idx_ctb_compliance_log_action_type ON ctb_compliance_log(action_type);
CREATE INDEX idx_ctb_compliance_log_score ON ctb_compliance_log(compliance_score);
CREATE INDEX idx_ctb_compliance_log_created_at ON ctb_compliance_log(created_at DESC);
```

**Constraints**:
- Action type: `tag`, `audit`, `remediate`
- Compliance score: 0-100
- Status: `completed`, `failed`, `partial`
- HEIR ID format: `HEIR-YYYY-MM-SYS-CTB-VN`

---

#### 5. error_log

**Barton ID**: `BART-SHQ-ERRLOG-V1`
**Purpose**: System error logging
**Enforcement**: STANDARD
**STAMPED Compliant**: Yes

**Source Files**:
- Schema: `ctb/data/neon/schemas/error_log.sql`
- Migration: `ctb/data/migrations/neon/2025-10-23_create_error_log.sql`
- Model: `ctb/data/zod/models/error_log.ts`

**Linked Processes**:
- `PRC-ERR-LOG`: Error logging
- `PRC-ERR-RESOLVE`: Error resolution
- `PRC-ERR-NOTIFY`: Error notification

**Schema Definition**:
```sql
CREATE TABLE error_log (
  id SERIAL PRIMARY KEY,
  error_id VARCHAR(50) UNIQUE NOT NULL,
  severity VARCHAR(20) NOT NULL,
  error_code VARCHAR(50),
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  context JSONB,
  resolution_status VARCHAR(50) DEFAULT 'unresolved',
  resolved_at TIMESTAMP,
  resolved_by VARCHAR(100),

  -- STAMPED fields
  heir_id VARCHAR(50) NOT NULL,
  process_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100) NOT NULL,
  orbt_layer INTEGER DEFAULT 1,
  blueprint_version VARCHAR(20) DEFAULT '1.0',

  CONSTRAINT error_log_error_id_unique UNIQUE (error_id),
  CONSTRAINT error_log_severity_check CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);

CREATE INDEX idx_error_log_severity ON error_log(severity);
CREATE INDEX idx_error_log_resolution_status ON error_log(resolution_status);
CREATE INDEX idx_error_log_created_at ON error_log(created_at DESC);
```

**Constraints**:
- Severity: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- Resolution status: `unresolved`, `in_progress`, `resolved`, `archived`
- HEIR ID format: `HEIR-YYYY-MM-SYS-ERR-VN`

---

#### 6. schema_migrations

**Barton ID**: `BART-SHQ-MIGRATIONS-V1`
**Purpose**: Migration tracking
**Enforcement**: STRICT
**STAMPED Compliant**: No (system table)

**Source Files**:
- Schema: `ctb/data/neon/schemas/schema_migrations.sql`
- Migration: Auto-created by migration runner

**Schema Definition**:
```sql
CREATE TABLE schema_migrations (
  id SERIAL PRIMARY KEY,
  migration_name VARCHAR(255) UNIQUE NOT NULL,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  execution_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT
);

CREATE INDEX idx_schema_migrations_executed_at ON schema_migrations(executed_at DESC);
```

---

### Schema: `shq` (SubHive Queue)

---

#### 7. shq.tasks

**Barton ID**: `BART-SHQ-TASKS-V1`
**Purpose**: Background task queue
**Enforcement**: STANDARD
**STAMPED Compliant**: Yes

**Source Files**:
- Schema: `ctb/data/neon/schemas/shq/tasks.sql`
- Migration: `ctb/data/migrations/neon/2025-10-23_create_shq_tasks.sql`

**Linked Processes**:
- `PRC-TASK-CREATE`: Task creation
- `PRC-TASK-EXEC`: Task execution
- `PRC-TASK-RETRY`: Task retry

**Schema Definition**:
```sql
CREATE SCHEMA IF NOT EXISTS shq;

CREATE TABLE shq.tasks (
  id SERIAL PRIMARY KEY,
  task_id VARCHAR(50) UNIQUE NOT NULL,
  task_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'queued',
  priority INTEGER DEFAULT 5,
  max_retries INTEGER DEFAULT 3,
  retry_count INTEGER DEFAULT 0,
  scheduled_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  error_message TEXT,

  -- STAMPED fields
  heir_id VARCHAR(50) NOT NULL,
  process_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100) NOT NULL,
  orbt_layer INTEGER DEFAULT 2,
  blueprint_version VARCHAR(20) DEFAULT '1.0',

  CONSTRAINT shq_tasks_task_id_unique UNIQUE (task_id)
);

CREATE INDEX idx_shq_tasks_status ON shq.tasks(status);
CREATE INDEX idx_shq_tasks_scheduled_at ON shq.tasks(scheduled_at);
CREATE INDEX idx_shq_tasks_priority ON shq.tasks(priority DESC);
```

**Constraints**:
- Status: `queued`, `running`, `completed`, `failed`, `cancelled`
- Priority: 1-10 (1 = lowest, 10 = highest)
- Task types: `email_send`, `imo_generate`, `compliance_audit`, `data_sync`

---

## 🔥 Firebase/Firestore Collections

### Collection: users_sessions

**Barton ID**: `BART-FIRE-USERSESS-V1`
**Purpose**: User session management
**Enforcement**: STANDARD
**STAMPED Compliant**: Yes

**Source Files**:
- Schema: `ctb/data/firebase/schemas/user_sessions.ts`
- Security Rules: `ctb/data/firebase/rules/firestore.rules`

**Linked Processes**:
- `PRC-AUTH-SESSION`: Session creation
- `PRC-AUTH-REFRESH`: Session refresh
- `PRC-AUTH-LOGOUT`: Session termination

**Document Structure**:
```typescript
interface UserSession {
  id: string; // Session ID
  userId: string;
  deviceInfo: {
    browser: string;
    os: string;
    ip: string;
  };
  expiresAt: Timestamp;

  // STAMPED fields
  heirId: string;
  processId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  orbtLayer: number; // 3
  blueprintVersion: string; // "1.0"
}
```

**Security Rules**:
```javascript
match /users_sessions/{sessionId} {
  allow read, delete: if request.auth != null &&
    resource.data.userId == request.auth.uid;
  allow create: if request.auth != null;
}
```

---

### Collection: imo_drafts

**Barton ID**: `BART-FIRE-IMODRAFT-V1`
**Purpose**: Real-time IMO editing
**Enforcement**: RELAXED
**STAMPED Compliant**: Yes

**Source Files**:
- Schema: `ctb/data/firebase/schemas/imo_drafts.ts`
- Security Rules: `ctb/data/firebase/rules/firestore.rules`

**Linked Processes**:
- `PRC-IMO-DRAFT`: Draft creation
- `PRC-IMO-EDIT`: Real-time editing
- `PRC-IMO-PROMOTE`: Promotion to Neon

**Document Structure**:
```typescript
interface IMODraft {
  id: string;
  userId: string;
  name: string;
  content: any;
  status: 'editing' | 'client' | 'published';
  lastEditedAt: Timestamp;

  // STAMPED fields
  heirId: string;
  processId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  orbtLayer: number; // 3
  blueprintVersion: string;
}
```

**Security Rules**:
```javascript
match /imo_drafts/{draftId} {
  allow read, write: if request.auth != null &&
    resource.data.userId == request.auth.uid;
}
```

---

### Collection: activity_log

**Barton ID**: `BART-FIRE-ACTLOG-V1`
**Purpose**: Real-time activity tracking
**Enforcement**: STANDARD
**STAMPED Compliant**: Yes

**Source Files**:
- Schema: `ctb/data/firebase/schemas/activity_log.ts`
- Security Rules: `ctb/data/firebase/rules/firestore.rules`

**Document Structure**:
```typescript
interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  metadata: any;

  // STAMPED fields
  heirId: string;
  processId: string;
  createdAt: Timestamp;
  orbtLayer: number; // 4
  blueprintVersion: string;
}
```

---

## 📊 BigQuery Tables (Optional)

### Dataset: imo_analytics

---

#### Table: events

**Barton ID**: `BART-BQ-EVENTS-V1`
**Purpose**: Event analytics
**Enforcement**: STANDARD
**STAMPED Compliant**: Yes

**Source Files**:
- Schema: `ctb/data/bigquery/tables/events.sql`

**Schema Definition**:
```sql
CREATE TABLE `project.imo_analytics.events` (
  event_id STRING NOT NULL,
  event_type STRING NOT NULL,
  user_id STRING,
  event_data JSON,

  -- STAMPED fields
  heir_id STRING NOT NULL,
  process_id STRING NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  created_by STRING NOT NULL,
  orbt_layer INT64 DEFAULT 4,
  blueprint_version STRING DEFAULT '1.0'
);
```

**Linked Processes**:
- `PRC-ANALYTICS-TRACK`: Event tracking
- `PRC-ANALYTICS-QUERY`: Analytics queries

---

## 👁️ Views

### view_active_imos

**Purpose**: Active IMOs with user info
**Base Tables**: `imos`, `users`

**Definition**:
```sql
CREATE VIEW view_active_imos AS
SELECT
  i.imo_id,
  i.name,
  i.status,
  i.budget,
  u.email AS user_email,
  u.name AS user_name,
  i.created_at,
  i.heir_id
FROM imos i
JOIN users u ON i.user_id = u.id
WHERE i.status = 'active';
```

---

### view_compliance_history

**Purpose**: CTB compliance trends
**Base Tables**: `ctb_compliance_log`

**Definition**:
```sql
CREATE VIEW view_compliance_history AS
SELECT
  DATE(created_at) AS audit_date,
  action_type,
  AVG(compliance_score) AS avg_score,
  COUNT(*) AS audit_count
FROM ctb_compliance_log
WHERE action_type = 'audit'
GROUP BY DATE(created_at), action_type
ORDER BY audit_date DESC;
```

---

## 🔍 Indexes

### Performance Indexes

All tables include standard indexes on:
- Primary keys (automatic)
- Foreign keys
- HEIR IDs (unique)
- Timestamps (for sorting/filtering)
- Status fields (for filtering)

### Custom Indexes

```sql
-- Composite indexes
CREATE INDEX idx_imos_user_status ON imos(user_id, status);
CREATE INDEX idx_composio_executions_tool_status ON composio_executions(tool_name, status);

-- Partial indexes (for specific queries)
CREATE INDEX idx_error_log_unresolved ON error_log(created_at DESC)
  WHERE resolution_status = 'unresolved';

-- JSON indexes (for JSONB queries)
CREATE INDEX idx_imos_components ON imos USING GIN (components);
CREATE INDEX idx_composio_executions_arguments ON composio_executions USING GIN (arguments);
```

---

## ⚡ Triggers

### auto_update_timestamp

**Purpose**: Auto-update `updated_at` field
**Applies to**: All STAMPED tables

**Definition**:
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_imos_updated_at
  BEFORE UPDATE ON imos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

### validate_heir_id_format

**Purpose**: Validate HEIR ID format on insert
**Applies to**: All STAMPED tables with STRICT enforcement

**Definition**:
```sql
CREATE OR REPLACE FUNCTION validate_heir_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.heir_id !~ '^HEIR-\d{4}-\d{2}-[A-Z]+-[A-Z]+-\d{2}$' THEN
    RAISE EXCEPTION 'Invalid HEIR ID format: %', NEW.heir_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER validate_users_heir_id
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION validate_heir_id();
```

---

## 🛡️ Schema Enforcement

### Enforcement by Level

#### STRICT
- All STAMPED fields required
- Pre-insert/update validation triggers
- Unique HEIR ID enforcement
- Format validation (email, HEIR ID, Process ID)
- Reference integrity checks

**Tables**:
- `users`
- `ctb_compliance_log`
- `schema_migrations`

#### STANDARD
- STAMPED fields required
- Application-level validation
- Unique HEIR ID enforcement
- Basic format validation

**Tables**:
- `imos`
- `composio_executions`
- `error_log`
- `shq.tasks`

#### RELAXED
- Optional STAMPED fields
- Warning-only validation
- No unique HEIR ID requirement

**Collections**:
- Firebase `imo_drafts`

#### NONE
- No enforcement
- Log-only

**Collections**:
- Firebase `activity_log` (analytics only)

---

### Validation Rules

All STAMPED-compliant tables enforce:

1. **HEIR ID Format**: `HEIR-YYYY-MM-SYSTEM-MODE-VN`
2. **Process ID Format**: `PRC-SYSTEM-EPOCHTIMESTAMP`
3. **ORBT Layer Range**: 1-4
4. **Blueprint Version Format**: `X.Y` or `X.Y.Z`
5. **Timestamp Order**: `updated_at >= created_at`

---

## 📈 Migration Tracking

### Migration History

All migrations are tracked in `schema_migrations` table.

**Current Migrations**:
```
2025-10-20_create_users_table.sql
2025-10-21_create_imos_table.sql
2025-10-22_create_composio_executions.sql
2025-10-23_create_ctb_compliance_log.sql
2025-10-23_create_error_log.sql
2025-10-23_create_shq_schema.sql
2025-10-23_create_shq_tasks.sql
2025-10-23_create_views.sql
2025-10-23_create_indexes.sql
2025-10-23_create_triggers.sql
```

**Query Migration Status**:
```sql
SELECT
  migration_name,
  executed_at,
  execution_time_ms,
  success
FROM schema_migrations
ORDER BY executed_at DESC;
```

---

## 📊 Quick Reference Tables

### Tables by Database

| Database | Schema | Table | Barton ID | Enforcement |
|----------|--------|-------|-----------|-------------|
| Neon | public | users | BART-SHQ-USERS-V1 | STRICT |
| Neon | public | imos | BART-SHQ-IMOS-V1 | STANDARD |
| Neon | public | composio_executions | BART-SHQ-COMPEXEC-V1 | STANDARD |
| Neon | public | ctb_compliance_log | BART-SHQ-CTBLOG-V1 | STRICT |
| Neon | public | error_log | BART-SHQ-ERRLOG-V1 | STANDARD |
| Neon | public | schema_migrations | BART-SHQ-MIGRATIONS-V1 | STRICT |
| Neon | shq | tasks | BART-SHQ-TASKS-V1 | STANDARD |
| Firebase | - | users_sessions | BART-FIRE-USERSESS-V1 | STANDARD |
| Firebase | - | imo_drafts | BART-FIRE-IMODRAFT-V1 | RELAXED |
| Firebase | - | activity_log | BART-FIRE-ACTLOG-V1 | STANDARD |
| BigQuery | imo_analytics | events | BART-BQ-EVENTS-V1 | STANDARD |

### Tables by Purpose

| Purpose | Tables |
|---------|--------|
| Authentication | users, users_sessions |
| IMO Operations | imos, imo_drafts |
| Integration | composio_executions |
| Compliance | ctb_compliance_log |
| Task Queue | shq.tasks |
| Error Tracking | error_log |
| Analytics | events, activity_log |
| System | schema_migrations |

### HEIR ID Prefixes

| Prefix | System | Example |
|--------|--------|---------|
| USER | Users | HEIR-2025-10-USER-AUTH-01 |
| IMO | IMO Operations | HEIR-2025-10-IMO-CREATE-01 |
| SYS | System Operations | HEIR-2025-10-SYS-COMP-01 |
| CTB | CTB Compliance | HEIR-2025-10-SYS-CTB-01 |
| AUTH | Authentication | HEIR-2025-10-AUTH-LOGIN-01 |
| TASK | Background Tasks | HEIR-2025-10-TASK-EXEC-01 |
| ERR | Error Logging | HEIR-2025-10-SYS-ERR-01 |

---

## 🔗 Related Documentation

- **API Catalog**: `ctb/sys/api/API_CATALOG.md`
- **Data Layer Guide**: `ctb/data/README.md`
- **Migration Guide**: `ctb/data/migrations/README.md`
- **CTB Compliance**: `CTB_COMPLIANCE_SYSTEM_COMPLETE.md`

---

**Maintainer**: Data Engineering Team
**Last Updated**: 2025-10-23
**Next Review**: 2025-11-23
