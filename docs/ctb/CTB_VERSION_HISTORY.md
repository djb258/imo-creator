# CTB Version History

This document tracks the version history of the Christmas Tree Backbone (CTB) template architecture.

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
