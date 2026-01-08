#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# DOCTRINE AUDIT MODE (READ-ONLY)
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Constitutional)
# Purpose: Validate repo structure against IMO_CONTROL.json
# Mode: READ-ONLY - No file moves or mutations
# Output: 90_ops/doctrine_audit.md + 90_ops/doctrine_audit.json
# ═══════════════════════════════════════════════════════════════════════════════

set -e

# ───────────────────────────────────────────────────────────────────
# CONFIGURATION
# ───────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="${1:-$(cd "$SCRIPT_DIR/.." && pwd)}"
REPO_NAME=$(basename "$REPO_ROOT")
BRANCH=$(git -C "$REPO_ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
OUTPUT_DIR="$REPO_ROOT/90_ops"

# Colors (disabled in CI)
if [ -t 1 ]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    CYAN='\033[0;36m'
    NC='\033[0m'
else
    RED=''
    GREEN=''
    YELLOW=''
    CYAN=''
    NC=''
fi

# Counters
VIOLATIONS=0
WARNINGS=0
CHECKS_PASSED=0

# Arrays for findings
declare -a VIOLATION_LIST
declare -a WARNING_LIST
declare -a PASSED_LIST

# ───────────────────────────────────────────────────────────────────
# HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────────

add_violation() {
    local type="$1"
    local location="$2"
    local rule="$3"
    local action="$4"
    VIOLATION_LIST+=("{\"severity\":\"violation\",\"type\":\"$type\",\"location\":\"$location\",\"rule\":\"$rule\",\"action\":\"$action\"}")
    ((VIOLATIONS++))
    echo -e "${RED}[VIOLATION]${NC} $type: $location"
    echo "            Rule: $rule"
    echo "            Action: $action"
}

add_warning() {
    local type="$1"
    local location="$2"
    local rule="$3"
    local action="$4"
    WARNING_LIST+=("{\"severity\":\"warning\",\"type\":\"$type\",\"location\":\"$location\",\"rule\":\"$rule\",\"action\":\"$action\"}")
    ((WARNINGS++))
    echo -e "${YELLOW}[WARNING]${NC} $type: $location"
    echo "          Rule: $rule"
    echo "          Action: $action"
}

add_passed() {
    local check="$1"
    PASSED_LIST+=("$check")
    ((CHECKS_PASSED++))
    echo -e "${GREEN}[PASSED]${NC} $check"
}

# ───────────────────────────────────────────────────────────────────
# BANNER
# ───────────────────────────────────────────────────────────────────

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  DOCTRINE AUDIT MODE (READ-ONLY)${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Repository: $REPO_NAME"
echo "Branch:     $BRANCH"
echo "Timestamp:  $TIMESTAMP"
echo "Path:       $REPO_ROOT"
echo ""
echo "───────────────────────────────────────────────────────────────"
echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK 0: IMO_CONTROL.json existence (GATE)
# ───────────────────────────────────────────────────────────────────

if [ ! -f "$REPO_ROOT/IMO_CONTROL.json" ]; then
    echo -e "${RED}[FATAL]${NC} IMO_CONTROL.json not found"
    echo "        Governance file missing. Cannot proceed with audit."
    echo ""

    # Create minimal output for CI
    mkdir -p "$OUTPUT_DIR"

    cat > "$OUTPUT_DIR/doctrine_audit.json" << EOF
{
  "meta": {
    "repo": "$REPO_NAME",
    "branch": "$BRANCH",
    "timestamp": "$TIMESTAMP",
    "audit_version": "1.0.0"
  },
  "status": "FATAL",
  "reason": "IMO_CONTROL.json not found - governance missing",
  "violations": 1,
  "warnings": 0,
  "passed": 0,
  "findings": [
    {
      "severity": "violation",
      "type": "GOVERNANCE_MISSING",
      "location": "IMO_CONTROL.json",
      "rule": "IMO_CONTROL.json must exist at repository root",
      "action": "Copy IMO_CONTROL.json from imo-creator"
    }
  ]
}
EOF

    cat > "$OUTPUT_DIR/doctrine_audit.md" << EOF
# Doctrine Audit Report

| Field | Value |
|-------|-------|
| Repository | $REPO_NAME |
| Branch | $BRANCH |
| Timestamp | $TIMESTAMP |
| Status | **FATAL** |

---

## Fatal Error

**IMO_CONTROL.json not found**

Governance file is missing. This repository cannot be audited without a control plane.

### Required Action

Copy \`IMO_CONTROL.json\` from imo-creator to repository root.

---

## Summary

| Category | Count |
|----------|-------|
| Violations | 1 |
| Warnings | 0 |
| Passed | 0 |

**Result: BLOCKED**
EOF

    echo "Output written to:"
    echo "  - $OUTPUT_DIR/doctrine_audit.md"
    echo "  - $OUTPUT_DIR/doctrine_audit.json"
    echo ""
    exit 1
fi

add_passed "IMO_CONTROL.json exists"

# ───────────────────────────────────────────────────────────────────
# CHECK 1: Forbidden folders in src/
# ───────────────────────────────────────────────────────────────────

echo ""
echo "Checking forbidden folders..."

FORBIDDEN_FOLDERS=("utils" "helpers" "common" "shared" "lib" "misc")

if [ -d "$REPO_ROOT/src" ]; then
    for folder in "${FORBIDDEN_FOLDERS[@]}"; do
        if [ -d "$REPO_ROOT/src/$folder" ]; then
            add_violation "CTB_VIOLATION" "src/$folder/" "No $folder folders allowed in CTB structure" "Move contents to src/{sys,data,app,ai,ui} or DELETE"
        fi
    done

    # Check if any forbidden folders were found
    FORBIDDEN_FOUND=false
    for folder in "${FORBIDDEN_FOLDERS[@]}"; do
        if [ -d "$REPO_ROOT/src/$folder" ]; then
            FORBIDDEN_FOUND=true
            break
        fi
    done

    if [ "$FORBIDDEN_FOUND" = false ]; then
        add_passed "No forbidden folders in src/"
    fi
else
    add_passed "No src/ directory (doctrine-only repo)"
fi

# ───────────────────────────────────────────────────────────────────
# CHECK 2: Loose files in src/ root
# ───────────────────────────────────────────────────────────────────

echo ""
echo "Checking for loose files in src/..."

if [ -d "$REPO_ROOT/src" ]; then
    LOOSE_FILES=$(find "$REPO_ROOT/src" -maxdepth 1 -type f -name "*.js" -o -name "*.ts" -o -name "*.py" -o -name "*.jsx" -o -name "*.tsx" 2>/dev/null | head -10)

    if [ -n "$LOOSE_FILES" ]; then
        while IFS= read -r file; do
            if [ -n "$file" ]; then
                rel_path="${file#$REPO_ROOT/}"
                add_violation "LOOSE_FILE_VIOLATION" "$rel_path" "No code files allowed in src/ root" "Move to appropriate CTB branch"
            fi
        done <<< "$LOOSE_FILES"
    else
        add_passed "No loose files in src/ root"
    fi
fi

# ───────────────────────────────────────────────────────────────────
# CHECK 3: CTB altitude structure
# ───────────────────────────────────────────────────────────────────

echo ""
echo "Checking CTB altitude structure..."

CTB_BRANCHES=("sys" "data" "app" "ai" "ui")

if [ -d "$REPO_ROOT/src" ]; then
    MISSING_BRANCHES=()

    for branch in "${CTB_BRANCHES[@]}"; do
        if [ ! -d "$REPO_ROOT/src/$branch" ]; then
            MISSING_BRANCHES+=("$branch")
        fi
    done

    if [ ${#MISSING_BRANCHES[@]} -gt 0 ]; then
        for branch in "${MISSING_BRANCHES[@]}"; do
            add_warning "CTB_INCOMPLETE" "src/$branch/" "CTB branch missing" "Create src/$branch/ directory"
        done
    else
        add_passed "All CTB branches present (sys, data, app, ai, ui)"
    fi
fi

# ───────────────────────────────────────────────────────────────────
# CHECK 4: Required hub files
# ───────────────────────────────────────────────────────────────────

echo ""
echo "Checking required hub files..."

# Skip these checks for imo-creator itself (sovereign)
if [ "$REPO_NAME" != "imo-creator" ]; then

    # REGISTRY.yaml
    if [ ! -f "$REPO_ROOT/REGISTRY.yaml" ]; then
        add_warning "ANCHOR_MISSING" "REGISTRY.yaml" "Hub declaration file required" "Create REGISTRY.yaml per REPO_REFACTOR_PROTOCOL.md"
    else
        add_passed "REGISTRY.yaml exists"
    fi

    # DOCTRINE.md
    if [ ! -f "$REPO_ROOT/DOCTRINE.md" ]; then
        add_warning "ANCHOR_MISSING" "DOCTRINE.md" "Doctrine reference file required" "Create DOCTRINE.md pointing to imo-creator"
    else
        add_passed "DOCTRINE.md exists"
    fi

    # README.md
    if [ ! -f "$REPO_ROOT/README.md" ]; then
        add_warning "ANCHOR_MISSING" "README.md" "Hub identity file required" "Create README.md with hub identity"
    else
        add_passed "README.md exists"
    fi

else
    add_passed "Sovereign repo - hub file checks skipped"
fi

# ───────────────────────────────────────────────────────────────────
# CHECK 5: Optional maturity artifacts
# ───────────────────────────────────────────────────────────────────

echo ""
echo "Checking maturity artifacts..."

if [ "$REPO_NAME" != "imo-creator" ]; then
    # CHECKLIST.md
    if [ ! -f "$REPO_ROOT/CHECKLIST.md" ]; then
        add_warning "MATURITY_ARTIFACT" "CHECKLIST.md" "Acceptance gate checklist recommended" "Create CHECKLIST.md for compliance tracking"
    else
        add_passed "CHECKLIST.md exists"
    fi

    # AGENT_CONTEXT.yaml
    if [ ! -f "$REPO_ROOT/AGENT_CONTEXT.yaml" ]; then
        add_warning "MATURITY_ARTIFACT" "AGENT_CONTEXT.yaml" "Agent context file recommended" "Create AGENT_CONTEXT.yaml for Claude Code"
    else
        add_passed "AGENT_CONTEXT.yaml exists"
    fi
fi

# ───────────────────────────────────────────────────────────────────
# CHECK 6: Descent gate compliance (if src/ exists)
# ───────────────────────────────────────────────────────────────────

echo ""
echo "Checking descent gate compliance..."

if [ -d "$REPO_ROOT/src" ]; then
    # Check for PRD (CC-02 gate)
    if [ ! -f "$REPO_ROOT/docs/PRD.md" ] && [ ! -f "$REPO_ROOT/PRD.md" ]; then
        add_warning "DESCENT_GATE" "PRD.md" "CC-02 gate: PRD required before code" "Create docs/PRD.md"
    else
        add_passed "PRD exists (CC-02 gate)"
    fi

    # Check for at least one ADR if code exists (CC-03 gate)
    ADR_COUNT=$(find "$REPO_ROOT" -name "ADR*.md" -o -name "ADR-*.md" 2>/dev/null | wc -l)
    if [ "$ADR_COUNT" -eq 0 ]; then
        add_warning "DESCENT_GATE" "ADR-*.md" "CC-03 gate: ADR required for decisions" "Create docs/ADR-001-*.md"
    else
        add_passed "ADR(s) exist (CC-03 gate)"
    fi
fi

# ───────────────────────────────────────────────────────────────────
# CHECK 7: UI structure (if ui/ exists)
# ───────────────────────────────────────────────────────────────────

echo ""
echo "Checking UI structure..."

if [ -d "$REPO_ROOT/src/ui" ]; then
    # Check for ui.manifest.json
    if [ ! -f "$REPO_ROOT/src/ui/ui.manifest.json" ]; then
        add_warning "UI_STRUCTURE" "src/ui/ui.manifest.json" "UI manifest recommended for Lovable.dev" "Create ui.manifest.json"
    else
        add_passed "ui.manifest.json exists"
    fi

    # Check UI subfolders
    UI_FOLDERS=("pages" "components" "layouts" "styles" "assets")
    UI_MISSING=()

    for folder in "${UI_FOLDERS[@]}"; do
        if [ ! -d "$REPO_ROOT/src/ui/$folder" ]; then
            UI_MISSING+=("$folder")
        fi
    done

    if [ ${#UI_MISSING[@]} -gt 0 ]; then
        for folder in "${UI_MISSING[@]}"; do
            add_warning "UI_STRUCTURE" "src/ui/$folder/" "UI subfolder missing" "Create src/ui/$folder/"
        done
    else
        add_passed "All UI subfolders present"
    fi
else
    add_passed "No src/ui/ directory (no UI audit needed)"
fi

# ───────────────────────────────────────────────────────────────────
# GENERATE OUTPUT
# ───────────────────────────────────────────────────────────────────

echo ""
echo "───────────────────────────────────────────────────────────────"
echo ""

# Determine status
if [ $VIOLATIONS -gt 0 ]; then
    STATUS="FAILED"
    STATUS_COLOR="${RED}"
elif [ $WARNINGS -gt 0 ]; then
    STATUS="PASSED_WITH_WARNINGS"
    STATUS_COLOR="${YELLOW}"
else
    STATUS="PASSED"
    STATUS_COLOR="${GREEN}"
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# ───────────────────────────────────────────────────────────────────
# GENERATE JSON OUTPUT
# ───────────────────────────────────────────────────────────────────

# Build findings array
FINDINGS_JSON="["
FIRST=true

for v in "${VIOLATION_LIST[@]}"; do
    if [ "$FIRST" = true ]; then
        FIRST=false
    else
        FINDINGS_JSON+=","
    fi
    FINDINGS_JSON+="$v"
done

for w in "${WARNING_LIST[@]}"; do
    if [ "$FIRST" = true ]; then
        FIRST=false
    else
        FINDINGS_JSON+=","
    fi
    FINDINGS_JSON+="$w"
done

FINDINGS_JSON+="]"

cat > "$OUTPUT_DIR/doctrine_audit.json" << EOF
{
  "meta": {
    "repo": "$REPO_NAME",
    "branch": "$BRANCH",
    "timestamp": "$TIMESTAMP",
    "audit_version": "1.0.0",
    "control_plane": "IMO_CONTROL.json"
  },
  "status": "$STATUS",
  "summary": {
    "violations": $VIOLATIONS,
    "warnings": $WARNINGS,
    "passed": $CHECKS_PASSED
  },
  "findings": $FINDINGS_JSON
}
EOF

# ───────────────────────────────────────────────────────────────────
# GENERATE MARKDOWN OUTPUT
# ───────────────────────────────────────────────────────────────────

cat > "$OUTPUT_DIR/doctrine_audit.md" << EOF
# Doctrine Audit Report

| Field | Value |
|-------|-------|
| Repository | $REPO_NAME |
| Branch | $BRANCH |
| Timestamp | $TIMESTAMP |
| Control Plane | IMO_CONTROL.json |
| Status | **$STATUS** |

---

## Summary

| Category | Count |
|----------|-------|
| Violations | $VIOLATIONS |
| Warnings | $WARNINGS |
| Passed | $CHECKS_PASSED |

---

EOF

if [ $VIOLATIONS -gt 0 ]; then
    echo "## Violations (BLOCKING)" >> "$OUTPUT_DIR/doctrine_audit.md"
    echo "" >> "$OUTPUT_DIR/doctrine_audit.md"
    echo "These must be fixed before proceeding:" >> "$OUTPUT_DIR/doctrine_audit.md"
    echo "" >> "$OUTPUT_DIR/doctrine_audit.md"

    for v in "${VIOLATION_LIST[@]}"; do
        type=$(echo "$v" | grep -o '"type":"[^"]*"' | cut -d'"' -f4)
        location=$(echo "$v" | grep -o '"location":"[^"]*"' | cut -d'"' -f4)
        rule=$(echo "$v" | grep -o '"rule":"[^"]*"' | cut -d'"' -f4)
        action=$(echo "$v" | grep -o '"action":"[^"]*"' | cut -d'"' -f4)

        echo "### $type" >> "$OUTPUT_DIR/doctrine_audit.md"
        echo "" >> "$OUTPUT_DIR/doctrine_audit.md"
        echo "- **Location:** \`$location\`" >> "$OUTPUT_DIR/doctrine_audit.md"
        echo "- **Rule:** $rule" >> "$OUTPUT_DIR/doctrine_audit.md"
        echo "- **Action:** $action" >> "$OUTPUT_DIR/doctrine_audit.md"
        echo "" >> "$OUTPUT_DIR/doctrine_audit.md"
    done
fi

if [ $WARNINGS -gt 0 ]; then
    echo "## Warnings" >> "$OUTPUT_DIR/doctrine_audit.md"
    echo "" >> "$OUTPUT_DIR/doctrine_audit.md"
    echo "These should be addressed when possible:" >> "$OUTPUT_DIR/doctrine_audit.md"
    echo "" >> "$OUTPUT_DIR/doctrine_audit.md"

    for w in "${WARNING_LIST[@]}"; do
        type=$(echo "$w" | grep -o '"type":"[^"]*"' | cut -d'"' -f4)
        location=$(echo "$w" | grep -o '"location":"[^"]*"' | cut -d'"' -f4)
        rule=$(echo "$w" | grep -o '"rule":"[^"]*"' | cut -d'"' -f4)
        action=$(echo "$w" | grep -o '"action":"[^"]*"' | cut -d'"' -f4)

        echo "- **$type** (\`$location\`): $rule → $action" >> "$OUTPUT_DIR/doctrine_audit.md"
    done
    echo "" >> "$OUTPUT_DIR/doctrine_audit.md"
fi

if [ $CHECKS_PASSED -gt 0 ]; then
    echo "## Passed Checks" >> "$OUTPUT_DIR/doctrine_audit.md"
    echo "" >> "$OUTPUT_DIR/doctrine_audit.md"

    for p in "${PASSED_LIST[@]}"; do
        echo "- $p" >> "$OUTPUT_DIR/doctrine_audit.md"
    done
    echo "" >> "$OUTPUT_DIR/doctrine_audit.md"
fi

echo "---" >> "$OUTPUT_DIR/doctrine_audit.md"
echo "" >> "$OUTPUT_DIR/doctrine_audit.md"
echo "*Generated by doctrine audit mode v1.0.0*" >> "$OUTPUT_DIR/doctrine_audit.md"

# ───────────────────────────────────────────────────────────────────
# FINAL OUTPUT
# ───────────────────────────────────────────────────────────────────

echo -e "${STATUS_COLOR}STATUS: $STATUS${NC}"
echo ""
echo "Violations: $VIOLATIONS"
echo "Warnings:   $WARNINGS"
echo "Passed:     $CHECKS_PASSED"
echo ""
echo "Output written to:"
echo "  - $OUTPUT_DIR/doctrine_audit.md"
echo "  - $OUTPUT_DIR/doctrine_audit.json"
echo ""

# Exit with appropriate code
if [ $VIOLATIONS -gt 0 ]; then
    exit 1
else
    exit 0
fi
