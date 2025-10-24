# PROMPT 6: CTB Verification Checklist Template

**Purpose**: Systematic verification template for CTB doctrine compliance audit

**Stage**: After completing all CTB implementation steps (PROMPT 1-5)

---

## 🎯 OBJECTIVE

Provide a comprehensive, reusable verification checklist to audit CTB compliance in any repository. This template ensures consistent, thorough evaluation across all implementations.

---

## 📋 VERIFICATION CHECKLIST

### Repository Information

**Repository Name**: `[REPOSITORY_NAME]`
**Audit Date**: `[YYYY-MM-DD HH:MM UTC]`
**Auditor**: `[AUDITOR_NAME]`
**CTB Version**: `[VERSION]`

**Audit Type**:
- [ ] Initial certification
- [ ] Re-certification
- [ ] Post-fix verification
- [ ] Routine compliance check

---

## 1️⃣ CTB Structure (10 points)

**Purpose**: Verify directory structure meets CTB standards

### Required Checks

| Item | Status | Points | Notes |
|------|--------|--------|-------|
| Root contains only specified files | ☐ | 3 | Check for minimal root directory |
| All six CTB branches exist | ☐ | 4 | sys/, ai/, data/, docs/, ui/, meta/ |
| CTB_INDEX.md correctly maps paths | ☐ | 3 | Migration tracking present |

### Directory Structure Verification

```
Expected Structure:
Repository Root
├── README.md                     ☐ Present
├── LICENSE                       ☐ Present
├── CONTRIBUTING.md               ☐ Present
├── ENTRYPOINT.md                 ☐ Present
├── CTB_ENFORCEMENT.md            ☐ Present
├── CTB_INDEX.md                  ☐ Present
├── QUICKREF.md                   ☐ Present
├── global-config.yaml            ☐ Present
├── .gitignore                    ☐ Present
├── ctb/                          ☐ Present
└── logs/                         ☐ Present

CTB Branches:
ctb/
├── sys/      ☐ System infrastructure
├── ai/       ☐ AI models and agents
├── data/     ☐ Database schemas
├── docs/     ☐ Documentation
├── ui/       ☐ User interface
└── meta/     ☐ Configuration metadata
```

### Additional Checks

**Root Directory Cleanliness**:
- [ ] No legacy files (*-before-doctrine.*)
- [ ] No orphaned configuration files
- [ ] No temporary files or directories
- [ ] Non-CTB files documented with justification

**Verification Commands**:
```bash
# Check CTB branches exist
ls ctb/

# Expected output: sys ai data docs ui meta
```

**Section Score**: `____/10`

**Issues Found**:
```
[List any issues discovered]
```

---

## 2️⃣ Doctrine Files & Prompts (10 points)

**Purpose**: Verify complete doctrine documentation system

### Required Checks

| Item | Status | Points | Notes |
|------|--------|--------|-------|
| Five doctrine prompts (PROMPT_1–5) exist | ☐ | 5 | All present in doctrine/ |
| Prompt 5 includes enforcement summary | ☐ | 2 | Complete enforcement guide |
| PROMPT_6_CHECKLIST.md added | ☐ | 2 | This template file |
| README.md in doctrine folder | ☐ | 1 | Doctrine overview |

### Doctrine Files Verification

```
Expected Doctrine Files:
ctb/sys/global-factory/doctrine/
├── README.md                             ☐ Doctrine overview
├── PROMPT_1_REORGANIZER.md               ☐ Structure reorganization
├── PROMPT_2_TAGGER_AUDITOR_REMEDIATOR.md ☐ Core scripts
├── PROMPT_3_GITHUB_FACTORY_CI.md         ☐ CI/CD integration
├── PROMPT_4_DOCUMENTATION_NAVIGATION.md  ☐ Documentation system
├── PROMPT_5_ENFORCEMENT_VERIFICATION.md  ☐ Enforcement & audit
└── PROMPT_6_CHECKLIST.md                 ☐ This checklist
```

### Content Verification

**PROMPT_1 includes**:
- [ ] CTB structure definition
- [ ] Directory reorganization rules
- [ ] File classification guidelines

**PROMPT_2 includes**:
- [ ] Metadata tagger documentation
- [ ] Audit generator documentation
- [ ] Remediator documentation

**PROMPT_3 includes**:
- [ ] GitHub Actions workflow
- [ ] Composio integration
- [ ] CI/CD setup instructions

**PROMPT_4 includes**:
- [ ] ENTRYPOINT.md specifications
- [ ] Branch README specifications
- [ ] API/Schema catalog specifications

**PROMPT_5 includes**:
- [ ] CTB_ENFORCEMENT.md specifications
- [ ] Threshold table
- [ ] Four-layer enforcement explanation
- [ ] Troubleshooting guide
- [ ] This verification checklist

**Verification Commands**:
```bash
# List all prompts
ls ctb/sys/global-factory/doctrine/PROMPT_*.md

# Expected: 6 files (PROMPT_1 through PROMPT_6)
```

**Section Score**: `____/10`

**Issues Found**:
```
[List any issues discovered]
```

---

## 3️⃣ Scripts & Workflows (12 points)

**Purpose**: Verify automation scripts and CI/CD workflows

### Required Checks

| Item | Status | Points | Notes |
|------|--------|--------|-------|
| ctb_metadata_tagger.py present and functional | ☐ | 3 | File classification |
| ctb_audit_generator.py present and functional | ☐ | 3 | Compliance auditing |
| ctb_remediator.py present and functional | ☐ | 2 | Auto-remediation |
| run_compliance_simple.py wrapper present | ☐ | 1 | Complete cycle runner |
| ctb_enforcement.yml workflow exists | ☐ | 2 | GitHub Actions CI/CD |
| Additional workflows (optional) | ☐ | 1 | Drift check, health, sync |

### Scripts Verification

```
Expected Scripts:
ctb/sys/github-factory/scripts/
├── ctb_metadata_tagger.py        ☐ Present ☐ No syntax errors
├── ctb_audit_generator.py        ☐ Present ☐ No syntax errors
├── ctb_remediator.py             ☐ Present ☐ No syntax errors
└── run_compliance_simple.py      ☐ Present ☐ No syntax errors
```

### Workflows Verification

```
Expected Workflows:
.github/workflows/
├── ctb_enforcement.yml           ☐ Present ☐ Valid YAML
├── ctb_drift_check.yml           ☐ Optional
├── ctb_health.yml                ☐ Optional
└── doctrine_sync.yml             ☐ Optional
```

### Functional Testing

**Test ctb_metadata_tagger.py**:
```bash
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py ctb/ --dry-run

Expected:
- ☐ No syntax errors
- ☐ Generates classification suggestions
- ☐ Outputs to logs/CTB_TAGGING_REPORT.md
```

**Test ctb_audit_generator.py**:
```bash
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

Expected:
- ☐ No syntax errors
- ☐ Calculates compliance score
- ☐ Outputs to logs/ctb_audit_report.json
- ☐ Outputs to logs/CTB_AUDIT_REPORT.md
```

**Test ctb_remediator.py**:
```bash
python ctb/sys/github-factory/scripts/ctb_remediator.py --dry-run

Expected:
- ☐ No syntax errors
- ☐ Identifies fixable issues
- ☐ Suggests remediation actions
```

**Test complete cycle**:
```bash
python ctb/sys/github-factory/scripts/run_compliance_simple.py ctb/

Expected:
- ☐ Runs all three scripts sequentially
- ☐ Generates all three reports
- ☐ No errors
```

**Verification Commands**:
```bash
# Check scripts exist
ls ctb/sys/github-factory/scripts/ctb_*.py

# Check workflows exist
ls .github/workflows/ctb_*.yml

# Syntax check scripts
python -m py_compile ctb/sys/github-factory/scripts/ctb_audit_generator.py
python -m py_compile ctb/sys/github-factory/scripts/ctb_metadata_tagger.py
python -m py_compile ctb/sys/github-factory/scripts/ctb_remediator.py
```

**Section Score**: `____/12`

**Issues Found**:
```
[List any issues discovered]
```

---

## 4️⃣ Documentation & Navigation (20 points)

**Purpose**: Verify complete documentation ecosystem

### Required Checks

| Item | Status | Points | Notes |
|------|--------|--------|-------|
| ENTRYPOINT.md is comprehensive start guide | ☐ | 5 | Navigation hub |
| QUICKREF.md exists | ☐ | 2 | Quick reference commands |
| CTB_ENFORCEMENT.md complete | ☐ | 5 | Full enforcement guide |
| Five branch READMEs exist | ☐ | 4 | sys, ai, data, docs, meta |
| API_CATALOG.md exists | ☐ | 2 | Complete API reference |
| SCHEMA_REFERENCE.md exists | ☐ | 2 | Complete schema catalog |

### Core Documentation Verification

```
Expected Root Documentation:
Repository Root
├── ENTRYPOINT.md              ☐ Present (≥10 KB recommended)
├── CTB_ENFORCEMENT.md         ☐ Present (≥20 KB recommended)
├── QUICKREF.md                ☐ Present (1-2 KB)
└── README.md                  ☐ Present (≥5 KB)
```

### Branch READMEs Verification

```
Expected Branch READMEs:
ctb/
├── sys/README.md      ☐ Present (≥10 KB) - Infrastructure guide
├── ai/README.md       ☐ Present (≥10 KB) - AI systems guide
├── data/README.md     ☐ Present (≥10 KB) - Data layer guide
├── docs/README.md     ☐ Present (≥10 KB) - Documentation hub
└── meta/README.md     ☐ Present (≥10 KB) - Configuration guide
```

### Catalog Documentation Verification

```
Expected Catalogs:
ctb/sys/api/API_CATALOG.md       ☐ Present (≥20 KB recommended)
ctb/data/SCHEMA_REFERENCE.md     ☐ Present (≥20 KB recommended)
```

### Content Quality Checks

**ENTRYPOINT.md includes**:
- [ ] Project overview
- [ ] Quick start (3-5 steps)
- [ ] CTB structure visualization
- [ ] Navigation by role
- [ ] Common tasks
- [ ] Finding information guide

**CTB_ENFORCEMENT.md includes**:
- [ ] Introduction and goals
- [ ] Compliance threshold table
- [ ] Four-layer enforcement explanation
- [ ] Platform-specific setup (Windows/Mac/Linux)
- [ ] Troubleshooting guide (8+ scenarios)
- [ ] FAQ (10+ questions)

**QUICKREF.md includes**:
- [ ] Common commands
- [ ] Key file locations
- [ ] Quick troubleshooting
- [ ] Threshold reference

**Branch READMEs include**:
- [ ] Quick start commands
- [ ] Architecture overview
- [ ] Key components documentation
- [ ] Usage examples
- [ ] Troubleshooting

**API_CATALOG.md includes**:
- [ ] Base configuration
- [ ] All endpoints documented
- [ ] Request/response schemas
- [ ] Authentication requirements
- [ ] Error codes
- [ ] Example requests

**SCHEMA_REFERENCE.md includes**:
- [ ] STAMPED fields legend
- [ ] All tables documented
- [ ] Barton IDs
- [ ] Enforcement levels
- [ ] Linked processes and endpoints

### Additional Documentation

**Architecture Diagrams**:
```
ctb/docs/architecture/
├── architecture.mmd           ☐ Present - System architecture
├── data_flow.mmd              ☐ Optional - Data flow diagram
└── composio_integration.mmd   ☐ Optional - Integration diagram
```

**Dependency Mapping**:
```
ctb/meta/DEPENDENCIES.md       ☐ Present - Dependency documentation
```

**Environment Configuration**:
```
.env.example                   ☐ Present - Root example
ctb/sys/api/.env.example       ☐ Present - API config
ctb/data/.env.example          ☐ Present - Data config
```

**Test Infrastructure**:
```
ctb/sys/tests/                 ☐ Present - Test suite
ctb/data/tests/                ☐ Present - Test suite
```

**Verification Commands**:
```bash
# Check core docs
ls ENTRYPOINT.md CTB_ENFORCEMENT.md QUICKREF.md

# Check branch READMEs
ls ctb/*/README.md

# Check catalogs
ls ctb/sys/api/API_CATALOG.md
ls ctb/data/SCHEMA_REFERENCE.md

# Check architecture diagrams
ls ctb/docs/architecture/*.mmd
```

**Section Score**: `____/20`

**Issues Found**:
```
[List any issues discovered]
```

---

## 5️⃣ Enforcement Configuration (10 points)

**Purpose**: Verify enforcement system is properly configured

### Required Checks

| Item | Status | Points | Notes |
|------|--------|--------|-------|
| global-config.yaml properly configured | ☐ | 3 | Complete configuration |
| doctrine_enforcement section present | ☐ | 2 | Enforcement rules |
| Composio scenario configured | ☐ | 2 | CTB_Compliance_Cycle |
| Enforcement threshold consistent | ☐ | 2 | Same in config and docs |
| Pre-commit hooks documented/installed | ☐ | 1 | Local enforcement |

### global-config.yaml Verification

```yaml
Expected Configuration Sections:
ctb:                           ☐ CTB structure definition
doctrine_enforcement:          ☐ Enforcement rules
  ctb_factory:                 ☐ Path to factory
  auto_sync:                   ☐ Auto-sync enabled
  min_score:                   ☐ Threshold (70 or 90)
  composio_scenario:           ☐ CTB_Compliance_Cycle
  auto_remediate:              ☐ Auto-fix enabled
logging:                       ☐ Logging configuration
integrations:                  ☐ Composio, Firebase, Neon, GitHub
heir_orbt:                     ☐ Tracking configuration
database:                      ☐ Database settings
ai:                            ☐ AI providers
ui:                            ☐ UI framework
documentation:                 ☐ Documentation settings
maintenance:                   ☐ Maintenance rules
security:                      ☐ Security settings
performance:                   ☐ Performance settings
```

### Threshold Consistency Check

**Check 1 - global-config.yaml**:
```bash
# Extract threshold
grep "min_score" global-config.yaml

Expected: min_score: [70 or 90]
Actual: _______
```

**Check 2 - CTB_ENFORCEMENT.md**:
```bash
# Search for current threshold
grep -A 2 "Current threshold" CTB_ENFORCEMENT.md

Expected: **70/100** or **90/100**
Actual: _______
```

**Consistency**:
- [ ] Thresholds match
- [ ] If different, documented reason exists

### Composio Scenario Verification

**Required elements**:
- [ ] Scenario name: `CTB_Compliance_Cycle`
- [ ] Schedule: Weekly (e.g., `0 2 * * 0`)
- [ ] Tasks: ctb_tagger, ctb_auditor, ctb_remediator
- [ ] Notifications configured
- [ ] Conditions for auto-remediation

### Pre-commit Hook Verification

**Hook file check**:
```bash
# Check if pre-commit hook exists
ls .git/hooks/pre-commit

Status: ☐ Present ☐ Executable ☐ Not installed
```

**Hook content check**:
- [ ] Runs ctb_audit_generator.py
- [ ] Checks compliance score
- [ ] Blocks commit if score < threshold
- [ ] Provides helpful error message

**Verification Commands**:
```bash
# Validate YAML syntax
cat global-config.yaml | python -c "import yaml; yaml.safe_load(open('global-config.yaml'))"

# Check pre-commit hook
cat .git/hooks/pre-commit
```

**Section Score**: `____/10`

**Issues Found**:
```
[List any issues discovered]
```

---

## 6️⃣ Compliance Verification (14 points)

**Purpose**: Verify compliance system is operational

### Required Checks

| Item | Status | Points | Notes |
|------|--------|--------|-------|
| CTB_TAGGING_REPORT.md generated | ☐ | 2 | Tagging report exists |
| CTB_AUDIT_REPORT.md generated | ☐ | 4 | Audit report exists |
| CTB_REMEDIATION_SUMMARY.md generated | ☐ | 2 | Remediation report exists |
| CTB_ENFORCEMENT.md exists with scoring | ☐ | 2 | Enforcement guide with table |
| Current audit score ≥ threshold | ☐ | 2 | Meets minimum requirement |
| Auto-tagging verified | ☐ | 1 | Tagger functional |
| Weekly Composio audit scheduled | ☐ | 1 | Automated compliance |

### Reports Verification

```
Expected Reports:
logs/
├── CTB_TAGGING_REPORT.md         ☐ Generated ☐ Non-empty
├── CTB_AUDIT_REPORT.md           ☐ Generated ☐ Non-empty
├── CTB_REMEDIATION_SUMMARY.md    ☐ Generated ☐ Non-empty
├── ctb_audit_report.json         ☐ Generated ☐ Valid JSON
└── ctb_compliance_results.json   ☐ Generated ☐ Valid JSON
```

### Compliance Score Verification

**Run full compliance cycle**:
```bash
python ctb/sys/github-factory/scripts/run_compliance_simple.py ctb/

Expected:
- ☐ All three scripts execute without errors
- ☐ All three reports generate
- ☐ Compliance score calculated
```

**Check compliance score**:
```bash
# Extract score from JSON
python -c "import json; print(json.load(open('logs/ctb_audit_report.json'))['compliance_score'])"

Actual Score: ________/100
Threshold:    ________/100
Status:       ☐ PASS ☐ FAIL
```

### Scoring Threshold Verification

**Threshold Table Check**:
```markdown
Expected in CTB_ENFORCEMENT.md:

| Score Range | Grade | Status | Merge Policy |
|-------------|-------|--------|--------------|
| 90-100 | EXCELLENT 🌟 | PASS | Allowed |
| 70-89 | GOOD/FAIR ✅ | PASS | Allowed |
| 60-69 | NEEDS WORK ⚠️ | BLOCKED | Requires fixes |
| 0-59 | FAIL ❌ | BLOCKED | Requires fixes |

Status: ☐ Present ☐ Accurate
```

### Four-Layer Enforcement Verification

**Layer 1 - Pre-commit Hooks**:
- [ ] Documented in CTB_ENFORCEMENT.md
- [ ] Installation instructions provided
- [ ] Script example included
- [ ] ☐ Installed locally (if accessible)

**Layer 2 - GitHub Actions**:
- [ ] ctb_enforcement.yml workflow exists
- [ ] Triggers on push/PR/schedule
- [ ] Runs compliance check
- [ ] Blocks merge if non-compliant
- [ ] Comments on PRs with score

**Layer 3 - Composio Weekly Runs**:
- [ ] CTB_Compliance_Cycle scenario configured
- [ ] Weekly schedule defined
- [ ] Notifications configured
- [ ] ☐ Verified running (requires time observation)

**Layer 4 - CTB Remediator**:
- [ ] ctb_remediator.py exists and functional
- [ ] Auto-fix capabilities documented
- [ ] Dry-run mode supported
- [ ] Auto-triggered when score < threshold

### Auto-Tagging Test

**Create test file and verify tagging**:
```bash
# Create test file
echo "test" > test_classify_me.py

# Run tagger
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py .

# Check if test file was classified
grep "test_classify_me.py" ctb/meta/ctb_tags.json

Result: ☐ File classified ☐ Suggested branch assigned ☐ HEIR ID generated
```

**Cleanup**:
```bash
# Remove test file
rm test_classify_me.py
```

**Verification Commands**:
```bash
# Check reports exist
ls logs/CTB_*.md

# View compliance score
cat logs/CTB_AUDIT_REPORT.md | grep "Compliance Score"

# Validate JSON reports
cat logs/ctb_audit_report.json | python -m json.tool
```

**Section Score**: `____/14`

**Issues Found**:
```
[List any issues discovered]
```

---

## 7️⃣ Quality & Consistency (8 points)

**Purpose**: Verify code quality and consistency standards

### Required Checks

| Item | Status | Points | Notes |
|------|--------|--------|-------|
| File naming: kebab-case/snake_case | ☐ | 2 | Consistent conventions |
| No *-before-doctrine.* files | ☐ | 2 | No legacy files |
| .env.example files exist | ☐ | 2 | Configuration templates |
| Architecture diagram renders | ☐ | 2 | Valid Mermaid syntax |

### File Naming Conventions

**Python files (snake_case)**:
```bash
# Check Python file naming
find . -name "*.py" -not -path "*/node_modules/*" -not -path "*/.git/*"

Spot check results:
☐ All Python files use snake_case
☐ Some inconsistencies found: [list files]
```

**JavaScript/TypeScript files (kebab-case)**:
```bash
# Check JS/TS file naming
find . -name "*.js" -o -name "*.ts" -not -path "*/node_modules/*" -not -path "*/.git/*"

Spot check results:
☐ All JS/TS files use kebab-case
☐ Some inconsistencies found: [list files]
```

**Markdown files (UPPERCASE or kebab-case)**:
```bash
# Check markdown file naming
find . -name "*.md" -not -path "*/node_modules/*" -not -path "*/.git/*"

Spot check results:
☐ Root files use UPPERCASE (ENTRYPOINT.md, CTB_ENFORCEMENT.md, etc.)
☐ Other files use kebab-case or are standard (README.md)
☐ Inconsistencies found: [list files]
```

### Legacy Files Check

**Search for legacy files**:
```bash
# Search for *-before-doctrine* files
find . -name "*-before-doctrine*"

Result: ☐ None found ✅ ☐ Files found ❌ [list files]
```

### Environment Configuration Templates

**Check .env.example files**:
```
Expected:
.env.example (root)              ☐ Present ☐ Comprehensive
ctb/sys/api/.env.example         ☐ Present ☐ Comprehensive
ctb/data/.env.example            ☐ Present ☐ Comprehensive
```

**Content verification**:
- [ ] All required environment variables documented
- [ ] Clear comments explaining each variable
- [ ] Security warnings for sensitive values
- [ ] Platform-specific notes (if applicable)

### Architecture Diagram Validation

**Check Mermaid diagrams**:
```bash
# List all .mmd files
find ctb/docs/architecture -name "*.mmd"

Expected:
ctb/docs/architecture/architecture.mmd           ☐ Present
ctb/docs/architecture/data_flow.mmd              ☐ Optional
ctb/docs/architecture/composio_integration.mmd   ☐ Optional
```

**Syntax validation**:
```bash
# Test Mermaid syntax (if mermaid-cli installed)
mmdc -i ctb/docs/architecture/architecture.mmd -o /tmp/test.svg

Result: ☐ Valid ☐ Syntax errors found
```

**Manual verification**:
- [ ] Open diagram in Mermaid Live Editor
- [ ] Verify it renders without errors
- [ ] Check for clear labeling
- [ ] Verify proper styling

### Additional Quality Checks

**Code organization**:
- [ ] Clear separation of concerns
- [ ] Logical directory structure
- [ ] No circular dependencies

**Documentation quality**:
- [ ] No broken internal links
- [ ] Code examples are correct
- [ ] Formatting is consistent
- [ ] Grammar and spelling are correct

**Verification Commands**:
```bash
# Find all Python files
find . -name "*.py" -type f | wc -l

# Find all markdown files
find . -name "*.md" -type f | wc -l

# Check for legacy files
find . -name "*-before-doctrine*"

# List environment examples
find . -name ".env.example"
```

**Section Score**: `____/8`

**Issues Found**:
```
[List any issues discovered]
```

---

## 8️⃣ Bonus Points (up to 16 points)

**Purpose**: Reward exceptional implementation

### Bonus Categories

| Category | Max Points | Awarded | Notes |
|----------|-----------|---------|-------|
| Documentation excellence | 5 | ____ | Exceptional quality/depth |
| Advanced enforcement features | 3 | ____ | Custom rules, dashboards |
| Complete test coverage | 3 | ____ | Comprehensive testing |
| Outstanding traceability | 3 | ____ | Perfect API→DB linkage |
| Innovation | 2 | ____ | Novel approaches |

### Documentation Excellence (up to 5 points)

**Award points for**:
- [ ] +1: Documentation exceeds 100 KB total
- [ ] +1: Includes diagrams and visualizations
- [ ] +1: Provides video tutorials or GIFs
- [ ] +1: Has interactive examples
- [ ] +1: Exceptional clarity and completeness

### Advanced Enforcement Features (up to 3 points)

**Award points for**:
- [ ] +1: Custom compliance rules beyond base system
- [ ] +1: Compliance dashboard or monitoring
- [ ] +1: Automated trend analysis and reporting

### Complete Test Coverage (up to 3 points)

**Award points for**:
- [ ] +1: Test suites for all CTB scripts
- [ ] +1: Integration tests for enforcement system
- [ ] +1: Automated testing in CI/CD

### Outstanding Traceability (up to 3 points)

**Award points for**:
- [ ] +1: Complete API→Handler→Schema→DB linkage
- [ ] +1: HEIR/ORBT IDs on all resources
- [ ] +1: Automated traceability verification

### Innovation (up to 2 points)

**Award points for**:
- [ ] +1: Novel approaches to compliance
- [ ] +1: Contributions back to CTB doctrine

**Section Score**: `____/16`

**Bonus Notes**:
```
[Describe exceptional features]
```

---

## 📊 FINAL SCORING

### Score Summary

| Section | Possible | Achieved | Percentage |
|---------|----------|----------|------------|
| 1. CTB Structure | 10 | ____ | ____% |
| 2. Doctrine Files & Prompts | 10 | ____ | ____% |
| 3. Scripts & Workflows | 12 | ____ | ____% |
| 4. Documentation & Navigation | 20 | ____ | ____% |
| 5. Enforcement Configuration | 10 | ____ | ____% |
| 6. Compliance Verification | 14 | ____ | ____% |
| 7. Quality & Consistency | 8 | ____ | ____% |
| 8. Bonus Points | 16 | ____ | ____% |
| **TOTAL** | **100** | **____** | **____%** |

### Compliance Determination

**Actual Score**: `____/100`

**Current Threshold**: `____/100` (from global-config.yaml)

**Result**:
- ☐ **90-100**: EXCELLENT 🌟 - Full certification granted
- ☐ **70-89**: GOOD/FAIR ✅ - Conditional certification, minor improvements recommended
- ☐ **60-69**: NEEDS WORK ⚠️ - Significant improvements required before certification
- ☐ **0-59**: FAIL ❌ - Major issues must be resolved, recertification required

**Pass/Fail**: ☐ **PASS** ☐ **FAIL**

---

## 🏆 CERTIFICATION STATEMENT

**Auditor**: `[AUDITOR_NAME]`
**Audit Date**: `[YYYY-MM-DD HH:MM UTC]`
**Audit Duration**: `[DURATION]`
**Audit Method**: `[Automated/Manual/Hybrid]`

### Certification

This is to certify that the **[REPOSITORY_NAME]** repository has undergone a comprehensive CTB (Christmas Tree Backbone) compliance audit.

**Result**: ☐ **CERTIFIED** ☐ **CONDITIONALLY CERTIFIED** ☐ **NOT CERTIFIED**

**Compliance Score**: `____/100`

**Grade**: `[A/B/C/D/F]`

**Certification Level**:
- ☐ **FULL CERTIFICATION**: Score ≥ 90, all requirements met
- ☐ **CONDITIONAL CERTIFICATION**: Score 70-89, minor improvements needed
- ☐ **PROVISIONAL CERTIFICATION**: Score 60-69, pending improvements
- ☐ **NOT CERTIFIED**: Score < 60, major issues present

**Valid Until**: `[DATE]` (3 months from audit date)

**Signature**: `_________________________`

---

## 📋 FINDINGS SUMMARY

### Strengths

**What Works Well**:
```
1. [List key strengths]
2.
3.
```

### Critical Issues

**Must Fix Before Certification**:
```
1. [List critical issues]
2.
3.
```

### Important Issues

**Should Fix This Week**:
```
1. [List important issues]
2.
3.
```

### Minor Issues

**Nice to Have Fixes**:
```
1. [List minor issues]
2.
3.
```

---

## ✅ ACTION ITEMS

### Immediate (Today)

- [ ] [Action 1]
- [ ] [Action 2]
- [ ] [Action 3]

### This Week

- [ ] [Action 1]
- [ ] [Action 2]
- [ ] [Action 3]

### This Month

- [ ] [Action 1]
- [ ] [Action 2]
- [ ] [Action 3]

---

## 🔄 RE-CERTIFICATION

**Next Audit Date**: `[YYYY-MM-DD]`

**Recommended Schedule**:
- **Weekly**: During Phase 1 (establishing baseline)
- **Monthly**: Once score stabilizes above 85
- **Quarterly**: When score consistently above 90

**Continuous Monitoring**:
- Pre-commit hooks: Every commit
- GitHub Actions: Every PR
- Composio: Weekly automated runs

---

## 📞 AUDITOR NOTES

**Methodology**:
```
[Describe audit approach]
```

**Limitations**:
```
[Note any limitations or items that could not be verified]
```

**Confidence Level**: `[High/Medium/Low]` (`____%`)

**Reasoning**:
```
[Explain confidence assessment]
```

---

## 📊 VISUAL SUMMARY

```
CTB Compliance Score: ____/100

████████████████████████████░░░░░░░░░░░░  ____%

┌─────────────────────────────────────────┐
│ COMPLIANCE STATUS: [STATUS]              │
│ Grade: [GRADE]                           │
│ Threshold: ____/100                      │
│ Status: [PASS/FAIL]                      │
└─────────────────────────────────────────┘

Section Breakdown:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Structure        [BARS]   ____%
2. Doctrine         [BARS]   ____%
3. Scripts          [BARS]   ____%
4. Documentation    [BARS]   ____%
5. Configuration    [BARS]   ____%
6. Verification     [BARS]   ____%
7. Quality          [BARS]   ____%
8. Bonus Points     [BARS]   ____%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📝 ADDITIONAL COMMENTS

```
[Add any additional observations, recommendations, or context]
```

---

**End of CTB Verification Checklist**

**Template Version**: 1.0
**Last Updated**: 2025-10-23
**Next Template Review**: [DATE]

---

## 🎯 USAGE INSTRUCTIONS

### How to Use This Template

1. **Copy this template** to the repository being audited
2. **Fill in repository information** at the top
3. **Work through each section** systematically
4. **Check each box** as items are verified
5. **Record scores** for each section
6. **Calculate total score** at the end
7. **Complete certification statement**
8. **Save as** `CTB_VERIFICATION_CHECKLIST.md` in repository root

### Tips for Effective Auditing

- **Be systematic**: Don't skip sections
- **Be thorough**: Check every item
- **Be objective**: Score based on evidence, not assumptions
- **Be constructive**: Note issues with suggested fixes
- **Be consistent**: Use same standards across all audits

### When to Re-Audit

- After fixing critical issues
- After major repository changes
- On a scheduled basis (weekly/monthly/quarterly)
- Before production deployments
- After doctrine updates

---

## 📚 REFERENCES

**CTB Doctrine Prompts**:
- PROMPT_1: Structure reorganization
- PROMPT_2: Core scripts
- PROMPT_3: CI/CD integration
- PROMPT_4: Documentation system
- PROMPT_5: Enforcement & verification
- PROMPT_6: This checklist template

**Key Documents**:
- ENTRYPOINT.md: Navigation hub
- CTB_ENFORCEMENT.md: Enforcement guide
- global-config.yaml: Configuration
- API_CATALOG.md: API reference
- SCHEMA_REFERENCE.md: Schema reference

**Verification Commands Reference**:
```bash
# Run full compliance cycle
python ctb/sys/github-factory/scripts/run_compliance_simple.py ctb/

# Check score
python -c "import json; print(json.load(open('logs/ctb_audit_report.json'))['compliance_score'])"

# Generate reports
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py ctb/
python ctb/sys/github-factory/scripts/ctb_audit_generator.py
python ctb/sys/github-factory/scripts/ctb_remediator.py --dry-run
```

---

**Template maintained by**: CTB Standards Team
**Questions or improvements**: Submit via GitHub issue with `ctb-doctrine` label
