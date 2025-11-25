#!/bin/bash
# validate-structure.sh
# Validates that repo follows Barton Doctrine CTB structure
# Run: ./scripts/validate-structure.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

echo "=========================================="
echo "  Barton Doctrine Structure Validator"
echo "=========================================="
echo ""

# Check IMO exists
echo -n "Checking IMO definition... "
if [ -f "docs/10-imo.md" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}MISSING${NC}"
    echo "  ERROR: docs/10-imo.md must exist before any code"
    ((ERRORS++))
fi

# Check CTB directories
echo ""
echo "Checking CTB layer directories..."
CTB_LAYERS=("system" "data" "app" "ai" "ui")
for layer in "${CTB_LAYERS[@]}"; do
    echo -n "  src/$layer... "
    if [ -d "src/$layer" ]; then
        echo -e "${GREEN}OK${NC}"
    else
        echo -e "${RED}MISSING${NC}"
        ((ERRORS++))
    fi
done

# Check CTB docs
echo ""
echo "Checking CTB layer documentation..."
for layer in "${CTB_LAYERS[@]}"; do
    echo -n "  docs/20-ctb-$layer.md... "
    if [ -f "docs/20-ctb-$layer.md" ]; then
        echo -e "${GREEN}OK${NC}"
    else
        echo -e "${RED}MISSING${NC}"
        ((ERRORS++))
    fi
done

# Check test directories
echo ""
echo "Checking test directories..."
for layer in "${CTB_LAYERS[@]}"; do
    echo -n "  tests/$layer... "
    if [ -d "tests/$layer" ]; then
        echo -e "${GREEN}OK${NC}"
    else
        echo -e "${YELLOW}MISSING${NC} (warning)"
        ((WARNINGS++))
    fi
done

# Check altitude docs
echo ""
echo "Checking altitude documentation..."
ALTITUDES=("40k-vision" "30k-category" "20k-logic" "10k-ui" "5k-ops")
for alt in "${ALTITUDES[@]}"; do
    echo -n "  docs/altitude/$alt.md... "
    if [ -f "docs/altitude/$alt.md" ]; then
        echo -e "${GREEN}OK${NC}"
    else
        echo -e "${RED}MISSING${NC}"
        ((ERRORS++))
    fi
done

# Check agents.json
echo ""
echo -n "Checking agents configuration... "
if [ -f "config/agents.json" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}MISSING${NC}"
    echo "  ERROR: config/agents.json must define agent-to-CTB mapping"
    ((ERRORS++))
fi

# Check MCP registry
echo ""
echo -n "Checking MCP registry... "
if [ -f "config/mcp_registry.json" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}MISSING${NC}"
    ((ERRORS++))
fi

# Check HEIR doctrine
echo ""
echo -n "Checking HEIR doctrine... "
if [ -f "heir.doctrine.yaml" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}MISSING${NC}"
    ((ERRORS++))
fi

# Check for files in wrong CTB layers
echo ""
echo "Checking CTB layer compliance..."

# Function to check if file belongs to correct layer
check_layer_compliance() {
    local file=$1
    local expected_layer=$2

    # Extract the layer from file path
    if [[ $file == src/* ]]; then
        actual_layer=$(echo "$file" | cut -d'/' -f2)
        if [[ "$actual_layer" != "$expected_layer" && " ${CTB_LAYERS[@]} " =~ " ${actual_layer} " ]]; then
            return 1
        fi
    fi
    return 0
}

# Check for common misplacements
MISPLACED=0

# Database clients should be in data layer
for file in $(find src -name "*neon*" -o -name "*firebase*" -o -name "*db*" -o -name "*client*" 2>/dev/null | grep -v "__pycache__" | head -20); do
    if [[ $file == src/* && ! $file == src/data/* ]]; then
        echo -e "  ${YELLOW}WARNING${NC}: $file might belong in src/data/"
        ((WARNINGS++))
    fi
done

# Auth/config should be in system layer
for file in $(find src -name "*auth*" -o -name "*config*" -o -name "*sidecar*" 2>/dev/null | grep -v "__pycache__" | head -20); do
    if [[ $file == src/* && ! $file == src/system/* ]]; then
        echo -e "  ${YELLOW}WARNING${NC}: $file might belong in src/system/"
        ((WARNINGS++))
    fi
done

# LLM/AI should be in ai layer
for file in $(find src -name "*llm*" -o -name "*prompt*" -o -name "*mcp*" -o -name "*agent*" 2>/dev/null | grep -v "__pycache__" | head -20); do
    if [[ $file == src/* && ! $file == src/ai/* ]]; then
        echo -e "  ${YELLOW}WARNING${NC}: $file might belong in src/ai/"
        ((WARNINGS++))
    fi
done

if [ $WARNINGS -eq 0 ] && [ $MISPLACED -eq 0 ]; then
    echo -e "  ${GREEN}No obvious layer violations${NC}"
fi

# Summary
echo ""
echo "=========================================="
echo "  Summary"
echo "=========================================="
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}Structure validation PASSED${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}$WARNINGS warning(s)${NC} - review recommended"
    fi
    exit 0
else
    echo -e "${RED}Structure validation FAILED${NC}"
    echo -e "${RED}$ERRORS error(s)${NC}, ${YELLOW}$WARNINGS warning(s)${NC}"
    echo ""
    echo "Fix errors before proceeding. Barton Doctrine rules:"
    echo "  - Never build CTB before IMO exists"
    echo "  - Never write code before CTB structure exists"
    echo "  - Never skip altitude docs"
    echo "  - Files stay in their CTB layer"
    exit 1
fi
