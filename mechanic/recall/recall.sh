#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-}"
if [ -z "$TARGET" ]; then
  echo "Usage: npm run recall -- ../path/to/existing-repo"
  exit 1
fi

echo "[Recall] Analyzing $TARGET ..."

# Run compliance check first
COMPLIANCE_SCORE=0
if [ -f "tools/repo_compliance_check.py" ]; then
  echo "[Recall] Running compliance check..."
  python "tools/repo_compliance_check.py" "$TARGET" || true
fi

# Ensure .env.example exists with required keys (no real values)
if [ ! -f "$TARGET/.env.example" ]; then
  echo "[Recall] Creating .env.example from schema..."
  cat > "$TARGET/.env.example" << 'ENV'
APP_NAME=
IMO_MASTER_ERROR_ENDPOINT=
IMO_ERROR_API_KEY=
NEON_DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Optional:
# OPENAI_API_KEY=
# ANTHROPIC_API_KEY=
# SUPABASE_URL=
# SUPABASE_ANON_KEY=
# VERCEL_URL=
# VERCEL_ENV=
# PORT=
ENV
  echo "[Recall] ✅ Created .env.example"
fi

# Add logging shim if not present
if [ ! -f "$TARGET/src/imo-logger.ts" ] && [ ! -f "$TARGET/src/imo-logger.js" ]; then
  mkdir -p "$TARGET/src"
  cp "src/imo-logger.ts" "$TARGET/src/imo-logger.ts"
  echo "[Recall] ✅ Added logging shim (write-only)"
fi

# Add compliance monitoring if not present
if [ ! -f "$TARGET/.imo-compliance.json" ]; then
  cat > "$TARGET/.imo-compliance.json" << JSON
{
  "version": "1.0.0",
  "imo_creator_version": "1.0.0",
  "last_check": "$(date -Iseconds 2>/dev/null || date)",
  "last_update": "$(date -Iseconds 2>/dev/null || date)",
  "check_interval_hours": 24,
  "auto_update": false,
  "compliance_level": "standard",
  "repo_metadata": {
    "processed_by_imo": true,
    "processing_date": "$(date -Iseconds 2>/dev/null || date)",
    "initial_compliance_score": 50,
    "current_compliance_score": 50,
    "repo_name": "$(basename "$TARGET")",
    "processed_by": "mechanic_recall"
  }
}
JSON
  echo "[Recall] ✅ Added compliance configuration"
fi

# Add compliance check script if not present
if [ ! -f "$TARGET/imo-compliance-check.py" ]; then
  if [ -f "templates/imo-compliance-check.py" ]; then
    cp "templates/imo-compliance-check.py" "$TARGET/imo-compliance-check.py"
    echo "[Recall] ✅ Added compliance check script"
  fi
fi

# Check for missing standard files and offer to add them
MISSING_FILES=""
[ ! -f "$TARGET/README.md" ] && MISSING_FILES="$MISSING_FILES README.md"
[ ! -f "$TARGET/LICENSE" ] && MISSING_FILES="$MISSING_FILES LICENSE"
[ ! -f "$TARGET/CONTRIBUTING.md" ] && MISSING_FILES="$MISSING_FILES CONTRIBUTING.md"
[ ! -f "$TARGET/.github/workflows/ci.yml" ] && [ ! -f "$TARGET/.github/workflows/ci.yaml" ] && MISSING_FILES="$MISSING_FILES .github/workflows/ci.yml"

if [ -n "$MISSING_FILES" ]; then
  echo "[Recall] Missing standard files:$MISSING_FILES"
  echo "[Recall] Run compliance fixer to add them: python tools/repo_compliance_fixer.py $TARGET"
fi

# Generate deep wiki with branch specifications if not present
if [ ! -d "$TARGET/docs/wiki" ]; then
  echo "[Recall] Generating deep wiki with branch specifications..."
  bash tools/deep_wiki_generator.sh "$TARGET" "$(basename "$TARGET")"
  echo "[Recall] ✅ Added deep wiki system with branch architecture"
elif [ ! -f "$TARGET/docs/branches/schema.json" ]; then
  echo "[Recall] Upgrading existing wiki to branch specification system..."
  bash tools/deep_wiki_generator.sh "$TARGET" "$(basename "$TARGET")"
  echo "[Recall] ✅ Upgraded to branch-driven wiki system"
else
  echo "[Recall] Branch-driven wiki already exists - preserving existing content"
fi

echo "[Recall] ✅ Recall complete"
echo "[Recall] Next steps:"
echo "  1. Review changes in $TARGET"
echo "  2. Run HEIR checks if needed"
echo "  3. Commit when ready"
echo "  4. Set environment variables in deployment platform"