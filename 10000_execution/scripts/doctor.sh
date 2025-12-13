#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Running Barton Doctor…"

echo "1️⃣  Checking file naming..."
bash ./scripts/check_file_names.sh || exit 1

echo "2️⃣  Validating configs..."
node ./scripts/validate_configs.cjs || exit 1

echo "3️⃣  Checking branch health..."
git fetch origin master >/dev/null 2>&1 || true
git diff --quiet origin/master || echo "⚠️  Branch differs from origin/master."

echo "4️⃣  Security scan..."
npx --yes npm-audit --production || echo "⚠️  Security warnings."

echo "5️⃣  Acronym presence..."
grep -q "HEIR" ctb/docs/doctrine/doctrine/doctrine_system_manifest.yaml || echo "❌ HEIR missing in doctrine_system_manifest.yaml"

echo "✅ Doctor check complete."


