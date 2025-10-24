#!/bin/bash
# CTB Bootstrap Script
# Copies global factory scripts and workflows into any repository

set -e

echo "🏗️  CTB Bootstrap Installer"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SOURCE_REPO=${SOURCE_REPO:-""}  # Set to your CTB factory repo URL
TARGET_DIR=$(pwd)

echo "📂 Target Directory: $TARGET_DIR"
echo ""

# Step 1: Create CTB directory structure
echo "📁 Creating CTB directory structure..."
mkdir -p ctb/{sys,ai,data,docs,ui,meta}
mkdir -p ctb/sys/global-factory/{scripts,doctrine}
mkdir -p logs

echo "   ✅ Created: ctb/{sys,ai,data,docs,ui,meta}"
echo "   ✅ Created: ctb/sys/global-factory/{scripts,doctrine}"
echo "   ✅ Created: logs/"
echo ""

# Step 2: Create or update CTB registry
echo "🏷️  Creating CTB registry..."
cat > ctb/meta/ctb_registry.json << 'EOF'
{
  "version": "1.0.0",
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "repository": "$(basename $(pwd))",
  "ctb_structure": {
    "sys": "System integrations and infrastructure",
    "ai": "AI models, prompts, and training",
    "data": "Database schemas and migrations",
    "docs": "Documentation and guides",
    "ui": "UI components and templates",
    "meta": "CTB metadata and registry"
  },
  "enforcement": {
    "enabled": true,
    "min_score": 90,
    "auto_remediate": true
  },
  "branches": {
    "sys": {
      "description": "System integrations",
      "subdirs": ["composio-mcp", "firebase", "neon", "github-factory", "gatekeeper", "validator", "global-factory"]
    },
    "ai": {
      "description": "AI systems",
      "subdirs": ["models", "prompts", "blueprints", "training"]
    },
    "data": {
      "description": "Data layer",
      "subdirs": ["firebase", "neon", "bigquery", "zod"]
    },
    "docs": {
      "description": "Documentation",
      "subdirs": ["ctb", "doctrine", "ort", "sops"]
    },
    "ui": {
      "description": "User interfaces",
      "subdirs": ["components", "pages", "templates"]
    }
  }
}
EOF

echo "   ✅ Created: ctb/meta/ctb_registry.json"
echo ""

# Step 3: Create global-config.yaml
echo "⚙️  Creating global configuration..."
cat > global-config.yaml << 'EOF'
# Global CTB Configuration
version: "1.0.0"
repository: $(basename $(pwd))

# CTB Structure Configuration
ctb:
  enabled: true
  version: "1.0.0"
  branches:
    - sys      # System integrations
    - ai       # AI models and prompts
    - data     # Database schemas
    - docs     # Documentation
    - ui       # User interfaces
    - meta     # Metadata

# Doctrine Enforcement
doctrine_enforcement:
  ctb_factory: ctb/sys/global-factory/
  auto_sync: true
  min_score: 90
  composio_scenario: CTB_Compliance_Cycle
  auto_remediate: true

# Logging
logging:
  directory: logs/
  audit_enabled: true
  retention_days: 90

# Integration Settings
integrations:
  composio:
    enabled: false
  firebase:
    enabled: false
  neon:
    enabled: false
EOF

echo "   ✅ Created: global-config.yaml"
echo ""

# Step 4: Copy global factory scripts (if source repo provided)
if [ -n "$SOURCE_REPO" ]; then
    echo "📥 Copying global factory scripts from source..."

    # Clone or download factory scripts
    TEMP_DIR=$(mktemp -d)
    git clone --depth 1 "$SOURCE_REPO" "$TEMP_DIR" 2>/dev/null || {
        echo -e "${RED}   ❌ Failed to clone source repository${NC}"
        echo "   ℹ️  Skipping script download. Install manually."
    }

    if [ -d "$TEMP_DIR/ctb/sys/global-factory/scripts" ]; then
        cp -r "$TEMP_DIR/ctb/sys/global-factory/scripts/"* ctb/sys/global-factory/scripts/
        echo "   ✅ Copied: global factory scripts"
    fi

    if [ -d "$TEMP_DIR/ctb/sys/global-factory/doctrine" ]; then
        cp -r "$TEMP_DIR/ctb/sys/global-factory/doctrine/"* ctb/sys/global-factory/doctrine/
        echo "   ✅ Copied: global factory doctrine"
    fi

    rm -rf "$TEMP_DIR"
    echo ""
else
    echo -e "${YELLOW}⚠️  No source repository specified${NC}"
    echo "   To copy scripts from a source repo, set SOURCE_REPO environment variable:"
    echo "   export SOURCE_REPO=https://github.com/YOUR_ORG/ctb-factory.git"
    echo "   Then run this script again."
    echo ""
fi

# Step 5: Make scripts executable
echo "🔧 Setting script permissions..."
if [ -d "ctb/sys/global-factory/scripts" ]; then
    chmod +x ctb/sys/global-factory/scripts/*.py 2>/dev/null || true
    chmod +x ctb/sys/global-factory/scripts/*.sh 2>/dev/null || true
    echo "   ✅ Scripts are now executable"
else
    echo "   ⚠️  No scripts found to make executable"
fi
echo ""

# Step 6: Create .gitignore entries
echo "📝 Updating .gitignore..."
if [ ! -f .gitignore ]; then
    touch .gitignore
fi

# Add CTB-specific ignores if not already present
grep -q "# CTB" .gitignore || cat >> .gitignore << 'EOF'

# CTB
logs/ctb_*.json
ctb/meta/ctb_tags.json
EOF

echo "   ✅ Updated: .gitignore"
echo ""

# Step 7: Summary and next steps
echo "========================================"
echo -e "${GREEN}✅ CTB Bootstrap Complete!${NC}"
echo "========================================"
echo ""
echo "📁 Created Structure:"
echo "   ctb/{sys,ai,data,docs,ui,meta}"
echo "   logs/"
echo ""
echo "📄 Created Files:"
echo "   ctb/meta/ctb_registry.json"
echo "   global-config.yaml"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Tag files:"
echo "   python ctb/sys/global-factory/scripts/ctb_metadata_tagger.py"
echo ""
echo "2. Audit compliance:"
echo "   python ctb/sys/global-factory/scripts/ctb_audit_generator.py"
echo ""
echo "3. Fix issues:"
echo "   python ctb/sys/global-factory/scripts/ctb_remediator.py --dry-run"
echo "   python ctb/sys/global-factory/scripts/ctb_remediator.py"
echo ""
echo "4. Review:"
echo "   cat logs/ctb_audit_report.json"
echo ""
echo "📖 Documentation:"
echo "   ctb/sys/global-factory/doctrine/README.md"
echo ""
echo "========================================"
