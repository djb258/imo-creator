# UI Build Resources

This folder contains the key CTB documentation files formatted for UI design and Plasmic integration.

## Files for CustomGPT → Plasmic workflow:

### **30k.md** - Strategic UI Layout
Perfect for designing dashboard layout with swim lanes:
- **INPUTS** → Left sidebar/input panels
- **ORCHESTRATION** → Center processing area  
- **ENFORCEMENT** → Validation/rules panels
- **STORES** → Database status widgets
- **OUTPUTS** → Results/dashboard panels

### **ctb_horiz.md** - Horizontal Navigation Flow
ASCII backbone showing the main navigation flow across 4 nodes.

### **catalog.md** - Data Structure Reference
Complete database schemas, tools, and MCP servers for building data-driven components.

### **flows.md** - Information Flow Arrows
Shows how data moves between components for designing connectors and workflows.

## Usage:
1. Copy content from these files
2. Paste into CustomGPT prompt
3. Ask it to generate Plasmic component specifications
4. Use those specs to build UI in Plasmic

## Auto-generated from:
- Source: `spec/process_map.yaml`
- Generator: `tools/generate_ctb.py`
- Last updated: Auto-generated on spec changes via GitHub Actions