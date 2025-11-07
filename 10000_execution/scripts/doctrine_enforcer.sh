#!/usr/bin/env bash

# ─────────────────────────────────────────────
#  BARTON DOCTRINE ENFORCER (Solo Edition)
#  Purpose: Validate, synchronize, and summarize
#  all doctrinal assets for Barton Enterprises.
# ─────────────────────────────────────────────

set -euo pipefail

echo ""
echo "🧠  BARTON DOCTRINE ENFORCER – Starting checks..."
echo "─────────────────────────────────────────────"

# 1️⃣  Check file naming conventions
echo "🔹 Checking naming conventions..."
BAD_NAMES=$(find . -type f | grep -E '[A-Z ]' || true)
if [ -n "$BAD_NAMES" ]; then
  echo "⚠️  Non-snake_case file names detected:"
  echo "$BAD_NAMES"
else
  echo "✅ Naming consistent."
fi
echo "─────────────────────────────────────────────"

# 2️⃣  Validate doctrine manifests (system + global)
echo "🔹 Validating doctrine manifests..."
if node ./scripts/validate_configs.cjs; then
  echo "✅ Doctrine schema validation passed."
else
  echo "❌ Doctrine schema validation failed."; exit 1;
fi
echo "─────────────────────────────────────────────"

# Paths adapted to this repo
SYSTEM_MANIFEST="ctb/docs/doctrine/doctrine/doctrine_system_manifest.yaml"
CTB_DOC="ctb/docs/global-config/doctrine_ctb.md"
ACRONYMS_DOC="ctb/docs/doctrine/doctrine/doctrine_acronyms.md"

# 3️⃣  Verify required core doctrine files
echo "🔹 Checking required doctrine files..."
REQUIRED_FILES=(
  "$SYSTEM_MANIFEST"
  "$CTB_DOC"
  "$ACRONYMS_DOC"
)
for f in "${REQUIRED_FILES[@]}"; do
  if [[ -f "$f" ]]; then
    echo "✅ Found $f"
  else
    echo "❌ Missing $f"
  fi
done
echo "─────────────────────────────────────────────"

# 4️⃣  Generate visuals if present
echo "🔹 Generating visuals..."
if ls docs/visuals/*.mmd >/dev/null 2>&1; then
  node ./scripts/gen_visuals.cjs
  echo "✅ Visuals updated."
else
  echo "⚠️  No .mmd files found in docs/visuals. Skipping diagram generation."
fi
echo "─────────────────────────────────────────────"

# 5️⃣  Generate doctrine hash
echo "🔹 Computing doctrine hash..."
if [[ -f "$SYSTEM_MANIFEST" ]]; then
  sha1sum "$SYSTEM_MANIFEST" > .doctrine_hash
  echo "✅ Doctrine hash stored in .doctrine_hash"
else
  echo "⚠️  System manifest not found at $SYSTEM_MANIFEST; skipping hash."
fi
echo "─────────────────────────────────────────────"

# 6️⃣  Build summary report
REPORT_PATH=".doctrine_manifest_report.txt"
echo "🔹 Building summary report..."
{
  echo "─────────────────────────────────────────────"
  echo "📜 BARTON DOCTRINE MANIFEST REPORT"
  echo "Generated: $(date)"
  echo "─────────────────────────────────────────────"
  echo ""
  echo "🔹 CTB / ALTITUDE STRUCTURE"
  echo "   - 60k: HEIR Supervisory Framework"
  echo "   - 40k: UI & Governance Layers"
  echo "   - 30k: Engineering Hangar (Cursor 2.0 + CODEX)"
  echo "   - 20k: Gateway (n8n + Composio)"
  echo "   - 10k: Vaults (Neon / Firebase / BigQuery)"
  echo "   - 5k : Process Operations / Communicator Agents"
  echo ""
  echo "🔹 ACTIVE TOOLCHAIN"
  if [[ -f "$SYSTEM_MANIFEST" ]]; then
    grep -A4 "tool_sections:" "$SYSTEM_MANIFEST" | grep "current_tool" | sed 's/^[ \t-]*//'
  else
    echo "(system manifest missing)"
  fi
  echo ""
  echo "🔹 DOCTRINE ACRONYMS"
  if [[ -f "$SYSTEM_MANIFEST" ]]; then
    grep -A2 "acronym:" "$SYSTEM_MANIFEST" | grep "acronym:" | sed 's/^[ \t-]*//'
  else
    echo "(system manifest missing)"
  fi
  echo ""
  echo "🔹 HEIR / ORBT STATUS"
  echo "   HEIR → Hierarchy, Enforcement, Integration, Reporting"
  echo "   ORBT → Operate, Repair, Build, Train"
  echo ""
  echo "✅ Doctrine verification complete – see notes above for warnings."
  echo "─────────────────────────────────────────────"
} > "$REPORT_PATH"

echo "📄 Doctrine manifest summary saved to $REPORT_PATH"
echo "✨ Enforcement complete."


