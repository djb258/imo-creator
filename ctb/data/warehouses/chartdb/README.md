# ChartDB Integration

**Doctrine ID**: 04.04.07
**CTB Branch**: `sys/chartdb`
**Altitude**: 40k (Doctrine Core - System Infrastructure)

---

## Purpose

ChartDB provides database schema visualization and entity-relationship diagram generation for the CTB ecosystem. It enables developers to:

- Visualize database schemas interactively
- Generate and export DDL statements
- Compare schemas across environments
- Create ER diagrams automatically
- Document database structures

---

## Integration Flow

```
┌─────────────────────────────────────────┐
│   Application Database                  │
│   (Neon, Firebase, BigQuery, etc.)      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   ChartDB Analyzer                      │
│   - Schema introspection                │
│   - Relationship detection              │
│   - Diagram generation                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Composio MCP Integration              │
│   Endpoint: http://localhost:3001/tool  │
│   Doctrine ID: 04.04.07                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   CTB Repository                        │
│   - docs/database/schema_diagrams/      │
│   - config/database_schema.json         │
└─────────────────────────────────────────┘
```

---

## Example Usage

### Generate Schema Diagram

```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "ChartDB",
    "action": "GENERATE_SCHEMA_DIAGRAM",
    "data": {
      "database_url": "${MCP:DATABASE_URL}",
      "output_format": "svg"
    },
    "unique_id": "HEIR-2025-10-CHARTDB-001",
    "process_id": "PRC-SCHEMA-001",
    "orbt_layer": 1,
    "blueprint_version": "1.0"
  }'
```

### Export DDL

```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "ChartDB",
    "action": "EXPORT_DDL",
    "data": {
      "database_url": "${MCP:DATABASE_URL}",
      "tables": ["users", "projects", "tasks"]
    },
    "unique_id": "HEIR-2025-10-CHARTDB-002",
    "process_id": "PRC-DDL-001",
    "orbt_layer": 1
  }'
```

---

## Toolkit Tools

- `GENERATE_SCHEMA_DIAGRAM` - Create visual database diagrams
- `EXPORT_DDL` - Export Data Definition Language statements
- `IMPORT_DATABASE` - Import existing database schemas
- `VISUALIZE_RELATIONSHIPS` - Show table relationships and foreign keys
- `COMPARE_SCHEMAS` - Compare schemas between environments
- `GENERATE_DOCS` - Auto-generate database documentation

---

## Local Development

ChartDB runs on port 5173 by default:

```bash
# Start ChartDB locally
cd chartdb/
npm install
npm run dev

# Access at http://localhost:5173
```

---

## CTB Compliance

- **Doctrine ID**: 04.04.07 (mandatory for all CTB repos)
- **MCP Endpoint**: Registered in `config/mcp_registry.json`
- **Branch**: Must exist in all CTB-compliant repositories
- **Enforcement**: Validated by `global-config/scripts/ctb_enforce.sh`

---

## Documentation

- Full integration docs: `sys/chartdb/` directory in this branch
- CTB Doctrine: `global-config/CTB_DOCTRINE.md`
- MCP Registry: `config/mcp_registry.json`

---

**Status**: Active
**Version**: 1.0
**Last Updated**: 2025-10-18
