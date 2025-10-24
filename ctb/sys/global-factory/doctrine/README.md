# CTB Global Factory - Doctrine Documentation

## 📚 Overview

The **Christmas Tree Backbone (CTB) Global Factory** is a standardization system for organizing code repositories into a consistent, maintainable structure.

## 🌲 What is CTB?

CTB is a repository organization standard that divides all code, documentation, and resources into six main branches:

- **sys** - System integrations, infrastructure, services
- **ai** - AI models, prompts, blueprints, training
- **data** - Database schemas, migrations, data models
- **docs** - Documentation, guides, manuals
- **ui** - User interface components, pages, templates
- **meta** - CTB metadata, registry, configuration

## 🎯 Purpose

The CTB Global Factory provides:

1. **Automated Organization** - Scripts to reorganize repositories into CTB structure
2. **Compliance Auditing** - Tools to measure and enforce CTB compliance
3. **Auto-Remediation** - Automated fixing of compliance issues
4. **Documentation** - Comprehensive guides and prompts for manual and AI-assisted reorganization

## 📁 Factory Contents

### Scripts (`scripts/`)

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `ctb_metadata_tagger.py` | Tag files with CTB metadata | First step - classify all files |
| `ctb_audit_generator.py` | Generate compliance audit | Check CTB compliance score |
| `ctb_remediator.py` | Auto-fix compliance issues | Remediate after audit |
| `ctb_reorganizer.py` | Full reorganization (optional) | Major restructuring |

### Doctrine (`doctrine/`)

| Document | Purpose | Audience |
|----------|---------|----------|
| `PROMPT_1_REORGANIZER.md` | Manual reorganization guide | Developers |
| `PROMPT_2_TAGGER_AUDITOR_REMEDIATOR.md` | Automation workflow guide | DevOps |
| `PROMPT_3_CLARITY_PACK.md` | CTB concepts and standards | All teams |
| `PROMPT_4_API_SCHEMA.md` | API organization in CTB | Backend devs |
| `PROMPT_5_AUTOMATION.md` | CI/CD integration | DevOps |
| `README.md` | This file | Everyone |

## 🚀 Quick Start

### For New Repositories

```bash
# 1. Install CTB factory
curl -O https://raw.githubusercontent.com/YOUR_ORG/ctb-factory/main/setup_ctb.sh
chmod +x setup_ctb.sh
./setup_ctb.sh

# 2. Tag files
python ctb/sys/global-factory/scripts/ctb_metadata_tagger.py

# 3. Audit compliance
python ctb/sys/global-factory/scripts/ctb_audit_generator.py

# 4. Fix issues
python ctb/sys/global-factory/scripts/ctb_remediator.py
```

### For Existing Repositories

```bash
# 1. Tag all existing files
python ctb/sys/global-factory/scripts/ctb_metadata_tagger.py

# 2. Run compliance audit
python ctb/sys/global-factory/scripts/ctb_audit_generator.py

# 3. Review audit report
cat logs/ctb_audit_report.json

# 4. Auto-remediate (dry-run first)
python ctb/sys/global-factory/scripts/ctb_remediator.py --dry-run
python ctb/sys/global-factory/scripts/ctb_remediator.py

# 5. Verify improvements
python ctb/sys/global-factory/scripts/ctb_audit_generator.py
```

## 📊 Compliance Levels

| Score | Status | Description |
|-------|--------|-------------|
| 90-100 | ✅ Excellent | Full CTB compliance |
| 70-89 | ⚠️ Good | Minor improvements needed |
| 50-69 | ⚠️ Needs Work | Significant issues to address |
| <50 | ❌ Non-Compliant | Major restructuring required |

## 🎯 CTB Structure Template

```
repository/
├── ctb/
│   ├── sys/                    # System integrations
│   │   ├── composio-mcp/       # Composio MCP server
│   │   ├── firebase/           # Firebase integration
│   │   ├── neon/               # Neon database
│   │   ├── github-factory/     # GitHub automation
│   │   ├── gatekeeper/         # Access control
│   │   └── validator/          # Validation services
│   ├── ai/                     # AI systems
│   │   ├── models/             # AI models
│   │   ├── prompts/            # Prompt templates
│   │   ├── blueprints/         # AI blueprints
│   │   └── training/           # Training data
│   ├── data/                   # Data layer
│   │   ├── firebase/           # Firebase schemas
│   │   ├── neon/               # Neon schemas
│   │   ├── bigquery/           # BigQuery schemas
│   │   └── zod/                # Zod validators
│   ├── docs/                   # Documentation
│   │   ├── ctb/                # CTB documentation
│   │   ├── doctrine/           # Doctrine documents
│   │   ├── ort/                # ORT manuals
│   │   └── sops/               # Standard procedures
│   ├── ui/                     # User interfaces
│   │   ├── components/         # UI components
│   │   ├── pages/              # Pages
│   │   └── templates/          # Templates
│   └── meta/                   # Metadata
│       ├── ctb_registry.json   # CTB registry
│       └── ctb_tags.json       # File tags
├── logs/                       # Logs
│   ├── ctb_audit_report.json   # Audit reports
│   └── ctb_remediation_log.json # Remediation logs
└── global-config.yaml          # Global config
```

## 💡 Best Practices

### 1. Start with Tagging
Always run the tagger first to understand current file distribution:
```bash
python ctb/sys/global-factory/scripts/ctb_metadata_tagger.py
```

### 2. Audit Regularly
Run monthly audits to catch structural drift:
```bash
python ctb/sys/global-factory/scripts/ctb_audit_generator.py
```

### 3. Use Dry-Run Mode
Preview changes before applying:
```bash
python ctb/sys/global-factory/scripts/ctb_remediator.py --dry-run
```

### 4. Track Compliance Score
Maintain a score of 90+ for production repositories.

### 5. Document Migrations
Create `CTB_INDEX.md` to document file movements.

## 🔄 Maintenance Workflow

### Weekly
- Run tagger for new files
- Review any new files in wrong locations

### Monthly
- Full compliance audit
- Address recommendations
- Update documentation

### Quarterly
- Review CTB structure effectiveness
- Update factory scripts if needed
- Train team on CTB standards

## 🆘 Troubleshooting

### Low Compliance Score
1. Review audit report: `logs/ctb_audit_report.json`
2. Identify main issues (structure, distribution, metadata)
3. Run remediator: `ctb_remediator.py`
4. Re-audit to verify: `ctb_audit_generator.py`

### Files Not Moving
1. Check permissions
2. Verify tags file exists: `ctb/meta/ctb_tags.json`
3. Review remediation log: `logs/ctb_remediation_log.json`
4. Move manually if needed

### Missing Directories
1. Run remediator to create structure
2. Verify creation in audit report
3. Check permissions if creation fails

## 📖 Further Reading

- **PROMPT_1_REORGANIZER.md** - Manual reorganization guide
- **PROMPT_2_TAGGER_AUDITOR_REMEDIATOR.md** - Automation workflow
- **PROMPT_3_CLARITY_PACK.md** - CTB concepts (if available)
- **PROMPT_4_API_SCHEMA.md** - API organization (if available)
- **PROMPT_5_AUTOMATION.md** - CI/CD integration (if available)

## 🤝 Contributing

To improve the CTB Global Factory:

1. Test scripts on various repository types
2. Report issues and edge cases
3. Suggest improvements to classification logic
4. Update doctrine documentation
5. Share best practices

## 📜 License

CTB Global Factory is part of the Barton Doctrine compliance system.

---

**Version**: 1.0.0
**Last Updated**: 2025-10-23
**Maintained By**: CTB Standards Team

---

## 🎯 Summary

The CTB Global Factory provides automated tools and comprehensive documentation to help teams organize repositories into a standardized, maintainable structure. Use the scripts for automation and the doctrine documents for guidance.

**Key Principle**: *Structure enables scalability, consistency enables collaboration.*
