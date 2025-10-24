# PROMPT 3: GitHub Factory Installation & CI/CD Integration

**Purpose**: Install CTB compliance automation scripts and GitHub Actions workflows for continuous enforcement

**Stage**: After completing CTB structure reorganization and tagging/auditing

---

## 🎯 OBJECTIVE

Install and connect the three core compliance scripts in the GitHub Factory, set up CI/CD enforcement workflows, and expose CTB operations as Composio tasks for automated weekly compliance cycles.

---

## ✅ TASKS

### 1. GitHub Factory Scripts

Create inside `ctb/sys/github-factory/scripts/`:

#### a. ctb_metadata_tagger.py
- Automatically classify files into CTB branches
- Generate HEIR tracking IDs
- Suggest new CTB locations for misplaced files
- Output: `ctb/meta/ctb_tags.json` and `logs/CTB_TAGGING_REPORT.md`

#### b. ctb_audit_generator.py
- Calculate CTB compliance score (0-100)
- Check directory structure completeness
- Validate file distribution across branches
- Identify compliance issues with severity levels
- Output: `logs/ctb_audit_report.json` and `logs/CTB_AUDIT_REPORT.md`

#### c. ctb_remediator.py
- Auto-fix compliance issues
- Create missing directories
- Generate CTB registry
- Support dry-run mode for preview
- Output: `logs/ctb_remediation_log.json` and `logs/CTB_REMEDIATION_SUMMARY.md`

#### d. run_compliance_simple.py (wrapper)
- Run all three scripts sequentially
- Combine results into single report
- Output: `logs/ctb_compliance_results.json`

---

### 2. GitHub Actions Workflows

Create in `.github/workflows/`:

#### a. ctb_enforcement.yml (Primary Workflow)

**Triggers**:
- Push to main/master
- Pull requests
- Weekly schedule (Sundays at 2 AM UTC)
- Manual workflow dispatch

**Steps**:
1. Checkout code
2. Setup Python 3.9+
3. Install dependencies
4. Run CTB metadata tagger
5. Run CTB auditor
6. Check compliance score against threshold (min: 70/100)
7. Upload reports as artifacts
8. Comment on PR with results
9. Block merge if score < 70
10. Create issue if weekly check fails

**Example Workflow**:
```yaml
name: CTB Enforcement

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
  schedule:
    - cron: '0 2 * * 0'  # Sundays at 2 AM UTC
  workflow_dispatch:

jobs:
  ctb-compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Run CTB Tagger
        run: python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py ctb/

      - name: Run CTB Auditor
        run: python ctb/sys/github-factory/scripts/ctb_audit_generator.py

      - name: Check Compliance Score
        run: |
          SCORE=$(python -c "import json; print(json.load(open('logs/ctb_audit_report.json'))['compliance_score'])")
          echo "Compliance Score: $SCORE/100"
          if [ "$SCORE" -lt 70 ]; then
            echo "❌ Score below threshold (70/100)"
            exit 1
          fi

      - name: Upload Reports
        uses: actions/upload-artifact@v3
        with:
          name: ctb-reports
          path: logs/*.md

      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('logs/ctb_audit_report.json'));
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## CTB Compliance Report\n\n**Score**: ${report.compliance_score}/100\n**Status**: ${report.status}\n\nSee artifacts for full report.`
            });
```

#### b. Optional Supporting Workflows
- `ctb_drift_check.yml` - Detect configuration drift
- `ctb_health.yml` - Monitor CTB system health
- `doctrine_sync.yml` - Sync doctrine updates from global-factory

---

### 3. Composio Integration

Expose each script as a Composio-callable task:

#### Task Definitions:

**ctb_tagger**:
- Tool: `ctb_tagger`
- Action: Execute file tagging
- Input: `target_dir` (default: "ctb/")
- Output: Tagged file count, report path, HEIR ID

**ctb_auditor**:
- Tool: `ctb_auditor`
- Action: Run compliance audit
- Input: None
- Output: Compliance score, status, issues, report path

**ctb_remediator**:
- Tool: `ctb_remediator`
- Action: Auto-fix compliance issues
- Input: `dry_run` (boolean)
- Output: Actions performed, report path

#### Composio Scenario: CTB_Compliance_Cycle

**Name**: `CTB_Compliance_Cycle`
**Schedule**: Weekly (Sundays at 2 AM UTC)
**Steps**:
1. Run `ctb_tagger` on entire repository
2. Run `ctb_auditor` to calculate score
3. If score < 70: Run `ctb_remediator` (dry-run first, then apply)
4. Send notification if issues found
5. Create GitHub issue if score remains < 70

**Scenario Configuration**:
```json
{
  "scenario": "CTB_Compliance_Cycle",
  "schedule": "0 2 * * 0",
  "tasks": [
    {
      "tool": "ctb_tagger",
      "data": {"target_dir": "ctb/"},
      "orbt_layer": 1
    },
    {
      "tool": "ctb_auditor",
      "orbt_layer": 1
    },
    {
      "tool": "ctb_remediator",
      "data": {"dry_run": false},
      "orbt_layer": 1,
      "condition": "score < 70"
    }
  ],
  "notifications": {
    "on_failure": true,
    "on_score_below": 70,
    "channels": ["github_issue", "slack"]
  }
}
```

---

### 4. Documentation Integration

Create in `ctb/sys/github-factory/`:

**COMPOSIO_CTB_INTEGRATION.md**:
- Document all three Composio tasks
- Provide CTB_Compliance_Cycle scenario details
- Include REST API endpoint specifications
- Add usage examples and test cases

---

## 📦 OUTPUT

After completing this prompt:

**Files Created**:
```
ctb/sys/github-factory/
├── scripts/
│   ├── ctb_metadata_tagger.py        ✅ File classifier
│   ├── ctb_audit_generator.py        ✅ Compliance auditor
│   ├── ctb_remediator.py             ✅ Auto-remediation
│   └── run_compliance_simple.py      ✅ Full cycle runner
└── COMPOSIO_CTB_INTEGRATION.md       ✅ Composio docs

.github/workflows/
├── ctb_enforcement.yml                ✅ Primary CI/CD
└── [optional supporting workflows]    ✅ Additional checks

logs/
├── CTB_TAGGING_REPORT.md             ✅ (generated)
├── CTB_AUDIT_REPORT.md               ✅ (generated)
└── CTB_REMEDIATION_SUMMARY.md        ✅ (generated)
```

**Configuration Updated**:
```yaml
# global-config.yaml
doctrine_enforcement:
  ctb_factory: ctb/sys/github-factory/
  auto_sync: true
  min_score: 70
  composio_scenario: CTB_Compliance_Cycle
  auto_remediate: true
```

---

## 🔄 VERIFICATION

Run the complete compliance cycle:

```bash
# 1. Tag all files
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py ctb/

# 2. Audit compliance
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# 3. View score
cat logs/ctb_audit_report.json | jq '.compliance_score'

# 4. Remediate if needed (dry-run first)
python ctb/sys/github-factory/scripts/ctb_remediator.py --dry-run

# 5. Apply fixes
python ctb/sys/github-factory/scripts/ctb_remediator.py

# 6. Re-audit to confirm improvement
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# Or run complete cycle:
python ctb/sys/github-factory/scripts/run_compliance_simple.py ctb/
```

**Success Criteria**:
- ✅ All three reports generate successfully
- ✅ Compliance score calculated (should be ≥ 70)
- ✅ GitHub Actions workflow runs without errors
- ✅ PR comments appear with compliance results
- ✅ Composio scenario configured and testable

---

## 🎯 EXPECTED RESULTS

**Compliance Reports**:
- `CTB_TAGGING_REPORT.md`: Shows files tagged, distribution by branch
- `CTB_AUDIT_REPORT.md`: Shows compliance score, structure checks, issues
- `CTB_REMEDIATION_SUMMARY.md`: Shows actions performed, fixes applied

**Enforcement Active**:
- Pre-commit hooks (if installed): Block commits < 70
- GitHub Actions: Block PRs < 70, comment with score
- Composio: Weekly automated compliance checks
- Self-healing: Remediator fixes drift automatically

**Zero Manual Work**:
- ✅ No manual Barton ID management
- ✅ No manual file classification
- ✅ No manual compliance checks
- ✅ Automatic drift detection and correction

---

## ⏭️ NEXT STEPS

After completing this prompt:
1. Proceed to **PROMPT 4**: Documentation & Navigation Files
2. Add ENTRYPOINT.md, branch READMEs, and catalog files
3. Create complete traceability system

---

**Prompt Stage**: 3 of 5
**Estimated Time**: 2-3 hours (with provided scripts)
**Prerequisites**: PROMPT 1 (structure), PROMPT 2 (tagger/auditor/remediator)
**Next**: PROMPT 4 (documentation)
