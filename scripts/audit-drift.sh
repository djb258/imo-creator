#!/bin/bash
# audit-drift.sh
# Audits repo for doctrine drift from Barton Doctrine standards
# Run weekly: ./scripts/audit-drift.sh
# Add to cron: 0 2 * * 0 /path/to/scripts/audit-drift.sh >> /var/log/doctrine-audit.log 2>&1

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

AUDIT_DATE=$(date +"%Y-%m-%d %H:%M:%S")
AUDIT_FILE="audit_results/doctrine-audit-$(date +%Y%m%d).json"

echo "=========================================="
echo "  Barton Doctrine Drift Audit"
echo "  $AUDIT_DATE"
echo "=========================================="
echo ""

# Initialize audit results
mkdir -p audit_results

cat > "$AUDIT_FILE" << EOF
{
  "audit_date": "$AUDIT_DATE",
  "repo": "$(basename $(pwd))",
  "findings": [],
  "metrics": {}
}
EOF

FINDINGS=()
DRIFT_SCORE=0

# 1. Check IMO freshness
echo -e "${BLUE}[1/7]${NC} Checking IMO freshness..."
if [ -f "docs/10-imo.md" ]; then
    IMO_AGE=$(( ($(date +%s) - $(stat -c %Y docs/10-imo.md 2>/dev/null || stat -f %m docs/10-imo.md)) / 86400 ))
    if [ $IMO_AGE -gt 90 ]; then
        echo -e "  ${YELLOW}WARNING${NC}: IMO is $IMO_AGE days old (recommend review every 90 days)"
        FINDINGS+=("IMO document is $IMO_AGE days old")
        ((DRIFT_SCORE+=10))
    else
        echo -e "  ${GREEN}OK${NC}: IMO is $IMO_AGE days old"
    fi
else
    echo -e "  ${RED}ERROR${NC}: IMO missing!"
    FINDINGS+=("IMO document missing")
    ((DRIFT_SCORE+=50))
fi

# 2. Check altitude doc completeness
echo -e "${BLUE}[2/7]${NC} Checking altitude documentation..."
ALTITUDE_COMPLETE=0
ALTITUDE_TOTAL=5
for alt in "40k-vision" "30k-category" "20k-logic" "10k-ui" "5k-ops"; do
    if [ -f "docs/altitude/$alt.md" ]; then
        # Check if file has content (more than 10 lines)
        LINES=$(wc -l < "docs/altitude/$alt.md")
        if [ $LINES -gt 10 ]; then
            ((ALTITUDE_COMPLETE++))
        else
            echo -e "  ${YELLOW}WARNING${NC}: $alt.md is sparse ($LINES lines)"
            FINDINGS+=("Altitude doc $alt.md needs content")
            ((DRIFT_SCORE+=5))
        fi
    else
        echo -e "  ${RED}MISSING${NC}: $alt.md"
        FINDINGS+=("Altitude doc $alt.md missing")
        ((DRIFT_SCORE+=15))
    fi
done
echo -e "  Altitude completeness: $ALTITUDE_COMPLETE/$ALTITUDE_TOTAL"

# 3. Check CTB layer isolation
echo -e "${BLUE}[3/7]${NC} Checking CTB layer isolation..."
ISOLATION_VIOLATIONS=0

# Check for cross-layer imports (Python)
for layer in system data app ai ui; do
    if [ -d "src/$layer" ]; then
        # Look for imports from sibling layers that violate hierarchy
        VIOLATIONS=$(grep -r "from src\." "src/$layer" 2>/dev/null | grep -v "__pycache__" | wc -l || echo 0)
        if [ "$VIOLATIONS" -gt 0 ]; then
            echo -e "  ${YELLOW}WARNING${NC}: $layer has $VIOLATIONS cross-layer imports"
            FINDINGS+=("CTB layer $layer has $VIOLATIONS potential cross-layer imports")
            ((ISOLATION_VIOLATIONS+=VIOLATIONS))
        fi
    fi
done

if [ $ISOLATION_VIOLATIONS -eq 0 ]; then
    echo -e "  ${GREEN}OK${NC}: No obvious isolation violations"
else
    ((DRIFT_SCORE+=ISOLATION_VIOLATIONS*2))
fi

# 4. Check agents.json sync with actual code
echo -e "${BLUE}[4/7]${NC} Checking agent-code alignment..."
if [ -f "config/agents.json" ]; then
    # Count agents defined
    AGENTS_DEFINED=$(grep -c '"id":' config/agents.json || echo 0)
    echo -e "  Agents defined: $AGENTS_DEFINED"

    # Check if agent tools exist
    MISSING_TOOLS=0
    for tool in "heir.check" "sidecar.event" "intake.mapping.validate"; do
        if ! grep -rq "$tool" src/ 2>/dev/null; then
            echo -e "  ${YELLOW}WARNING${NC}: Tool '$tool' referenced but not found in src/"
            FINDINGS+=("Agent tool '$tool' not implemented")
            ((MISSING_TOOLS++))
        fi
    done

    if [ $MISSING_TOOLS -gt 0 ]; then
        ((DRIFT_SCORE+=MISSING_TOOLS*10))
    else
        echo -e "  ${GREEN}OK${NC}: Agent tools aligned"
    fi
else
    echo -e "  ${RED}ERROR${NC}: agents.json missing"
    ((DRIFT_SCORE+=30))
fi

# 5. Check kill switch coverage
echo -e "${BLUE}[5/7]${NC} Checking kill switch coverage..."
# Look for try/except or error handling patterns
ERROR_HANDLERS=$(grep -r "try:" src/ 2>/dev/null | grep -v "__pycache__" | wc -l || echo 0)
TOTAL_FUNCTIONS=$(grep -r "def " src/ 2>/dev/null | grep -v "__pycache__" | wc -l || echo 0)

if [ $TOTAL_FUNCTIONS -gt 0 ]; then
    COVERAGE=$(( (ERROR_HANDLERS * 100) / TOTAL_FUNCTIONS ))
    echo -e "  Error handling coverage: ~$COVERAGE%"
    if [ $COVERAGE -lt 30 ]; then
        echo -e "  ${YELLOW}WARNING${NC}: Low error handling coverage"
        FINDINGS+=("Error handling coverage is low ($COVERAGE%)")
        ((DRIFT_SCORE+=15))
    fi
else
    echo -e "  ${GREEN}OK${NC}: No functions to check (or non-Python codebase)"
fi

# 6. Check test coverage alignment
echo -e "${BLUE}[6/7]${NC} Checking test structure..."
TEST_ALIGNMENT=0
for layer in system data app ai ui; do
    SRC_FILES=$(find "src/$layer" -name "*.py" 2>/dev/null | grep -v "__pycache__" | wc -l || echo 0)
    TEST_FILES=$(find "tests/$layer" -name "*.py" 2>/dev/null | grep -v "__pycache__" | wc -l || echo 0)

    if [ $SRC_FILES -gt 0 ] && [ $TEST_FILES -eq 0 ]; then
        echo -e "  ${YELLOW}WARNING${NC}: $layer has $SRC_FILES source files but no tests"
        FINDINGS+=("CTB layer $layer has no tests")
        ((DRIFT_SCORE+=10))
    fi
done
echo -e "  ${GREEN}OK${NC}: Test structure check complete"

# 7. Check HEIR compliance
echo -e "${BLUE}[7/7]${NC} Checking HEIR compliance..."
if [ -f "heir.doctrine.yaml" ]; then
    # Check if heir checks are in CI
    if [ -f ".github/workflows/"* ] 2>/dev/null; then
        if grep -rq "heir" .github/workflows/ 2>/dev/null; then
            echo -e "  ${GREEN}OK${NC}: HEIR checks in CI"
        else
            echo -e "  ${YELLOW}WARNING${NC}: HEIR checks not found in CI workflows"
            FINDINGS+=("HEIR checks not in CI")
            ((DRIFT_SCORE+=10))
        fi
    fi
else
    echo -e "  ${RED}ERROR${NC}: heir.doctrine.yaml missing"
    FINDINGS+=("HEIR doctrine file missing")
    ((DRIFT_SCORE+=25))
fi

# Calculate final score
echo ""
echo "=========================================="
echo "  Audit Summary"
echo "=========================================="
echo ""

HEALTH_SCORE=$((100 - DRIFT_SCORE))
if [ $HEALTH_SCORE -lt 0 ]; then
    HEALTH_SCORE=0
fi

if [ $HEALTH_SCORE -ge 90 ]; then
    GRADE="A"
    COLOR=$GREEN
elif [ $HEALTH_SCORE -ge 80 ]; then
    GRADE="B"
    COLOR=$GREEN
elif [ $HEALTH_SCORE -ge 70 ]; then
    GRADE="C"
    COLOR=$YELLOW
elif [ $HEALTH_SCORE -ge 60 ]; then
    GRADE="D"
    COLOR=$YELLOW
else
    GRADE="F"
    COLOR=$RED
fi

echo -e "Doctrine Health Score: ${COLOR}$HEALTH_SCORE/100 ($GRADE)${NC}"
echo ""
echo "Findings: ${#FINDINGS[@]}"
for finding in "${FINDINGS[@]}"; do
    echo "  - $finding"
done

# Update JSON audit file
cat > "$AUDIT_FILE" << EOF
{
  "audit_date": "$AUDIT_DATE",
  "repo": "$(basename $(pwd))",
  "health_score": $HEALTH_SCORE,
  "grade": "$GRADE",
  "drift_score": $DRIFT_SCORE,
  "findings_count": ${#FINDINGS[@]},
  "findings": [
$(printf '    "%s",\n' "${FINDINGS[@]}" | sed '$ s/,$//')
  ],
  "metrics": {
    "altitude_completeness": "$ALTITUDE_COMPLETE/$ALTITUDE_TOTAL",
    "isolation_violations": $ISOLATION_VIOLATIONS,
    "error_handling_coverage": "$COVERAGE%"
  }
}
EOF

echo ""
echo "Audit results saved to: $AUDIT_FILE"
echo ""

# Exit with appropriate code
if [ $HEALTH_SCORE -lt 60 ]; then
    echo -e "${RED}FAIL${NC}: Doctrine drift too high. Review findings and remediate."
    exit 1
else
    echo -e "${GREEN}PASS${NC}: Doctrine compliance acceptable."
    exit 0
fi
