# 🎨 CTB UI Doctrine: Figma → Bolt.new Pipeline

## Overview

The **CTB UI Doctrine** defines the standardized workflow for transforming Figma designs into deployable applications through the Bolt.new platform, integrated with the CTB branch structure.

**Pipeline**: `Figma Design → JSON Export → imo/output → Bolt.new → Deployment`

---

## Branch Mapping

### UI Development Flow

```
Figma Design (External)
    ↓
ui/figma-bolt ← Design tokens, component mappings, prompts
    ↓
imo/output ← Exported JSON, ready for Bolt.new
    ↓
Bolt.new Platform ← Imports and generates application
    ↓
Vercel Deployment ← Live application
```

---

## Directory Structure

```
ui/figma-bolt/
├── figma-templates/
│   ├── figma-template-prompt.txt      ← Prompts for Figma AI
│   ├── component-library.json         ← Reusable components
│   └── design-tokens.json             ← Colors, fonts, spacing
│
├── bolt-config/
│   ├── bolt-import-template.json      ← Bolt.new import config
│   └── bolt-deployment-config.yaml    ← Deployment settings
│
└── workflows/
    ├── figma-to-json.md               ← Export workflow
    └── json-to-bolt.md                ← Import workflow

imo/output/
├── figma-exports/
│   ├── {project-name}.json            ← Exported Figma JSON
│   └── assets/                        ← Images, icons
│
└── bolt-ready/
    └── {project-name}-bolt.json       ← Bolt.new ready format
```

---

## Workflow Steps

### 1. Design in Figma

**Branch**: Work in `ui/figma-bolt`

1. Create design in Figma
2. Apply CTB component naming convention:
   ```
   CTB-{altitude}-{component}

   Examples:
   - CTB-40k-Header
   - CTB-20k-DataTable
   - CTB-10k-Button
   - CTB-5k-StatusBadge
   ```

3. Use design tokens from `design-tokens.json`:
   ```json
   {
     "colors": {
       "doctrine-core": "#1a1a2e",
       "business-logic": "#16213e",
       "ui-layer": "#0f3460",
       "operations": "#533483"
     },
     "spacing": {
       "40k": "4rem",
       "20k": "2rem",
       "10k": "1rem",
       "5k": "0.5rem"
     }
   }
   ```

### 2. Export from Figma

**Branch**: Export to `imo/output`

1. Use Figma AI with prompt from `figma-template-prompt.txt`
2. Export design as JSON
3. Save to `imo/output/figma-exports/{project-name}.json`
4. Commit to `imo/output` branch

### 3. Transform for Bolt.new

**Branch**: Process in `imo/middle`, output to `imo/output`

1. Run transformation script:
   ```bash
   bash ops/automation-scripts/transform-figma-to-bolt.sh {project-name}
   ```

2. Script converts Figma JSON to Bolt.new format
3. Saves to `imo/output/bolt-ready/{project-name}-bolt.json`

### 4. Import to Bolt.new

**Platform**: Bolt.new

1. Open Bolt.new
2. Import JSON from `imo/output/bolt-ready/{project-name}-bolt.json`
3. Review generated code
4. Deploy to Vercel

---

## Design Tokens Reference

### CTB Altitude Colors

```json
{
  "altitude-colors": {
    "40k-doctrine-core": {
      "primary": "#1a1a2e",
      "secondary": "#16213e",
      "accent": "#0f3460"
    },
    "20k-business-logic": {
      "primary": "#16213e",
      "secondary": "#0f3460",
      "accent": "#533483"
    },
    "10k-ui-layer": {
      "primary": "#0f3460",
      "secondary": "#533483",
      "accent": "#e94560"
    },
    "5k-operations": {
      "primary": "#533483",
      "secondary": "#e94560",
      "accent": "#f39c12"
    }
  }
}
```

### Component Naming Convention

```
CTB-{altitude}-{component-type}-{variant}

Examples:
- CTB-40k-Layout-Main
- CTB-20k-Form-Input
- CTB-10k-Button-Primary
- CTB-5k-Badge-Status
```

---

## Figma Template Prompts

### Prompt 1: Generate CTB Component Library

```
Create a component library following the CTB (Christmas Tree Backbone) design system:

1. Altitude-based color scheme:
   - 40k (Doctrine): Dark navy (#1a1a2e)
   - 20k (Business): Medium navy (#16213e)
   - 10k (UI): Blue (#0f3460)
   - 5k (Operations): Purple (#533483)

2. Component hierarchy:
   - Layout components at 40k
   - Data components at 20k
   - Interactive components at 10k
   - Status indicators at 5k

3. Typography:
   - Headers: Inter Bold
   - Body: Inter Regular
   - Code: Fira Code

4. Spacing scale: 4rem, 2rem, 1rem, 0.5rem

Export as JSON with component mappings.
```

### Prompt 2: Generate Application Screen

```
Design an application screen using CTB design tokens:

1. Use altitude-appropriate colors for each section
2. Name all components with CTB-{altitude}-{name} format
3. Apply spacing based on altitude (40k=4rem, 20k=2rem, etc.)
4. Include navigation at 40k level
5. Main content at 20k level
6. Interactive elements at 10k level
7. Status badges at 5k level

Export as Figma JSON for Bolt.new import.
```

---

## Bolt.new Import Configuration

### Template: `bolt-import-template.json`

```json
{
  "meta": {
    "source": "figma-ctb",
    "version": "1.0",
    "doctrine": "HEIR/CTB"
  },
  "project": {
    "name": "{{PROJECT_NAME}}",
    "framework": "react",
    "styling": "tailwind",
    "typescript": true
  },
  "components": {
    "source": "imo/output/figma-exports/{{PROJECT_NAME}}.json",
    "mapping": {
      "CTB-40k-*": "layouts/*",
      "CTB-20k-*": "components/business/*",
      "CTB-10k-*": "components/ui/*",
      "CTB-5k-*": "components/status/*"
    }
  },
  "deployment": {
    "platform": "vercel",
    "branch": "ui/figma-bolt",
    "auto_deploy": true
  }
}
```

---

## Automation Scripts

### Script 1: Transform Figma to Bolt

**Location**: `ops/automation-scripts/transform-figma-to-bolt.sh`

```bash
#!/bin/bash
# Transforms Figma JSON to Bolt.new format

PROJECT_NAME=$1
INPUT="imo/output/figma-exports/${PROJECT_NAME}.json"
OUTPUT="imo/output/bolt-ready/${PROJECT_NAME}-bolt.json"

# Transform JSON structure
jq --arg name "$PROJECT_NAME" '
{
  meta: {
    source: "figma-ctb",
    version: "1.0",
    project: $name
  },
  components: .document.children | map({
    name: .name,
    type: .type,
    props: .props,
    children: .children
  })
}' "$INPUT" > "$OUTPUT"

echo "Transformed: $OUTPUT"
```

### Script 2: Deploy to Bolt.new

**Location**: `ops/automation-scripts/deploy-to-bolt.sh`

```bash
#!/bin/bash
# Deploys JSON to Bolt.new platform

PROJECT_NAME=$1
BOLT_JSON="imo/output/bolt-ready/${PROJECT_NAME}-bolt.json"

# Upload to Bolt.new (API integration)
curl -X POST https://bolt.new/api/import \
  -H "Content-Type: application/json" \
  -d @"$BOLT_JSON"

echo "Deployed to Bolt.new: $PROJECT_NAME"
```

---

## Integration with CTB Branches

### Merge Flow for UI Work

```
1. Design in Figma (external)
   ↓
2. Export to ui/figma-bolt branch
   git checkout ui/figma-bolt
   git add figma-templates/
   git commit -m "📐 Add Figma design templates"
   ↓
3. Transform in imo/middle branch
   git checkout imo/middle
   bash ops/automation-scripts/transform-figma-to-bolt.sh project-name
   ↓
4. Export to imo/output branch
   git checkout imo/output
   git add figma-exports/ bolt-ready/
   git commit -m "📤 Export Figma to Bolt.new format"
   ↓
5. Deploy via Bolt.new
   ↓
6. Merge upward to sys branches (after verification)
```

---

## Example: CTB Key Viewer

### Project Structure

```
ui/figma-bolt/
└── ctb-keyviewer/
    ├── design-tokens.json
    ├── component-library.json
    └── README.md

imo/output/
└── figma-exports/
    └── ctb-keyviewer.json

Bolt.new Project:
└── components/
    ├── layouts/MainLayout.tsx        (40k)
    ├── business/KeyList.tsx          (20k)
    ├── ui/KeyCard.tsx                (10k)
    └── status/StatusBadge.tsx        (5k)
```

### Deployment Flow

1. Design in Figma with CTB components
2. Export to `imo/output/figma-exports/ctb-keyviewer.json`
3. Transform: `bash ops/automation-scripts/transform-figma-to-bolt.sh ctb-keyviewer`
4. Import to Bolt.new
5. Deploy to Vercel
6. URL: `https://ctb-keyviewer.vercel.app`

---

## Best Practices

### 1. Component Naming

✅ **Good**: `CTB-20k-UserForm-Input`
❌ **Bad**: `UserInput` (no altitude context)

### 2. Color Usage

✅ **Good**: Use altitude-appropriate colors
❌ **Bad**: Random colors not in design tokens

### 3. Branch Organization

✅ **Good**: Design work stays in `ui/figma-bolt`, exports to `imo/output`
❌ **Bad**: Mixing design files across multiple branches

### 4. Documentation

✅ **Good**: Document each design in README with altitude mapping
❌ **Bad**: No documentation of component purpose

---

## Troubleshooting

### Figma Export Issues

**Problem**: JSON export missing components
**Solution**: Ensure all layers are named with CTB- prefix

### Bolt.new Import Issues

**Problem**: Components not mapping correctly
**Solution**: Check `bolt-import-template.json` mapping rules

### Deployment Failures

**Problem**: Vercel deployment fails
**Solution**: Verify `bolt-deployment-config.yaml` settings

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-09 | Initial CTB UI Doctrine |

---

**🎨 CTB UI Doctrine: Design with structure, deploy with confidence**
