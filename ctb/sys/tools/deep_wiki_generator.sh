#!/usr/bin/env bash
# Deep Wiki Generator with Branch Specification System
set -euo pipefail

REPO="${1:-.}"
APP_NAME="${2:-$(basename "$REPO")}"
WIKI="$REPO/docs/wiki"
BRANCHES="$REPO/docs/branches"
TOOLBOX="$REPO/docs/toolbox"
SCRIPTS="$REPO/scripts"

echo "[Deep Wiki] Creating standardized wiki system for $REPO..."

# Create complete directory structure
mkdir -p "$WIKI"/{00-overview,10-input,20-middle,30-output,40-agents,50-environment,60-operations,70-troubleshooting}
mkdir -p "$BRANCHES" "$TOOLBOX" "$SCRIPTS"

# 1) BRANCH SPECIFICATION SYSTEM
cat > "$BRANCHES/_tree.yml" << 'YML'
# Root structure of the Christmas tree
root:
  - outreach-root
  - ops-root
  - data-root
  - api-root
YML

cat > "$BRANCHES/example.yml" << YML
branch_id: ${APP_NAME}-main
title: $APP_NAME → Main Processing
parent_id: api-root
altitude: "10k"            # 30k/20k/10k/5k
contracts: ["/health", "/version", "/heir/status"]

input:
  sources: ["api", "queue", "webhook"]
  schema:  ["request", "payload"]
  guards:  ["env:check", "heir:intake", "rate-limit"]

middle:
  steps:   ["validate", "transform", "process", "store"]
  validators: ["schema-validate", "business-rules", "state-check"]

output:
  destinations: ["response", "webhook", "queue"]
  sLAs: ["<200ms p95", "99.9% uptime", "idempotent"]

tools_profile: ["db", "deploy", "logging"]
metrics: ["request_count", "latency_p95", "error_rate"]
risks:   ["database-timeout", "memory-leak", "rate-limits"]
dashboards: ["{{DASHBOARD_URL}}", "{{METRICS_URL}}"]
YML

cat > "$BRANCHES/schema.json" << 'JSON'
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["branch_id","title","altitude","input","middle","output","tools_profile"],
  "properties": {
    "branch_id": {"type": "string", "pattern": "^[a-z0-9-]+$"},
    "title": {"type": "string"},
    "parent_id": {"type": "string"},
    "altitude": {"enum": ["30k","20k","10k","5k"]},
    "contracts": {
      "type": "array",
      "items": {"type": "string"}
    },
    "input": {
      "type": "object",
      "properties": {
        "sources": {"type": "array", "items": {"type": "string"}},
        "schema": {"type": "array", "items": {"type": "string"}},
        "guards": {"type": "array", "items": {"type": "string"}}
      }
    },
    "middle": {
      "type": "object", 
      "properties": {
        "steps": {"type": "array", "items": {"type": "string"}},
        "validators": {"type": "array", "items": {"type": "string"}}
      }
    },
    "output": {
      "type": "object",
      "properties": {
        "destinations": {"type": "array", "items": {"type": "string"}},
        "sLAs": {"type": "array", "items": {"type": "string"}}
      }
    },
    "tools_profile": {"type": "array", "items": {"type": "string"}},
    "metrics": {"type": "array", "items": {"type": "string"}},
    "risks": {"type": "array", "items": {"type": "string"}},
    "dashboards": {"type": "array", "items": {"type": "string"}}
  }
}
JSON

# 2) TOOLBOX PROFILES
cat > "$TOOLBOX/profiles.yml" << 'YML'
profiles:
  db:
    deps: ["@neondatabase/serverless", "prisma"]
    services: ["neon", "postgres"]
    patterns: ["connection-pool", "migrations"]
    
  deploy:
    deps: ["vercel", "@vercel/node"]
    services: ["vercel", "render", "aws"]
    patterns: ["serverless", "containers"]
    
  firebase:
    deps: ["firebase-admin", "firebase"]
    services: ["firestore", "auth", "storage"]
    patterns: ["realtime", "offline-first"]
    
  messaging:
    deps: ["sendgrid", "slack-sdk", "@slack/web-api"]
    services: ["email", "slack", "webhook"]
    patterns: ["async", "retry", "dlq"]
    
  logging:
    deps: ["winston", "pino", "undici"]
    services: ["imo-master", "datadog", "sentry"]
    patterns: ["structured", "correlation-id"]
    
  caching:
    deps: ["redis", "node-cache"]
    services: ["redis", "memory", "cdn"]
    patterns: ["ttl", "invalidation", "warming"]
    
  auth:
    deps: ["jsonwebtoken", "bcrypt", "passport"]
    services: ["jwt", "oauth", "saml"]
    patterns: ["middleware", "rbac", "session"]
YML

# 3) WIKI GENERATOR SCRIPT
cat > "$SCRIPTS/gen-wiki.mjs" << 'JS'
import fs from 'fs';
import path from 'path';

// Simple YAML parser (basic support)
function parseYAML(content) {
  const lines = content.split('\n');
  const result = {};
  let currentKey = null;
  let currentArray = null;
  let indent = 0;
  
  for (const line of lines) {
    if (line.trim().startsWith('#') || line.trim() === '') continue;
    
    const match = line.match(/^(\s*)([^:]+):\s*(.*)$/);
    if (match) {
      const [, spaces, key, value] = match;
      const currentIndent = spaces.length;
      
      if (value.startsWith('[') && value.endsWith(']')) {
        // Array in bracket notation
        result[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''));
      } else if (value === '') {
        // Start of nested object or array
        currentKey = key;
        result[key] = {};
      } else {
        result[key] = value.replace(/['"]/g, '');
      }
    } else if (line.trim().startsWith('- ')) {
      // Array item
      const item = line.trim().slice(2);
      if (currentKey && !Array.isArray(result[currentKey])) {
        result[currentKey] = [];
      }
      if (currentKey) {
        result[currentKey].push(item.replace(/['"]/g, ''));
      }
    }
  }
  
  return result;
}

const branchesDir = 'docs/branches';
const wikiDir = 'docs/wiki';
const toolboxDir = 'docs/toolbox';

// Ensure directories exist
fs.mkdirSync(wikiDir, { recursive: true });
fs.mkdirSync(path.join(wikiDir, 'branches'), { recursive: true });

// Load toolbox profiles if available
let profiles = {};
try {
  const profilesContent = fs.readFileSync(path.join(toolboxDir, 'profiles.yml'), 'utf8');
  const parsed = parseYAML(profilesContent);
  profiles = parsed.profiles || {};
} catch (e) {
  console.log('No toolbox profiles found, using defaults');
}

function renderMermaid(branch) {
  const inputs = branch.input?.sources?.join('\\n') || 'Input';
  const outputs = branch.output?.destinations?.join('\\n') || 'Output';
  const steps = branch.middle?.steps?.slice(0, 3).join(' --> ') || 'Process';
  
  return `
\`\`\`mermaid
flowchart TB
    subgraph "Input Layer"
        I[${inputs}]
    end
    
    subgraph "Middle Layer (${branch.altitude || '10k'})"
        ${steps}
    end
    
    subgraph "Output Layer"
        O[${outputs}]
    end
    
    subgraph "Tools"
        ${branch.tools_profile?.join(':::tool\\n') || 'Tools'}:::tool
    end
    
    I --> Middle
    Middle --> O
    
    classDef tool fill:#f9f,stroke:#333,stroke-width:2px;
\`\`\`
  `.trim();
}

function renderToolProfile(profileName) {
  const profile = profiles[profileName];
  if (!profile) return `- ${profileName} (profile not found)`;
  
  return `
### ${profileName}
- **Dependencies**: ${profile.deps?.join(', ') || 'None'}
- **Services**: ${profile.services?.join(', ') || 'None'}  
- **Patterns**: ${profile.patterns?.join(', ') || 'None'}
`;
}

function writeBranchWiki(branch) {
  const dir = path.join(wikiDir, 'branches', branch.branch_id);
  fs.mkdirSync(dir, { recursive: true });
  
  // Tool profiles section
  const toolsSection = branch.tools_profile?.map(renderToolProfile).join('\\n') || 'No tools configured';
  
  const md = `# ${branch.title}

**Branch ID**: \`${branch.branch_id}\`  
**Altitude**: ${branch.altitude}  
**Parent**: ${branch.parent_id || 'root'}  

## Architecture Overview
${renderMermaid(branch)}

## Input Layer
- **Sources**: ${branch.input?.sources?.join(', ') || 'Not specified'}
- **Schema**: ${branch.input?.schema?.join(', ') || 'Not specified'}
- **Guards**: ${branch.input?.guards?.join(', ') || 'Not specified'}

## Middle Layer Processing
- **Steps**: ${branch.middle?.steps?.join(' → ') || 'Not specified'}
- **Validators**: ${branch.middle?.validators?.join(', ') || 'Not specified'}

## Output Layer
- **Destinations**: ${branch.output?.destinations?.join(', ') || 'Not specified'}
- **SLAs**: ${branch.output?.sLAs?.join(', ') || 'Not specified'}

## API Contracts
${branch.contracts?.map(c => \`- \\\`\${c}\\\`\`).join('\\n') || '- No contracts specified'}

## Tool Profiles
${toolsSection}

## Observability

### Metrics
${branch.metrics?.map(m => \`- \${m}\`).join('\\n') || '- No metrics specified'}

### Dashboards
${branch.dashboards?.map(d => \`- [\${d}](\${d})\`).join('\\n') || '- No dashboards specified'}

### Risk Assessment
${branch.risks?.map(r => \`- ⚠️ \${r}\`).join('\\n') || '- No risks identified'}

## Related Documentation
- [[../../00-overview/index.md|System Overview]]
- [[../../10-input/index.md|Input Layer Details]]
- [[../../20-middle/index.md|Middle Layer Details]]
- [[../../30-output/index.md|Output Layer Details]]
- [[../../60-operations/index.md|Operations Guide]]

---
*Generated from \`docs/branches/${branch.branch_id}.yml\`*
`;

  fs.writeFileSync(path.join(dir, 'index.md'), md);
  
  // Create navigation file
  const navMd = \`# Branch: \${branch.title}

## Quick Navigation
- [[index.md|Overview]]
- [[input.md|Input Details]] 
- [[middle.md|Processing Logic]]
- [[output.md|Output Handling]]
- [[monitoring.md|Monitoring & Alerts]]

## Altitude: \${branch.altitude}
\${branch.altitude === '30k' ? '**Strategic Level** - Planning & Orchestration' : 
  branch.altitude === '20k' ? '**Tactical Level** - Analysis & Decisions' :
  branch.altitude === '10k' ? '**Implementation Level** - Core Processing' :
  '**Validation Level** - Testing & Verification'}
\`;

  fs.writeFileSync(path.join(dir, 'README.md'), navMd);
}

function generateOverview() {
  const branches = [];
  
  try {
    for (const file of fs.readdirSync(branchesDir)) {
      if (!file.endsWith('.yml') || file === '_tree.yml') continue;
      
      const content = fs.readFileSync(path.join(branchesDir, file), 'utf8');
      const branch = parseYAML(content);
      branches.push(branch);
    }
  } catch (e) {
    console.log('No branch files found');
  }
  
  const overviewMd = \`# Branch Architecture Overview

## System Branches
\${branches.map(b => \`- [[\${b.branch_id}/index.md|\${b.title}]] (\${b.altitude})\`).join('\\n')}

## Altitude Distribution
\${branches.reduce((acc, b) => {
  acc[b.altitude] = acc[b.altitude] || [];
  acc[b.altitude].push(b);
  return acc;
}, {})}

## System Flow
\`\`\`mermaid
graph TB
    \${branches.filter(b => b.altitude === '30k').map(b => \`\${b.branch_id}["\${b.title}"]\`).join('\\n    ')}
    \${branches.filter(b => b.altitude === '20k').map(b => \`\${b.branch_id}["\${b.title}"]\`).join('\\n    ')}
    \${branches.filter(b => b.altitude === '10k').map(b => \`\${b.branch_id}["\${b.title}"]\`).join('\\n    ')}
    \${branches.filter(b => b.altitude === '5k').map(b => \`\${b.branch_id}["\${b.title}"]\`).join('\\n    ')}
\`\`\`

---
*Auto-generated from branch specifications*
\`;

  fs.writeFileSync(path.join(wikiDir, 'branches', 'README.md'), overviewMd);
}

// Process all branch files
try {
  for (const file of fs.readdirSync(branchesDir)) {
    if (!file.endsWith('.yml') || file === '_tree.yml') continue;
    
    const content = fs.readFileSync(path.join(branchesDir, file), 'utf8');
    const branch = parseYAML(content);
    writeBranchWiki(branch);
    console.log(\`Generated wiki for branch: \${branch.branch_id}\`);
  }
  
  generateOverview();
  console.log("Deep Wiki with branch specifications generated under docs/wiki/");
} catch (e) {
  console.log("Error generating wiki:", e.message);
  console.log("Creating basic structure...");
  
  // Fallback: create basic structure
  fs.writeFileSync(path.join(wikiDir, 'branches', 'README.md'), '# Branches\\n\\nNo branch specifications found.');
}
JS

# 4) Enhanced main wiki index
cat > "$REPO/docs/README.md" << 'MD'
# Deep Wiki System

## Core Navigation
- [[wiki/00-overview/index.md|📊 System Overview]]
- [[wiki/branches/README.md|🌲 Branch Architecture]]
- [[wiki/10-input/index.md|📥 Input Layer]]
- [[wiki/20-middle/index.md|⚙️ Middle Layer]]
- [[wiki/30-output/index.md|📤 Output Layer]]
- [[wiki/40-agents/index.md|🤖 Agent System]]
- [[wiki/50-environment/index.md|🔐 Environment]]
- [[wiki/60-operations/index.md|🚀 Operations]]
- [[wiki/70-troubleshooting/index.md|🔧 Troubleshooting]]

## Branch Specifications
This repository uses YAML-driven branch specifications for systematic documentation:
- Branch definitions in `docs/branches/*.yml`
- Schema validation via `docs/branches/schema.json` 
- Auto-generated wiki pages via `npm run docs`

## Quick Commands
```bash
npm run docs         # Generate wiki from branch specs
npm run docs:watch   # Auto-regenerate on changes
npm run env:check    # Validate environment
```

## Architecture Patterns
Each branch follows the Input → Middle → Output pattern with:
- **Altitude assignment** (30k/20k/10k/5k)
- **Tool profiles** (db, deploy, messaging, etc.)
- **Contract definitions** (API endpoints)
- **SLA specifications**
- **Risk assessments**

---
*Deep Wiki System - Generated with IMO Creator v2.0*
MD

# 5) Enhanced package.json scripts (check if exists first)
if [ -f "$REPO/package.json" ]; then
  # Use Node.js to update package.json
  cat > "$SCRIPTS/update-package.mjs" << 'JS'
import fs from 'fs';
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.docs = 'node scripts/gen-wiki.mjs';
pkg.scripts['docs:watch'] = 'nodemon --exec node scripts/gen-wiki.mjs';
pkg.devDependencies = pkg.devDependencies || {};
pkg.devDependencies.nodemon = '^3.0.1';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('Updated package.json with docs scripts');
JS
  node "$SCRIPTS/update-package.mjs" 2>/dev/null || echo "[Deep Wiki] Could not update package.json automatically"
  rm -f "$SCRIPTS/update-package.mjs"
fi

# 6) GitHub workflow for validation
mkdir -p "$REPO/.github/workflows"
cat > "$REPO/.github/workflows/wiki-validation.yml" << 'YML'
name: Deep Wiki Validation
on: [push, pull_request]

jobs:
  validate-wiki:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install ajv-cli -g
        
      - name: Validate branch specifications
        run: |
          if [ -d "docs/branches" ]; then
            ajv validate -s docs/branches/schema.json -d "docs/branches/*.yml" --spec=draft7 || exit 1
            echo "✅ Branch specifications are valid"
          else
            echo "ℹ️ No branch specifications to validate"
          fi
          
      - name: Generate wiki
        run: |
          if [ -f "scripts/gen-wiki.mjs" ]; then
            node scripts/gen-wiki.mjs
            echo "✅ Wiki generation successful"
          else
            echo "ℹ️ No wiki generator found"
          fi
          
      - name: Check wiki completeness
        run: |
          if [ -d "docs/wiki" ]; then
            echo "📚 Wiki sections found:"
            ls -la docs/wiki/
            if [ -d "docs/wiki/branches" ]; then
              echo "🌲 Branch documentation:"
              ls -la docs/wiki/branches/
            fi
          fi
YML

# Generate initial wiki from the example branch
if command -v node >/dev/null 2>&1; then
  echo "[Deep Wiki] Generating initial wiki..."
  cd "$REPO"
  node scripts/gen-wiki.mjs 2>/dev/null || echo "[Deep Wiki] Initial generation will happen on first run"
  cd - > /dev/null
fi

echo "[Deep Wiki] ✅ Deep Wiki system with branch specifications created"
echo "[Deep Wiki] 🌲 Branch-driven architecture ready"
echo "[Deep Wiki] 📊 Schema validation configured"
echo "[Deep Wiki] 🔄 Auto-generation via 'npm run docs'"