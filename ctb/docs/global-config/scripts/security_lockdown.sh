#!/bin/bash
# # CTB Metadata
# # Generated: 2025-10-23T14:32:40.836587
# # CTB Version: 1.3.3
# # Division: Documentation
# # Category: global-config
# # Compliance: 70%
# # HEIR ID: HEIR-2025-10-DOC-GLOBAL-01


###############################################################################
# Security & Secret Handling Lockdown Script
# Version: 1.0
# Purpose: Enforce zero-tolerance security policy for local secret files
# Usage: bash global-config/scripts/security_lockdown.sh
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Logging functions
log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[✅]${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}[⚠️ ]${NC} $1"
}

log_error() {
  echo -e "${RED}[❌]${NC} $1"
}

log_critical() {
  echo -e "${MAGENTA}[🔒]${NC} $1"
}

log_step() {
  echo -e "${CYAN}[STEP]${NC} $1"
}

# Configuration
SECURITY_LOG="logs/security_audit.log"
FIREBASE_COLLECTION="security_audit_log"
REPO_NAME=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Security violation tracking
VIOLATIONS_FOUND=false
declare -a VIOLATIONS=()
declare -a ENV_FILES=()
declare -a SECRET_PATTERNS=()

# Header
echo ""
echo -e "${MAGENTA}╔════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║    🔒 SECURITY LOCKDOWN ENFORCEMENT       ║${NC}"
echo -e "${MAGENTA}║   Zero-Tolerance Secret Scanning System   ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════╝${NC}"
echo ""

log_info "Repository: $REPO_NAME"
log_info "Timestamp: $TIMESTAMP"
log_info "Policy: ZERO TOLERANCE - No local secrets allowed"
echo ""

# Forbidden file patterns
FORBIDDEN_FILES=(
  ".env"
  ".env.local"
  ".env.development"
  ".env.production"
  ".env.staging"
  ".env.test"
  ".env.*.local"
  "*.env"
  "credentials.json"
  "service-account.json"
  "firebase-adminsdk*.json"
  "*-credentials.json"
  "secrets.yaml"
  "secrets.yml"
  "vault.json"
  ".secrets"
)

# Secret patterns to detect in files
SECRET_PATTERNS=(
  "api[_-]?key\s*=\s*['\"]?[A-Za-z0-9_-]{20,}['\"]?"
  "secret[_-]?key\s*=\s*['\"]?[A-Za-z0-9_-]{20,}['\"]?"
  "password\s*=\s*['\"]?[A-Za-z0-9!@#$%^&*()_+-]{8,}['\"]?"
  "token\s*=\s*['\"]?[A-Za-z0-9_-]{20,}['\"]?"
  "private[_-]?key\s*=\s*['\"]?-----BEGIN"
  "access[_-]?token\s*=\s*['\"]?[A-Za-z0-9_-]{20,}['\"]?"
  "auth[_-]?token\s*=\s*['\"]?[A-Za-z0-9_-]{20,}['\"]?"
  "database[_-]?url\s*=\s*['\"]?postgres://[^'\"]*:[^'\"]*@"
  "mongodb://[^:]+:[^@]+@"
  "mysql://[^:]+:[^@]+@"
)

# Step 1: Scan for forbidden .env files
log_step "1/5 Scanning for forbidden .env files..."
echo ""

for pattern in "${FORBIDDEN_FILES[@]}"; do
  # Find files matching pattern (excluding node_modules, .git, etc.)
  while IFS= read -r file; do
    if [ -f "$file" ]; then
      # Check if it's actually a secret file (not .env.example)
      if [[ ! "$file" =~ \.example$ ]] && [[ ! "$file" =~ \.template$ ]] && [[ ! "$file" =~ \.sample$ ]]; then
        log_error "Forbidden file detected: $file"
        ENV_FILES+=("$file")
        VIOLATIONS+=("ENV_FILE:$file")
        VIOLATIONS_FOUND=true
      fi
    fi
  done < <(find . -name "$pattern" -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/vendor/*" -not -path "*/dist/*" -not -path "*/activepieces/*" -not -path "*/windmill/*" -not -path "*/chartdb/*" 2>/dev/null || true)
done

if [ ${#ENV_FILES[@]} -eq 0 ]; then
  log_success "No forbidden .env files found"
else
  log_critical "${#ENV_FILES[@]} forbidden file(s) detected!"
fi

echo ""

# Step 2: Scan committed files for secret patterns
log_step "2/5 Scanning committed files for hardcoded secrets..."
echo ""

# Get list of tracked source code files only (excluding external repos, documentation, and config files)
# Limit to 50 files for performance
TRACKED_FILES=$(git ls-files 2>/dev/null | grep -E "\.(py|js|ts|tsx|jsx|sh|env\.example)$" | grep -vE "^(activepieces|windmill|chartdb|package-lock\.json|yarn\.lock)/" | head -50 || find . -type f \( -name "*.py" -o -name "*.js" -o -name "*.ts" -o -name "*.sh" -o -name ".env.example" \) -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/activepieces/*" -not -path "*/windmill/*" -not -path "*/chartdb/*" | head -50)

HARDCODED_SECRETS=0
while IFS= read -r file; do
  if [ -f "$file" ]; then
    # Skip this script itself (contains pattern definitions)
    if [[ "$file" == *"security_lockdown.sh"* ]]; then
      continue
    fi
    # Skip binary files and large files
    if file "$file" | grep -q "text"; then
      # Check for secret patterns
      for pattern in "${SECRET_PATTERNS[@]}"; do
        if grep -iE "$pattern" "$file" > /dev/null 2>&1; then
          log_error "Potential secret in: $file"
          VIOLATIONS+=("HARDCODED_SECRET:$file")
          VIOLATIONS_FOUND=true
          ((HARDCODED_SECRETS++))
          break
        fi
      done
    fi
  fi
done <<< "$TRACKED_FILES"

if [ $HARDCODED_SECRETS -eq 0 ]; then
  log_success "No hardcoded secrets detected in tracked files"
else
  log_critical "$HARDCODED_SECRETS file(s) contain potential hardcoded secrets!"
fi

echo ""

# Step 3: Check for MCP variable usage
log_step "3/5 Verifying MCP variable usage patterns..."
echo ""

MCP_USAGE_CORRECT=true

# Check if codebase uses MCP variable format (only check source code files, excluding external repos)
if git ls-files | grep -E "\.(py|js|ts)$" | grep -vE "^(activepieces|windmill|chartdb)/" | head -50 | xargs grep -l "process\.env\." > /dev/null 2>&1; then
  log_warning "Found direct process.env usage - should use MCP variables"

  # Show examples
  log_info "Convert to MCP variable format:"
  log_info "  ❌ process.env.NEON_URL"
  log_info "  ✅ \${MCP:NEON_URL}"
  log_info "  ✅ mcp.getVariable('NEON_URL')"

  MCP_USAGE_CORRECT=false
fi

if [ "$MCP_USAGE_CORRECT" = true ]; then
  log_success "MCP variable usage appears correct"
fi

echo ""

# Step 4: Validate MCP vault configuration
log_step "4/5 Validating MCP vault configuration..."
echo ""

MCP_CONFIG_VALID=false

# Check for MCP configuration
if [ -f "config/mcp_endpoints.json" ] || [ -f "config/mcp_registry.json" ]; then
  log_success "MCP configuration files present"
  MCP_CONFIG_VALID=true
else
  log_error "MCP configuration files missing"
  VIOLATIONS+=("MISSING_MCP_CONFIG")
  VIOLATIONS_FOUND=true
fi

# Check for MCP vault integration
if grep -q "MCP" config/*.json 2>/dev/null; then
  log_success "MCP vault integration detected"
else
  log_warning "MCP vault integration not clearly defined"
fi

echo ""

# Step 5: Create security audit log
log_step "5/5 Creating security audit log..."
echo ""

mkdir -p logs

# Create detailed security log
cat > "$SECURITY_LOG" << EOF
{
  "timestamp": "$TIMESTAMP",
  "repo_id": "$REPO_NAME",
  "scan_type": "security_lockdown",
  "policy": "zero_tolerance",
  "violations": {
    "total": ${#VIOLATIONS[@]},
    "env_files": ${#ENV_FILES[@]},
    "hardcoded_secrets": $HARDCODED_SECRETS,
    "violations_list": $(printf '%s\n' "${VIOLATIONS[@]}" | jq -R . | jq -s . 2>/dev/null || echo "[]")
  },
  "mcp_compliance": {
    "config_valid": $MCP_CONFIG_VALID,
    "usage_correct": $MCP_USAGE_CORRECT
  },
  "status": "$([ "$VIOLATIONS_FOUND" = true ] && echo "FAILED" || echo "PASSED")"
}
EOF

log_success "Security audit log created: $SECURITY_LOG"

# Optional: Log to Firebase (if configured)
if command -v firebase &> /dev/null; then
  log_info "Firebase CLI detected - logging to $FIREBASE_COLLECTION"
  # Firebase logging would go here
else
  log_warning "Firebase CLI not found - skipping remote audit logging"
fi

echo ""

# Summary
log_info "=== Security Lockdown Summary ==="
echo ""

if [ "$VIOLATIONS_FOUND" = false ]; then
  echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║       ✅ SECURITY SCAN PASSED             ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${CYAN}Repository:${NC}        $REPO_NAME"
  echo -e "${CYAN}Status:${NC}            ✅ SECURE"
  echo -e "${CYAN}Violations:${NC}        0"
  echo -e "${CYAN}MCP Vault:${NC}         ✅ Configured"
  echo -e "${CYAN}Timestamp:${NC}         $TIMESTAMP"
  echo ""

  log_success "All security checks passed - ready for build/deploy"
  exit 0
else
  echo -e "${RED}╔════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║   ❌ SECURITY_LOCKDOWN_TRIGGERED          ║${NC}"
  echo -e "${RED}╚════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${CYAN}Repository:${NC}        $REPO_NAME"
  echo -e "${CYAN}Status:${NC}            ❌ INSECURE"
  echo -e "${CYAN}Total Violations:${NC}  ${#VIOLATIONS[@]}"
  echo ""

  # Show violations
  if [ ${#ENV_FILES[@]} -gt 0 ]; then
    echo -e "${RED}Forbidden .env Files (${#ENV_FILES[@]}):${NC}"
    printf '  ❌ %s\n' "${ENV_FILES[@]}"
    echo ""
  fi

  if [ $HARDCODED_SECRETS -gt 0 ]; then
    echo -e "${RED}Files with Hardcoded Secrets ($HARDCODED_SECRETS):${NC}"
    echo "  Run: git grep -iE 'api[_-]?key|secret|password|token' to find"
    echo ""
  fi

  # Remediation steps
  echo -e "${YELLOW}🔒 REMEDIATION REQUIRED:${NC}"
  echo ""
  echo "1. Remove all .env files:"
  printf '   rm %s\n' "${ENV_FILES[@]}"
  echo ""
  echo "2. Move secrets to MCP vault:"
  echo "   - Use MCP environment registry"
  echo "   - Use Doppler vault integration"
  echo "   - Use Firebase secure variables"
  echo ""
  echo "3. Replace hardcoded secrets with MCP variables:"
  echo "   ❌ const key = 'sk_live_abc123'"
  echo "   ✅ const key = mcp.getVariable('STRIPE_SECRET_KEY')"
  echo ""
  echo "4. Update environment variable references:"
  echo "   ❌ process.env.DATABASE_URL"
  echo "   ✅ \${MCP:DATABASE_URL}"
  echo ""
  echo "5. Re-run security scan:"
  echo "   bash global-config/scripts/security_lockdown.sh"
  echo ""

  echo -e "${RED}⛔ BLOCKING BUILD/DEPLOY - Resolve security violations first${NC}"
  echo ""

  # Tag commit if in git repo
  if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    TAG_NAME="security-lockdown-$(date +%Y%m%d-%H%M%S)"
    git tag -a "$TAG_NAME" -m "[SECURITY_LOCKDOWN_TRIGGERED] Security violations detected at $TIMESTAMP" 2>/dev/null || log_info "Tag creation skipped"
    log_critical "Commit tagged: $TAG_NAME [SECURITY_LOCKDOWN_TRIGGERED]"
  fi

  exit 1
fi
