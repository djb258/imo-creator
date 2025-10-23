# Quick Reference - CTB Commands

**Version**: 1.3.3
**Last Updated**: 2025-10-23

---

## 🚀 Server Startup

```bash
# Start Composio MCP Server (MANDATORY)
cd ../scraping-tool/imo-creator/mcp-servers/composio-mcp
node server.js

# Start FastAPI Server
python main.py

# Check health
curl http://localhost:3001/mcp/health
curl http://localhost:8000/health
```

---

## 🛡️ CTB Enforcement Commands

### Check Compliance Score

```bash
# Generate full audit report
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# View score
cat CTB_AUDIT_REPORT.md | grep "Compliance Score"

# View issues
cat CTB_AUDIT_REPORT.md | grep -A 20 "## Issues"
```

### Tag Files with Metadata

```bash
# Tag all files
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py

# View tagging report
cat CTB_TAGGING_REPORT.md
```

### Auto-Fix Compliance Issues

```bash
# Run remediator
python ctb/sys/github-factory/scripts/ctb_remediator.py

# View remediation summary
cat CTB_REMEDIATION_SUMMARY.md
```

### Run Full Compliance Cycle

```bash
# Run all three scripts in sequence
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py
python ctb/sys/github-factory/scripts/ctb_audit_generator.py
python ctb/sys/github-factory/scripts/ctb_remediator.py
```

---

## 📊 CTB Registry & Data

### View Registry

```bash
# View CTB registry
cat ctb/meta/registry/ctb_registry.json

# View divisions
jq '.divisions | keys' ctb/meta/registry/ctb_registry.json

# View enforcement status
jq '.enforcement.status' ctb/meta/registry/ctb_registry.json
```

### View Audit Data

```bash
# View compliance score
jq '.statistics.compliance_score' ctb/meta/registry/audit_data.json

# View total issues
jq '.statistics.total_issues' ctb/meta/registry/audit_data.json

# View critical issues
jq '.issues[] | select(.severity == "critical")' ctb/meta/registry/audit_data.json
```

---

## 🔍 Finding Things

### Find Files

```bash
# Find by pattern
find ctb/ -name "*.py"
find ctb/ -name "*.md"

# Find in specific division
ls -R ctb/sys/
ls -R ctb/ai/
ls -R ctb/data/
```

### Search Code

```bash
# Search for text
grep -r "HEIR" ctb/
grep -r "Composio" ctb/docs/

# Search for API endpoints
grep -r "@app\." ctb/sys/

# Search for database tables
grep -r "CREATE TABLE" ctb/data/
```

### Find Documentation

```bash
# List all READMEs
find . -name "README.md"

# Find API docs
find ctb/docs/ -name "*.md"

# Find diagrams
find ctb/docs/ -name "*.mmd"
```

---

## 🗄️ Database Commands

### Connect to Database

```bash
# Test connection
psql $DATABASE_URL -c "SELECT version();"

# Connect interactively
psql $DATABASE_URL
```

### Run Migrations

```bash
# Run single migration
psql $DATABASE_URL < ctb/data/migrations/001_initial_schema.sql

# Run all migrations
for f in ctb/data/migrations/*.sql; do
  echo "Applying $f..."
  psql $DATABASE_URL < "$f"
done
```

### Seed Data

```bash
# Load seed data
psql $DATABASE_URL < ctb/data/seeds/test_data.sql

# Verify
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest ctb/sys/tests/test_api_smoke.py

# Run with coverage
pytest --cov=ctb --cov-report=html

# Run tests for specific division
pytest ctb/sys/tests/
pytest ctb/data/tests/
```

### API Testing

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test LLM endpoint
curl -X POST http://localhost:8000/llm \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello", "provider": "anthropic"}'

# Test SSOT processing
curl -X POST http://localhost:8000/api/ssot/save \
  -H "Content-Type: application/json" \
  -d '{"ssot": {"meta": {"app_name": "test"}}}'
```

---

## 🔧 Git Operations

### Standard Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Check status
git status

# Add files
git add .

# Commit (triggers pre-commit hook)
git commit -m "feat: Add my feature"

# Push
git push origin feature/my-feature
```

### Compliance-Aware Commits

```bash
# Check compliance before commit
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# If score < 70, fix issues
python ctb/sys/github-factory/scripts/ctb_remediator.py

# Then commit
git add .
git commit -m "fix: Improve CTB compliance"
```

### Emergency Bypass (Use Sparingly)

```bash
# Skip pre-commit hook (NOT RECOMMENDED)
git commit --no-verify -m "Emergency commit"

# Must fix compliance before merging!
```

---

## 📖 Documentation Lookup

### Quick Navigation

```bash
# Entry point
cat ENTRYPOINT.md

# Enforcement guide
cat CTB_ENFORCEMENT.md

# Quick reference (this file)
cat QUICKREF.md

# Division-specific
cat ctb/sys/README.md
cat ctb/ai/README.md
cat ctb/data/README.md
cat ctb/docs/README.md
cat ctb/meta/README.md
```

### API & Schema References

```bash
# API catalog
cat ctb/sys/api/API_CATALOG.md

# Schema reference
cat ctb/data/SCHEMA_REFERENCE.md

# Dependencies
cat ctb/meta/DEPENDENCIES.md

# Architecture diagram
cat ctb/docs/architecture/architecture.mmd
```

---

## 🔌 Composio Integration

### Test Composio Connection

```bash
# Check health
curl http://localhost:3001/mcp/health

# Get stats
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "get_composio_stats",
    "data": {},
    "unique_id": "HEIR-2025-10-TEST-01",
    "process_id": "PRC-TEST-001",
    "orbt_layer": 2,
    "blueprint_version": "1.0"
  }'

# List connected accounts
curl -X POST http://localhost:3001/tool \
  -d '{"tool": "manage_connected_account", "data": {"action": "list"}}'
```

### Trigger Compliance Cycle

```bash
# Manual trigger via Composio MCP
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "run_scenario",
    "data": {"scenario_id": "CTB_Compliance_Cycle"},
    "unique_id": "HEIR-2025-10-CTB-MANUAL-01",
    "process_id": "PRC-CTB-MANUAL",
    "orbt_layer": 4,
    "blueprint_version": "1.0"
  }'
```

---

## 🔍 Debugging

### Check Logs

```bash
# View recent logs
tail -f logs/api.log
tail -f logs/ctb_enforcement.log

# Search logs
grep "ERROR" logs/api.log
grep "WARNING" logs/ctb_enforcement.log
```

### Check Process Status

```bash
# Check running processes
ps aux | grep python
ps aux | grep node

# Check port usage
lsof -i :8000  # FastAPI
lsof -i :3001  # Composio MCP
```

### Verify Configuration

```bash
# Check environment variables
cat .env | grep DATABASE_URL
cat .env | grep COMPOSIO_API_KEY

# Check CTB structure
tree -L 2 ctb/

# Verify Git hooks
ls -la .githooks/
git config core.hooksPath
```

---

## 📊 Monitoring & Metrics

### Compliance Metrics

```bash
# Current score
jq '.statistics.compliance_score' ctb/meta/registry/audit_data.json

# Total files
jq '.metadata.total_files' ctb/meta/registry/audit_data.json

# Tagged files
jq '.total_tagged' ctb/meta/registry/tagging_data.json

# HEIR IDs generated
jq '.heir_pattern_matches' ctb/meta/registry/audit_data.json
```

### Division Statistics

```bash
# Files per division
jq '.divisions[] | {name: .name, files: .file_count}' ctb/meta/registry/ctb_registry.json

# Subdirectories per division
jq '.divisions[] | {name: .name, subdirs: .subdirectories}' ctb/meta/registry/ctb_registry.json
```

---

## 🛠️ Common Fixes

### Fix Import Errors

```bash
# Add CTB to Python path
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Or run from root
cd /path/to/imo-creator
python ctb/sys/github-factory/scripts/ctb_audit_generator.py
```

### Fix Permission Errors

```bash
# Make scripts executable (Linux/Mac)
chmod +x ctb/sys/github-factory/scripts/*.py
chmod +x ctb/sys/global-factory/scripts/*.sh
chmod +x .githooks/pre-commit
```

### Fix Database Connection

```bash
# Test connection
pg_isready -d $DATABASE_URL

# Check environment
echo $DATABASE_URL

# Verify .env file
cat .env | grep DATABASE_URL
```

---

## 🚨 Emergency Procedures

### Skip Enforcement (Emergency Only)

```bash
# Skip pre-commit hook
git commit --no-verify -m "Emergency: Critical fix"

# MUST fix compliance before merging!
python ctb/sys/github-factory/scripts/ctb_remediator.py
```

### Force Push (Danger Zone)

```bash
# Create backup branch first
git branch backup-$(date +%Y%m%d)

# Force push (use with extreme caution)
git push --force origin branch-name

# WARNING: Only use when absolutely necessary
```

### Restore from Backup

```bash
# List backups
git branch -a | grep backup

# Restore from backup
git checkout backup-20251023
git checkout -b recovery-branch
```

---

## 📋 Cheat Sheet

### One-Liners

```bash
# Quick compliance check
python ctb/sys/github-factory/scripts/ctb_audit_generator.py && cat CTB_AUDIT_REPORT.md | grep "Compliance Score"

# Full compliance cycle
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py && python ctb/sys/github-factory/scripts/ctb_audit_generator.py && python ctb/sys/github-factory/scripts/ctb_remediator.py

# Count files per division
for d in ctb/*/; do echo "$d: $(find $d -type f | wc -l) files"; done

# Find all HEIR IDs
grep -r "HEIR-" ctb/ --include="*.py" --include="*.js"

# Check all health endpoints
curl http://localhost:3001/mcp/health && curl http://localhost:8000/health
```

### Environment Setup

```bash
# Quick setup (copy and paste)
pip install -r requirements.txt && \
cp ctb/sys/api/.env.example .env && \
git config core.hooksPath .githooks && \
python ctb/sys/github-factory/scripts/ctb_audit_generator.py
```

---

## 🔗 Quick Links

| Resource | Location |
|----------|----------|
| Entry Point | `ENTRYPOINT.md` |
| Enforcement Guide | `CTB_ENFORCEMENT.md` |
| Quick Reference | `QUICKREF.md` (this file) |
| API Catalog | `ctb/sys/api/API_CATALOG.md` |
| Schema Reference | `ctb/data/SCHEMA_REFERENCE.md` |
| Dependencies | `ctb/meta/DEPENDENCIES.md` |
| Architecture | `ctb/docs/architecture/architecture.mmd` |
| Composio Integration | `ctb/docs/composio/COMPOSIO_INTEGRATION.md` |
| Barton Doctrine | `ctb/sys/global-factory/CTB_DOCTRINE.md` |

---

## 💡 Pro Tips

1. **Always check compliance before committing**
   ```bash
   python ctb/sys/github-factory/scripts/ctb_audit_generator.py
   ```

2. **Use Tab completion for paths**
   ```bash
   cat ctb/sys/<TAB>
   ```

3. **Alias common commands** (add to ~/.bashrc or ~/.zshrc)
   ```bash
   alias ctb-check='python ctb/sys/github-factory/scripts/ctb_audit_generator.py'
   alias ctb-fix='python ctb/sys/github-factory/scripts/ctb_remediator.py'
   alias ctb-tag='python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py'
   ```

4. **Use jq for JSON parsing**
   ```bash
   cat ctb/meta/registry/audit_data.json | jq '.statistics'
   ```

5. **Keep MCP server running in background**
   ```bash
   cd ../scraping-tool/imo-creator/mcp-servers/composio-mcp
   nohup node server.js &
   ```

---

**Last Updated**: 2025-10-23
**CTB Version**: 1.3.3
**Quick Reference Version**: 1.0

---

💡 **Tip**: Bookmark this file for instant access to all essential CTB commands!
