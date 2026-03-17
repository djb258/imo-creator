# Neon Connection & Pooling Reference

## max_connections by Compute Size

| Compute Size | Total Connections | Available (after 7 reserved) |
|-------------|-------------------|------------------------------|
| 0.25 CU | 104 | 97 |
| 0.50 CU | ~200 | ~193 |
| 1 CU | ~400 | ~393 |
| 2 CU | ~800 | ~793 |
| 4 CU | ~1,600 | ~1,593 |
| 9+ CU | 4,000 (capped) | 3,993 |

7 connections are always reserved for the neon_superuser account.

## Pooled vs Direct — When to Use Which

### Use Pooled (default for apps)
- Application traffic (API servers, edge functions, serverless)
- High concurrency (up to 10,000 connections)
- Short-lived transactions
- Any workload where you don't need session persistence

### Use Direct (specific operations only)
- `pg_dump` and `pg_restore`
- Schema migrations (Drizzle, Prisma, Flyway, etc.)
- Administrative operations
- Any code using `SET` statements, advisory locks, temp tables, LISTEN/NOTIFY

## PgBouncer Transaction Mode — What Breaks

PgBouncer in transaction mode means the backend Postgres connection is shared.
Between transactions, your "connection" is actually a different Postgres process.

**Breaks:**
```sql
-- This DOES NOT persist across transactions through the pooler
SET search_path TO myschema;
SELECT * FROM mytable;  -- works in this transaction
-- transaction ends, connection returns to pool
SELECT * FROM mytable;  -- ERROR: relation "mytable" does not exist
```

**Workarounds:**
- Use fully qualified table names: `SELECT * FROM myschema.mytable`
- Use protocol-level prepared statements (driver-level, not SQL PREPARE)
- Set search_path at the role level: `ALTER ROLE myuser SET search_path TO myschema`

## Protocol-Level Prepared Statements

Supported since PgBouncer 1.22.0. Use your driver's parameterized query feature:

```javascript
// node-postgres (pg)
const query = {
  name: 'fetch-user',
  text: 'SELECT * FROM users WHERE username = $1',
  values: ['alice'],
};
await client.query(query);
```

```python
# psycopg
cur = conn.cursor()
cur.execute("SELECT * FROM users WHERE username = %s", ('alice',), prepare=True)
```

SQL-level `PREPARE` and `EXECUTE` are NOT supported through PgBouncer.

## Serverless Driver Patterns

### HTTP Mode (serverless functions)
```javascript
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL, {
  fetchOptions: { signal: AbortSignal.timeout(10000) }  // cold start buffer
});
const rows = await sql`SELECT * FROM users WHERE id = ${userId}`;
```

### WebSocket Mode (long-running)
```javascript
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
```

### With Cloudflare Hyperdrive (NOT the serverless driver)
```javascript
// Use node-postgres, NOT @neondatabase/serverless
import { Client } from "pg";
const client = new Client({ connectionString: env.HYPERDRIVE.connectionString });
await client.connect();
```

## SSL Requirement

All Neon connections require SSL/TLS encryption. Add `?sslmode=require` to connection
strings. For additional security, add `&channel_binding=require`.

## BI Tools

When connecting BI tools (Metabase, Tableau, Power BI), use a read replica instead of
the primary compute. BI tools run long/heavy queries that can impact production traffic.
Read replicas scale independently.
