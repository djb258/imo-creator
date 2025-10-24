#!/usr/bin/env ts-node
// # CTB Metadata
// # Generated: 2025-10-23T14:32:35.727975
// # CTB Version: 1.3.3
// # Division: System Infrastructure
// # Category: scripts
// # Compliance: 85%
// # HEIR ID: HEIR-2025-10-SYS-SCRIPT-01


/**
 * CTB Scaffold Generator
 *
 * Creates new Barton-compliant repositories from the CTB template
 * following the Christmas Tree Backbone architecture.
 *
 * Usage:
 *   ts-node scripts/ctb_scaffold.ts --repo <repo-name> --tier <tier>
 *
 * Example:
 *   ts-node scripts/ctb_scaffold.ts --repo outreach-core --tier full
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface TierConfig {
  tier: string;
  description: string;
  include: string[];
  exclude: string[];
  use_cases?: string[];
  minimum_team_size?: number;
  complexity?: string;
}

interface ManifestConfig {
  repo_name: string;
  barton_id: string;
  ctb_tier: string;
  ctb_version: string;
  created_at: string;
  created_by: string;
}

// Parse command line arguments
function parseArgs(): { repo: string; tier: string } {
  const args = process.argv.slice(2);
  let repo = '';
  let tier = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--repo' && i + 1 < args.length) {
      repo = args[i + 1];
      i++;
    } else if (args[i] === '--tier' && i + 1 < args.length) {
      tier = args[i + 1];
      i++;
    }
  }

  if (!repo || !tier) {
    console.error('❌ Error: Both --repo and --tier arguments are required');
    console.log('\nUsage: ts-node ctb_scaffold.ts --repo <repo-name> --tier <tier>');
    console.log('\nAvailable tiers:');
    console.log('  - full   : Complete CTB structure for enterprise-scale repos');
    console.log('  - mid    : CTB layout for mid-size repos');
    console.log('  - micro  : CTB layout for single-tool repos');
    process.exit(1);
  }

  return { repo, tier };
}

// Generate Barton ID
function generateBartonId(repoName: string): string {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const timestamp = Date.now().toString().slice(-3);
  const repoNameUpper = repoName.toUpperCase().replace(/[^A-Z0-9]/g, '');

  return `SHQ.04.CTB.${repoNameUpper}.${dateStr}.${timestamp}`;
}

// Copy directory recursively
function copyDirectory(src: string, dest: string, exclude: string[] = []): void {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Check if this path should be excluded
    const relativePath = srcPath.replace(/\\/g, '/').split('ctb-template/')[1];
    if (relativePath && exclude.some(ex => relativePath.startsWith(ex))) {
      console.log(`  ⊘ Skipping excluded: ${relativePath}`);
      continue;
    }

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  ✓ Copied: ${relativePath}`);
    }
  }
}

// Filter paths based on tier configuration
function filterPaths(tierConfig: TierConfig): string[] {
  const exclude: string[] = [];

  // Add excluded paths from tier config
  if (tierConfig.exclude && tierConfig.exclude.length > 0) {
    exclude.push(...tierConfig.exclude);
  }

  // If include list is specified, exclude everything not in it
  if (tierConfig.include && tierConfig.include.length > 0) {
    const allPaths = ['sys', 'data', 'apps', 'ai', 'docs', 'tests'];
    const included = tierConfig.include;

    for (const p of allPaths) {
      if (!included.includes(p) && !included.some(inc => inc.startsWith(p + '/'))) {
        exclude.push(p);
      }
    }
  }

  return exclude;
}

// Main scaffolding function
async function scaffold() {
  const { repo, tier } = parseArgs();

  console.log('\n🌲 CTB Scaffold Generator');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`Repository: ${repo}`);
  console.log(`Tier:       ${tier}\n`);

  // Read tier configuration
  const tierConfigPath = path.join(__dirname, '..', 'ctb-template', 'tiers', `${tier}.json`);

  if (!fs.existsSync(tierConfigPath)) {
    console.error(`❌ Error: Tier "${tier}" not found`);
    console.log('\nAvailable tiers: full, mid, micro');
    process.exit(1);
  }

  const tierConfig: TierConfig = JSON.parse(fs.readFileSync(tierConfigPath, 'utf-8'));
  console.log(`📋 Tier: ${tierConfig.description}\n`);

  // Create output directory
  const outputDir = path.join(__dirname, '..', '..', repo);

  if (fs.existsSync(outputDir)) {
    console.error(`❌ Error: Directory "${repo}" already exists`);
    process.exit(1);
  }

  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`📁 Created: ${repo}/\n`);

  // Copy CTB template structure
  console.log('📦 Copying CTB template structure...\n');
  const templateDir = path.join(__dirname, '..', 'ctb-template');
  const exclude = filterPaths(tierConfig);

  copyDirectory(templateDir, outputDir, exclude);

  // Read version from template
  const versionPath = path.join(templateDir, 'version.json');
  const version = JSON.parse(fs.readFileSync(versionPath, 'utf-8'));

  // Generate Barton ID
  const bartonId = generateBartonId(repo);

  // Create manifest.json
  const manifest: ManifestConfig = {
    repo_name: repo,
    barton_id: bartonId,
    ctb_tier: tier,
    ctb_version: version.ctb_version,
    created_at: new Date().toISOString(),
    created_by: 'CTB Scaffold Generator'
  };

  const manifestPath = path.join(outputDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n✅ Generated manifest.json`);
  console.log(`   Barton ID: ${bartonId}`);

  // Create README.md
  const readmePath = path.join(outputDir, 'README.md');
  const readmeContent = `# ${repo}

**Barton ID**: \`${bartonId}\`
**CTB Tier**: ${tier} (${tierConfig.description})
**CTB Version**: ${version.ctb_version}

## Overview

This repository was scaffolded from the IMO-Creator CTB template using the **Christmas Tree Backbone (CTB)** architecture.

## Structure

This repo follows the **${tier}** tier CTB structure:

${tierConfig.include.map(p => `- \`${p}/\` - ${getPathDescription(p)}`).join('\n')}

${tierConfig.exclude.length > 0 ? `\n### Excluded Components\n\n${tierConfig.exclude.map(p => `- \`${p}/\``).join('\n')}` : ''}

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Configure environment:
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

3. Run development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Barton Doctrine Compliance

This repository enforces:
- ✅ Composio MCP required for all external integrations
- ✅ Gatekeeper-enforced access control
- ✅ No direct Neon vault access (must go through validator)

See \`ctb-template/.barton_policy.json\` for complete policy.

## CTB Version

Current CTB version: **${version.ctb_version}**
Last updated: ${version.last_updated}

## Documentation

- [CTB Architecture](./docs/ctb/)
- [Barton Doctrine](./docs/doctrine/)
- [API Reference](./docs/api/)

---

Generated by CTB Scaffold Generator from [IMO-Creator](https://github.com/djb258/imo-creator)
`;

  fs.writeFileSync(readmePath, readmeContent);
  console.log(`✅ Generated README.md\n`);

  // Initialize git repository
  try {
    execSync('git init', { cwd: outputDir, stdio: 'ignore' });
    execSync('git add .', { cwd: outputDir, stdio: 'ignore' });
    execSync(`git commit -m "🌲 Initialize ${repo} with CTB ${tier} tier (${bartonId})"`, {
      cwd: outputDir,
      stdio: 'ignore'
    });
    console.log(`✅ Initialized git repository\n`);
  } catch (error) {
    console.log(`⚠️  Could not initialize git repository (git may not be available)\n`);
  }

  // Success summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Scaffold Complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`Repository:  ${repo}`);
  console.log(`Location:    ${outputDir}`);
  console.log(`Barton ID:   ${bartonId}`);
  console.log(`CTB Tier:    ${tier}`);
  console.log(`CTB Version: ${version.ctb_version}\n`);
  console.log('Next steps:');
  console.log(`  cd ${repo}`);
  console.log(`  npm install`);
  console.log(`  npm run dev\n`);
}

function getPathDescription(path: string): string {
  const descriptions: Record<string, string> = {
    'sys': 'System infrastructure and core services',
    'data': 'Data layer with schema enforcement',
    'apps': 'Application code (UI, API, agents, tools)',
    'ai': 'AI models, prompts, and blueprints',
    'docs': 'Documentation and SOPs',
    'tests': 'Unit, integration, and audit tests'
  };
  return descriptions[path] || '';
}

// Run the scaffolder
scaffold().catch((error) => {
  console.error('\n❌ Scaffolding failed:', error.message);
  process.exit(1);
});
