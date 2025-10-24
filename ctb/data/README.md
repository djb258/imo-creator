# CTB/DATA - Data Layer

**Purpose**: Database schemas, migrations, data models, validation schemas, and data pipelines

---

## 📁 Directory Structure

```
ctb/data/
├── firebase/                 # Firebase/Firestore schemas
│   ├── schemas/             # Firestore collection schemas
│   ├── rules/               # Security rules
│   └── indexes/             # Composite indexes
├── neon/                    # Neon PostgreSQL schemas
│   ├── schemas/             # Table schemas (SQL)
│   ├── migrations/          # Database migrations
│   ├── seeds/               # Seed data
│   └── views/               # Database views
├── bigquery/                # BigQuery schemas
│   ├── datasets/            # Dataset definitions
│   ├── tables/              # Table schemas
│   └── queries/             # Saved queries
├── zod/                     # Zod validation schemas
│   ├── api/                 # API request/response schemas
│   ├── forms/               # Form validation schemas
│   └── models/              # Data model schemas
├── migrations/              # Unified migration directory
│   ├── firebase/           # Firebase migrations
│   ├── neon/               # Neon/PostgreSQL migrations
│   └── bigquery/           # BigQuery migrations
├── pipelines/              # Data pipelines & ETL
│   ├── extract/            # Data extraction scripts
│   ├── transform/          # Data transformation
│   └── load/               # Data loading scripts
└── tests/                  # Data layer tests
    ├── schemas/            # Schema validation tests
    ├── migrations/         # Migration tests
    └── integration/        # Integration tests
```

---

## 🗄️ Database Systems

### 1. Neon PostgreSQL (Primary)

**Purpose**: Relational data, transactional workloads

**Connection**:
```bash
# Set environment variable
export DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/main"

# Test connection
psql "$DATABASE_URL"
```

**Schemas**:
```sql
-- Example: users table
-- Location: ctb/data/neon/schemas/users.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Run Migrations**:
```bash
# Using Node.js runner
node ctb/sys/database/migrations/run.cjs

# Or Python
python ctb/data/migrations/run_migrations.py
```

---

### 2. Firebase/Firestore (Workbench)

**Purpose**: Real-time data, user sessions, temporary data

**Connection**:
```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  // ...other config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```

**Schemas** (TypeScript):
```typescript
// Location: ctb/data/firebase/schemas/user.ts
interface User {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Collection reference
const usersRef = collection(db, 'users');
```

**Security Rules**:
```javascript
// Location: ctb/data/firebase/rules/firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

### 3. BigQuery (Analytics)

**Purpose**: Data warehouse, analytics, reporting

**Connection**:
```python
from google.cloud import bigquery

client = bigquery.Client(project=os.getenv("BIGQUERY_PROJECT_ID"))
```

**Schemas**:
```sql
-- Location: ctb/data/bigquery/tables/events.sql
CREATE TABLE `project.dataset.events` (
  event_id STRING NOT NULL,
  event_type STRING NOT NULL,
  user_id STRING,
  event_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);
```

---

## 🔄 Migrations

### Migration File Naming

**Convention**: `YYYY-MM-DD_description.sql`

Examples:
- `2025-10-23_create_users_table.sql`
- `2025-10-23_add_email_index.sql`
- `2025-10-24_alter_users_add_role.sql`

### Creating Migrations

**1. Create Migration File**:
```bash
# Create new migration
touch ctb/data/migrations/neon/2025-10-23_create_users.sql
```

**2. Write Migration**:
```sql
-- UP: Create table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX idx_users_email ON users(email);

-- Add comments
COMMENT ON TABLE users IS 'User accounts table';
COMMENT ON COLUMN users.email IS 'User email address (unique)';
```

**3. Add to Migration List**:
```javascript
// In run_migrations.cjs
const migrations = [
  '2025-10-23_create_users.sql',
  // ...other migrations
];
```

**4. Run Migration**:
```bash
node ctb/sys/database/migrations/run.cjs
```

### Rollback Migrations

**Create Rollback Script**:
```sql
-- File: 2025-10-23_create_users_rollback.sql
DROP TABLE IF EXISTS users CASCADE;
```

---

## ✅ Validation Schemas (Zod)

### Purpose
Type-safe validation for APIs, forms, and data models.

### Example Schema

**Location**: `ctb/data/zod/api/user.ts`

```typescript
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  name: z.string().min(1).max(255),
  role: z.enum(['user', 'admin', 'moderator']),
  createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Validation function
export function validateUser(data: unknown): User {
  return UserSchema.parse(data);
}
```

**Usage**:
```typescript
import { validateUser } from 'ctb/data/zod/api/user';

try {
  const user = validateUser(requestData);
  // user is now typed and validated
} catch (error) {
  // Handle validation error
  console.error(error.errors);
}
```

---

## 🧪 Testing

### Test Database Setup

**1. Create Test Database**:
```bash
# Set test database URL
export TEST_DATABASE_URL="postgresql://user:pass@localhost:5432/test_db"

# Create test database
psql -c "CREATE DATABASE test_db;"
```

**2. Run Test Migrations**:
```bash
DATABASE_URL=$TEST_DATABASE_URL node ctb/sys/database/migrations/run.cjs
```

### Run Data Tests

```bash
# Run all data tests
pytest ctb/data/tests/

# Run schema tests
pytest ctb/data/tests/schemas/

# Run migration tests
pytest ctb/data/tests/migrations/

# Run integration tests
pytest ctb/data/tests/integration/
```

### Example Test

```python
# ctb/data/tests/test_user_schema.py
import pytest
from ctb.sys.database.client import get_db_client

@pytest.mark.asyncio
async def test_create_user():
    db = get_db_client()

    # Insert user
    user_id = await db.execute_command(
        "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id",
        ["test@example.com", "Test User"]
    )

    assert user_id is not None

    # Query user
    users = await db.execute_query(
        "SELECT * FROM users WHERE email = $1",
        ["test@example.com"]
    )

    assert len(users) == 1
    assert users[0]['email'] == "test@example.com"
```

---

## 📊 Common Tasks

### 1. Add New Table

**Step 1**: Create schema file
```sql
-- ctb/data/neon/schemas/products.sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Step 2**: Create migration
```bash
touch ctb/data/migrations/neon/2025-10-23_create_products.sql
# Copy schema content to migration file
```

**Step 3**: Run migration
```bash
node ctb/sys/database/migrations/run.cjs
```

**Step 4**: Create Zod schema (if needed)
```typescript
// ctb/data/zod/models/product.ts
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  createdAt: z.date(),
});
```

### 2. Add Firestore Collection

**Step 1**: Define schema
```typescript
// ctb/data/firebase/schemas/orders.ts
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Timestamp;
}
```

**Step 2**: Add security rules
```javascript
// ctb/data/firebase/rules/firestore.rules
match /orders/{orderId} {
  allow read: if request.auth != null &&
    resource.data.userId == request.auth.uid;
  allow create: if request.auth != null;
}
```

**Step 3**: Create indexes (if needed)
```json
// ctb/data/firebase/indexes/orders.json
{
  "indexes": [
    {
      "collectionGroup": "orders",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "userId", "order": "ASCENDING"},
        {"fieldPath": "createdAt", "order": "DESCENDING"}
      ]
    }
  ]
}
```

### 3. Create Data Pipeline

**Example ETL Pipeline**:
```python
# ctb/data/pipelines/extract/fetch_users.py
async def extract_users_from_api():
    """Extract users from external API"""
    response = await httpx.get("https://api.example.com/users")
    return response.json()

# ctb/data/pipelines/transform/clean_users.py
def transform_users(users):
    """Clean and transform user data"""
    return [
        {
            'email': user['email'].lower(),
            'name': user['name'].strip(),
            'created_at': parse_date(user['created'])
        }
        for user in users
    ]

# ctb/data/pipelines/load/load_users.py
async def load_users_to_db(users):
    """Load users into database"""
    db = get_db_client()
    for user in users:
        await db.execute_command(
            "INSERT INTO users (email, name, created_at) VALUES ($1, $2, $3)",
            [user['email'], user['name'], user['created_at']]
        )
```

---

## 🔗 Dependencies

### External Services
- **Neon PostgreSQL**: Primary database
- **Firebase/Firestore**: Real-time workbench
- **BigQuery**: Analytics warehouse (optional)

### Internal Dependencies
- `ctb/sys/` - Database client utilities
- `ctb/ai/` - Training datasets
- `ctb/ui/` - Form validation schemas

### Packages

**Python**:
```bash
pip install asyncpg psycopg2-binary firebase-admin google-cloud-bigquery
```

**Node/TypeScript**:
```bash
npm install firebase firebase-admin zod @google-cloud/bigquery
```

---

## 🔐 Environment Variables

```bash
# Neon/PostgreSQL
DATABASE_URL=postgresql://user:pass@host:5432/main
NEON_DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/main

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# BigQuery
BIGQUERY_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Test Database
TEST_DATABASE_URL=postgresql://user:pass@localhost:5432/test_db
```

See `.env.example` in this directory for complete list.

---

## 📚 Documentation

- **Schema Design Guide**: `schemas/SCHEMA_DESIGN.md`
- **Migration Guide**: `migrations/MIGRATION_GUIDE.md`
- **Validation Schemas**: `zod/ZOD_GUIDE.md`
- **Firebase Setup**: `firebase/FIREBASE_SETUP.md`
- **BigQuery Setup**: `bigquery/BIGQUERY_SETUP.md`

---

## 🚨 Important Notes

### Database Operations
- **Always use migrations** for schema changes
- **Never modify production schema directly**
- **Test migrations on staging first**
- **Keep rollback scripts** for critical migrations

### Data Validation
- **Validate at API boundary** using Zod schemas
- **Validate before database insert** (defense in depth)
- **Log validation failures** for debugging
- **Return clear error messages** to users

### Performance
- **Add indexes** for frequently queried columns
- **Use connection pooling** for database clients
- **Implement caching** for read-heavy tables
- **Monitor query performance** regularly

---

## 🆘 Troubleshooting

### Migration Fails
```bash
# Check current schema
psql "$DATABASE_URL" -c "\dt"

# View migration log
cat logs/migrations.log

# Rollback manually
psql "$DATABASE_URL" -f ctb/data/migrations/neon/ROLLBACK_FILE.sql

# Re-run migration
node ctb/sys/database/migrations/run.cjs
```

### Connection Issues
```bash
# Test connection
psql "$DATABASE_URL"

# Check SSL requirements
psql "$DATABASE_URL?sslmode=require"

# Verify credentials
echo $DATABASE_URL
```

### Validation Errors
```typescript
// Add detailed error logging
try {
  const data = schema.parse(input);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log('Validation errors:', error.errors);
    // [{path: ['email'], message: 'Invalid email'}]
  }
}
```

---

## 📞 Support

- **Schema Issues**: Review schema design guide
- **Migration Issues**: See migration guide
- **Firebase Issues**: Check Firebase console
- **General Help**: See `ENTRYPOINT.md` at repo root

---

**Branch**: data
**Maintainer**: Data Engineering Team
**Last Updated**: 2025-10-23
