# ChartDB Schema Directory

This directory contains automatically generated database schema documentation from the ChartDB automation system.

## Structure

```
chartdb_schemas/
├── schema_index.json            # Master index of all database schemas
├── README.md                     # This file
├── detected_schemas.txt          # List of detected schema files
├── schemas/                      # Per-schema metadata
│   ├── schema1.json
│   ├── schema2.json
│   └── ...
└── diagrams/                     # Generated schema diagrams
    ├── schema1.png
    ├── schema1.svg
    └── ...
```

## Index File Format

The `schema_index.json` file contains:

```json
{
  "version": "1.0",
  "last_updated": "ISO8601 timestamp",
  "repositories": {
    "repo-name": {
      "branch": "branch name",
      "last_commit": "commit hash",
      "last_updated": "ISO8601 timestamp",
      "author": "commit author",
      "email": "commit email",
      "commit_message": "commit message",
      "status": "success|failed",
      "schema_count": 0
    }
  }
}
```

## Automation

Database schemas are automatically detected and documented when:
- SQL files are modified
- Database migrations are added
- Prisma schema changes
- Model/entity files are updated
- Scheduled daily refresh (3 AM UTC)
- Manual trigger via GitHub Actions

## Detected Schema Files

ChartDB automatically detects:
- `*.sql` - SQL schema files
- `migrations/**` - Database migration files
- `prisma/schema.prisma` - Prisma schemas
- `**/models/**` - ORM model files
- `**/entities/**` - Entity definition files

## Configuration

See `global-config/global_manifest.yaml` for:
- Enabled/disabled status
- Target repositories
- Schema detection patterns
- Diagram generation settings
- Kill switch

## Logs

- **Audit Log**: `logs/chartdb_audit.log` - All schema scans
- **Error Log**: `logs/chartdb_error.log` - Failed scans

## Kill Switch

To disable all automation globally:

```yaml
# In global-config/global_manifest.yaml
chartdb:
  kill_switch:
    enabled: true
    reason: "Emergency maintenance"
```

## Manual Execution

To manually run ChartDB schema detection:

```bash
# Via hook script
./scripts/hooks/post_update_chartdb.sh

# Via GitHub Actions
gh workflow run chartdb_automation.yml
```

## Viewing Schema Diagrams

1. **Local ChartDB Interface**:
   ```bash
   cd chartdb
   npm install
   npm run dev
   # Open http://localhost:5173
   ```

2. **Import Schema Files**:
   - Use ChartDB UI to import detected SQL files
   - Schemas are auto-detected from `detected_schemas.txt`

## Troubleshooting

### No Schemas Detected

```bash
# Check if schema files exist
find . -name "*.sql" ! -path "*/node_modules/*"

# Check configuration
cat global-config/global_manifest.yaml | grep -A 20 "chartdb:"
```

### ChartDB Not Running

```bash
cd chartdb
npm install
npm run dev
```

### View Logs

```bash
tail -f logs/chartdb_audit.log
tail -f logs/chartdb_error.log
```

## Support

For issues or questions:
- Check logs first
- Review global configuration
- Ensure schema files are in tracked locations
- Contact: admin@bartonenterprises.com

---

**Last Updated**: 2025-10-22
**Version**: 1.0
