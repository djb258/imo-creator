<!--

# CTB Metadata
# Generated: 2025-10-23T14:32:40.054852
# CTB Version: 1.3.3
# Division: Documentation
# Category: guides
# Compliance: 75%
# HEIR ID: HEIR-2025-10-DOC-GUIDES-01

-->

# CTB Tier Selection Guide

This guide helps you choose the right CTB tier for your repository based on scope, team size, and complexity.

## Quick Decision Tree

```
┌─────────────────────────────────────┐
│  What type of project are you      │
│  building?                          │
└──────────────┬──────────────────────┘
               │
               ├─── Single-purpose CLI tool or parser?
               │    → MICRO TIER
               │
               ├─── Standard web app or API backend?
               │    → MID TIER
               │
               └─── Enterprise platform with AI?
                    → FULL TIER
```

---

## Tier Comparison

| Feature | Micro | Mid | Full |
|---------|-------|-----|------|
| **System Layer** (sys/) | ✅ | ✅ | ✅ |
| **Data Layer** (data/) | Zod only | ✅ Complete | ✅ Complete |
| **Apps Layer** (apps/) | tools only | ✅ Complete | ✅ Complete |
| **AI Layer** (ai/) | ❌ | Partial | ✅ Complete |
| **Documentation** (docs/) | Minimal | Standard | Complete |
| **Testing** (tests/) | Unit only | Unit + Integration | Complete |
| **Team Size** | 1-2 | 2-4 | 5+ |
| **Complexity** | Low | Medium | High |

---

## MICRO Tier

### When to Use
- Single-purpose CLI tools
- Data ingestors and parsers
- Utility libraries
- Lightweight microservices
- Personal automation scripts

### What You Get

```
my-micro-tool/
├── sys/
│   ├── composio-mcp/  # MCP integration
│   ├── validator/      # Schema validation
│   └── env/           # Environment config
├── apps/
│   └── tools/         # CLI tools
└── data/
    └── zod/           # TypeScript validation
```

### What's Excluded
- ❌ AI integration (ai/)
- ❌ Documentation (docs/)
- ❌ Integration tests
- ❌ Full data layer (only Zod)
- ❌ UI components
- ❌ API backends

### Example Projects
- `email-validator-cli` - Validates email addresses via Million Verifier
- `schema-ingestor` - Parses SQL DDL into JSON schemas
- `log-parser` - Extracts structured data from logs
- `config-migrator` - Migrates config files between formats

### Scaffolding Command
```bash
ts-node scripts/ctb_scaffold.ts --repo my-cli-tool --tier micro
```

### Expected Development Time
- Setup: 1-2 hours
- Core feature: 1-3 days
- Testing: 4-8 hours
- Total: ~1 week

---

## MID Tier

### When to Use
- Standard web applications
- API backends with multiple endpoints
- Internal dashboards and tools
- Multi-component services
- Projects without heavy AI integration

### What You Get

```
my-mid-app/
├── sys/
│   ├── composio-mcp/
│   ├── gatekeeper/
│   ├── validator/
│   ├── ci/
│   └── env/
├── data/
│   ├── neon/
│   ├── firebase/
│   ├── bigquery/
│   └── zod/
├── apps/
│   ├── ui/
│   ├── api/
│   └── tools/
├── docs/
│   ├── ctb/
│   ├── doctrine/
│   └── sops/
└── tests/
    ├── unit/
    └── integration/
```

### What's Excluded
- ❌ AI training resources (ai/training/)
- ❌ ORT documentation (docs/ort/)
- ❌ AI agents (apps/agents/)

### Example Projects
- `customer-portal` - Client dashboard with API backend
- `inventory-manager` - Multi-page inventory tracking system
- `analytics-dashboard` - Real-time data visualization
- `workflow-automator` - Internal automation platform

### Scaffolding Command
```bash
ts-node scripts/ctb_scaffold.ts --repo my-web-app --tier mid
```

### Expected Development Time
- Setup: 1 day
- Core features: 2-4 weeks
- Testing: 1 week
- Total: ~1-2 months

---

## FULL Tier

### When to Use
- Enterprise-scale platforms
- Multi-service architectures
- AI-powered applications
- Complex systems requiring complete observability
- Projects with dedicated AI/ML components

### What You Get

```
my-enterprise-app/
├── sys/
│   ├── composio-mcp/
│   ├── gatekeeper/
│   ├── validator/
│   ├── ci/
│   └── env/
├── data/
│   ├── neon/
│   ├── firebase/
│   ├── bigquery/
│   └── zod/
├── apps/
│   ├── ui/
│   ├── api/
│   ├── agents/
│   └── tools/
├── ai/
│   ├── blueprints/
│   ├── prompts/
│   ├── models/
│   └── training/
├── docs/
│   ├── ctb/
│   ├── doctrine/
│   ├── ort/
│   └── sops/
└── tests/
    ├── unit/
    ├── integration/
    └── audit/
```

### What's Included
✅ Everything - complete CTB structure

### Example Projects
- `imo-creator` - AI-powered interface generation platform
- `enterprise-crm` - Full-featured CRM with AI insights
- `autonomous-support` - AI agent support system
- `multi-tenant-saas` - Complex SaaS platform

### Scaffolding Command
```bash
ts-node scripts/ctb_scaffold.ts --repo my-enterprise-app --tier full
```

### Expected Development Time
- Setup: 2-3 days
- Core features: 2-6 months
- Testing & validation: 1-2 months
- Total: ~3-8 months

---

## Decision Criteria

### Choose MICRO If...
- ✅ Single command-line tool
- ✅ No UI required
- ✅ Minimal dependencies
- ✅ Solo developer
- ✅ Quick turnaround (< 1 week)

### Choose MID If...
- ✅ Web application with API
- ✅ Multiple pages or views
- ✅ Team of 2-4 developers
- ✅ Standard CRUD operations
- ✅ Development timeline: 1-2 months

### Choose FULL If...
- ✅ Enterprise-scale requirements
- ✅ AI/ML integration needed
- ✅ Team of 5+ developers
- ✅ Complex business logic
- ✅ Development timeline: 3+ months

---

## Upgrading Between Tiers

### MICRO → MID

1. Add missing directories:
   ```bash
   mkdir -p apps/{ui,api} data/{neon,firebase,bigquery} tests/integration docs/{ctb,doctrine,sops}
   ```

2. Copy expanded structure from `ctb-template/`

3. Update `manifest.json`:
   ```json
   {
     "ctb_tier": "mid"
   }
   ```

### MID → FULL

1. Add AI components:
   ```bash
   mkdir -p ai/{blueprints,prompts,models,training} apps/agents docs/ort tests/audit
   ```

2. Copy AI structure from `ctb-template/`

3. Update `manifest.json`:
   ```json
   {
     "ctb_tier": "full"
   }
   ```

---

## Common Mistakes

### ❌ Over-Engineering
**Mistake**: Choosing FULL tier for a simple CLI tool
**Impact**: Unnecessary complexity, slower development
**Solution**: Start with MICRO, upgrade later if needed

### ❌ Under-Planning
**Mistake**: Choosing MICRO for a project that will need AI later
**Impact**: Major refactoring required
**Solution**: Plan ahead, choose MID or FULL upfront

### ❌ Skipping Tiers
**Mistake**: Jumping from MICRO directly to FULL without assessing MID
**Impact**: Complexity overload
**Solution**: Evaluate each tier's features against requirements

---

## FAQs

### Q: Can I customize the tier after scaffolding?
**A**: Yes, but maintain Barton Doctrine compliance. Don't remove core sys/ components.

### Q: Can I mix tier features?
**A**: No. Each tier is a coherent package. Mixing creates drift. Upgrade to next tier instead.

### Q: What if my project doesn't fit any tier?
**A**: Choose the closest tier, then add/remove directories as needed. Update `manifest.json` to reflect customization.

### Q: Can I downgrade tiers?
**A**: Yes, but carefully. Remove unnecessary directories and update manifest. Ensure no code depends on removed components.

### Q: How do I know when to upgrade?
**A**: When you consistently hit tier limitations (e.g., need AI in a MID tier project).

---

## Support

- [CTB Architecture Documentation](./README.md)
- [CTB Version History](./CTB_VERSION_HISTORY.md)
- [Barton Doctrine Policies](../doctrine/)
- [GitHub Issues](https://github.com/djb258/imo-creator/issues)

---

**Last Updated**: 2025-10-23
**Maintainer**: Barton Doctrine Authority
**Repository**: [IMO-Creator](https://github.com/djb258/imo-creator)
