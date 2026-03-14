# Rosetta Stone — Domain 1: Database

## Tier 0 Reference: law/doctrine/TIER0_DOCTRINE.md

---

## Gate 1 (50,000 ft) — What IS a database?

**Candidate Constant:** A system for storing, organizing, and retrieving structured information.

| Validator | Pass/Fail | Reasoning |
|-----------|-----------|-----------|
| IMO | PASS | Regardless of what data flows through (customers, logs, transactions), the system stores, organizes, and retrieves. The definition holds. |
| CTB | PASS | At every level — from enterprise Oracle to a personal spreadsheet to a clay tablet — the definition holds. |
| Circle | PASS | After a full feedback cycle (store data → retrieve data → discover need for new organization → reorganize), the definition still holds. |

**Verdict:** CONSTANT_LOCKED

---

## Gate 2 (45,000 ft) — Universal Components

**18 Root Concepts extracted and validated:**

| # | Constant | Definition | IMO | CTB | Circle | Verdict |
|---|----------|-----------|-----|-----|--------|---------|
| 1 | Store | A named container for organized data | PASS | PASS | PASS | LOCKED |
| 2 | Record | A single complete unit of related data | PASS | PASS | PASS | LOCKED |
| 3 | Field | One named attribute within a record | PASS | PASS | PASS | LOCKED |
| 4 | Schema | The structural definition of how data is organized | PASS | PASS | PASS | LOCKED |
| 5 | Key | A unique identifier for a record | PASS | PASS | PASS | LOCKED |
| 6 | Index | A lookup structure that accelerates retrieval | PASS | PASS | PASS | LOCKED |
| 7 | Join | Combining data from multiple stores based on a shared key | PASS | PASS | PASS | LOCKED |
| 8 | Query | A request for specific data from the store | PASS | PASS | PASS | LOCKED |
| 9 | Filter | A condition that narrows returned data | PASS | PASS | PASS | LOCKED |
| 10 | Sort | Ordering returned data by a specified field | PASS | PASS | PASS | LOCKED |
| 11 | Aggregate | Combining multiple records into a summary value | PASS | PASS | PASS | LOCKED |
| 12 | Transform | Changing data from one structure to another | PASS | PASS | PASS | LOCKED |
| 13 | Constraint | A rule that data must satisfy to be stored | PASS | PASS | PASS | LOCKED |
| 14 | Relation | A defined connection between two stores | PASS | PASS | PASS | LOCKED |
| 15 | Transaction | An atomic unit of work — all succeed or all fail | PASS | PASS | PASS | LOCKED |
| 16 | Connection | An established channel between a client and a store | PASS | PASS | PASS | LOCKED |
| 17 | View | A derived, read-only presentation of stored data | PASS | PASS | PASS | LOCKED |
| 18 | Migration | A versioned change to the schema | PASS | PASS | PASS | LOCKED |

**Back-propagation check:** None of the 18 constants invalidate Gate 1 or each other. Clean.

---

## Gate 3 (40,000 ft) — Process Constant (IMO)

Every database operation follows IMO:
- **Input:** Data or query enters the system
- **Middle:** Engine processes (stores, retrieves, transforms, validates)
- **Output:** Result returned (data set, confirmation, error)

| Validator | Pass/Fail | Reasoning |
|-----------|-----------|-----------|
| IMO | PASS | The I→M→O pattern is the database operation itself. |
| CTB | PASS | At every level — single query, batch job, full ETL — the pattern holds. |
| Circle | PASS | Query results feed back as inputs to new queries. The loop closes. |

**Verdict:** CONSTANT_LOCKED

---

## Gate 4 (35,000 ft) — Organization Constant (CTB)

Every database organizes as CTB:
- **Trunk:** The engine (PostgreSQL, D1, MongoDB...)
- **Branches:** Databases/schemas within the engine
- **Leaves:** Tables → Records → Fields

| Validator | Pass/Fail | Reasoning |
|-----------|-----------|-----------|
| IMO | PASS | Data flows through this hierarchy regardless of what the data is. |
| CTB | PASS | The hierarchy IS the CTB. Self-validating. |
| Circle | PASS | Schema evolution (migrations) reorganizes the tree but doesn't break the pattern. |

**Verdict:** CONSTANT_LOCKED

---

## Gate 5 — Rosetta Stone Matrix

The 18 constants mapped to product-specific vocabulary:

| Root Concept | PostgreSQL | Cloudflare D1 | MongoDB | Google Sheets | Ledger (1494 AD) | Clay Tablet (3500 BC) |
|-------------|-----------|---------------|---------|--------------|-------------------|----------------------|
| Store | Table | Table | Collection | Sheet/Tab | Account Book | Tablet |
| Record | Row | Row | Document | Row | Entry / Line Item | Impression Row |
| Field | Column | Column | Field | Cell / Column Header | Column (Date, Amount, Description) | Wedge-marked Section |
| Schema | CREATE TABLE / DDL | CREATE TABLE | Implicit (schemaless) | Column Headers (row 1) | Double-entry format (debit/credit) | Cuneiform symbol system |
| Key | PRIMARY KEY | PRIMARY KEY / rowid | _id (ObjectId) | Row number | Entry number / date | Seal mark / sequence |
| Index | CREATE INDEX | CREATE INDEX | createIndex() | Sort / Filter view | Alphabetical ledger tabs | Tablet ordering in archive |
| Join | JOIN / LEFT JOIN | JOIN | $lookup / aggregate | VLOOKUP / INDEX-MATCH | Cross-referencing books | Referencing other tablets |
| Query | SELECT | SELECT | find() / aggregate() | Filter / Query function | "Look up the account for..." | Reading the tablet |
| Filter | WHERE | WHERE | { field: value } | Filter view / FILTER() | "All entries for this merchant" | Selected tablet from shelf |
| Sort | ORDER BY | ORDER BY | .sort() | Sort A-Z / Z-A | Chronological order | Chronological archive order |
| Aggregate | SUM/COUNT/AVG/GROUP BY | SUM/COUNT/AVG/GROUP BY | $group / $sum | SUM() / COUNTIF() | "Total for this account" | Running tally marks |
| Transform | CAST / functions | CAST / functions | $project / $set | Formulas / Apps Script | Calculating balances | Re-pressing clay |
| Constraint | NOT NULL / CHECK / FK | NOT NULL / CHECK | Schema validation | Data validation rules | "Must balance" / double-entry rule | Temple accounting rules |
| Relation | FOREIGN KEY / references | FOREIGN KEY | DBRef / manual reference | Sheet cross-reference | Ledger cross-reference | Archive tablet grouping |
| Transaction | BEGIN/COMMIT/ROLLBACK | D1 batch API | Session transactions | N/A (eventual consistency) | "Entry completed and verified" | Fired (permanent) vs unfired (draft) |
| Connection | Connection string / pool | D1 binding | Connection string / URI | OAuth / API key | Physical access to the book | Physical access to archive |
| View | CREATE VIEW | CREATE VIEW | Aggregation pipeline view | Named range / pivot table | Summary page | Summary tablet |
| Migration | ALTER TABLE / migration files | D1 migrations | Schema versioning tools | Manually adding columns | New ledger book (new year) | New tablet series |

---

## Gate 6 — Circle Validation (Feedback Patterns)

Four feedback patterns constant across all products:

| Circle Pattern | Description | PostgreSQL Example | Universal? |
|---------------|-------------|-------------------|------------|
| Performance Circle | Slow queries → add indexes → faster queries | EXPLAIN ANALYZE → CREATE INDEX → re-query | YES — applies to every product |
| Quality Circle | Data errors → add constraints → cleaner data | Bad data found → ADD CONSTRAINT → rejected on insert | YES — applies to every product |
| Evolution Circle | Schema doesn't fit → migration → updated schema | Business changes → ALTER TABLE → new structure | YES — applies to every product |
| Capacity Circle | Storage growing → archive/partition → managed growth | Table bloat → PARTITION BY / archive old → sustainable | YES — applies to every product |

**Verdict:** All four circles CONSTANT_LOCKED. They describe the same feedback loops regardless of product.

---

## Gate 7 — True Variables Isolated

After extraction, only product-specific implementation details remain as variables:

| Variable | Why It's a Variable |
|----------|-------------------|
| Connection string format | Changes per product (postgres://... vs D1 binding vs mongodb+srv://...) |
| SQL dialect / query syntax | PostgreSQL SQL vs D1 SQL vs MongoDB query language vs Sheets formulas |
| Tuning parameters | work_mem, shared_buffers vs D1 limits vs WiredTiger cache |
| Pricing tiers | Free/Pro/Enterprise vary per vendor |
| Replication topology | Primary-replica vs edge replication vs N/A |
| Backup mechanism | pg_dump vs D1 export vs mongodump vs Sheets revision history |
| Driver/SDK | psycopg2 vs D1 binding vs pymongo vs Sheets API |

**Variable count:** 7 — within tolerance.

---

## Summary

| Metric | Value |
|--------|-------|
| Total gates | 7 |
| Constants locked | 18 root concepts + 3 structural constants + 4 circle patterns = 25 |
| Variables isolated | 7 |
| Back-propagation events | 0 |
| Domain-agnostic check | PASS — constants hold from clay tablets to cloud databases |