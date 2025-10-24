# CTB/META - Configuration & Metadata

**Purpose**: Configuration files, IDE settings, dependency management, CTB registry, and compliance tracking

---

## 📁 Directory Structure

```
ctb/meta/
├── ctb_registry.json         # CTB structure registry
├── ctb_tags.json             # File classification tags (auto-generated)
├── global-config.yaml        # Global repository configuration
├── .editorconfig             # IDE/editor settings
├── .prettierrc               # Code formatting rules
├── tsconfig.json             # TypeScript configuration
├── dependencies/             # Dependency management
│   ├── DEPENDENCIES.md       # Inter-branch dependencies map
│   ├── package.json          # Node.js dependencies
│   └── requirements.txt      # Python dependencies
├── ide/                      # IDE-specific configurations
│   ├── vscode/              # VS Code settings
│   │   ├── settings.json    # Workspace settings
│   │   ├── extensions.json  # Recommended extensions
│   │   └── launch.json      # Debug configurations
│   └── cursor/              # Cursor IDE settings
├── compliance/              # Compliance tracking
│   ├── compliance_history.json  # Historical scores
│   └── maintenance_log.json     # Maintenance activities
└── templates/               # Configuration templates
    ├── .env.template        # Environment variable template
    └── config.template.yaml # Configuration template
```

---

## 🎯 Quick Start

### View Current Configuration
```bash
# View CTB registry
cat ctb/meta/ctb_registry.json

# View global config
cat global-config.yaml

# Check file tags
cat ctb/meta/ctb_tags.json
```

### Update Configuration
```bash
# Edit global config
nano global-config.yaml

# Validate config
python ctb/sys/github-factory/scripts/validate_config.py
```

---

## 📋 Key Configuration Files

### 1. CTB Registry

**File**: `ctb_registry.json`

**Purpose**: Central registry of CTB structure, branches, and integrations

**Structure**:
```json
{
  "ctb_structure": {
    "version": "1.0.0",
    "branches": {
      "sys": {
        "description": "System infrastructure and integrations",
        "path": "ctb/sys/",
        "maintainer": "Infrastructure Team"
      },
      "ai": {
        "description": "AI models, agents, and orchestration",
        "path": "ctb/ai/",
        "maintainer": "AI/ML Team"
      },
      "data": {
        "description": "Database schemas and data pipelines",
        "path": "ctb/data/",
        "maintainer": "Data Engineering Team"
      },
      "docs": {
        "description": "Documentation and guides",
        "path": "ctb/docs/",
        "maintainer": "Documentation Team"
      },
      "ui": {
        "description": "User interfaces and frontend",
        "path": "ctb/ui/",
        "maintainer": "Frontend Team"
      },
      "meta": {
        "description": "Configuration and metadata",
        "path": "ctb/meta/",
        "maintainer": "DevOps Team"
      }
    }
  },
  "integrations": {
    "composio": {
      "enabled": true,
      "mcp_port": 3001
    },
    "neon": {
      "enabled": true,
      "connection_pooling": true
    },
    "firebase": {
      "enabled": true,
      "emulator": false
    }
  },
  "enforcement": {
    "min_compliance_score": 90,
    "auto_remediate": true,
    "ci_enforcement": true
  },
  "heir_orbt": {
    "enabled": true,
    "heir_format": "HEIR-YYYY-MM-SYSTEM-MODE-VN",
    "process_format": "PRC-SYSTEM-EPOCHTIMESTAMP",
    "orbt_layers": [1, 2, 3, 4]
  },
  "maintenance": {
    "last_audit": "2025-10-23",
    "last_remediation": "2025-10-23",
    "next_scheduled_audit": "2025-10-30"
  }
}
```

**Usage**:
```python
import json

# Load registry
with open('ctb/meta/ctb_registry.json', 'r') as f:
    registry = json.load(f)

# Get branch info
sys_branch = registry['ctb_structure']['branches']['sys']
print(f"Sys branch: {sys_branch['description']}")

# Check integrations
if registry['integrations']['composio']['enabled']:
    print("Composio integration is enabled")
```

---

### 2. Global Configuration

**File**: `global-config.yaml` (at repo root)

**Purpose**: Repository-wide configuration

**Structure**:
```yaml
project:
  name: imo-creator
  version: 1.0.0
  description: IMO (Indexed Marketing Operation) Creator

doctrine_enforcement:
  ctb_factory: ctb/sys/github-factory/
  auto_sync: true
  min_score: 90
  composio_scenario: CTB_Compliance_Cycle
  auto_remediate: true

database:
  primary: neon
  workbench: firebase
  analytics: bigquery

integrations:
  composio:
    enabled: true
    port: 3001
  neon:
    enabled: true
    ssl: true
  firebase:
    enabled: true

ci_cd:
  platform: github_actions
  enforcement: true
  weekly_audit: true
  pr_checks: true

maintenance:
  schedule:
    compliance_audit: weekly
    dependency_update: monthly
    security_scan: weekly
```

**Usage**:
```python
import yaml

# Load config
with open('global-config.yaml', 'r') as f:
    config = yaml.safe_load(f)

# Get settings
min_score = config['doctrine_enforcement']['min_score']
print(f"Minimum compliance score: {min_score}")
```

---

### 3. File Classification Tags

**File**: `ctb_tags.json` (auto-generated)

**Purpose**: Mapping of files to CTB branches

**Generated by**: `ctb_metadata_tagger.py`

**Structure**:
```json
{
  "tagged_files": [
    {
      "file_path": "src/api/composio_tools.py",
      "ctb_branch": "sys",
      "heir_id": "HEIR-2025-10-SYS-API-01",
      "confidence": "high",
      "suggested_location": "ctb/sys/api/composio_tools.py",
      "timestamp": "2025-10-23T12:00:00Z"
    },
    {
      "file_path": "src/models/gemini_client.py",
      "ctb_branch": "ai",
      "heir_id": "HEIR-2025-10-AI-MODEL-01",
      "confidence": "high",
      "suggested_location": "ctb/ai/models/gemini/client.py",
      "timestamp": "2025-10-23T12:00:00Z"
    }
  ],
  "statistics": {
    "total_files": 250,
    "tagged_files": 235,
    "untagged_files": 15,
    "by_branch": {
      "sys": 85,
      "ai": 42,
      "data": 38,
      "docs": 45,
      "ui": 25
    }
  },
  "last_updated": "2025-10-23T12:00:00Z"
}
```

**Usage**:
```python
# Load tags
with open('ctb/meta/ctb_tags.json', 'r') as f:
    tags = json.load(f)

# Find files by branch
sys_files = [f for f in tags['tagged_files'] if f['ctb_branch'] == 'sys']
print(f"Found {len(sys_files)} sys branch files")

# Get statistics
stats = tags['statistics']
print(f"Total files: {stats['total_files']}")
print(f"Tagged: {stats['tagged_files']}")
```

---

## 🔗 Inter-Branch Dependencies

### Dependency Map

**Visual Overview**:
```
meta (this branch)
  ↑ All branches depend on meta for configuration

sys
  ↑ ai (uses API integrations)
  ↑ data (uses database client)
  ↑ ui (uses API endpoints)

data
  ↑ sys (provides database client)
  ↑ ai (provides training datasets)
  ↑ ui (provides data schemas)

ai
  ↑ sys (provides API integrations)
  ↑ data (provides training data)
  ↑ ui (provides prompts and models)

docs
  ↑ All branches (documentation)

ui
  ↑ sys (uses API)
  ↑ data (uses schemas)
  ↑ ai (uses models)
```

### Dependency Rules

1. **meta → All**: All branches read config from meta
2. **sys → data, ai, ui**: System layer provides infrastructure
3. **data → ai, ui**: Data layer provides schemas and storage
4. **ai → ui**: AI layer provides intelligence to UI
5. **docs → None**: Documentation has no runtime dependencies

**See**: `ctb/meta/DEPENDENCIES.md` for detailed dependency documentation

---

## 🛠️ IDE Configuration

### VS Code Settings

**File**: `ctb/meta/ide/vscode/settings.json`

**Recommended Settings**:
```json
{
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.eol": "\n",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.formatting.provider": "black",
  "typescript.preferences.quoteStyle": "single",
  "files.exclude": {
    "**/__pycache__": true,
    "**/*.pyc": true,
    "**/node_modules": true,
    "**/.env": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/venv": true,
    "**/.venv": true
  }
}
```

### Recommended Extensions

**File**: `ctb/meta/ide/vscode/extensions.json`

```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.vscode-pylance",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "redhat.vscode-yaml",
    "bierner.markdown-mermaid",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### EditorConfig

**File**: `ctb/meta/.editorconfig`

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,ts,jsx,tsx,json,yaml,yml}]
indent_style = space
indent_size = 2

[*.{py}]
indent_style = space
indent_size = 4

[*.md]
trim_trailing_whitespace = false
```

---

## 📊 Compliance Tracking

### Compliance History

**File**: `ctb/meta/compliance/compliance_history.json`

**Purpose**: Track compliance scores over time

**Structure**:
```json
{
  "history": [
    {
      "date": "2025-10-23",
      "score": 92,
      "status": "EXCELLENT",
      "issues": 3,
      "remediated": 3,
      "audit_report": "logs/CTB_AUDIT_REPORT_2025-10-23.md"
    },
    {
      "date": "2025-10-16",
      "score": 85,
      "status": "GOOD",
      "issues": 8,
      "remediated": 6,
      "audit_report": "logs/CTB_AUDIT_REPORT_2025-10-16.md"
    }
  ],
  "current_score": 92,
  "trend": "improving",
  "target_score": 95
}
```

### Maintenance Log

**File**: `ctb/meta/compliance/maintenance_log.json`

```json
{
  "activities": [
    {
      "date": "2025-10-23",
      "type": "compliance_audit",
      "performed_by": "GitHub Actions",
      "result": "passed",
      "details": "Score: 92/100"
    },
    {
      "date": "2025-10-23",
      "type": "dependency_update",
      "performed_by": "Dependabot",
      "result": "completed",
      "details": "Updated 5 packages"
    }
  ]
}
```

---

## 🔐 Environment Configuration

### Environment Template

**File**: `ctb/meta/templates/.env.template`

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
NEON_DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/main

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Composio
COMPOSIO_API_KEY=ak_your_api_key
COMPOSIO_USER_ID=usr_your_user_id

# AI Models
GOOGLE_API_KEY=AIzaSy...
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# API
API_KEY=your_api_key_for_internal_use
API_PORT=8000
MCP_PORT=3001

# Environment
NODE_ENV=development
PYTHON_ENV=development
LOG_LEVEL=info
```

### Environment Setup

```bash
# Copy template
cp ctb/meta/templates/.env.template .env

# Edit with your credentials
nano .env

# Never commit .env
echo ".env" >> .gitignore
```

---

## 📦 Dependency Management

### Python Dependencies

**File**: `ctb/meta/dependencies/requirements.txt`

```
# Core
fastapi>=0.104.0
uvicorn>=0.24.0
pydantic>=2.5.0

# Database
asyncpg>=0.29.0
psycopg2-binary>=2.9.9
firebase-admin>=6.2.0

# AI
google-generativeai>=0.3.0
openai>=1.3.0
anthropic>=0.7.0

# Utilities
python-dotenv>=1.0.0
pyyaml>=6.0.1
httpx>=0.25.0
```

**Install**:
```bash
pip install -r ctb/meta/dependencies/requirements.txt
```

### Node.js Dependencies

**File**: `ctb/meta/dependencies/package.json`

```json
{
  "dependencies": {
    "composio-core": "^1.0.0",
    "@composio/mcp-server": "^1.0.0",
    "firebase": "^10.7.0",
    "firebase-admin": "^12.0.0",
    "pg": "^8.11.3"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0",
    "prettier": "^3.1.0",
    "eslint": "^8.55.0"
  }
}
```

**Install**:
```bash
npm install
```

---

## 🔄 Common Tasks

### 1. Update CTB Registry

```bash
# Edit registry
nano ctb/meta/ctb_registry.json

# Validate changes
python ctb/sys/github-factory/scripts/ctb_audit_generator.py
```

### 2. Update Global Configuration

```bash
# Edit config
nano global-config.yaml

# Restart services
docker-compose restart
```

### 3. Regenerate File Tags

```bash
# Run tagger
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py ctb/

# View results
cat ctb/meta/ctb_tags.json
```

### 4. Check Compliance History

```bash
# View history
cat ctb/meta/compliance/compliance_history.json | jq '.history'

# View current score
cat ctb/meta/compliance/compliance_history.json | jq '.current_score'
```

### 5. Update Dependencies

```bash
# Python
pip install --upgrade -r ctb/meta/dependencies/requirements.txt

# Node.js
npm update

# Log update
echo "{\"date\": \"$(date -I)\", \"type\": \"dependency_update\"}" >> ctb/meta/compliance/maintenance_log.json
```

---

## 🎯 Configuration Best Practices

### 1. Version Control
- ✅ Commit configuration templates
- ✅ Commit .env.example files
- ❌ NEVER commit .env files with secrets
- ❌ NEVER commit API keys

### 2. Configuration Updates
- ✅ Test changes locally first
- ✅ Update documentation when changing config
- ✅ Run compliance audit after changes
- ✅ Notify team of breaking changes

### 3. Dependency Management
- ✅ Pin major versions (e.g., `package>=1.0.0,<2.0.0`)
- ✅ Update dependencies monthly
- ✅ Test updates in staging first
- ✅ Document breaking changes

### 4. IDE Settings
- ✅ Use shared .editorconfig
- ✅ Enforce formatting on save
- ✅ Use recommended extensions
- ✅ Share debug configurations

---

## 🚨 Important Notes

### Configuration Changes
- **Always validate** after editing config files
- **Run compliance audit** to ensure no issues
- **Update documentation** if behavior changes
- **Notify team** of breaking changes

### Security
- **NEVER commit secrets** to git
- **Use environment variables** for credentials
- **Rotate API keys** regularly
- **Review access logs** monthly

### Maintenance
- **Weekly**: Run compliance audit
- **Monthly**: Update dependencies, review configs
- **Quarterly**: Security audit, review access controls
- **Annually**: Architecture review, tech debt cleanup

---

## 📚 Documentation

- **Dependency Map**: `DEPENDENCIES.md` (in this directory)
- **CTB Guide**: `ctb/docs/ctb/CTB_GUIDE.md`
- **Compliance Guide**: `ctb/sys/github-factory/COMPOSIO_CTB_INTEGRATION.md`
- **Environment Setup**: `.env.example` files in each branch

---

## 🆘 Troubleshooting

### Configuration Errors
```bash
# Validate YAML
python -c "import yaml; yaml.safe_load(open('global-config.yaml'))"

# Validate JSON
python -c "import json; json.load(open('ctb/meta/ctb_registry.json'))"

# Check for syntax errors
yamllint global-config.yaml
```

### Environment Issues
```bash
# Check environment variables
env | grep -E "DATABASE|COMPOSIO|FIREBASE"

# Test database connection
python -c "import os; print(os.getenv('DATABASE_URL'))"

# Verify .env file exists
ls -la .env
```

### Compliance Failures
```bash
# Run full audit
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# View issues
cat logs/CTB_AUDIT_REPORT.md

# Run remediator
python ctb/sys/github-factory/scripts/ctb_remediator.py
```

---

## 📞 Support

- **Configuration Issues**: Review this README
- **Dependency Issues**: See `DEPENDENCIES.md`
- **Compliance Issues**: Run `ctb_audit_generator.py`
- **General Help**: See `ENTRYPOINT.md` at repo root

---

**Branch**: meta
**Maintainer**: DevOps Team
**Last Updated**: 2025-10-23

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| View CTB registry | `cat ctb/meta/ctb_registry.json` |
| View global config | `cat global-config.yaml` |
| View file tags | `cat ctb/meta/ctb_tags.json` |
| Update tags | `python ctb_metadata_tagger.py ctb/` |
| Check compliance | `python ctb_audit_generator.py` |
| View compliance history | `cat ctb/meta/compliance/compliance_history.json` |
| Install Python deps | `pip install -r ctb/meta/dependencies/requirements.txt` |
| Install Node deps | `npm install` |
| Validate YAML | `yamllint global-config.yaml` |
| Validate JSON | `jq . ctb/meta/ctb_registry.json` |
