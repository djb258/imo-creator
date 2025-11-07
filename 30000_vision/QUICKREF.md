# CTB Quick Reference

**One-Page Command Cheat Sheet** | Last Updated: 2025-10-23

---

## 🚀 Common Commands

### Run Full Compliance Cycle
```bash
# Complete cycle (tag → audit → remediate)
python ctb/sys/github-factory/scripts/run_compliance_simple.py ctb/
```

### Individual Script Execution

```bash
# 1. Tag files (classify and assign HEIR IDs)
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py ctb/

# 2. Audit compliance (calculate score)
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# 3. Remediate issues (fix problems)
python ctb/sys/github-factory/scripts/ctb_remediator.py --dry-run  # Preview
python ctb/sys/github-factory/scripts/ctb_remediator.py             # Apply fixes
```

### Check Compliance Score

```bash
# View full report (Markdown)
cat logs/CTB_AUDIT_REPORT.md

# View score only (JSON)
python -c "import json; print(json.load(open('logs/ctb_audit_report.json'))['compliance_score'])"

# View score with jq (if installed)
cat logs/ctb_audit_report.json | jq '.compliance_score'
```

### View Reports

```bash
# All generated reports
ls logs/CTB_*.md

# Tagging report
cat logs/CTB_TAGGING_REPORT.md

# Audit report
cat logs/CTB_AUDIT_REPORT.md

# Remediation report
cat logs/CTB_REMEDIATION_SUMMARY.md
```

---

## 📁 Key File Locations

| File | Path | Purpose |
|------|------|---------|
| **Entry Point** | `ENTRYPOINT.md` | Start here - navigation hub |
| **Enforcement Guide** | `CTB_ENFORCEMENT.md` | Complete enforcement documentation |
| **Quick Reference** | `QUICKREF.md` | This file - quick commands |
| **Configuration** | `global-config.yaml` | Global CTB configuration |
| **Registry** | `ctb/meta/ctb_registry.json` | CTB file registry |
| **Tags** | `ctb/meta/ctb_tags.json` | File classifications |
| **Audit Report** | `logs/CTB_AUDIT_REPORT.md` | Latest compliance report |
| **Audit JSON** | `logs/ctb_audit_report.json` | Machine-readable audit results |

---

## 📚 Documentation Quick Links

| Topic | Location |
|-------|----------|
| **System Infrastructure** | `ctb/sys/README.md` |
| **AI Systems** | `ctb/ai/README.md` |
| **Data Layer** | `ctb/data/README.md` |
| **Documentation Hub** | `ctb/docs/README.md` |
| **Configuration** | `ctb/meta/README.md` |
| **API Endpoints** | `ctb/sys/api/API_CATALOG.md` |
| **Database Schemas** | `ctb/data/SCHEMA_REFERENCE.md` |
| **Dependencies** | `ctb/meta/DEPENDENCIES.md` |
| **Architecture** | `ctb/docs/architecture/architecture.mmd` |

---

## 🔧 Troubleshooting

### Issue: Score Below 70

```bash
# 1. Run audit to identify issues
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# 2. View issues
cat logs/CTB_AUDIT_REPORT.md

# 3. Preview fixes (dry-run)
python ctb/sys/github-factory/scripts/ctb_remediator.py --dry-run

# 4. Apply fixes
python ctb/sys/github-factory/scripts/ctb_remediator.py

# 5. Re-audit to confirm improvement
python ctb/sys/github-factory/scripts/ctb_audit_generator.py
```

### Issue: Missing CTB Directories

```bash
# Auto-create missing directories
python ctb/sys/github-factory/scripts/ctb_remediator.py --fix-structure

# Or manually create
mkdir -p ctb/{sys,ai,data,docs,ui,meta}
mkdir -p logs
```

### Issue: Files Outside CTB Structure

```bash
# Tag files to see suggested locations
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py .

# Move files automatically
python ctb/sys/github-factory/scripts/ctb_remediator.py --fix-files
```

### Issue: Syntax Errors in Scripts

```bash
# Check script syntax
python -m py_compile ctb/sys/github-factory/scripts/ctb_audit_generator.py

# Common fixes:
# - Check for unterminated strings (quotes/parentheses)
# - Verify indentation (consistent spaces/tabs)
# - Look for missing colons on if/for/def lines
```

### Issue: Missing Metadata

```bash
# Generate registry and tags
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py ctb/
python ctb/sys/github-factory/scripts/ctb_remediator.py --fix-metadata

# Verify files created
ls ctb/meta/ctb_registry.json
ls ctb/meta/ctb_tags.json
```

---

## 📊 Compliance Thresholds

| Score Range | Grade | Status | Merge Policy |
|-------------|-------|--------|--------------|
| **90-100** | EXCELLENT 🌟 | PASS | Commit/merge allowed |
| **70-89** | GOOD/FAIR ✅ | PASS | Commit/merge allowed |
| **60-69** | NEEDS WORK ⚠️ | BLOCKED | Must fix before commit |
| **0-59** | FAIL ❌ | BLOCKED | Must fix before commit |

**Current Threshold**: **70/100**

---

## 🔒 Git & Version Control

### Pre-commit Hook

```bash
# Check if hook is installed
ls .git/hooks/pre-commit

# Manual hook installation (Mac/Linux)
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
python3 ctb/sys/github-factory/scripts/ctb_audit_generator.py
SCORE=$(python3 -c "import json; print(json.load(open('logs/ctb_audit_report.json'))['compliance_score'])")
if [ "$SCORE" -lt 70 ]; then exit 1; fi
EOF
chmod +x .git/hooks/pre-commit

# Windows (Git Bash)
# Create .git/hooks/pre-commit with similar content
# Then: git update-index --chmod=+x .git/hooks/pre-commit
```

### Bypass Pre-commit Hook (Emergency Only)

```bash
# Skip local hook (GitHub Actions will still check)
git commit --no-verify -m "Emergency fix"
```

### Check Enforcement Workflow

```bash
# View GitHub Actions workflow
cat .github/workflows/ctb_enforcement.yml

# Check workflow status (requires gh CLI)
gh workflow view ctb_enforcement.yml
gh run list --workflow=ctb_enforcement.yml
```

---

## ⚙️ Configuration

### View Current Threshold

```bash
# From global-config.yaml
grep "min_score" global-config.yaml

# Should show: min_score: 70
```

### Update Threshold

```bash
# Edit global-config.yaml
nano global-config.yaml

# Change:
# doctrine_enforcement:
#   min_score: 70  # Change to desired threshold (70-90)
```

### Check Composio Scenario

```bash
# Verify scenario configured
grep "composio_scenario" global-config.yaml

# Should show: composio_scenario: CTB_Compliance_Cycle
```

---

## 🧪 Testing & Validation

### Test Auto-Tagging

```bash
# Create test file
echo "test" > test_file.py

# Run tagger
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py .

# Check classification
grep "test_file.py" ctb/meta/ctb_tags.json

# Cleanup
rm test_file.py
```

### Validate Scripts (Syntax Check)

```bash
# Check all scripts for syntax errors
python -m py_compile ctb/sys/github-factory/scripts/ctb_metadata_tagger.py
python -m py_compile ctb/sys/github-factory/scripts/ctb_audit_generator.py
python -m py_compile ctb/sys/github-factory/scripts/ctb_remediator.py
python -m py_compile ctb/sys/github-factory/scripts/run_compliance_simple.py

# All should return silently (no output = no errors)
```

### Validate Configuration

```bash
# Check YAML syntax
python -c "import yaml; yaml.safe_load(open('global-config.yaml'))"

# Should print parsed config or error message
```

---

## 📦 Installation & Setup

### First-Time Setup (Mac/Linux)

```bash
# Install dependencies
pip3 install -r requirements.txt

# Copy environment files
cp ctb/sys/api/.env.example ctb/sys/api/.env
cp ctb/data/.env.example ctb/data/.env

# Edit with your credentials
nano ctb/sys/api/.env
nano ctb/data/.env

# Run initial compliance check
python3 ctb/sys/github-factory/scripts/run_compliance_simple.py ctb/
```

### First-Time Setup (Windows)

```powershell
# Install dependencies
pip install -r requirements.txt

# Copy environment files
copy ctb\sys\api\.env.example ctb\sys\api\.env
copy ctb\data\.env.example ctb\data\.env

# Edit with your credentials
notepad ctb\sys\api\.env
notepad ctb\data\.env

# Run initial compliance check
python ctb/sys/github-factory/scripts/run_compliance_simple.py ctb/
```

---

## 🎯 Common Workflows

### 1. Daily Development Workflow

```bash
# Morning: Check compliance status
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# During development: Write code normally
# Pre-commit hook will auto-check before each commit

# Before push: Manual check (optional)
python ctb/sys/github-factory/scripts/run_compliance_simple.py ctb/
```

### 2. Adding New Files

```bash
# Just create the file in appropriate CTB branch
touch ctb/sys/integrations/new_integration.py

# Auto-tagging happens on:
# - Pre-commit hook
# - GitHub Actions
# - Weekly Composio run

# Or manually tag:
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py ctb/
```

### 3. Fixing Non-Compliance

```bash
# 1. Identify issues
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# 2. Review recommended fixes
cat logs/CTB_AUDIT_REPORT.md

# 3. Auto-fix (preview first)
python ctb/sys/github-factory/scripts/ctb_remediator.py --dry-run

# 4. Apply fixes
python ctb/sys/github-factory/scripts/ctb_remediator.py

# 5. Verify improvement
python ctb/sys/github-factory/scripts/ctb_audit_generator.py
```

### 4. Creating Pull Request

```bash
# 1. Ensure compliance locally
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# 2. Fix any issues
python ctb/sys/github-factory/scripts/ctb_remediator.py

# 3. Commit changes
git add .
git commit -m "Your commit message"
# Pre-commit hook runs automatically

# 4. Push to remote
git push origin your-branch

# 5. Create PR
# GitHub Actions will run compliance check
# PR will be commented with score
```

---

## 💡 Pro Tips

### Faster Compliance Checks

```bash
# Check only structure (fast)
python ctb/sys/github-factory/scripts/ctb_audit_generator.py --check-structure-only

# Check only metadata (fast)
python ctb/sys/github-factory/scripts/ctb_audit_generator.py --check-metadata-only
```

### Watch Mode (Auto-Run on Changes)

```bash
# Linux/Mac with entr
ls ctb/**/*.py | entr python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# Or use nodemon (if installed)
nodemon --exec "python ctb/sys/github-factory/scripts/ctb_audit_generator.py" --watch ctb/
```

### Batch Operations

```bash
# Tag, audit, and remediate in one command
python ctb/sys/github-factory/scripts/run_compliance_simple.py ctb/ && \
python ctb/sys/github-factory/scripts/ctb_remediator.py && \
python ctb/sys/github-factory/scripts/ctb_audit_generator.py
```

---

## 📞 Getting Help

### Documentation

- **Full Guide**: See `CTB_ENFORCEMENT.md` for comprehensive documentation
- **Navigation**: See `ENTRYPOINT.md` for finding information
- **API Reference**: See `ctb/sys/api/API_CATALOG.md`
- **Schema Reference**: See `ctb/data/SCHEMA_REFERENCE.md`

### Common Questions

| Question | Answer |
|----------|--------|
| Do I need to tag files manually? | No - automated via hooks/CI/CD |
| What if my PR score is 69? | Blocked - run remediator and fix issues |
| Can I disable enforcement? | Use `--no-verify` flag (not recommended) |
| How do I raise threshold? | Edit `global-config.yaml` min_score |
| What's the target score? | Start at 70, gradually increase to 90 |

### Troubleshooting

See full troubleshooting guide in `CTB_ENFORCEMENT.md` section 🔧 Troubleshooting

### Support

- Create GitHub issue with `ctb-compliance` label
- Reference this quick reference or specific section of CTB_ENFORCEMENT.md
- Include output of: `python ctb/sys/github-factory/scripts/ctb_audit_generator.py`

---

## 🔄 Quick Reference Version

**Version**: 1.0
**Last Updated**: 2025-10-23
**For CTB Version**: 1.0.0
**Current Threshold**: 70/100

---

## ⚡ Ultra-Quick Commands

**Most Common Operations**:

```bash
# Check score
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# Fix issues
python ctb/sys/github-factory/scripts/ctb_remediator.py

# Full cycle
python ctb/sys/github-factory/scripts/run_compliance_simple.py ctb/

# View score
cat logs/ctb_audit_report.json | jq '.compliance_score'
```

**Remember**:
- **70+** = Pass ✅
- **Below 70** = Fix issues ⚠️
- Pre-commit hooks enforce automatically 🔒
- GitHub Actions double-check on PRs 🤖
- Weekly Composio runs monitor drift 📅

---

**End of Quick Reference** | Print this page for easy access!
