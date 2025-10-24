# PROMPT 2: CTB Tagger, Auditor & Remediator

## 🎯 Objective
Tag files with CTB metadata, audit compliance, and automatically fix issues.

## 📋 Three-Step Process

### Step 1: Tag Files (CTB Metadata Tagger)

**Script**: `ctb_metadata_tagger.py`

**Purpose**: Automatically classify and tag all files with CTB metadata.

**Usage**:
```bash
python ctb/sys/global-factory/scripts/ctb_metadata_tagger.py
```

**What it does**:
1. Scans entire repository
2. Classifies each file into a CTB branch (sys, ai, data, docs, ui)
3. Generates HEIR tracking IDs
4. Suggests new location in CTB structure
5. Outputs `ctb/meta/ctb_tags.json`

**Output Example**:
```json
{
  "scanned_at": "2025-10-23T12:00:00Z",
  "files": [
    {
      "file_path": "src/api/composio.js",
      "ctb_branch": "sys",
      "file_type": ".js",
      "heir_id": "HEIR-2025-10-CTB-SYS-01",
      "suggested_location": "ctb/sys/api/composio.js"
    }
  ],
  "summary": {
    "total_files": 150,
    "by_branch": {
      "sys": 45,
      "ai": 12,
      "data": 23,
      "docs": 30,
      "ui": 40
    }
  }
}
```

---

### Step 2: Audit Compliance (CTB Audit Generator)

**Script**: `ctb_audit_generator.py`

**Purpose**: Generate compliance audit report and calculate CTB score.

**Usage**:
```bash
python ctb/sys/global-factory/scripts/ctb_audit_generator.py
```

**What it does**:
1. Checks CTB directory structure exists
2. Validates file distribution across branches
3. Checks metadata files (registry, tags)
4. Verifies global-factory installation
5. Calculates compliance score (0-100)
6. Generates issue list and recommendations
7. Outputs `logs/ctb_audit_report.json`

**Compliance Score Calculation**:
- **100**: Perfect CTB compliance
- **90-99**: Excellent (minor improvements needed)
- **70-89**: Good (some issues to fix)
- **50-69**: Needs improvement
- **<50**: Non-compliant (major restructuring needed)

**Penalties**:
- Missing required directory: -15 points
- More files outside CTB than inside: -10 points
- HIGH severity issue: -10 points each
- MEDIUM severity issue: -5 points each

**Output Example**:
```json
{
  "audit_timestamp": "2025-10-23T12:00:00Z",
  "compliance_score": 75,
  "issues": [
    {
      "severity": "HIGH",
      "category": "structure",
      "message": "Missing required path: ctb/meta",
      "recommendation": "Create directory: ctb/meta"
    }
  ],
  "recommendations": [
    {
      "priority": "MEDIUM",
      "category": "organization",
      "message": "Found 50 files outside CTB structure",
      "action": "Run ctb_reorganizer.py"
    }
  ]
}
```

---

### Step 3: Auto-Remediate (CTB Remediator)

**Script**: `ctb_remediator.py`

**Purpose**: Automatically fix CTB compliance issues.

**Usage**:
```bash
# Dry run (preview changes)
python ctb/sys/global-factory/scripts/ctb_remediator.py --dry-run

# Apply fixes
python ctb/sys/global-factory/scripts/ctb_remediator.py
```

**What it does**:
1. Loads latest audit report
2. Creates missing directories
3. Creates CTB registry if missing
4. Creates global-config.yaml if missing
5. (Optional) Moves files to suggested locations
6. Logs all actions to `logs/ctb_remediation_log.json`

**Remediation Actions**:
- ✅ Create `ctb/{sys,ai,data,docs,ui,meta}` directories
- ✅ Create `logs/` directory
- ✅ Create `ctb/meta/ctb_registry.json`
- ✅ Create `global-config.yaml`
- ⚠️ Move files (use with caution - requires manual review)

**Safety Features**:
- Dry-run mode for preview
- Logs all actions
- Limits file moves per run (50 max)
- Preserves original files until verified

---

## 🔄 Complete Workflow

### Initial Setup (First Time)
```bash
# 1. Tag all files
python ctb/sys/global-factory/scripts/ctb_metadata_tagger.py

# 2. Audit compliance
python ctb/sys/global-factory/scripts/ctb_audit_generator.py

# 3. Preview fixes
python ctb/sys/global-factory/scripts/ctb_remediator.py --dry-run

# 4. Apply fixes
python ctb/sys/global-factory/scripts/ctb_remediator.py

# 5. Re-audit to verify
python ctb/sys/global-factory/scripts/ctb_audit_generator.py
```

### Ongoing Maintenance
```bash
# Weekly: Re-tag new files
python ctb/sys/global-factory/scripts/ctb_metadata_tagger.py

# Monthly: Audit compliance
python ctb/sys/global-factory/scripts/ctb_audit_generator.py

# As needed: Fix issues
python ctb/sys/global-factory/scripts/ctb_remediator.py
```

---

## 📊 Compliance Targets

| Score Range | Status | Action Required |
|-------------|--------|-----------------|
| 90-100 | ✅ Excellent | Maintain current structure |
| 70-89 | ⚠️ Good | Address recommendations |
| 50-69 | ⚠️ Needs Work | Run remediator |
| <50 | ❌ Non-Compliant | Major restructuring needed |

---

## 🎯 Expected Outputs

After running all three scripts:

### Files Created:
- `ctb/meta/ctb_tags.json` - File classification and tags
- `ctb/meta/ctb_registry.json` - CTB structure registry
- `logs/ctb_audit_report.json` - Compliance audit report
- `logs/ctb_remediation_log.json` - Remediation action log
- `global-config.yaml` - Global configuration (if missing)

### Directory Structure:
```
repository/
├── ctb/
│   ├── sys/
│   ├── ai/
│   ├── data/
│   ├── docs/
│   ├── ui/
│   └── meta/
│       ├── ctb_registry.json
│       └── ctb_tags.json
├── logs/
│   ├── ctb_audit_report.json
│   └── ctb_remediation_log.json
└── global-config.yaml
```

---

## 💡 Pro Tips

1. **Always run tagger first** - It generates the metadata needed by auditor
2. **Use dry-run mode** - Preview changes before applying
3. **Review before moving files** - Manual verification prevents mistakes
4. **Check audit score** - Target 90+ for production repos
5. **Run regularly** - Monthly audits catch drift early

---

## 🆘 Troubleshooting

### "No audit report found"
→ Run `ctb_audit_generator.py` first

### "No tags file found"
→ Run `ctb_metadata_tagger.py` first

### Low compliance score (<50)
→ Review audit report issues
→ Run remediator with dry-run
→ Manually fix critical issues
→ Re-audit

### Files not moving
→ Check file permissions
→ Verify paths in tags file
→ Review remediation log

---

**Use these three scripts together to achieve and maintain CTB compliance.**
