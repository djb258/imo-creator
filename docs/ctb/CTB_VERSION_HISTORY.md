# CTB Version History

This document tracks the version history of the Christmas Tree Backbone (CTB) template architecture.

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
