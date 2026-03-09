# D1 & R2 Limits and Pricing Reference

## D1 Full Limits

| Resource | Free Plan | Paid Plan |
|----------|-----------|-----------|
| Max DB size | 500MB | 10GB (cannot increase) |
| Databases/account | 10 | 50,000 (can request millions) |
| Rows read/day | 5M | Unlimited (billed) |
| Rows written/day | 100K | Unlimited (billed) |
| Storage | 5GB total | 5GB free, then $0.75/GB-month |
| Max bindings/Worker | ~5,000 D1 databases | ~5,000 D1 databases |
| Connections/invocation | 6 simultaneous | 6 simultaneous |
| Batch API timeout | 30 seconds | 30 seconds |

## D1 Pricing (Paid)

| Metric | Included/month | Overage |
|--------|----------------|---------|
| Rows read | 25 billion | $0.001/million |
| Rows written | 50 million | $1.00/million |
| Storage | 5GB | $0.75/GB-month |
| Egress | $0 | $0 |
| Compute | $0 (billed via Workers) | $0 |

## D1 Performance Reality

D1 is single-threaded. This is the constraint that governs everything:

- Throughput = 1 / query_duration
- 1ms query → ~1,000 QPS
- 10ms query → ~100 QPS
- 100ms query → ~10 QPS (you'll hit "overloaded" errors here)

**Why indexing matters for cost AND performance:**
A full table scan on 5,000 rows = 5,000 rows_read billed, even if your WHERE clause
returns 3 rows. An indexed query on the same table might read 3 rows. That's a 1,600x
billing difference.

**Batch mutation rules:**
- Large UPDATE/DELETE affecting millions of rows → must batch at ~1,000 rows per query
- A single query modifying hundreds of thousands of rows will exceed execution limits
- Break work into chunks and loop

**D1 runs inside Workers resource limits.** Result serialization (converting query results
to JSON) consumes Workers CPU time. Large result sets can hit the CPU cap before the
query itself is slow.

**Time Travel:** Point-in-time recovery to any minute in the last 30 days. No extra cost
for the feature — storage of history is included in normal storage billing.

## D1 Design Philosophy

D1 is built for horizontal scale-out: many small databases, not one big one.
- Per-user databases
- Per-tenant databases
- Per-entity databases
- Thousands of DBs at no extra cost (pricing is query + storage only)

If your use case is a single large relational database with complex queries, joins,
and write-heavy workloads → use Neon, not D1.

## R2 Full Pricing

| Metric | Free/month | Paid |
|--------|------------|------|
| Storage (standard) | 10GB | $0.015/GB-month |
| Storage (infrequent) | — | $0.01/GB-month (30-day min) |
| Class A ops (writes) | 1M | $4.50/million |
| Class B ops (reads) | 10M | $0.36/million |
| Egress | **$0** | **$0** |
| Data retrieval (infrequent) | — | $0.01/GB |

## R2 Key Facts

- S3-compatible API
- Max object: 5TB multipart, 5GB single PUT
- CDN cache limits: 512MB (free/pro/business), 5GB (enterprise)
- Super Slurper: bulk migration from S3/GCS (free, billed as Class A ops to R2)
- Sippy: incremental migration (copies objects on first access)
- Data Catalog: public beta, no extra charge currently (30-day notice before pricing changes)

## Durable Objects Pricing

| Metric | Free | Paid |
|--------|------|------|
| Requests | 1M/month | $0.15/million |
| Duration | 400K GB-s | $12.50/million GB-s |
| Rows read (SQLite) | Matches D1 | Matches D1 |
| Rows written (SQLite) | Matches D1 | Matches D1 |
| Storage (SQLite) | 5GB | $0.75/GB-month (matches D1) |
| Storage (KV) | 1GB | $0.20/GB-month |

Free plan: SQLite backend only. KV backend requires paid plan.

## Queues Pricing

- $0.40/million operations
- Operation = each 64KB chunk written, read, or deleted
- 65KB message = 2 operations. 127KB message = 2 operations. 128KB = 2 operations
- Each message includes ~100 bytes internal metadata
