# 📋 IMO Project Blueprint Template Repository

🚀 **One-click project planning with Whimsical integration**

This is a GitHub template repository that provides a comprehensive project planning blueprint using multi-altitude thinking and automatic diagram generation.

## ⚡ Quick Start

1. **Use this template**: Click "Use this template" button on GitHub
2. **Fill out blueprint**: Edit `blueprint.json` with your project details
3. **Validate**: Run `npm run validate` to check completeness
4. **Generate visuals**: Submit to Whimsical GPT for diagrams
5. **Start building**: Use generated plans to guide development

## 🎯 What This Template Provides

### 📊 Multi-Altitude Planning
- **30,000ft**: Strategic vision and objectives
- **20,000ft**: System architecture and components  
- **10,000ft**: Implementation details and decisions
- **5,000ft**: Tactical execution and handoffs

### 🎨 Visual Generation
- Mind maps for strategic overview
- Flowcharts for process flows
- Agent maps for role coordination
- Sequence diagrams for interactions

### ✅ Built-in Validation
- Schema compliance checking
- Completeness scoring
- HEIR/ORBT doctrine validation
- Automated blueprint hashing

## 📁 Repository Structure

```
├── blueprint.json              # Main project blueprint
├── scripts/
│   ├── validate.ts            # Validation script
│   └── generate-diagrams.ts   # Diagram generation
├── templates/
│   ├── blueprint-template.json
│   └── examples/
├── docs/
│   ├── PLANNING_GUIDE.md
│   └── INTEGRATION_GUIDE.md
└── .github/
    └── workflows/
        └── validate-blueprint.yml
```

## 🛠️ Commands

```bash
# Install dependencies
npm install

# Validate your blueprint
npm run validate

# Check blueprint completeness
npm run check-completeness

# Generate example filled blueprint
npm run generate-example

# Export for Whimsical GPT
npm run export-whimsical
```

## 🎨 Whimsical Integration

Once your blueprint is 80%+ complete:

1. Copy the JSON content from `blueprint.json`
2. Paste into Whimsical GPT with this prompt:

```
Generate comprehensive project visualizations from this IMO blueprint:

[PASTE YOUR BLUEPRINT JSON HERE]

Please create:
- Strategic mind map (30,000ft view)
- System architecture flowchart (20,000ft view)  
- Implementation sequence diagram (10,000ft view)
- Agent coordination map (5,000ft view)
```

3. Receive live Whimsical links and iframe embeds
4. Update `visual_embedding.whimsical_diagram_ids` with generated IDs

## 📋 Blueprint Structure

### Status Flags
```json
"status_flags": {
  "is_filled": false,      // All required fields completed
  "is_validated": false,   // Schema validation passed
  "is_whimsical_ready": false  // Ready for diagram generation
}
```

### Meta Information  
```json
"meta": {
  "unique_id": "DB/HIVE/SUB/PROC-YYYYMMDD-HHMMSS-XXXX",
  "process_id": "IMO-{project_slug}-{increment}",
  "blueprint_version_hash": "sha256:...",
  "doctrine": ["BARTON", "ORBT", "HEIR", "STAMPED/SPVPET/STACKED"]
}
```

### Altitude Planning
- **30,000ft**: Vision, objectives, stakeholders
- **20,000ft**: Components, roles, stages, I/O
- **10,000ft**: Steps, APIs, decisions, compliance
- **5,000ft**: Documentation, agents, handoffs

## 🔄 Workflow Integration

### GitHub Actions
- Automatic validation on PR
- Blueprint completeness checking  
- Whimsical-ready status updates

### Development Integration
- IDE snippets for common patterns
- Pre-commit hooks for validation
- Notion workspace integration

## 🌟 Example Projects

- [E-commerce Platform](templates/examples/ecommerce-blueprint.json)
- [SaaS Dashboard](templates/examples/saas-blueprint.json) 
- [Mobile App](templates/examples/mobile-blueprint.json)

## 🤝 Contributing

1. Fork this repository
2. Create example blueprints in `templates/examples/`
3. Improve validation scripts
4. Add new diagram types
5. Submit PR with improvements

## 📚 Documentation

- [📖 Planning Guide](docs/PLANNING_GUIDE.md) - How to fill out blueprints
- [🔗 Integration Guide](docs/INTEGRATION_GUIDE.md) - Tool integrations
- [🎨 Visual Guide](docs/VISUAL_GUIDE.md) - Diagram generation

## 🎯 Use Cases

### For Solo Developers
- Structured project planning
- Visual communication with stakeholders
- Documentation generation

### For Teams  
- Coordinated planning across roles
- Clear handoff definitions
- Shared visual understanding

### For Agencies
- Client project kickoffs
- Proposal visualizations
- Standardized planning process

## 🚀 Next Steps After Using Template

1. **Fill out your blueprint** completely
2. **Validate** and reach 80%+ completeness
3. **Generate visuals** with Whimsical GPT
4. **Create project repository** using generated plans
5. **Start development** with clear roadmap

---

**Ready to plan your next project?** Use this template and transform ideas into actionable blueprints with beautiful visualizations! 🎨

[![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?style=for-the-badge)](../../generate)