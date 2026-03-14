#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# DOCTRINE AUDIT MODE (READ-ONLY)
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Constitutional)
# Purpose: Validate repo structure against IMO_CONTROL.json
# Mode: READ-ONLY - No file moves or mutations
# Output: 90_ops/doctrine_audit.md + 90_ops/doctrine_audit.json
# ═══════════════════════════════════════════════════════════════════════════════

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

# Findings (stored as temp files for portability)
TEMP_DIR=$(mktemp -d)
VIOLATIONS_FILE="$TEMP_DIR/violations.json"
WARNINGS_FILE="$TEMP_DIR/warnings.json"
PASSED_FILE="$TEMP_DIR/passed.txt"

echo "[]" > "$VIOLATIONS_FILE"
echo "[]" > "$WARNINGS_FILE"
echo "" > "$PASSED_FILE"

# ───────────────────────────────────────────────────────────────────
# HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────────

add_violation() {
    local type="$1"
    local location="$2"
    local rule="$3"
    local action="$4"

    # Append to JSON array
    local content=$(cat "$VIOLATIONS_FILE")
    if [ "$content" = "[]" ]; then
        echo "[{\"severity\":\"violation\",\"type\":\"$type\",\"location\":\"$location\",\"rule\":\"$rule\",\"action\":\"$action\"}]" > "$VIOLATIONS_FILE"
    else
        # Remove trailing ] and add new entry
        echo "${content%]},{\"severity\":\"violation\",\"type\":\"$type\",\"location\":\"$location\",\"rule\":\"$rule\",\"action\":\"$action\"}]" > "$VIOLATIONS_FILE"
    fi

    VIOLATIONS=$((VIOLATIONS + 1))
    echo -e "${RED}[VIOLATION]${NC} $type: $location"
    echo "            Rule: $rule"
    echo "            Action: $action"
}

add_warning() {
    local type="$1"
    local location="$2"
    local rule="$3"
    local action="$4"

    local content=$(cat "$WARNINGS_FILE")
    if [ "$content" = "[]" ]; then
        echo "[{\"severity\":\"warning\",\"type\":\"$type\",\"location\":\"$location\",\"rule\":\"$rule\",\"action\":\"$action\"}]" > "$WARNINGS_FILE"
    else
        echo "${content%]},{\"severity\":\"warning\",\"type\":\"$type\",\"location\":\"$location\",\"rule\":\"$rule\",\"action\":\"$action\"}]" > "$WARNINGS_FILE"
    fi

    WARNINGS=$((WARNINGS + 1))
    echo -e "${YELLOW}[WARNING]${NC} $type: $location"
    echo "          Rule: $rule"
    echo "          Action: $action"
}

add_passed() {
    local check="$1"
    echo "$check" >> "$PASSED_FILE"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
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
  "summary": {
    "violations": 1,
    "warnings": 0,
    "passed": 0
  },
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
    rm -rf "$TEMP_DIR"
    exit 1
fi

add_passed "IMO_CONTROL.json exists"

# ───────────────────────────────────────────────────────────────────
# CHECK 1: Forbidden folders in src/
# ───────────────────────────────────────────────────────────────────

echo ""
echo "Checking forbidden folders..."

if [ -d "$REPO_ROOT/src" ]; then
    FORBIDDEN_FOUND=false

    for folder in utils helpers common shared lib misc; do
        if [ -d "$REPO_ROOT/src/$folder" ]; then
            add_violation "CTB_VIOLATION" "src/$folder/" "No $folder folders allowed in CTB structure" "Move contents to src/{sys,data,app,ai,ui} or DELETE"
            FORBIDDEN_FOUND=true
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
    LOOSE_FOUND=false

    for ext in js ts py jsx tsx; do
        for file in "$REPO_ROOT/src"/*.$ext; do
            if [ -f "$file" ]; then
                rel_path="${file#$REPO_ROOT/}"
                add_violation "LOOSE_FILE_VIOLATION" "$rel_path" "No code files allowed in src/ root" "Move to appropriate CTB branch"
                LOOSE_FOUND=true
            fi
        done
    done

    if [ "$LOOSE_FOUND" = false ]; then
        add_passed "No loose files in src/ root"
    fi
fi

# ───────────────────────────────────────────────────────────────────
# CHECK 3: CTB altitude structure
# ───────────────────────────────────────────────────────────────────

echo ""
echo "Checking CTB altitude structure..."

if [ -d "$REPO_ROOT/src" ]; then
    MISSING_FOUND=false

    for branch in sys data app ai ui; do
        if [ ! -d "$REPO_ROOT/src/$branch" ]; then
            add_warning "CTB_INCOMPLETE" "src/$branch/" "CTB branch missing" "Create src/$branch/ directory"
            MISSING_FOUND=true
        fi
    done

    if [ "$MISSING_FOUND" = false ]; then
        add_passed "All CTB branches present (sys, data, app, ai, ui)"
    fi
fi

# ───────────────────────────────────────────────────────────────────
# CHECK 4: Required hub files (skip for imo-creator)
# ───────────────────────────────────────────────────────────────────

echo ""
echo "Checking required hub files..."

if [ "$REPO_NAME" != "imo-creator" ]; then
    if [ ! -f "$REPO_ROOT/REGISTRY.yaml" ]; then
        add_warning "ANCHOR_MISSING" "REGISTRY.yaml" "Hub declaration file required" "Create REGISTRY.yaml per REPO_REFACTOR_PROTOCOL.md"
    else
        add_passed "REGISTRY.yaml exists"
    fi

    if [ ! -f "$REPO_ROOT/DOCTRINE.md" ]; then
        add_warning "ANCHOR_MISSING" "DOCTRINE.md" "Doctrine reference file required" "Create DOCTRINE.md pointing to imo-creator"
    else
        add_passed "DOCTRINE.md exists"
    fi

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
    if [ ! -f "$REPO_ROOT/CHECKLIST.md" ]; then
        add_warning "MATURITY_ARTIFACT" "CHECKLIST.md" "Acceptance gate checklist recommended" "Create CHECKLIST.md for compliance tracking"
    else
        add_passed "CHECKLIST.md exists"
    fi

    if [ ! -f "$REPO_ROOT/AGENT_CONTEXT.yaml" ]; then
        add_warning "MATURITY_ARTIFACT" "AGENT_CONTEXT.yaml" "Agent context file recommended" "Create AGENT_CONTEXT.yaml for Claude Code"
    else
        add_passed "AGENT_CONTEXT.yaml exists"
    fi
fi

# ───────────────────────────────────────────────────────────────────
# CHECK 6: Descent gate compliance
# ───────────────────────────────────────────────────────────────────

echo ""
echo "Checking descent gate compliance..."

if [ -d "$REPO_ROOT/src" ]; then
    if [ ! -f "$REPO_ROOT/docs/PRD.md" ] && [ ! -f "$REPO_ROOT/PRD.md" ]; then
        add_warning "DESCENT_GATE" "PRD.md" "CC-02 gate: PRD required before code" "Create docs/PRD.md"
    else
        add_passed "PRD exists (CC-02 gate)"
    fi

    ADR_COUNT=$(find "$REPO_ROOT" -name "ADR*.md" -o -name "ADR-*.md" 2>/dev/null | wc -l)
    if [ "$ADR_COUNT" -eq 0 ]; then
        add_warning "DESCENT_GATE" "ADR-*.md" "CC-03 gate: ADR required for decisions" "Create docs/ADR-001-*.md"
    else
        add_passed "ADR(s) exist (CC-03 gate)"
    fi
fi

# ───────────────────────────────────────────────────────────────────
# CHECK 7: UI structure
# ───────────────────────────────────────────────────────────────────

echo ""
echo "Checking UI structure..."

if [ -d "$REPO_ROOT/src/ui" ]; then
    if [ ! -f "$REPO_ROOT/src/ui/ui.manifest.json" ]; then
        add_warning "UI_STRUCTURE" "src/ui/ui.manifest.json" "UI manifest recommended for Lovable.dev" "Create ui.manifest.json"
    else
        add_passed "ui.manifest.json exists"
    fi

    UI_MISSING=false
    for folder in pages components layouts styles assets; do
        if [ ! -d "$REPO_ROOT/src/ui/$folder" ]; then
            add_warning "UI_STRUCTURE" "src/ui/$folder/" "UI subfolder missing" "Create src/ui/$folder/"
            UI_MISSING=true
        fi
    done

    if [ "$UI_MISSING" = false ]; then
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

mkdir -p "$OUTPUT_DIR"

# ───────────────────────────────────────────────────────────────────
# GENERATE JSON OUTPUT
# ───────────────────────────────────────────────────────────────────

VIOLATIONS_JSON=$(cat "$VIOLATIONS_FILE")
WARNINGS_JSON=$(cat "$WARNINGS_FILE")

# Merge findings
if [ "$VIOLATIONS_JSON" = "[]" ] && [ "$WARNINGS_JSON" = "[]" ]; then
    FINDINGS_JSON="[]"
elif [ "$VIOLATIONS_JSON" = "[]" ]; then
    FINDINGS_JSON="$WARNINGS_JSON"
elif [ "$WARNINGS_JSON" = "[]" ]; then
    FINDINGS_JSON="$VIOLATIONS_JSON"
else
    # Merge both arrays
    FINDINGS_JSON="${VIOLATIONS_JSON%]}${WARNINGS_JSON#[}"
    FINDINGS_JSON="${FINDINGS_JSON/]\[/,}"
fi

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
    # Parse violations from JSON and output to markdown
    echo "$VIOLATIONS_JSON" | grep -o '{[^}]*}' | while read -r finding; do
        type=$(echo "$finding" | grep -o '"type":"[^"]*"' | cut -d'"' -f4)
        location=$(echo "$finding" | grep -o '"location":"[^"]*"' | cut -d'"' -f4)
        rule=$(echo "$finding" | grep -o '"rule":"[^"]*"' | cut -d'"' -f4)
        action=$(echo "$finding" | grep -o '"action":"[^"]*"' | cut -d'"' -f4)

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
    echo "$WARNINGS_JSON" | grep -o '{[^}]*}' | while read -r finding; do
        type=$(echo "$finding" | grep -o '"type":"[^"]*"' | cut -d'"' -f4)
        location=$(echo "$finding" | grep -o '"location":"[^"]*"' | cut -d'"' -f4)
        action=$(echo "$finding" | grep -o '"action":"[^"]*"' | cut -d'"' -f4)

        echo "- **$type** (\`$location\`): $action" >> "$OUTPUT_DIR/doctrine_audit.md"
    done
    echo "" >> "$OUTPUT_DIR/doctrine_audit.md"
fi

if [ $CHECKS_PASSED -gt 0 ]; then
    echo "## Passed Checks" >> "$OUTPUT_DIR/doctrine_audit.md"
    echo "" >> "$OUTPUT_DIR/doctrine_audit.md"
    while IFS= read -r line; do
        if [ -n "$line" ]; then
            echo "- $line" >> "$OUTPUT_DIR/doctrine_audit.md"
        fi
    done < "$PASSED_FILE"
    echo "" >> "$OUTPUT_DIR/doctrine_audit.md"
fi

echo "---" >> "$OUTPUT_DIR/doctrine_audit.md"
echo "" >> "$OUTPUT_DIR/doctrine_audit.md"
echo "*Generated by doctrine audit mode v1.0.0*" >> "$OUTPUT_DIR/doctrine_audit.md"

# ───────────────────────────────────────────────────────────────────
# GENERATE COMPLIANCE STATUS (only on zero violations)
# ───────────────────────────────────────────────────────────────────

if [ $VIOLATIONS -eq 0 ]; then
    # Extract control_version from IMO_CONTROL.json
    CONTROL_VERSION=$(grep -o '"control_version": *"[^"]*"' "$REPO_ROOT/IMO_CONTROL.json" 2>/dev/null | cut -d'"' -f4 || echo "unknown")

    cat > "$REPO_ROOT/COMPLIANCE_STATUS.md" << EOF
# Compliance Status

**This repository is structurally compliant.**

---

## Audit Summary

| Field | Value |
|-------|-------|
| Repository | $REPO_NAME |
| Branch | $BRANCH |
| Audit Timestamp | $TIMESTAMP |
| Control Version | $CONTROL_VERSION |
| Status | **COMPLIANT** |

---

## Results

| Category | Count |
|----------|-------|
| Violations | 0 |
| Warnings | $WARNINGS |
| Passed Checks | $CHECKS_PASSED |

---

## Enforcement Layers Active

| Layer | Status |
|-------|--------|
| Claude Code | APPLY_DOCTRINE.prompt.md |
| Pre-commit | scripts/hooks/pre-commit |
| CI | .github/workflows/doctrine-enforcement.yml |
| UI Builder | UI_CONTROL_CONTRACT.json |

---

## Control Plane

| File | Purpose |
|------|---------|
| IMO_CONTROL.json | Primary control plane |
| UI_CONTROL_CONTRACT.json | UI build control |

---

*Generated by doctrine audit mode v1.0.0*
*This file is a status artifact, not doctrine.*
EOF

    echo -e "${GREEN}[COMPLIANCE]${NC} COMPLIANCE_STATUS.md generated"
else
    # Remove compliance status if it exists (violations found)
    if [ -f "$REPO_ROOT/COMPLIANCE_STATUS.md" ]; then
        rm "$REPO_ROOT/COMPLIANCE_STATUS.md"
        echo -e "${YELLOW}[COMPLIANCE]${NC} COMPLIANCE_STATUS.md removed (violations present)"
    fi
fi

# Cleanup
rm -rf "$TEMP_DIR"

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

if [ $VIOLATIONS -gt 0 ]; then
    exit 1
else
    exit 0
fi
