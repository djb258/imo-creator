# 🤖 LLM Onboarding Guide - imo-creator Repository

**Last Updated**: 2025-10-19
**Repository**: imo-creator (Barton Enterprises)
**Purpose**: MCP-powered development scaffold with multi-altitude HEIR/ORBT architecture

---

## 🎯 **Quick Context - Read This First**

This repository is **NOT a traditional monolithic codebase**. It's a **scaffold/template system** that implements the **CTB (Christmas Tree Backbone) Doctrine** - a hierarchical branch-based architecture for managing complex business applications.

### What You Need to Know Immediately:

1. **Multi-Altitude Architecture**: Code is organized by "altitude" (40k, 20k, 10k, 5k) representing abstraction levels
2. **30+ Active Branches**: Each branch serves a specific purpose in the hierarchy
3. **MCP Integration**: Heavy use of Model Context Protocol for tool orchestration
4. **Auto-Update System**: Can sync structure to other repositories with one command
5. **Doctrine-First**: This repo defines standards that other repos inherit

---

## 📊 **Repository Statistics**

- **Total Files**: ~16,600+ (after recent update)
- **Main Language**: Python, TypeScript, JavaScript
- **Key Frameworks**: FastAPI, Node.js, Firebase, Composio
- **External Integrations**: 12+ (ChartDB, Activepieces, Windmill, Claude Skills, etc.)
- **Branch Count**: 30+ specialized branches
- **Documentation Files**: 100+ markdown files

---

## 🏗️ **Architecture Overview - The Christmas Tree Model**

Think of this repository as a Christmas tree:

```
                    ⭐ (Operations - 5k ft)
                   /|\
                  / | \    Automation & Scripts
                 /  |  \
                /   |   \   (UI Layer - 10k ft)
               /    |    \   Figma, Builder.io
              /     |     \
             /      |      \  (Business Logic - 20k ft)
            /       |       \  IMO Factory (Input/Middle/Output)
           /        |        \
          /_________|_________\  (System Infrastructure - 40k ft)
                   |||          MCP servers, databases, security
                   |||
                  TRUNK         (Main branch - Doctrine Core)
```

### Altitude Breakdown:

| Altitude | Purpose | Key Branches | Merge Direction |
|----------|---------|--------------|-----------------|
| **40k ft** | Immutable doctrine, system infrastructure | `main`, `sys/*`, `doctrine/*` | ← Receives from 20k |
| **20k ft** | Business process engine (IMO Factory) | `imo/input`, `imo/middle`, `imo/output` | ← Receives from 10k |
| **10k ft** | User interface components | `ui/figma-bolt`, `ui/builder-templates` | ← Receives from 5k |
| **5k ft** | Operational tooling | `ops/automation-scripts`, `ops/report-builder` | Source level |

**Merge Flow**: Changes flow **UPWARD** like sap in a tree: `ops/* → ui/* → imo/* → sys/* → main`

---

## 🌲 **CTB Branch Structure - Critical Branches**

### **40k Altitude - Doctrine Core** (12 branches)

These branches define the foundational systems:

| Branch | Doctrine ID | Purpose |
|--------|-------------|---------|
| `main` | N/A | Production trunk - all branches eventually merge here |
| `sys/composio-mcp` | 04.04.05 | MCP tool registry and Composio integrations |
| `sys/neon-vault` | 04.04.01 | PostgreSQL database schemas and migrations |
| `sys/firebase-workbench` | 04.04.02 | Firestore data structures and security rules |
| `sys/bigquery-warehouse` | 04.04.03 | Analytics and data warehouse configuration |
| `sys/chartdb` | 04.04.07 | Database visualization and schema management |
| `sys/activepieces` | 04.04.08 | Workflow automation platform |
| `sys/windmill` | 04.04.09 | Script orchestration and automation |
| `sys/claude-skills` | 04.04.10 | AI reasoning layer and extended context |
| `sys/github-factory` | N/A | CI/CD templates and GitHub automation |
| `sys/builder-bridge` | N/A | Builder.io and Figma connectors |
| `sys/security-audit` | N/A | Security compliance and secrets management |

### **20k Altitude - IMO Factory** (3 branches)

The core business logic layer:

| Branch | Purpose |
|--------|---------|
| `imo/input` | Data intake, web scraping, enrichment, validation |
| `imo/middle` | Business calculators, compliance logic, transformations |
| `imo/output` | Dashboard generation, exports, visualizations |

### **10k & 5k Altitudes** (4 branches)

UI and operational layers:

- `ui/figma-bolt` - Figma + Bolt UI components
- `ui/builder-templates` - Reusable Builder.io modules
- `ops/automation-scripts` - Automation tooling
- `ops/report-builder` - Report generation scripts

---

## 🔑 **Key Concepts You Must Understand**

### 1. **HEIR (Hierarchical Entity Identification Registry)**

A unique ID system for tracking entities across altitudes:

**Format**: `AA.BB.CC.DD`

- `AA` = Altitude (40, 20, 10, 05)
- `BB` = Domain (04=Systems, 05=Business, 06=UI, 07=Ops)
- `CC` = Sub-domain
- `DD` = Sequence

**Example**: `40.04.07.01` = ChartDB system at 40k altitude, systems domain, database sub-domain, first item

### 2. **ORBT (Orchestrated Repo Branching Topology)**

The branching strategy that enables:
- **Altitude-based separation** of concerns
- **Upward merge flow** from operations to doctrine
- **Automated synchronization** between branches
- **Protection levels** based on criticality

### 3. **MCP (Model Context Protocol)**

All external integrations are exposed through MCP tools:
- Located in `config/mcp_registry.json`
- Each tool has a doctrine ID
- Composio serves as the MCP orchestration layer

---

## 📁 **Critical Files and Their Purposes**

### **Configuration Files**

| File | Purpose |
|------|---------|
| `global-config/CTB_DOCTRINE.md` | Complete CTB philosophy and rules |
| `global-config/ctb.branchmap.yaml` | Branch structure definition |
| `config/mcp_registry.json` | MCP tool registry and metadata |
| `heir.doctrine.yaml` | HEIR ID schema and validation rules |
| `imo.config.json` | IMO Factory configuration |

### **Documentation Hub**

| File | Purpose |
|------|---------|
| `REPO_OVERVIEW.md` | ⭐ **START HERE** - Generated gitingest overview |
| `LLM_ONBOARDING.md` | This file - your orientation guide |
| `README.md` | Project overview and quick start |
| `QUICKSTART.md` | Fast setup instructions |
| `docs/ARCHITECTURE.md` | Detailed architecture documentation |
| `docs/COMPOSIO_MCP_INTEGRATION.md` | MCP integration patterns |
| `global-config/QUICK_REFERENCE.md` | Common commands and workflows |

### **Key Scripts**

| Script | Purpose |
|--------|---------|
| `global-config/scripts/update_from_imo_creator.sh` | Sync CTB structure to child repos |
| `global-config/scripts/ctb_enforce.sh` | Validate CTB compliance |
| `global-config/scripts/security_lockdown.sh` | Security audit and secret scanning |
| `bootstrap-repo.cjs` | Initialize new repo with CTB structure |

---

## 🚀 **Common Tasks - How To**

### **Task 1: Understanding the Current State**

```bash
# View branch structure
git branch -a

# Check current altitude
cat .ctb-metadata

# View MCP registry
cat config/mcp_registry.json

# See all sys/ branches
git branch -a | grep sys/
```

### **Task 2: Working with Branches**

```bash
# Switch to a specific altitude branch
git checkout sys/composio-mcp    # System level
git checkout imo/middle           # Business logic level
git checkout ops/automation-scripts  # Operations level

# Create a feature branch (inherits from current altitude)
git checkout -b feature/new-integration

# Merge upward (following CTB flow)
# ops/* → ui/* → imo/* → sys/* → main
```

### **Task 3: Adding a New MCP Tool**

1. Add entry to `config/mcp_registry.json`
2. Create sys/ branch: `git checkout -b sys/new-tool`
3. Add documentation to `sys/new-tool/README.md`
4. Update `global-config/ctb.branchmap.yaml`
5. Run: `bash global-config/scripts/ctb_enforce.sh`

### **Task 4: Syncing Structure to Another Repo**

Tell Claude Code: **"update from imo-creator"**

Or manually:
```bash
bash global-config/scripts/update_from_imo_creator.sh /path/to/target/repo
```

---

## 🔒 **Security & Compliance**

### **Zero-Tolerance Security Policy**

- ❌ **NO .env files** committed (use MCP vault variables)
- ❌ **NO hardcoded API keys** (use placeholders like `<your-api-key>`)
- ✅ All secrets via `process.env.MCP_VAULT_*` or Composio variables
- ✅ Pre-commit hooks scan for secrets
- ✅ GitHub Actions enforce security on every PR

### **Forbidden Files**

```
.env
.env.local
.env.production
credentials.json
service-account.json
*.pem
*.key
```

### **Security Scanning**

```bash
# Run security audit
bash global-config/scripts/security_lockdown.sh

# Check logs
cat logs/security_audit.log
```

---

## 🎓 **Learning Path for New LLMs**

### **Level 1: Orientation (15 minutes)**
1. Read this file (LLM_ONBOARDING.md)
2. Skim `REPO_OVERVIEW.md` for file structure
3. Review `global-config/CTB_DOCTRINE.md` - first 100 lines
4. Check `global-config/ctb.branchmap.yaml`

### **Level 2: Understanding Architecture (30 minutes)**
1. Read `docs/ARCHITECTURE.md`
2. Explore `config/mcp_registry.json`
3. Review branch structure: `git branch -a`
4. Read `docs/COMPOSIO_MCP_INTEGRATION.md`

### **Level 3: Hands-On (1 hour)**
1. Check out each altitude branch
2. Examine file organization patterns
3. Review `garage-mcp/` module structure
4. Study automation scripts in `global-config/scripts/`

### **Level 4: Mastery (2-3 hours)**
1. Understand HEIR ID system
2. Review MCP tool implementations
3. Study external repo integrations (activepieces, windmill, chartdb)
4. Examine GitHub Actions workflows

---

## 🎯 **Common Questions & Answers**

### Q: "Why are there so many branches?"

**A**: Each branch represents a distinct altitude/concern in the CTB architecture. This enables:
- Isolated development at different abstraction levels
- Clear merge paths and dependencies
- Easy synchronization across repositories
- Doctrine enforcement at the appropriate level

### Q: "What is the IMO Factory?"

**A**: IMO = Input → Middle → Output. It's a 3-stage business process engine:
- **Input**: Collect and validate data
- **Middle**: Transform and enrich data with business logic
- **Output**: Generate dashboards, reports, and visualizations

### Q: "How does this relate to MCP?"

**A**: MCP (Model Context Protocol) is the **integration layer**. Every external service (databases, APIs, automation platforms) is exposed as an MCP tool. This repo maintains the MCP registry and orchestrates all integrations through Composio.

### Q: "Can I modify files on the main branch?"

**A**: ⚠️ **No!** The main branch is the "trunk" - it only receives merges from sys/ branches. All changes must:
1. Start at the appropriate altitude (ops, ui, imo, or sys)
2. Flow upward through the merge chain
3. Pass CTB compliance checks
4. Be reviewed before merging to main

### Q: "What's the difference between this and a normal repo?"

**A**: Normal repos are monolithic. This is a **multi-altitude scaffold**:
- Normal repo: All code in one branch → deploy
- CTB repo: Code organized by abstraction level → propagated through altitudes → main branch is always production-ready

### Q: "How do I know which branch to work in?"

**A**: Check the **file organization** section in `global-config/ctb.branchmap.yaml`. It maps file patterns to branches:
- Database schemas → `sys/neon-vault`
- MCP tools → `sys/composio-mcp`
- Business logic → `imo/middle`
- UI components → `ui/figma-bolt`
- Scripts → `ops/automation-scripts`

---

## 🧭 **Navigation Tips**

### **Finding Things Fast**

```bash
# Find all MCP-related files
grep -r "mcp" --include="*.json" --include="*.md"

# Find all doctrine files
find . -name "*doctrine*"

# Find all HEIR references
grep -r "HEIR" --include="*.md" --include="*.yaml"

# List all sys/ branches
git branch -a | grep sys/

# Find configuration files
find . -name "*.config.*" -not -path "*/node_modules/*"
```

### **Understanding Dependencies**

```bash
# Python dependencies
cat requirements.txt
cat garage-mcp/requirements.txt

# Node dependencies
cat package.json

# System dependencies
cat runtime.txt
```

---

## 🔥 **Red Flags - Things That Should Alarm You**

1. **Hardcoded API keys in any file**
   - Action: Run security_lockdown.sh immediately

2. **Direct commits to main branch**
   - Action: This violates CTB - revert and follow merge flow

3. **Missing .ctb-metadata file**
   - Action: Run ctb_init.sh to restore

4. **Branches not matching ctb.branchmap.yaml**
   - Action: Run ctb_enforce.sh to validate

5. **MCP tools without doctrine IDs**
   - Action: Update mcp_registry.json with proper HEIR IDs

---

## 📞 **Getting Help**

### **Documentation Resources**

1. **Doctrine Questions**: Read `global-config/CTB_DOCTRINE.md`
2. **Architecture Questions**: Read `docs/ARCHITECTURE.md`
3. **MCP Integration**: Read `docs/COMPOSIO_MCP_INTEGRATION.md`
4. **Quick Commands**: Read `global-config/QUICK_REFERENCE.md`
5. **Troubleshooting**: Read `docs/TROUBLESHOOTING.md`

### **Validation Commands**

```bash
# Validate CTB compliance
bash global-config/scripts/ctb_enforce.sh

# Check security
bash global-config/scripts/security_lockdown.sh

# Verify branch structure
bash global-config/scripts/ctb_verify.sh

# Check version
bash global-config/scripts/ctb_check_version.sh
```

---

## ✅ **Final Checklist - Am I Ready?**

Before working on this repository, confirm you understand:

- [ ] The Christmas Tree Backbone (CTB) philosophy
- [ ] The 4 altitude levels (40k, 20k, 10k, 5k)
- [ ] Upward merge flow (ops → ui → imo → sys → main)
- [ ] HEIR ID system (AA.BB.CC.DD format)
- [ ] MCP tool registry location and structure
- [ ] Security zero-tolerance policy (no hardcoded secrets)
- [ ] File organization patterns by branch
- [ ] How to validate CTB compliance
- [ ] Where to find documentation for each system
- [ ] The IMO Factory (Input/Middle/Output) pattern

---

## 🎬 **Next Steps**

1. **Read REPO_OVERVIEW.md** - Get familiar with the file structure
2. **Explore a sys/ branch** - Pick one (e.g., sys/composio-mcp) and understand its contents
3. **Review MCP Registry** - Open config/mcp_registry.json and study the tool definitions
4. **Run a validation** - Execute ctb_enforce.sh to see compliance in action
5. **Ask specific questions** - Now that you have context, ask detailed questions about components

---

**Welcome to the imo-creator repository! 🎄**

You now have the foundational knowledge to navigate this multi-altitude architecture effectively. Remember: Think like a Christmas tree - everything flows upward from operations to doctrine.
