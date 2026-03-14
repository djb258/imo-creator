# Rosetta Stone — Universal IT Vocabulary Matrices

## Layer 0 Reference: docs/LAYER0_DOCTRINE.md

These matrices were produced by running the Layer 0 constant-extraction engine
against eight IT domains. Each matrix maps universal root concepts (constants)
to product-specific vocabulary (variables).

## Domains

| # | Domain | File | Root Concepts | Product Columns |
|---|--------|------|---------------|-----------------|
| 1 | Database | domain-database.md | 18 | PostgreSQL, D1, MongoDB, Sheets, Ledger, Clay |
| 2 | Programming | domain-programming.md | 18 | Python, JS, SQL, n8n, CF Workers |
| 3 | Networking | domain-networking.md | 14 | TCP/IP, HTTP, CF, Historical |
| 4 | APIs | domain-apis.md | 10 | REST, GraphQL, gRPC, CF, Historical |
| 5 | Security | domain-security.md | 11 | CF Access, JWT, OAuth, Historical |
| 6 | Infrastructure | domain-infrastructure.md | 13 | CF, AWS, GCP, Historical |
| 7 | Data Flow | domain-dataflow.md | 11 | CF Queues, n8n, Kafka, Historical |
| 8 | Version Control | domain-versioncontrol.md | 12 | Git, SVN, Historical |

## How These Were Built

Each domain was run through the Layer 0 gate mechanism:
1. Extract constants (universal concepts that hold across all products)
2. Validate with IMO/CTB/Circle
3. Map constants to product-specific vocabulary
4. Isolate true variables (product-specific implementation details only)

The constants don't change. The vocabulary (variable) changes per product.
Learn the constants, pick up any product.