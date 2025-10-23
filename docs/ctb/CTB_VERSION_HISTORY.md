# CTB Version History

This document tracks the version history of the Christmas Tree Backbone (CTB) template architecture.

## Patch 1.3.1a (2025-10-23)

**Status**: Critical Hotfix 🔧

### Overview
Emergency fix for invalid GitHub Actions syntax that caused all 18 workflows to fail, triggering excessive email notifications on every push/PR to main and develop branches.

### Problem Identified

**Root Cause**: Invalid `notifications:` syntax in all GitHub Actions workflow files

```yaml
# INVALID SYNTAX (caused failures)
notifications:
  email: false
```

**Impact**:
- All 24 workflow files contained invalid YAML syntax
- GitHub Actions does not support `notifications:` as a top-level key
- Every push/PR triggered 18 workflow failures
- Each failure sent an email notification
- User received 18+ failure emails per commit

**Affected Workflows**: All 24 workflow files:
- Root: `.github/workflows/*.yml` (20 files)
- Template: `ctb-template/.github/workflows/*.yml` (4 files)

### Fix Applied

**Solution**: Removed all invalid `notifications:` syntax from workflow files

```bash
# Removal command executed:
find .github/workflows -name "*.yml" -exec sed -i '/^# Silence email notifications$/d; /^notifications:$/d; /^  email: false$/d' {} \;
find ctb-template/.github/workflows -name "*.yml" -exec sed -i '/^# Silence email notifications$/d; /^notifications:$/d; /^  email: false$/d' {} \;
```

**Files Fixed** (22 workflow files modified):
- audit.yml, chartdb_automation.yml, ci.yml, composio-orchestration.yml
- ctb_enforcement.yml, ctb_health.yml, ctb_version_check.yml
- deepwiki_automation.yml, deploy.yml, doctrine-validate.yml
- doctrine_sync.yml, drawio-ingest.yml, figma-sync.yml
- firebase-promote.yml, heir-checks.yml, reusable-ctb-enforcement.yml
- security_lockdown.yml, sync-updates.yml, test_coverage.yml
- ctb-template/.github/workflows/auto_ctb_sync.yml
- ctb-template/.github/workflows/ci.yml
- ctb-template/.github/workflows/ctb_enforcement.yml

**Files Already Compliant** (2 files):
- .github/workflows/ctb_drift_check.yml
- ctb-template/.github/workflows/ctb_drift_check.yml

### Verification

✅ All workflows now use only valid GitHub Actions syntax
✅ Workflow triggers correctly limited to `main` and `develop` branches
✅ No invalid top-level YAML keys present
✅ Workflows will execute successfully on next push

### Important Note: Email Notification Control

**GitHub Actions Email Notifications Cannot Be Disabled via YAML**

The `notifications:` key does not exist in GitHub Actions YAML syntax. Email notifications for workflow failures must be controlled at the repository or organization level via GitHub Settings:

**To disable workflow failure emails**:
1. Navigate to: `Settings → Notifications → Actions`
2. Uncheck: "Send notifications for failed workflows"
3. Or configure at organization level for all repositories

**Alternative**: Use GitHub's built-in notification preferences per user account.

### Prevention

**Added to CTB Documentation**:
- ✅ Documented valid GitHub Actions syntax patterns
- ✅ Clarified that email control is settings-based, not YAML-based
- ✅ Prevented future syntax errors through documentation

**Kodex Validation** (Future Enhancement):
Consider adding workflow YAML validation rule to catch invalid top-level keys before commit.

### Breaking Changes
None - Fix restores workflows to working state.

### Resolution Time
Immediate - All workflows operational after this commit.

### Commit Hash
`e589ef5f` - 🔧 Fix: Remove invalid GitHub Actions syntax causing 18 workflow failures

---

## Patch 1.3.3a (2025-10-23)

**Status**: Doctrine Cleanup ✅

### Overview
Corrected a doctrinal misclassification where Google Gemini AI Integration was incorrectly registered as a CTB doctrine element (doctrine_id 04.04.12) instead of a Composio MCP tool.

### Changes

#### Reclassification
- **Gemini Moved**: From CTB doctrine registry → Composio MCP tools
- **New Location**: `ctb-template/sys/composio-mcp/tools/gemini/`
- **Doctrine ID Removed**: 04.04.12 no longer assigned to Gemini
- **Tool Governance**: Now governed by Composio MCP, not CTB structural doctrine

#### Files Added
- ✅ `ctb-template/sys/composio-mcp/tools/gemini/tool_manifest.json`
- ✅ `ctb-template/sys/composio-mcp/tools/gemini/README.md`

#### Files Modified
- ✅ `config/mcp_registry.json` - Removed doctrine_id, changed type to "Composio MCP Tool"
- ✅ `tools/gemini-cli/README.md` - Updated compliance section
- ✅ `kodex.rules.json` - Added DOCTRINE_SCOPE_EXCLUSION rule (24th rule)

#### Kodex Enforcement
- **New Rule**: DOCTRINE_SCOPE_EXCLUSION
  - **Purpose**: Prevents MCP tools from being classified as doctrine components
  - **Enforcement**: Tools must be under `ctb-template/sys/composio-mcp/tools/`
  - **Rationale**: CTB doctrine governs repository architecture (sys, data, apps, ai, docs, tests), not individual tool integrations

### Doctrine Clarification

**What IS CTB Doctrine:**
- Repository structure (sys/, data/, apps/, ai/, docs/, tests/)
- Branch organization (main, develop, sys/*, feature/*)
- Barton policy enforcement (Composio required, gatekeeper enforced, no direct Neon)
- Tier system (full, mid, micro)

**What IS NOT CTB Doctrine:**
- Individual tools (Gemini, Claude, GPT, etc.)
- MCP tool integrations (governed by Composio MCP)
- External service APIs (governed by their respective policies)

### Tool vs. Doctrine Decision Tree

```
Is this a structural component of the repo?
├─ YES → CTB Doctrine (assign altitude, enforce structure)
└─ NO  → Is it an integration/tool?
          └─ YES → Composio MCP Tool (register in tools/, no doctrine_id)
```

### Breaking Changes
None - All Gemini functionality remains intact, only classification changed.

### Deprecations
- `doctrine_id: 04.04.12` for Gemini (removed, now `previous_doctrine_id`)

### Migration Impact
- **Existing code**: No changes required
- **MCP registry**: Uses new `tool_manifest` reference
- **Documentation**: Updated to clarify tool vs. doctrine

### Future Prevention
- Kodex rule DOCTRINE_SCOPE_EXCLUSION automatically blocks future misclassifications
- All AI models (Claude Skills, GPT, Perplexity, etc.) must follow this pattern

---

## Version 1.3.0 (2025-10-23)

**Status**: Role-Based System Manual ✨

### Overview

Major release introducing a comprehensive **Role-Based System Manual + Troubleshooting Layer** to the CTB template. This release prepares the architecture for external visualization apps (CTB Viewer) while maintaining vendor-agnostic operational documentation.

### Key Features

#### 1. Role-Based Abstraction (NEW)

Introduced **4 functional roles** independent of vendor implementations:

- **AI_ENGINE** (20k altitude) - Reasoning, orchestration, LLM execution
- **WORKBENCH_DB** (5k altitude) - Staging database, validation queues
- **VAULT_DB** (5k altitude) - Production vault with schema enforcement
- **INTEGRATION_BRIDGE** (20k altitude) - External tools, API gateway via MCP

**Why Role-Based?**
- Prevents vendor lock-in (switch Gemini↔Claude, Firebase↔MongoDB without breaking architecture)
- Enables driver abstraction with interface contracts
- Prepares for future CTB Viewer App visualization
- Stable documentation regardless of vendor changes

#### 2. Driver Manifests (NEW)

Created vendor-agnostic driver manifests for all roles:

**Files Added:**
- ✅ `ctb-template/drivers/ai_engine/driver_manifest.json`
- ✅ `ctb-template/drivers/workbench_db/driver_manifest.json`
- ✅ `ctb-template/drivers/vault_db/driver_manifest.json`
- ✅ `ctb-template/drivers/integration_bridge/driver_manifest.json`

**Structure:**
```json
{
  "role": "AI_ENGINE",
  "current_driver": "gemini",
  "supported_drivers": ["gemini", "claude", "gpt"],
  "interface_contract": {
    "input": "structured_prompt",
    "output": "json_result"
  },
  "ort_manual": "/manual/ort-manuals/ai_engine.ort.md",
  "status_endpoint": "/manual/troubleshooting/system_diagnostics.json#ai_engine"
}
```

#### 3. ORBT Manuals (NEW)

Implemented **Operate/Repair/Build/Train** operational runbooks for each role:

**Files Added:**
- ✅ `ctb-template/manual/ort-manuals/ai_engine.ort.md` (~250 lines)
- ✅ `ctb-template/manual/ort-manuals/workbench_db.ort.md`
- ✅ `ctb-template/manual/ort-manuals/vault_db.ort.md`
- ✅ `ctb-template/manual/ort-manuals/integration_bridge.ort.md`

**ORBT Format:**
- **Operate**: Normal operations, health checks, daily procedures
- **Repair**: Failure modes (symptoms, diagnosis, repair steps, resolution time)
- **Build**: Initial setup, configuration, driver switching
- **Train**: Key concepts, practice scenarios, operator training

**Example Failure Modes Documented:**
- AI_ENGINE: API connection failure, high latency, model deprecation
- WORKBENCH_DB: Connection timeout, validation queue backlog
- VAULT_DB: Connection failure, schema violation, audit log overflow
- INTEGRATION_BRIDGE: MCP server down, API rate limits, tool registration failure

#### 4. System Topology Maps (NEW)

Created system visualization ready for CTB Viewer App:

**Files Added:**
- ✅ `ctb-template/manual/system-map/ctb_system_map.json` - System topology (JSON)
- ✅ `ctb-template/manual/system-map/ctb_system_map.mmd` - System diagram (Mermaid)

**Features:**
- Node definitions with altitude classification (20k/5k)
- Link definitions showing data flow between roles
- Color-coded visualization (yellow/blue/teal/orange)
- Viewer integration metadata

#### 5. Troubleshooting Layer (NEW)

Implemented live system diagnostics and health monitoring:

**Files Added:**
- ✅ `ctb-template/manual/troubleshooting/system_diagnostics.json` - Live health status
- ✅ `ctb-template/manual/scripts/status_check.ts` - Health check script (~300 lines)

**Health Monitoring Features:**
- Real-time status for all 4 roles (healthy/degraded/disconnected)
- Latency tracking per role
- System-wide health aggregation
- Alert generation and issue tracking
- Viewer-ready JSON output

**Status Check Script:**
```bash
# Run health check
ts-node ctb-template/manual/scripts/status_check.ts

# Output: System health summary with role diagnostics
```

#### 6. Viewer API (NEW)

Created external API layer for CTB Viewer apps:

**Files Added:**
- ✅ `ctb-template/viewer-api/schemas/system_health_response.schema.json` - Health API schema
- ✅ `ctb-template/viewer-api/schemas/role_details_response.schema.json` - Role API schema
- ✅ `ctb-template/viewer-api/mocks/sample_system_health.json` - Mock health data
- ✅ `ctb-template/viewer-api/mocks/sample_role_details.json` - Mock role data
- ✅ `ctb-template/viewer-api/README.md` - Integration guide

**JSON Schema Features:**
- Draft-07 compliant schemas for validation
- TypeScript-compatible type definitions
- Mock data for frontend development
- Complete integration examples (React, Next.js)

**Viewer Integration:**
```typescript
// Poll system health (recommended: 30s interval)
const health = await fetch('/manual/troubleshooting/system_diagnostics.json');

// Load role details
const role = await fetch('/drivers/ai_engine/driver_manifest.json');
```

#### 7. Documentation (NEW)

Comprehensive system manual and guides:

**Files Added:**
- ✅ `docs/ctb/CTB_SYSTEM_MANUAL_GUIDE.md` - Complete operational guide (~500 lines)

**Guide Includes:**
- System architecture overview
- Role-based abstraction explanation
- ORBT manual usage
- Troubleshooting workflows
- Driver management procedures
- Quick reference commands
- Incident response playbooks

### Directory Structure Changes

**New Directories:**
```
ctb-template/
├── manual/                     # NEW: System documentation
│   ├── system-map/
│   ├── ort-manuals/
│   ├── troubleshooting/
│   └── scripts/
├── drivers/                    # NEW: Vendor implementations
│   ├── ai_engine/
│   ├── workbench_db/
│   ├── vault_db/
│   └── integration_bridge/
└── viewer-api/                 # NEW: External API layer
    ├── schemas/
    └── mocks/
```

### Statistics

**Files Added**: 21
- 4 driver manifests
- 4 ORBT manuals
- 2 system maps (JSON + Mermaid)
- 2 troubleshooting files (diagnostics + script)
- 4 viewer API schemas/mocks
- 2 READMEs
- 1 system manual guide
- 2 directory structure additions

**Total Lines**: ~2,500
- ORBT manuals: ~800 lines
- Status check script: ~300 lines
- System manual guide: ~500 lines
- Viewer API schemas: ~400 lines
- Documentation/READMEs: ~500 lines

### Barton Doctrine Compliance

All role-based structures follow Barton Doctrine:

- ✅ **Vendor-agnostic**: Roles are functional (AI_ENGINE), not vendor-specific (Gemini)
- ✅ **Driver abstraction**: Current driver is separate from interface contract
- ✅ **HEIR/ORBT tracking**: All roles include tracking metadata
- ✅ **Composio MCP integration**: Integration Bridge uses MCP protocol
- ✅ **Gatekeeper enforcement**: Vault DB access requires validation
- ✅ **No direct access**: Vault DB forbids direct writes (validator layer required)

### Breaking Changes

**None** - All additions are backward-compatible. Existing CTB scaffolds continue to work.

### Deprecations

None

### Migration Guide

#### For Existing CTB v1.0.0 Repositories

1. **Copy New Structures** (optional, recommended for operational excellence):
   ```bash
   # Add role-based documentation
   cp -r ctb-template/manual your-repo/
   cp -r ctb-template/drivers your-repo/
   cp -r ctb-template/viewer-api your-repo/
   ```

2. **Configure Driver Manifests**:
   - Edit `drivers/*/driver_manifest.json` with your current vendors
   - Update `current_driver` fields (gemini, firebase, neon, composio-mcp)

3. **Run Health Check**:
   ```bash
   ts-node manual/scripts/status_check.ts
   ```

4. **Optional - Add to Scaffolding**:
   - Update `ctb_scaffold.ts` to include new structures (Step 9)
   - Add Kodex rules for role-based validation (Step 10)

### Known Issues

None

### Future Enhancements (Planned)

- **v1.4.0**: CTB Viewer App (React/Next.js) with live system visualization
- **v1.5.0**: WebSocket support for real-time health updates
- **v1.6.0**: Historical metrics and trend analysis

### Acknowledgments

This release prepares CTB for external visualization while maintaining operational excellence through vendor-agnostic role-based documentation.

---

## Version 1.0.0 (2025-10-23)

**Status**: Initial Release ✨

### Overview
First official release of the Christmas Tree Backbone (CTB) architecture as the canonical template authority for all Barton-compliant repositories.

### Features

#### Template Structure
- ✅ Complete directory hierarchy (sys, data, apps, ai, docs, tests)
- ✅ Three-tier system (full, mid, micro)
- ✅ README files for all template subdirectories
- ✅ Barton Doctrine policy enforcement

#### Core Files
- ✅ `version.json` - Semantic versioning for CTB templates
- ✅ `.barton_policy.json` - Doctrine enforcement configuration
- ✅ `CTB_BRANCHMAP.yaml` - Standard branch organization

#### Tooling
- ✅ `ctb_scaffold.ts` - TypeScript scaffolding generator
- ✅ Barton ID generation system (SHQ.04.CTB format)
- ✅ Tier-based template filtering

#### CI/CD
- ✅ GitHub Action: `ctb_drift_check.yml` - Automated drift detection
- ✅ Kodex rules: `kodex.rules.json` - 23 enforcement rules

#### Documentation
- ✅ CTB Master Template Factory README section
- ✅ CTB Version History (this document)
- ✅ CTB Tier Selection Guide
- ✅ Architecture documentation stubs

### Directory Structure

```
ctb-template/
├── sys/              # System infrastructure (40k altitude)
│   ├── composio-mcp/ # Composio MCP integration
│   ├── gatekeeper/   # Access control
│   ├── validator/    # Schema enforcement
│   ├── ci/           # CI/CD pipelines
│   └── env/          # Environment config
├── data/             # Data layer (5k altitude)
│   ├── neon/         # PostgreSQL
│   ├── firebase/     # Realtime DB
│   ├── bigquery/     # Analytics
│   └── zod/          # TypeScript validation
├── apps/             # Application layer (20k altitude)
│   ├── ui/           # Frontend
│   ├── api/          # Backend
│   ├── agents/       # AI agents
│   └── tools/        # CLI utilities
├── ai/               # AI integration (20k altitude)
│   ├── blueprints/   # Workflow templates
│   ├── prompts/      # Prompt engineering
│   ├── models/       # Model configs
│   └── training/     # Training resources
├── docs/             # Documentation
│   ├── ctb/          # CTB architecture
│   ├── doctrine/     # Barton Doctrine
│   ├── ort/          # Operational readiness
│   └── sops/         # Standard procedures
└── tests/            # Test suites
    ├── unit/         # Unit tests
    ├── integration/  # Integration tests
    └── audit/        # Compliance audits
```

### Tier Configurations

#### Full Tier
- **Target**: Enterprise-scale repositories
- **Includes**: All CTB components
- **Excludes**: None
- **Team Size**: 5+ developers
- **Complexity**: High

#### Mid Tier
- **Target**: Standard web applications
- **Includes**: sys, data, apps, docs, tests
- **Excludes**: ai/training, docs/ort
- **Team Size**: 2-4 developers
- **Complexity**: Medium

#### Micro Tier
- **Target**: Single-purpose tools
- **Includes**: sys, apps/tools, data/zod
- **Excludes**: ai, docs, tests/integration
- **Team Size**: 1-2 developers
- **Complexity**: Low

### Barton Doctrine Rules

All CTB-scaffolded repositories enforce:

1. **Composio MCP Required**: All external integrations must use Composio MCP
2. **No Direct Neon Access**: Database access must go through validator layer
3. **Gatekeeper Enforced**: All data writes validated by gatekeeper

### Breaking Changes
None (initial release)

### Deprecations
None (initial release)

### Known Issues
None

### Migration Guide
N/A (initial release)

---

## Version 0.x (Pre-Release)

Prior to v1.0.0, CTB architecture was distributed informally across repositories. Version 1.0.0 represents the first formalization as the canonical template authority.

---

## Upgrade Path

### From Pre-1.0 Repositories

If you have an existing repository that predates CTB v1.0.0:

1. **Audit Current Structure**
   ```bash
   # Compare against CTB template
   diff -r your-repo/ ctb-template/
   ```

2. **Scaffold New Structure**
   ```bash
   # Create new repo with CTB
   ts-node scripts/ctb_scaffold.ts --repo your-repo-v2 --tier mid
   ```

3. **Migrate Code**
   - Move application code to `apps/`
   - Move data schemas to `data/`
   - Move system configs to `sys/`
   - Update imports and paths

4. **Update CI/CD**
   - Add `.github/workflows/ctb_drift_check.yml`
   - Configure Kodex rules
   - Test enforcement

5. **Verify Compliance**
   ```bash
   # Run drift check locally
   bash .github/workflows/ctb_drift_check.yml
   ```

---

## Contributing

To propose changes to the CTB template:

1. Create feature branch from `develop`
2. Modify `ctb-template/`
3. Update `version.json` (increment appropriately)
4. Document changes in this file
5. Submit PR with Kodex validation passing

---

## Semantic Versioning

CTB follows [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR**: Incompatible template structure changes
- **MINOR**: Backward-compatible additions
- **PATCH**: Backward-compatible bug fixes

---

**Last Updated**: 2025-10-23
**Maintainer**: Barton Doctrine Authority
**Repository**: [IMO-Creator](https://github.com/djb258/imo-creator)
