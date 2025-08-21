#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${1:-new-app}"
TARGET="apps/$APP_NAME"

echo "[Factory] Scaffolding $TARGET ..."
mkdir -p "$TARGET/src" "$TARGET/docs" "$TARGET/tests"

# Create .env.example from schema
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

# Create package.json
cat > "$TARGET/package.json" << JSON
{
  "name": "$APP_NAME",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "node src/index.js",
    "build": "echo 'Build script for $APP_NAME'",
    "test": "node --test tests/*.test.js",
    "env:check": "node ../../scripts/env-check.mjs",
    "compliance:check": "python ../../imo-compliance-check.py"
  },
  "dependencies": {
    "undici": "^6.19.8"
  }
}
JSON

# Create main app file with logging shim
cat > "$TARGET/src/index.js" << 'JS'
import { logError, logInfo, createHealthCheck } from "../../../src/imo-logger.ts";

export function health() { 
  return createHealthCheck();
}

export async function main() {
  try {
    await logInfo("Application starting", { phase: "boot" });
    console.log("[APP] Boot", health());
    
    // Your app logic here
    
  } catch (e) {
    await logError(e, { phase: "boot" });
    throw e;
  }
}

// Only run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
JS

# Create test file
cat > "$TARGET/tests/health.test.js" << 'JS'
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { health } from '../src/index.js';

describe('Health Check', () => {
  it('should return ok status', () => {
    const result = health();
    assert.strictEqual(result.ok, true);
    assert.ok(result.timestamp);
  });
});
JS

# Create IMO flow documentation
cat > "$TARGET/docs/imo-flow.ascii" << 'TXT'
IMO Flow Architecture
====================

[Input] -> [Middle] -> [Output]
   |          |           |
   v          v           v
Validate   Process    Deliver
   |          |           |
   v          v           v
 .env     imo-logger   /health

Components:
- Master error log via ../../../src/imo-logger.ts
- Environment keys from Vercel/Render (never committed)
- Compliance monitoring via imo-compliance-check.py

Altitude Layers:
- 30k: Strategic decisions
- 20k: Tactical processing  
- 10k: Implementation
- 5k:  Validation
TXT

# Add compliance config
cat > "$TARGET/.imo-compliance.json" << JSON
{
  "version": "1.0.0",
  "imo_creator_version": "1.0.0",
  "last_check": "$(date -Iseconds)",
  "last_update": "$(date -Iseconds)",
  "check_interval_hours": 24,
  "auto_update": false,
  "compliance_level": "standard",
  "repo_metadata": {
    "processed_by_imo": true,
    "processing_date": "$(date -Iseconds)",
    "initial_compliance_score": 100,
    "current_compliance_score": 100,
    "repo_name": "$APP_NAME",
    "created_by": "factory"
  }
}
JSON

# Copy compliance check script
cp "templates/imo-compliance-check.py" "$TARGET/imo-compliance-check.py" 2>/dev/null || echo "[Factory] Note: Compliance check script not found in templates/"

# Generate deep wiki with branch specifications
echo "[Factory] Generating deep wiki with branch specifications..."
bash tools/deep_wiki_generator.sh "$TARGET" "$APP_NAME"

echo "[Factory] ✅ Created $TARGET with deep wiki"
echo "[Factory] Next steps:"
echo "  1. cd $TARGET"
echo "  2. Set environment variables in Vercel/Render"
echo "  3. npm run env:check"
echo "  4. npm run dev"