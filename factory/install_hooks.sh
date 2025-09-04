#!/bin/bash
# Install CTB generator hooks for Garage-MCP and IMO-Creator factory
# This script sets up automatic CTB seeding for all repo operations

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🔧 Installing CTB generator hooks..."

# Create hooks directory structure
mkdir -p "$REPO_ROOT/hooks/garage-mcp"
mkdir -p "$REPO_ROOT/hooks/imo-factory" 
mkdir -p "$REPO_ROOT/hooks/git"

# Install Garage-MCP hooks
echo "📁 Installing Garage-MCP hooks..."

cat > "$REPO_ROOT/hooks/garage-mcp/pre-process.sh" << 'EOF'
#!/bin/bash
# Garage-MCP pre-process hook: Seed CTB if needed
REPO_PATH="$1"
FACTORY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/factory"

echo "[GARAGE-MCP] Pre-processing CTB for: $(basename "$REPO_PATH")"

if [ ! -f "$REPO_PATH/tools/generate_ctb.py" ]; then
    echo "[GARAGE-MCP] Seeding CTB generator..."
    python3 "$FACTORY_DIR/auto_seed_ctb.py" "$REPO_PATH" \
        --project-name "$(basename "$REPO_PATH" | sed 's/-/ /g' | sed 's/\b\w/\U&/g')"
else
    echo "[GARAGE-MCP] CTB generator already present"
fi
EOF

cat > "$REPO_ROOT/hooks/garage-mcp/post-process.sh" << 'EOF'
#!/bin/bash
# Garage-MCP post-process hook: Regenerate CTB docs
REPO_PATH="$1"

echo "[GARAGE-MCP] Post-processing CTB for: $(basename "$REPO_PATH")"

if [ -f "$REPO_PATH/tools/generate_ctb.py" ] && [ -f "$REPO_PATH/spec/process_map.yaml" ]; then
    echo "[GARAGE-MCP] Regenerating CTB docs..."
    cd "$REPO_PATH"
    python3 tools/generate_ctb.py spec/process_map.yaml
    
    # Update ui-build
    mkdir -p ui-build
    for file in docs/ctb_horiz.md docs/catalog.md docs/flows.md docs/altitude/30k.md; do
        if [ -f "$file" ]; then
            cp "$file" "ui-build/$(basename "$file")"
        fi
    done
    
    echo "[GARAGE-MCP] ✓ CTB docs updated"
else
    echo "[GARAGE-MCP] No CTB generator found"
fi
EOF

# Install IMO-Factory hooks
echo "🏭 Installing IMO-Factory hooks..."

cat > "$REPO_ROOT/hooks/imo-factory/new-project.sh" << 'EOF'
#!/bin/bash
# IMO-Factory new project hook: Auto-seed CTB
PROJECT_PATH="$1" 
PROJECT_NAME="$2"
PROJECT_TYPE="$3"

FACTORY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/factory"

echo "[IMO-FACTORY] Setting up CTB for new project: $PROJECT_NAME"

# Seed with project-specific customization
python3 "$FACTORY_DIR/auto_seed_ctb.py" "$PROJECT_PATH" \
    --project-name "$PROJECT_NAME" \
    --owner "IMO-Factory"

# Generate initial docs
cd "$PROJECT_PATH"
if [ -f "tools/generate_ctb.py" ]; then
    python3 tools/generate_ctb.py spec/process_map.json
    echo "[IMO-FACTORY] ✓ Initial CTB docs generated"
fi

echo "[IMO-FACTORY] ✓ CTB integration complete for $PROJECT_NAME"
EOF

# Install Git hooks for development
echo "📝 Installing Git hooks..."

cat > "$REPO_ROOT/hooks/git/pre-commit-ctb" << 'EOF'
#!/bin/bash
# Git pre-commit hook: Regenerate CTB if spec changed
REPO_ROOT="$(git rev-parse --show-toplevel)"

# Check if spec files changed
if git diff --cached --name-only | grep -E "spec/process_map\.(yaml|json)$|tools/generate_ctb\.py$" > /dev/null; then
    echo "[GIT] CTB spec changed, regenerating docs..."
    
    if [ -f "$REPO_ROOT/tools/generate_ctb.py" ]; then
        cd "$REPO_ROOT"
        python3 tools/generate_ctb.py spec/process_map.yaml 2>/dev/null || \
        python3 tools/generate_ctb.py spec/process_map.json
        
        # Stage the updated docs
        git add docs/ ui-build/ 2>/dev/null || true
        echo "[GIT] ✓ CTB docs regenerated and staged"
    fi
fi
EOF

# Make all hooks executable
chmod +x "$REPO_ROOT/hooks/garage-mcp/"*.sh
chmod +x "$REPO_ROOT/hooks/imo-factory/"*.sh  
chmod +x "$REPO_ROOT/hooks/git/"*

# Create hook registry
cat > "$REPO_ROOT/hooks/REGISTRY.md" << 'EOF'
# CTB Generator Hook Registry

This directory contains hooks for automatic CTB generator integration.

## Garage-MCP Hooks

### `garage-mcp/pre-process.sh`
- **When**: Before Garage-MCP processes a repository
- **What**: Seeds CTB generator if not present
- **Usage**: `./hooks/garage-mcp/pre-process.sh /path/to/repo`

### `garage-mcp/post-process.sh`  
- **When**: After Garage-MCP finishes processing
- **What**: Regenerates CTB docs and ui-build folder
- **Usage**: `./hooks/garage-mcp/post-process.sh /path/to/repo`

## IMO-Factory Hooks

### `imo-factory/new-project.sh`
- **When**: Creating new project via IMO-Factory
- **What**: Seeds CTB with project-specific customization
- **Usage**: `./hooks/imo-factory/new-project.sh /path/to/project "Project Name" "project-type"`

## Git Hooks

### `git/pre-commit-ctb`
- **When**: Before committing changes
- **What**: Regenerates CTB docs if spec changed
- **Install**: `ln -s ../../hooks/git/pre-commit-ctb .git/hooks/pre-commit`

## Usage in Scripts

```bash
# For Garage-MCP integration
source hooks/garage-mcp/pre-process.sh "/path/to/repo"
source hooks/garage-mcp/post-process.sh "/path/to/repo"

# For IMO-Factory integration  
source hooks/imo-factory/new-project.sh "/path/to/project" "My App" "nodejs"

# For Git integration (install once)
ln -s ../../hooks/git/pre-commit-ctb .git/hooks/pre-commit
```

## Integration Points

- **Garage-MCP**: Call hooks during repo processing
- **IMO-Factory**: Call hooks during project creation
- **Git**: Optional auto-regeneration on commits
- **CI/CD**: GitHub Actions already handles this
EOF

# Create installation status
cat > "$REPO_ROOT/hooks/.installed" << EOF
Installation completed: $(date)
Hooks directory: $REPO_ROOT/hooks
Version: 1.0.0

Installed hooks:
✓ garage-mcp/pre-process.sh
✓ garage-mcp/post-process.sh  
✓ imo-factory/new-project.sh
✓ git/pre-commit-ctb

Integration scripts:
✓ factory/auto_seed_ctb.py
✓ factory/garage_mcp_integration.py
EOF

echo "✅ CTB generator hooks installed successfully!"
echo ""
echo "📋 Summary:"
echo "   • Garage-MCP hooks: hooks/garage-mcp/"
echo "   • IMO-Factory hooks: hooks/imo-factory/" 
echo "   • Git hooks: hooks/git/"
echo "   • Registry: hooks/REGISTRY.md"
echo ""
echo "🔗 Integration:"
echo "   • Garage-MCP: Call hooks during repo processing"
echo "   • IMO-Factory: Call hooks during project creation"
echo "   • Git: Install pre-commit hook if desired"
echo ""
echo "🎯 Result:"
echo "   Every repo touched by Garage-MCP or IMO-Factory will"
echo "   automatically get CTB generator and ui-build folder!"