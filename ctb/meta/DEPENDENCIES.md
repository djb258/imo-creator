# CTB Dependencies Map

**Purpose**: Document all dependencies (inter-branch, external services, packages) and their relationships

**Last Updated**: 2025-10-23

---

## 📊 Dependency Overview

### Dependency Categories

1. **Inter-Branch Dependencies**: How CTB branches depend on each other
2. **External Service Dependencies**: Third-party services and APIs
3. **Package Dependencies**: Python and Node.js packages
4. **Build Dependencies**: Tools required for building and deployment

---

## 🌲 Inter-Branch Dependencies

### Dependency Graph

```mermaid
graph TD
    meta[meta: Configuration]
    sys[sys: Infrastructure]
    data[data: Data Layer]
    ai[ai: AI Models]
    ui[ui: User Interface]
    docs[docs: Documentation]

    %% All branches depend on meta
    meta -->|config| sys
    meta -->|config| data
    meta -->|config| ai
    meta -->|config| ui
    meta -->|config| docs

    %% sys provides infrastructure
    sys -->|API endpoints| ui
    sys -->|database client| data
    sys -->|integrations| ai

    %% data provides schemas
    data -->|schemas| ui
    data -->|training data| ai
    data -->|migrations| sys

    %% ai provides intelligence
    ai -->|models| ui
    ai -->|agents| sys

    %% docs documents everything
    docs -.->|documents| sys
    docs -.->|documents| data
    docs -.->|documents| ai
    docs -.->|documents| ui
    docs -.->|documents| meta
```

### Detailed Dependencies

#### meta → All Branches
**Type**: Configuration Provider
**Direction**: meta provides to all

**What meta provides**:
- `ctb_registry.json` - CTB structure definition
- `global-config.yaml` - Global settings
- `.editorconfig` - Editor configuration
- IDE settings (VS Code, Cursor)
- Environment templates

**Used by**:
- sys: Reads Composio, database, API config
- data: Reads database connection settings
- ai: Reads AI model configurations
- ui: Reads UI settings, API endpoints
- docs: Reads documentation standards

**Files**:
- `ctb/meta/ctb_registry.json`
- `global-config.yaml` (repo root)
- `ctb/meta/.editorconfig`

---

#### sys → data, ai, ui
**Type**: Infrastructure Provider
**Direction**: sys provides to data, ai, ui

**What sys provides**:
- `database/client.py` - Database client
- `utils/heir_orbt.py` - HEIR/ORBT utilities
- `api/*` - REST API endpoints
- `composio-mcp/` - External integrations

**Used by**:
- **data**: Uses database client for queries/migrations
- **ai**: Uses API endpoints to trigger AI workflows
- **ui**: Consumes REST API endpoints

**Examples**:
```python
# data uses sys database client
from ctb.sys.database.client import get_db_client
db = get_db_client()

# ai uses sys HEIR/ORBT utilities
from ctb.sys.utils.heir_orbt import generate_heir_id
heir_id = generate_heir_id("AI", "MODEL")
```

**Files**:
- `ctb/sys/database/client.py`
- `ctb/sys/utils/heir_orbt.py`
- `ctb/sys/api/`

---

#### data → sys, ai, ui
**Type**: Data Provider
**Direction**: data provides to sys, ai, ui

**What data provides**:
- Database schemas (Neon, Firebase)
- Zod validation schemas
- Migration files
- ETL pipelines
- Training datasets (for ai)

**Used by**:
- **sys**: Executes migrations, runs queries
- **ai**: Reads training datasets
- **ui**: Validates forms using Zod schemas

**Examples**:
```typescript
// ui uses data validation schemas
import { UserSchema } from 'ctb/data/zod/api/user';
const user = UserSchema.parse(formData);
```

```python
# ai uses data training datasets
import json
with open('ctb/data/training/datasets/imo_examples/valid/example1.json') as f:
    training_data = json.load(f)
```

**Files**:
- `ctb/data/neon/schemas/`
- `ctb/data/zod/`
- `ctb/data/migrations/`
- `ctb/ai/training/datasets/`

---

#### ai → sys, ui
**Type**: Intelligence Provider
**Direction**: ai provides to sys, ui

**What ai provides**:
- AI model clients (Gemini, OpenAI, Claude)
- Prompt templates
- Agent configurations
- Trained models
- Inference endpoints

**Used by**:
- **sys**: Routes requests to AI agents via API
- **ui**: Displays AI-generated content

**Examples**:
```python
# sys uses ai models
from ctb.ai.models.gemini import GeminiClient
client = GeminiClient()
response = await client.generate(prompt)
```

```typescript
// ui triggers AI workflows
const response = await fetch('/api/ai/generate-imo', {
  method: 'POST',
  body: JSON.stringify({ requirements })
});
```

**Files**:
- `ctb/ai/models/`
- `ctb/ai/prompts/`
- `ctb/ai/agents/`

---

#### ui → sys, data
**Type**: Presentation Layer
**Direction**: ui consumes from sys, data

**What ui depends on**:
- sys: REST API endpoints
- data: Validation schemas

**Examples**:
```typescript
// ui uses sys API
import { apiClient } from 'ctb/ui/utils/api';
const data = await apiClient.get('/api/imo/list');

// ui uses data schemas
import { IMOSchema } from 'ctb/data/zod/models/imo';
IMOSchema.parse(data);
```

**Files**:
- `ctb/ui/utils/api.ts`
- `ctb/ui/components/`

---

#### docs → All Branches
**Type**: Documentation (No Runtime Dependencies)
**Direction**: docs documents all, but has no runtime dependencies

**What docs provides**:
- API documentation
- Architecture diagrams
- User guides
- Integration guides

**Used by**: Developers (not runtime)

**Files**:
- `ctb/docs/api/`
- `ctb/docs/architecture/`
- `ctb/docs/guides/`

---

## 🌐 External Service Dependencies

### Required Services

#### 1. Neon PostgreSQL
**Type**: Primary Database
**Used by**: sys, data
**Purpose**: Persistent relational data storage

**Configuration**:
```bash
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/main
```

**Dependencies**:
- `asyncpg>=0.29.0` (Python)
- `pg>=8.11.3` (Node.js)

**Status Check**:
```bash
psql "$DATABASE_URL" -c "SELECT version();"
```

**Documentation**: https://neon.tech/docs

---

#### 2. Composio MCP
**Type**: Integration Hub
**Used by**: sys
**Purpose**: 100+ service integrations (Gmail, GitHub, Apify, etc.)

**Configuration**:
```bash
COMPOSIO_API_KEY=ak_your_api_key
COMPOSIO_USER_ID=usr_your_user_id
```

**Dependencies**:
- `composio-core>=1.0.0` (Node.js)
- `@composio/mcp-server>=1.0.0` (Node.js)

**Status Check**:
```bash
curl http://localhost:3001/health
```

**Documentation**: https://docs.composio.dev

---

#### 3. Firebase/Firestore
**Type**: Real-time Database (Workbench)
**Used by**: sys, data, ui
**Purpose**: Real-time data, sessions, temporary storage

**Configuration**:
```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
```

**Dependencies**:
- `firebase-admin>=6.2.0` (Python)
- `firebase>=10.7.0` (Node.js)

**Status Check**:
```python
import firebase_admin
firebase_admin.initialize_app()
```

**Documentation**: https://firebase.google.com/docs

---

#### 4. Google Gemini API
**Type**: AI Model API
**Used by**: ai
**Purpose**: AI-powered content generation

**Configuration**:
```bash
GOOGLE_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-2.5-flash
```

**Dependencies**:
- `google-generativeai>=0.3.0` (Python)

**Status Check**:
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent" \
  -H "x-goog-api-key: $GOOGLE_API_KEY"
```

**Documentation**: https://ai.google.dev/docs

---

#### 5. OpenAI API (Optional)
**Type**: AI Model API
**Used by**: ai
**Purpose**: Alternative AI model

**Configuration**:
```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo
```

**Dependencies**:
- `openai>=1.3.0` (Python)

**Status Check**:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**Documentation**: https://platform.openai.com/docs

---

#### 6. BigQuery (Optional)
**Type**: Analytics Warehouse
**Used by**: data
**Purpose**: Data warehouse, analytics

**Configuration**:
```bash
BIGQUERY_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

**Dependencies**:
- `google-cloud-bigquery>=3.11.0` (Python)

**Documentation**: https://cloud.google.com/bigquery/docs

---

## 📦 Package Dependencies

### Python Dependencies

**File**: `requirements.txt` (repo root)

#### Core Framework
```
fastapi>=0.104.0          # REST API framework
uvicorn>=0.24.0           # ASGI server
pydantic>=2.5.0           # Data validation
```

#### Database
```
asyncpg>=0.29.0           # PostgreSQL async driver
psycopg2-binary>=2.9.9    # PostgreSQL driver
firebase-admin>=6.2.0     # Firebase Admin SDK
google-cloud-bigquery>=3.11.0  # BigQuery client (optional)
```

#### AI Models
```
google-generativeai>=0.3.0  # Google Gemini
openai>=1.3.0               # OpenAI (optional)
anthropic>=0.7.0            # Anthropic Claude (optional)
```

#### Utilities
```
python-dotenv>=1.0.0      # Environment variables
pyyaml>=6.0.1             # YAML parsing
httpx>=0.25.0             # HTTP client
pytest>=7.4.0             # Testing framework
```

**Install**:
```bash
pip install -r requirements.txt
```

---

### Node.js Dependencies

**File**: `package.json` (repo root)

#### Core
```json
{
  "dependencies": {
    "composio-core": "^1.0.0",
    "@composio/mcp-server": "^1.0.0",
    "pg": "^8.11.3",
    "firebase": "^10.7.0",
    "firebase-admin": "^12.0.0"
  }
}
```

#### Frontend (if applicable)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zod": "^3.22.0"
  }
}
```

#### Dev Tools
```json
{
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

## 🔄 Dependency Update Procedures

### Monthly Dependency Updates

**Schedule**: First Monday of each month

**Procedure**:
```bash
# 1. Update Python dependencies
pip list --outdated
pip install --upgrade -r requirements.txt

# 2. Update Node.js dependencies
npm outdated
npm update

# 3. Test everything
pytest
npm test

# 4. Run compliance check
python ctb/sys/github-factory/scripts/ctb_audit_generator.py

# 5. Commit if all pass
git add requirements.txt package.json package-lock.json
git commit -m "Update dependencies - $(date -I)"

# 6. Log update
echo '{"date": "'$(date -I)'", "type": "dependency_update", "result": "success"}' \
  >> ctb/meta/compliance/maintenance_log.json
```

---

### Security Updates

**Immediate Action Required For**:
- Critical security vulnerabilities
- Database driver updates with security fixes
- Authentication/authorization library updates

**Procedure**:
```bash
# 1. Check for security issues
pip-audit  # Python
npm audit  # Node.js

# 2. Update vulnerable packages
pip install --upgrade <package>
npm install <package>@latest

# 3. Test immediately
pytest
npm test

# 4. Deploy ASAP if tests pass
```

---

## 📋 Dependency Rules

### Version Pinning Strategy

#### Production Dependencies
- **Major version locked**: `package>=1.0.0,<2.0.0`
- Allows minor and patch updates
- Prevents breaking changes

#### Development Dependencies
- **Flexible**: `package>=1.0.0`
- Allows all updates
- Test before deploying to production

**Example**:
```
# Production
fastapi>=0.104.0,<1.0.0

# Development
pytest>=7.4.0
```

---

### Adding New Dependencies

**Before Adding**:
1. ✅ Check if existing dependency can be used
2. ✅ Verify package is actively maintained
3. ✅ Check security vulnerabilities
4. ✅ Verify license compatibility

**Procedure**:
```bash
# 1. Install package
pip install <package>

# 2. Add to requirements.txt
echo "<package>>=<version>" >> requirements.txt

# 3. Document usage
# Add to this DEPENDENCIES.md file

# 4. Test
pytest

# 5. Update dependency graph
# Update diagrams in this file

# 6. Commit
git add requirements.txt DEPENDENCIES.md
git commit -m "Add <package> dependency for <purpose>"
```

---

### Removing Dependencies

**Before Removing**:
1. ✅ Search codebase for usage: `grep -r "import package"`
2. ✅ Check indirect dependencies
3. ✅ Update documentation

**Procedure**:
```bash
# 1. Remove from code
# Remove all import statements

# 2. Remove from requirements.txt
# Delete line from file

# 3. Uninstall
pip uninstall <package>

# 4. Test
pytest

# 5. Update this file
# Remove from dependency graph

# 6. Commit
git commit -m "Remove <package> dependency (no longer needed)"
```

---

## 🚨 Dependency Conflicts

### Common Conflicts

#### Python Version Conflicts
**Issue**: Package A requires Python 3.9+, Package B requires Python 3.8

**Solution**:
```bash
# Check current Python version
python --version

# Use virtual environment with specific version
pyenv install 3.9.0
pyenv local 3.9.0
python -m venv venv
source venv/bin/activate
```

#### Package Version Conflicts
**Issue**: Package A requires lib==1.0, Package B requires lib==2.0

**Solution**:
1. Check if both packages have newer versions that align
2. Pin to compatible versions
3. Consider alternatives to one package

---

### Resolving Conflicts

**Tools**:
```bash
# Python
pip install pip-tools
pip-compile requirements.in

# Node.js
npm ls
npm dedupe
```

**Strategy**:
1. Identify conflicting packages: `pip check`
2. Check compatibility: Review package changelogs
3. Update to compatible versions
4. Test thoroughly
5. Document resolution in this file

---

## 📊 Dependency Health Dashboard

### Metrics to Track

| Metric | Target | Check |
|--------|--------|-------|
| **Python packages outdated** | < 5 | `pip list --outdated` |
| **Node packages outdated** | < 5 | `npm outdated` |
| **Security vulnerabilities** | 0 | `pip-audit`, `npm audit` |
| **Dependency freshness** | < 90 days old | Manual review |
| **License compliance** | 100% | `pip-licenses` |

### Monthly Review Checklist

```markdown
- [ ] Check outdated packages
- [ ] Run security audits
- [ ] Review dependency graph for redundancies
- [ ] Update this DEPENDENCIES.md if changes made
- [ ] Test all updates in staging
- [ ] Deploy to production if tests pass
- [ ] Log update in maintenance_log.json
```

---

## 🔗 External Resources

### Package Repositories
- **Python**: https://pypi.org
- **Node.js**: https://npmjs.com

### Security Advisories
- **Python**: https://pyup.io
- **Node.js**: https://npmjs.com/advisories

### Version Checking
- **Python**: `pip list --outdated`
- **Node.js**: `npm outdated`

### License Checking
- **Python**: `pip-licenses`
- **Node.js**: `license-checker`

---

## 🆘 Troubleshooting

### Dependency Installation Fails

```bash
# Clear cache
pip cache purge
npm cache clean --force

# Reinstall
pip install -r requirements.txt --no-cache-dir
npm ci

# Check logs
cat ~/.pip/pip.log
npm install --verbose
```

### Import Errors

```python
# Check if package is installed
pip show <package>

# Check import path
python -c "import <package>; print(<package>.__file__)"

# Reinstall
pip uninstall <package>
pip install <package>
```

### Version Conflicts

```bash
# Check dependency tree
pip show <package>
npm ls <package>

# Force reinstall with specific version
pip install <package>==<version> --force-reinstall
npm install <package>@<version> --force
```

---

## 📞 Support

- **Dependency Issues**: Review this file
- **Package Updates**: See update procedures above
- **Security Issues**: Follow security update procedure
- **General Help**: See `ENTRYPOINT.md` at repo root

---

**Maintainer**: DevOps Team
**Last Reviewed**: 2025-10-23
**Next Review**: 2025-11-23
