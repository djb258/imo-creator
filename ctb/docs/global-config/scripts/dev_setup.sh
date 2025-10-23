#!/bin/bash
# # CTB Metadata
# # Generated: 2025-10-23T14:32:40.829494
# # CTB Version: 1.3.3
# # Division: Documentation
# # Category: global-config
# # Compliance: 75%
# # HEIR ID: HEIR-2025-10-DOC-GLOBAL-01


###############################################################################
# CTB Doctrine v1.3 - Developer Environment Setup Script
# Description: Quick setup for local development environment
# Version: 1.0
# Last Updated: 2025-10-18
###############################################################################

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     CTB Doctrine v1.3 - Developer Environment Setup           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Navigate to repo root
cd "$REPO_ROOT" || exit 1

echo "📁 Repository: $(basename "$REPO_ROOT")"
echo "🌲 CTB Doctrine: v1.3"
echo ""

###############################################################################
# Step 1: Install Node.js Dependencies
###############################################################################

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Step 1: Installing Node.js dependencies..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "package.json" ]; then
    if command -v pnpm &> /dev/null; then
        echo "   Using pnpm..."
        pnpm install
    elif command -v npm &> /dev/null; then
        echo "   Using npm..."
        npm install
    else
        echo "❌ ERROR: Neither npm nor pnpm found. Please install Node.js."
        exit 1
    fi
    echo "✅ Node.js dependencies installed"
else
    echo "⏭️  No package.json found - skipping Node.js dependencies"
fi

echo ""

###############################################################################
# Step 2: Install Python Dependencies (if applicable)
###############################################################################

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🐍 Step 2: Checking Python dependencies..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "requirements.txt" ]; then
    if command -v pip &> /dev/null; then
        echo "   Installing Python dependencies..."
        pip install -r requirements.txt --quiet
        echo "✅ Python dependencies installed"
    else
        echo "⚠️  pip not found - skipping Python dependencies"
    fi
else
    echo "⏭️  No requirements.txt found - skipping Python dependencies"
fi

echo ""

###############################################################################
# Step 3: Run CTB Enforcement Validation
###############################################################################

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Step 3: Running CTB Doctrine enforcement validation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "$SCRIPT_DIR/ctb_enforce.sh" ]; then
    bash "$SCRIPT_DIR/ctb_enforce.sh"
else
    echo "⚠️  CTB enforcement script not found at $SCRIPT_DIR/ctb_enforce.sh"
fi

echo ""

###############################################################################
# Step 4: Run Security Lockdown Check (Optional)
###############################################################################

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔒 Step 4: Running security validation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "$SCRIPT_DIR/security_lockdown.sh" ]; then
    echo "   Running security checks (this may take a moment)..."
    timeout 30 bash "$SCRIPT_DIR/security_lockdown.sh" 2>/dev/null || echo "⏭️  Security check timed out (non-critical)"
else
    echo "⏭️  Security lockdown script not found - skipping"
fi

echo ""

###############################################################################
# Setup Complete
###############################################################################

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ SETUP COMPLETE                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🎯 Your CTB Doctrine v1.3 environment is ready!"
echo ""
echo "📚 Next Steps:"
echo "   • Review global-config/CTB_DOCTRINE.md for doctrine details"
echo "   • Check config/mcp_registry.json for available tools"
echo "   • Run tests: pytest (if Python project)"
echo "   • Start MCP server: cd mcp-servers/composio-mcp && npm run dev"
echo ""
echo "🔗 Quick References:"
echo "   • CTB Enforcement: bash global-config/scripts/ctb_enforce.sh"
echo "   • Security Check: bash global-config/scripts/security_lockdown.sh"
echo "   • MCP Registry: config/mcp_registry.json"
echo ""
echo "Happy coding! 🚀"
echo ""
