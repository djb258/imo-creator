# CTB Enforcement System - Complete Guide

**Version**: 1.3.3
**Last Updated**: 2025-10-23
**Enforcement Status**: ✅ Active
**Current Threshold**: 70/100

---

## 🎯 Overview

The CTB Enforcement System ensures **100% compliance** with the Christmas Tree Backbone (CTB) architecture through automated validation, tagging, and remediation. Every developer, every commit, every PR, every time — guaranteed CTB compliance with zero manual effort.

---

## 📊 Compliance Threshold Table

| Score  | Grade         | Status  | Merge Policy           | Action Required |
|--------|---------------|---------|------------------------|-----------------|
| 90–100 | EXCELLENT 🌟  | PASS    | Commit/merge allowed   | None - excellent work! |
| 70–89  | GOOD/FAIR ✅   | PASS    | Commit/merge allowed   | Minor improvements suggested |
| 60–69  | NEEDS WORK ⚠️ | BLOCKED | Must fix before commit | Address critical issues |
| 0–59   | FAIL ❌        | BLOCKED | Must fix before commit | Major compliance work needed |

**Current Threshold**: **70/100**
- Matches current baseline score (72%)
- Gradually raise as repositories mature
- Goal: 90% compliance across all projects

---

## 🧩 Enforcement Architecture

### 4-Layer Enforcement System

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Pre-Commit Hook (Local)                          │
│ • Tags new files with CTB metadata                         │
│ • Calculates compliance score                              │
│ • Blocks commits below threshold                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: GitHub Actions (CI/CD)                           │
│ • Double-checks compliance on PRs                          │
│ • Generates audit report                                   │
│ • Posts results as PR comment                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: Composio Weekly Run (Monitoring)                 │
│ • Tracks compliance trendlines                             │
│ • Sends notifications for drift                            │
│ • Updates CTB registry                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: CTB Remediator (Self-Healing)                    │
│ • Auto-fixes drifted files                                 │
│ • Repairs missing metadata                                 │
│ • Generates remediation reports                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Setup Instructions

### Prerequisites

- Python 3.11+
- Git 2.x+
- Node.js 18+ (for Composio MCP integration)
- Access to repository with write permissions

---

### Setup: Windows

#### 1. Install Python Dependencies

```powershell
# Navigate to repository
cd C:\Users\CUSTOMER PC\Cursor Repo\imo-creator-latest

# Install Python dependencies
pip install -r requirements.txt
```

#### 2. Configure Git Hooks

```powershell
# Make scripts executable (if using Git Bash)
git config core.hooksPath .githooks

# Or copy hooks manually
mkdir .git\hooks
copy .githooks\pre-commit .git\hooks\pre-commit
```

#### 3. Set Environment Variables

```powershell
# Create .env file from template
copy ctb\sys\api\.env.example .env

# Edit .env and add:
# DOCTRINE_DB=shq
# DOCTRINE_SUBHIVE=03
# DOCTRINE_APP=imo
# DOCTRINE_VER=1
```

#### 4. Test Compliance Scripts

```powershell
# Test metadata tagger
python ctb\sys\github-factory\scripts\ctb_metadata_tagger.py

# Test audit generator
python ctb\sys\github-factory\scripts\ctb_audit_generator.py

# Test remediator
python ctb\sys\github-factory\scripts\ctb_remediator.py
```

#### 5. Verify Setup

```powershell
# Check compliance score
python ctb\sys\github-factory\scripts\ctb_audit_generator.py
# Should see: "Compliance Score: XX%"

# Make a test commit
echo "test" > test.txt
git add test.txt
git commit -m "test: Verify CTB enforcement"
# Should trigger pre-commit hook
```

---

### Setup: macOS

#### 1. Install Python Dependencies

```bash
# Navigate to repository
cd ~/Projects/imo-creator-latest

# Install Python dependencies
pip3 install -r requirements.txt
```

#### 2. Configure Git Hooks

```bash
# Make scripts executable
chmod +x ctb/sys/github-factory/scripts/*.py
chmod +x .githooks/pre-commit

# Configure Git to use custom hooks directory
git config core.hooksPath .githooks
```

#### 3. Set Environment Variables

```bash
# Create .env file
cp ctb/sys/api/.env.example .env

# Edit .env with your favorite editor
vim .env

# Add required variables:
# DOCTRINE_DB=shq
# DOCTRINE_SUBHIVE=03
# DOCTRINE_APP=imo
# DOCTRINE_VER=1
```

#### 4. Test Compliance Scripts

```bash
# Test metadata tagger
python3 ctb/sys/github-factory/scripts/ctb_metadata_tagger.py

# Test audit generator
python3 ctb/sys/github-factory/scripts/ctb_audit_generator.py

# Test remediator
python3 ctb/sys/github-factory/scripts/ctb_remediator.py
```

#### 5. Verify Setup

```bash
# Check compliance score
python3 ctb/sys/github-factory/scripts/ctb_audit_generator.py | grep "Compliance Score"

# Make a test commit
echo "test" > test.txt
git add test.txt
git commit -m "test: Verify CTB enforcement"
# Should trigger pre-commit hook
```

---

### Setup: Linux

#### 1. Install Python Dependencies

```bash
# Navigate to repository
cd ~/imo-creator-latest

# Install Python dependencies
pip3 install -r requirements.txt

# Or use virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 2. Configure Git Hooks

```bash
# Make scripts executable
chmod +x ctb/sys/github-factory/scripts/*.py
chmod +x ctb/sys/global-factory/scripts/*.sh
chmod +x .githooks/pre-commit

# Configure Git hooks
git config core.hooksPath .githooks
```

#### 3. Set Environment Variables

```bash
# Create .env file
cp ctb/sys/api/.env.example .env

# Edit .env
nano .env

# Add required variables:
# DOCTRINE_DB=shq
# DOCTRINE_SUBHIVE=03
# DOCTRINE_APP=imo
# DOCTRINE_VER=1
```

#### 4. Test Compliance Scripts

```bash
# Test metadata tagger
./ctb/sys/github-factory/scripts/ctb_metadata_tagger.py

# Test audit generator
./ctb/sys/github-factory/scripts/ctb_audit_generator.py

# Test remediator
./ctb/sys/github-factory/scripts/ctb_remediator.py
```

#### 5. Verify Setup

```bash
# Check compliance score
./ctb/sys/github-factory/scripts/ctb_audit_generator.py | grep "Compliance Score"

# Make a test commit
echo "test" > test.txt
git add test.txt
git commit -m "test: Verify CTB enforcement"
# Should trigger pre-commit hook
```

---

## 🏷️ Auto-Tagging Explanation

### What is Auto-Tagging?

Auto-tagging automatically injects CTB metadata blocks into source files during commits. This ensures every file has:
- Division assignment
- Category classification
- Compliance score
- HEIR ID for traceability

### Metadata Block Format

```python
# CTB_METADATA: {
#   "division": "System Infrastructure",
#   "category": "api_endpoint",
#   "compliance": 95,
#   "heir_id": "HEIR-2025-10-CTB-TAG-01",
#   "timestamp": "2025-10-23T12:00:00Z"
# }
```

### How Auto-Tagging Works

```
Developer makes changes
        ↓
git add <files>
        ↓
git commit -m "message"
        ↓
Pre-commit hook triggers
        ↓
ctb_metadata_tagger.py runs
        ↓
Scans staged files
        ↓
Determines division from path
        ↓
Calculates compliance score
        ↓
Injects metadata block
        ↓
Updates file in staging
        ↓
Commit proceeds (if score ≥ 70)
```

### Compliance Score Calculation

**Factors**:
1. **File Location** (30 points)
   - In correct CTB division: +30
   - In root or wrong division: +0

2. **Structure Compliance** (20 points)
   - Follows CTB patterns: +20
   - Does not follow patterns: +0

3. **HEIR Tracking** (25 points)
   - Has HEIR/ORBT implementation: +25
   - Missing HEIR tracking: +0

4. **Documentation** (15 points)
   - Has docstrings/comments: +15
   - Missing documentation: +0

5. **Security** (10 points)
   - No hardcoded secrets: +10
   - Contains secrets: +0

**Total**: 100 points maximum

---

## 🔧 Enforcement Commands

### Manual Compliance Check

```bash
# Generate full audit report
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# Output: CTB_AUDIT_REPORT.md
# View compliance score
cat CTB_AUDIT_REPORT.md | grep "Compliance Score"
```

### Tag Files Manually

```bash
# Tag all files in repository
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py

# Output: CTB_TAGGING_REPORT.md
# View tagging summary
cat CTB_TAGGING_REPORT.md
```

### Auto-Remediate Issues

```bash
# Fix compliance issues automatically
python ctb/sys/github-factory/scripts/ctb_remediator.py

# Output: CTB_REMEDIATION_SUMMARY.md
# View fixes applied
cat CTB_REMEDIATION_SUMMARY.md
```

### Run Full Compliance Cycle

```bash
# Run all three scripts in sequence
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py
python ctb/sys/github-factory/scripts/ctb_audit_generator.py
python ctb/sys/github-factory/scripts/ctb_remediator.py

# Check final score
cat CTB_AUDIT_REPORT.md | grep "Compliance Score"
```

### Bypass Enforcement (Emergency Only)

```bash
# Skip pre-commit hook (NOT RECOMMENDED)
git commit --no-verify -m "Emergency commit"

# WARNING: Only use in emergencies
# Must fix compliance before merging
```

---

## 🔍 Composio MCP Integration

### Weekly Compliance Cycle

The CTB Compliance Cycle runs automatically via Composio MCP every Monday at 00:00 UTC.

**Scenario**: `CTB_Compliance_Cycle`
**Tasks**: `ctb_tagger` → `ctb_auditor` → `ctb_remediator`

### Configuration

**File**: `ctb/meta/config/composio_ctb_tasks.json`

```json
{
  "scenarios": [{
    "scenario_id": "CTB_Compliance_Cycle",
    "execution_order": "sequential",
    "schedule": "weekly_monday_00:00_utc",
    "compliance_threshold": 90,
    "fail_on_threshold": true
  }]
}
```

### Triggering Manually

```bash
# Via Composio MCP server (must be running on port 3001)
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "run_scenario",
    "data": {
      "scenario_id": "CTB_Compliance_Cycle"
    },
    "unique_id": "HEIR-2025-10-CTB-MANUAL-01",
    "process_id": "PRC-CTB-MANUAL",
    "orbt_layer": 4,
    "blueprint_version": "1.0"
  }'
```

### Monitoring Results

```bash
# Check last run results
cat ctb/meta/registry/audit_data.json | jq '.statistics.compliance_score'

# View trend over time
ls -lt CTB_AUDIT_REPORT_*.md
```

---

## ❓ Troubleshooting & FAQ

### Common Issues

#### Issue: Pre-commit hook not running

**Symptoms**: Commits go through without compliance check

**Solutions**:
```bash
# Check hooks configuration
git config core.hooksPath
# Should show: .githooks

# Reconfigure hooks
git config core.hooksPath .githooks

# Make hook executable (Linux/Mac)
chmod +x .githooks/pre-commit

# Windows: Ensure Git Bash is being used
```

---

#### Issue: Compliance score stuck at low value

**Symptoms**: Score doesn't improve after fixes

**Solutions**:
```bash
# Clear cached audit data
rm ctb/meta/registry/audit_data.json

# Re-run audit
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# Check for root cause
cat CTB_AUDIT_REPORT.md | grep -A 20 "## Issues"
```

---

#### Issue: Metadata not injected into files

**Symptoms**: Files commit without CTB_METADATA blocks

**Solutions**:
```bash
# Run tagger manually
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py

# Check if files are in correct divisions
ls -R ctb/

# Verify file extensions are supported
# Supported: .py, .js, .ts, .jsx, .tsx, .md

# Check tagger output
cat CTB_TAGGING_REPORT.md
```

---

#### Issue: "Import error" when running scripts

**Symptoms**: `ModuleNotFoundError` or `ImportError`

**Solutions**:
```bash
# Install dependencies
pip install -r requirements.txt

# Add CTB to Python path
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Or run from repository root
cd /path/to/imo-creator
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py
```

---

#### Issue: GitHub Actions workflow fails

**Symptoms**: PR checks fail with compliance error

**Solutions**:
```bash
# Run audit locally first
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# Fix issues identified
cat CTB_AUDIT_REPORT.md

# Run remediator
python ctb/sys/github-factory/scripts/ctb_remediator.py

# Commit fixes
git add .
git commit -m "fix: Improve CTB compliance"
git push
```

---

#### Issue: Composio MCP server not running

**Symptoms**: Weekly compliance cycle doesn't execute

**Solutions**:
```bash
# Check if server is running
curl http://localhost:3001/mcp/health

# Start Composio MCP server
cd ../scraping-tool/imo-creator/mcp-servers/composio-mcp
node server.js

# Verify scenario is registered
curl -X POST http://localhost:3001/tool \
  -d '{"tool": "list_scenarios", "data": {}}'
```

---

### FAQ

**Q: Do I need to tag files manually?**
A: No! Auto-tagging happens automatically during commits via pre-commit hook.

**Q: What if my compliance score is below 70?**
A: The commit will be blocked. Run `ctb_remediator.py` to auto-fix issues, then commit again.

**Q: Can I bypass enforcement for urgent fixes?**
A: Use `git commit --no-verify` only in emergencies. You must fix compliance before merging.

**Q: How often should I run the compliance cycle?**
A: It runs automatically every Monday via Composio. You can also run manually anytime.

**Q: What happens if a file is in the wrong division?**
A: The remediator will suggest moving it. Move the file to the correct division and re-commit.

**Q: Do tests need CTB metadata?**
A: Yes, all files should have metadata, including tests.

**Q: Can I customize the compliance threshold?**
A: Yes, edit `.github/workflows/ctb_enforcement.yml` and `composio_ctb_tasks.json`.

**Q: What if I disagree with the compliance score?**
A: Review the audit report for specific issues. If legitimate, file an issue to update the scoring algorithm.

**Q: Does enforcement slow down commits?**
A: Pre-commit hook adds ~2-5 seconds. GitHub Actions run in parallel, no developer wait time.

**Q: Can I run enforcement on a specific file?**
A: Yes, modify scripts to accept file path arguments (future enhancement).

---

## 📈 Grading System Explained

### Score Breakdown

#### 90-100: EXCELLENT 🌟

**Characteristics**:
- All files in correct CTB divisions
- 100% HEIR/ORBT compliance where required
- No hardcoded secrets
- Complete documentation
- All tests passing
- Security best practices followed

**Benefits**:
- Instant merge approval
- Featured in compliance leaderboard
- Used as template for other projects

**Example**:
```
✅ Structure: 30/30
✅ HEIR Tracking: 25/25
✅ Documentation: 15/15
✅ Security: 10/10
✅ Patterns: 20/20
━━━━━━━━━━━━━━━━━━━━
Total: 100/100 (EXCELLENT)
```

---

#### 70-89: GOOD/FAIR ✅

**Characteristics**:
- Most files in correct divisions
- HEIR/ORBT tracking present
- Minor documentation gaps
- No critical issues
- Room for improvement

**Benefits**:
- Merge allowed
- Suggestions for improvement provided
- Trending toward excellence

**Example**:
```
✅ Structure: 28/30
✅ HEIR Tracking: 20/25
⚠️ Documentation: 10/15
✅ Security: 10/10
✅ Patterns: 18/20
━━━━━━━━━━━━━━━━━━━━
Total: 86/100 (GOOD)
```

---

#### 60-69: NEEDS WORK ⚠️

**Characteristics**:
- Some files misplaced
- Inconsistent HEIR tracking
- Missing documentation
- Some security concerns
- Requires attention

**Actions Required**:
1. Review audit report
2. Run remediator
3. Fix critical issues
4. Re-run audit
5. Commit fixes

**Example**:
```
⚠️ Structure: 20/30
⚠️ HEIR Tracking: 15/25
❌ Documentation: 5/15
✅ Security: 10/10
⚠️ Patterns: 14/20
━━━━━━━━━━━━━━━━━━━━
Total: 64/100 (NEEDS WORK)
```

---

#### 0-59: FAIL ❌

**Characteristics**:
- Files in wrong locations
- No HEIR/ORBT tracking
- Hardcoded secrets present
- Missing documentation
- Critical compliance violations

**Immediate Actions**:
1. STOP - Do not merge
2. Run full compliance cycle
3. Address ALL critical issues
4. Request architecture review
5. Re-audit before proceeding

**Example**:
```
❌ Structure: 10/30
❌ HEIR Tracking: 0/25
❌ Documentation: 2/15
❌ Security: 0/10 (SECRETS FOUND!)
❌ Patterns: 8/20
━━━━━━━━━━━━━━━━━━━━
Total: 20/100 (FAIL)
```

---

## 🎯 Enforcement Goals

### Primary Goals

1. **Zero Manual Barton ID Management**
   - ✅ Auto-generation via HEIR utilities
   - ✅ Auto-registration in `ids` table
   - ✅ Collision prevention

2. **No Non-Compliant Code Merged**
   - ✅ Pre-commit blocking
   - ✅ PR checks enforcement
   - ✅ 70% minimum threshold

3. **Every Commit Automatically Tagged**
   - ✅ Metadata injection
   - ✅ Division assignment
   - ✅ Compliance scoring

4. **Guaranteed CTB Compliance**
   - ✅ 4-layer enforcement
   - ✅ Self-healing via remediator
   - ✅ Continuous monitoring

---

### Secondary Goals

1. **Developer Experience**
   - Minimal friction during commits
   - Clear error messages
   - Automated fixes where possible

2. **Visibility & Metrics**
   - Compliance trending over time
   - Division-level scorecards
   - Team performance tracking

3. **Continuous Improvement**
   - Evolving scoring algorithm
   - Community feedback integration
   - Best practices sharing

---

## 📚 Related Documentation

- **Entry Point**: `ENTRYPOINT.md`
- **Quick Reference**: `QUICKREF.md`
- **CTB Doctrine**: `ctb/sys/global-factory/CTB_DOCTRINE.md`
- **API Catalog**: `ctb/sys/api/API_CATALOG.md`
- **Schema Reference**: `ctb/data/SCHEMA_REFERENCE.md`
- **Dependencies**: `ctb/meta/DEPENDENCIES.md`

---

## 🔄 Maintenance

### Updating Threshold

```bash
# Edit GitHub Actions workflow
vim .github/workflows/ctb_enforcement.yml

# Find and update threshold
min_score: 70  # Change to desired value

# Edit Composio scenario
vim ctb/meta/config/composio_ctb_tasks.json

# Update threshold
"compliance_threshold": 70  # Change to desired value
```

### Adding New Divisions

```bash
# Create new division directory
mkdir ctb/newdivision

# Update enforcement scripts
# Add to required_divisions list in:
# - ctb/sys/github-factory/scripts/ctb_metadata_tagger.py
# - ctb/sys/github-factory/scripts/ctb_audit_generator.py
# - ctb/sys/github-factory/scripts/ctb_remediator.py
```

### Updating Scoring Algorithm

```bash
# Edit metadata tagger
vim ctb/sys/github-factory/scripts/ctb_metadata_tagger.py

# Modify calculate_compliance_score() function
# Adjust weight percentages as needed

# Test with existing repository
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py
```

---

## 🚨 Critical Warnings

### DO NOT

❌ **Bypass enforcement without justification**
- Every bypass must be documented
- Fix compliance before merging
- Emergency use only

❌ **Edit metadata blocks manually**
- Auto-tagger will overwrite
- Use scripts to update metadata
- Maintain consistency

❌ **Ignore failed compliance checks**
- Violations indicate real issues
- Address root cause
- Request help if stuck

❌ **Lower threshold without team consensus**
- Requires architecture review
- Document reasoning
- Plan improvement path

### DO

✅ **Run compliance cycle regularly**
- Weekly automated via Composio
- Before major commits
- After large refactors

✅ **Keep enforcement scripts updated**
- Pull latest from master
- Review changelog
- Test after updates

✅ **Report false positives**
- File GitHub issue
- Include audit report
- Suggest improvements

✅ **Celebrate compliance milestones**
- Share 90%+ achievements
- Recognize team efforts
- Maintain momentum

---

## 📊 Enforcement Statistics

### Current Repository Status

- **CTB Version**: 1.3.3
- **Compliance Score**: 72% (as of last audit)
- **Current Threshold**: 70%
- **Total Files**: 500+
- **Tagged Files**: 150+
- **HEIR-Tracked Files**: 50+
- **Active Divisions**: 6

### Enforcement Coverage

- ✅ Pre-commit hooks: Active
- ✅ GitHub Actions: Configured
- ✅ Composio integration: Active
- ✅ Auto-remediation: Enabled
- ✅ Weekly monitoring: Scheduled

---

**Maintained by**: CTB Enforcement Team
**Review Schedule**: Monthly
**Next Review**: 2025-11-23
**Version**: 1.3.3
**Status**: ✅ Production Active

---

**Every developer, every commit, every PR, every time — guaranteed CTB compliance with zero manual effort.**
