# Factory Integration Guide - CTB Generator

Complete integration of CTB generator with **Garage-MCP** and **IMO-Creator factory** systems.

## 🎯 **What This Achieves**

Every repository that gets processed by Garage-MCP or created through IMO-Creator factory will automatically receive:

- ✅ **CTB Generator** (tools/generate_ctb.py)
- ✅ **Process Spec** (spec/process_map.yaml) 
- ✅ **Generated Docs** (docs/ and docs/altitude/)
- ✅ **UI Build Folder** (ui-build/ for Plasmic integration)
- ✅ **CI Workflow** (auto-regeneration on changes)
- ✅ **Integration Hooks** (automatic maintenance)

## 🔧 **Integration Scripts**

### **1. Auto-Seeding Script**
```bash
python factory/auto_seed_ctb.py /path/to/repo
python factory/auto_seed_ctb.py /path/to/repo --project-name "My App" --owner "Team"
```

**Features:**
- Detects existing project info (Node.js, Python, MCPs, databases)
- Customizes CTB spec based on project type
- Creates ui-build folder automatically
- Adds Garage-MCP and IMO-Factory integration hooks

### **2. Garage-MCP Integration**
```bash
python factory/garage_mcp_integration.py pre-process /path/to/repo
python factory/garage_mcp_integration.py post-process /path/to/repo
python factory/garage_mcp_integration.py health-check /path/to/repo
```

**Workflow:**
- **Pre-process**: Seeds CTB if not present
- **Post-process**: Regenerates docs, updates ui-build
- **Health-check**: Validates CTB compliance (0-100 score)

### **3. Hook Installation**
```bash
bash factory/install_hooks.sh
```

**Creates:**
- `hooks/garage-mcp/` - Garage-MCP integration scripts
- `hooks/imo-factory/` - IMO-Factory integration scripts
- `hooks/git/` - Optional Git pre-commit hooks
- `hooks/REGISTRY.md` - Documentation

## 🏭 **IMO-Creator Factory Integration**

### **New Project Creation**
```bash
# Called automatically when creating new projects
./hooks/imo-factory/new-project.sh /path/to/project "Project Name" "nodejs"
```

### **Project Templates**
Every new project gets:
- Customized `spec/process_map.yaml` with project-specific info
- Auto-detected databases, MCPs, tools
- Project-type specific altitude pages
- Ready-to-use ui-build folder

## 🔄 **Garage-MCP Workflow Integration**

### **Repository Processing**
```bash
# Before processing any repo
./hooks/garage-mcp/pre-process.sh /path/to/repo

# After processing is complete  
./hooks/garage-mcp/post-process.sh /path/to/repo
```

### **Automatic Updates**
- Seeds CTB generator if missing
- Regenerates docs after any changes
- Updates ui-build folder for Plasmic
- Auto-commits doc updates (configurable)
- Compliance scoring and health checks

## 📊 **Compliance Scoring**

Health check provides 0-100 compliance score:

- **20 points**: CTB generator present
- **20 points**: Process spec exists
- **20 points**: Core docs generated
- **10 points**: All altitude pages present
- **15 points**: UI-build folder ready
- **15 points**: CI workflow configured

**Thresholds:**
- **80-100**: Excellent compliance ✅
- **50-79**: Good compliance ⚠️
- **0-49**: Poor compliance ❌ (triggers auto-seeding)

## 🎨 **UI-Build Integration**

Every repo gets a **ui-build/** folder with:
- `30k.md` - Strategic swim lanes (perfect for dashboard layout)
- `ctb_horiz.md` - Navigation flow
- `catalog.md` - Data structures
- `flows.md` - Information flows
- `README.md` - Usage instructions

**Perfect for:**
- CustomGPT → Plasmic workflow
- UI component generation
- Dashboard layout design
- Visual documentation

## 🚀 **Deployment Instructions**

### **1. Install Hooks**
```bash
cd imo-creator
bash factory/install_hooks.sh
```

### **2. Update Garage-MCP**
Add to Garage-MCP processing pipeline:
```python
# Before processing
subprocess.run(["./hooks/garage-mcp/pre-process.sh", repo_path])

# After processing  
subprocess.run(["./hooks/garage-mcp/post-process.sh", repo_path])
```

### **3. Update IMO-Factory**
Add to project creation:
```python  
# When creating new project
subprocess.run(["./hooks/imo-factory/new-project.sh", project_path, project_name, project_type])
```

### **4. Optional Git Integration**
```bash
# Install pre-commit hook for development repos
ln -s ../../hooks/git/pre-commit-ctb .git/hooks/pre-commit
```

## 🔍 **Testing the Integration**

### **Test Auto-Seeding**
```bash
# Create test repo
mkdir test-app && cd test-app && git init

# Seed it
python ../factory/auto_seed_ctb.py . --project-name "Test App"

# Verify files created
ls -la spec/ tools/ docs/ ui-build/ .github/workflows/
```

### **Test Garage-MCP Flow**
```bash
# Simulate Garage-MCP processing
python factory/garage_mcp_integration.py pre-process ./test-app
python factory/garage_mcp_integration.py post-process ./test-app
python factory/garage_mcp_integration.py health-check ./test-app
```

## 📈 **Benefits**

✅ **Consistency**: Every repo has the same CTB structure
✅ **Automation**: No manual setup required
✅ **Maintenance**: Auto-updates when specs change
✅ **Compliance**: Built-in scoring and validation
✅ **UI Ready**: Immediate Plasmic integration capability
✅ **Scalable**: Works with any number of repositories
✅ **Zero Overhead**: Runs automatically in background

## 🎯 **Result**

**Every repository in your ecosystem will automatically have:**
- Professional documentation structure
- Visual architecture diagrams  
- UI-ready component specifications
- Automated maintenance and updates
- Factory-standard compliance

**Perfect for scaling from single developer to enterprise deployment!** 🚀