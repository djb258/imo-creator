<!--

# CTB Metadata
# Generated: 2025-10-23T14:32:34.965642
# CTB Version: 1.3.3
# Division: Data & Databases
# Category: README.md
# Compliance: 85%
# HEIR ID: HEIR-2025-10-DAT-README-01

-->

# CTB/DATA - Data & Databases

**Division**: Data & Databases
**Purpose**: Schemas, migrations, seeds, data warehouses, and database operations

---

## 📁 Directory Structure

```
ctb/data/
├── schemas/               # Database schemas
│   └── chartdb_schemas/  # ChartDB schema definitions
├── migrations/            # Database migration scripts
├── seeds/                 # Seed data for testing
├── warehouses/            # Data warehouse configurations
│   └── chartdb/          # ChartDB integration
└── tests/                 # Data layer tests
```

---

## 🗄️ Database Overview

### Primary Databases

1. **Neon PostgreSQL** (Production)
   - **Purpose**: Primary relational database
   - **Connection**: `DATABASE_URL` or `NEON_DATABASE_URL`
   - **Schema**: Managed via migrations
   - **Access**: Direct `pg` client (NOT via Composio)

2. **Firebase Firestore** (Document Store)
   - **Purpose**: Real-time data, user sessions
   - **Connection**: Firebase Admin SDK
   - **Schema**: Flexible document structure

3. **BigQuery** (Analytics)
   - **Purpose**: Data warehouse, analytics
   - **Connection**: Google Cloud SDK
   - **Schema**: Defined in `ctb/data/warehouses/`

4. **ChartDB** (Schema Visualization)
   - **Purpose**: Database schema documentation
   - **Location**: `ctb/data/warehouses/chartdb/`
   - **Automation**: GitHub Actions workflow

---

## 🚀 Quick Start

### 1. Set Up Local Database

```bash
# Using Neon (recommended)
export DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# Or use local PostgreSQL
export DATABASE_URL="postgresql://localhost:5432/imo_creator_dev"
```

### 2. Run Migrations

```bash
# Using pg client directly (CORRECT METHOD)
psql $DATABASE_URL < ctb/data/migrations/001_initial_schema.sql

# Or use Node.js migration runner
node ctb/data/migrations/run_migrations.js
```

### 3. Seed Test Data

```bash
# Load seed data
psql $DATABASE_URL < ctb/data/seeds/test_data.sql

# Or use seeding script
python ctb/data/seeds/seed_database.py
```

### 4. Test Database Connection

```bash
# Test connection
psql $DATABASE_URL -c "SELECT version();"

# Run data tests
pytest ctb/data/tests/
```

---

## 📊 Schemas

### Current Schemas

**Location**: `ctb/data/schemas/chartdb_schemas/`

```
schemas/
├── detected_schemas.txt       # Auto-detected schema list
├── schema_index.json          # Schema registry
└── schemas/
    ├── 2025-08-19_create_shq_master_error_log.json
    └── 2025-08-19_ids.json
```

### Schema Format

Schemas are defined in JSON format compatible with ChartDB:

```json
{
  "table_name": "users",
  "columns": [
    {
      "name": "id",
      "type": "UUID",
      "primary_key": true
    },
    {
      "name": "email",
      "type": "VARCHAR(255)",
      "unique": true,
      "nullable": false
    }
  ]
}
```

---

## 🔄 Migrations

### Migration Files

**Location**: `ctb/data/migrations/`

**Naming Convention**: `{version}_{description}.sql`
- `001_initial_schema.sql`
- `002_add_users_table.sql`
- `003_add_indexes.sql`

### Creating a Migration

```sql
-- ctb/data/migrations/004_add_analytics.sql

BEGIN;

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id),
    payload JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

COMMIT;
```

### Running Migrations

**Direct Connection (Recommended)**:
```javascript
const { Client } = require('pg');
const fs = require('fs');

async function runMigrations() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    await client.connect();

    const migrations = [
        '001_initial_schema.sql',
        '002_add_users_table.sql',
        '003_add_indexes.sql'
    ];

    for (const file of migrations) {
        const sql = fs.readFileSync(`ctb/data/migrations/${file}`, 'utf8');
        await client.query(sql);
        console.log(`✅ Applied: ${file}`);
    }

    await client.end();
}
```

**⚠️ IMPORTANT**:
- **DO NOT** use Composio MCP for database operations
- **DO NOT** call `neon_execute_sql` (it doesn't exist)
- **ALWAYS** use direct `pg` client connections

---

## 🌱 Seed Data

### Seed Files

**Location**: `ctb/data/seeds/`

```sql
-- test_data.sql
INSERT INTO users (email, name) VALUES
    ('test@example.com', 'Test User'),
    ('admin@example.com', 'Admin User');

INSERT INTO analytics_events (event_type, user_id) VALUES
    ('page_view', (SELECT id FROM users WHERE email = 'test@example.com')),
    ('button_click', (SELECT id FROM users WHERE email = 'test@example.com'));
```

---

## 📈 ChartDB Integration

### Purpose

ChartDB automatically generates visual database schemas from your PostgreSQL database.

### Automation

GitHub Actions workflow (`.github/workflows/chartdb_automation.yml`) runs:
- On schema changes
- Weekly schedule
- Manual trigger

### Schema Files

Auto-generated schemas are saved to:
- `ctb/data/schemas/chartdb_schemas/schemas/`
- Timestamped JSON files
- Index maintained in `schema_index.json`

---

## 🧪 Testing

### Test Database

```bash
# Create test database
createdb imo_creator_test

# Run migrations on test DB
export DATABASE_URL="postgresql://localhost:5432/imo_creator_test"
node ctb/data/migrations/run_migrations.js

# Seed test data
psql $DATABASE_URL < ctb/data/seeds/test_data.sql

# Run tests
pytest ctb/data/tests/
```

### Test Structure

```python
# ctb/data/tests/test_schema.py
import pytest
from sqlalchemy import create_engine, text

def test_users_table_exists():
    engine = create_engine(os.getenv('DATABASE_URL'))
    with engine.connect() as conn:
        result = conn.execute(text(
            "SELECT EXISTS (SELECT 1 FROM information_schema.tables "
            "WHERE table_name = 'users')"
        ))
        assert result.scalar() == True
```

---

## 📚 Related Documentation

- **Database Patterns**: `ctb/docs/BARTON_OUTREACH_CORE_UPDATES.md`
- **Composio Integration**: `ctb/docs/composio/COMPOSIO_INTEGRATION.md`
- **Global Manifest**: `ctb/docs/global-config/global_manifest.yaml`

---

## 🔗 Dependencies

**Depends On**:
- `ctb/sys/` - Database connection utilities

**Used By**:
- `ctb/sys/` - API layer queries database
- `ctb/ui/` - Frontend displays data
- `ctb/ai/` - Agents may query for context

---

## ⚠️ Critical Notes

### Database Operations

**✅ CORRECT**:
```javascript
// Use direct pg client
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL
});
await client.connect();
const result = await client.query('SELECT * FROM users');
await client.end();
```

**❌ INCORRECT**:
```javascript
// DO NOT use Composio for database operations
const response = await fetch('http://localhost:3001/tool', {
    body: JSON.stringify({
        tool: 'neon_execute_sql',  // DOES NOT EXIST!
        data: { sql: 'SELECT * FROM users' }
    })
});
```

---

## 📊 Environment Variables

**Required** (see `.env.example`):

```bash
# Primary Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Neon Specific (optional if DATABASE_URL is set)
NEON_DATABASE_URL=postgresql://neon_user:pass@neon_host/dbname

# Firebase (for Firestore)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# BigQuery (for analytics)
BIGQUERY_PROJECT_ID=your-project-id
BIGQUERY_DATASET=your_dataset
```

---

## 🚨 Common Issues

### Migration Fails

```bash
# Check current schema
psql $DATABASE_URL -c "\dt"

# Check migration status
psql $DATABASE_URL -c "SELECT * FROM schema_migrations;"

# Rollback if needed
psql $DATABASE_URL < ctb/data/migrations/rollback_003.sql
```

### Connection Refused

```bash
# Test connection
pg_isready -d $DATABASE_URL

# Check firewall/network
telnet your-db-host 5432
```

---

**Last Updated**: 2025-10-23
**CTB Version**: 1.3.3
**Maintainer**: Data Engineering Team
