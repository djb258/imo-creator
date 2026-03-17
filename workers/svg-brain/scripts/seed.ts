// ═══════════════════════════════════════════════════════════════
// Seed Script — Ingest IMO-Creator Doctrine into svg-brain
// ═══════════════════════════════════════════════════════════════
// Usage: npm run seed (requires BRAIN_API_URL env var)
// Reads doctrine files from imo-creator and POSTs to /ingest
// ═══════════════════════════════════════════════════════════════

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, extname } from 'path';

const API_URL = process.env.BRAIN_API_URL || 'http://localhost:8787';
const IMO_ROOT = process.env.IMO_ROOT || join(__dirname, '..', '..', 'imo-creator');

// Domain mapping based on source directory
const DOMAIN_MAP: Record<string, string> = {
  'law/doctrine': 'doctrine',
  'law/constitutional': 'governance',
  'law/integrations': 'integrations',
  'law/semantic': 'semantic',
  'factory/agents': 'agents',
  'factory/contracts': 'contracts',
  'fleet/car-template': 'templates',
  'fleet/checklists': 'checklists',
  'docs/adr': 'decisions',
};

// Files to seed (doctrine files from imo-creator)
const SEED_PATHS = [
  // Doctrine
  'law/doctrine/ARCHITECTURE.md',
  'law/doctrine/CTB_REGISTRY_ENFORCEMENT.md',
  'law/doctrine/FAIL_CLOSED_CI_CONTRACT.md',
  'law/doctrine/EXECUTION_SURFACE_LAW.md',
  'law/doctrine/ROLLBACK_PROTOCOL.md',
  'law/doctrine/LEGACY_COLLAPSE_PLAYBOOK.md',
  'law/doctrine/TIER0_DOCTRINE.md',
  // Constitutional
  'law/constitutional/PROMPT_SKILLS_BAY_CONSTITUTION.md',
  'law/constitutional/governance.md',
  // Integrations
  'law/integrations/TOOLS.md',
  'law/integrations/COMPOSIO.md',
  'law/integrations/DOPPLER.md',
  'law/integrations/HEIR.md',
  // Semantic
  'law/semantic/OSAM.md',
  // Agent skills
  'factory/agents/skill-creator/SKILL.md',
  'factory/agents/agent-orchestrator/SKILL.md',
  'factory/agents/agent-planner/SKILL.md',
  'factory/agents/agent-builder/SKILL.md',
  'factory/agents/agent-auditor/SKILL.md',
  'factory/agents/agent-db/SKILL.md',
  'factory/agents/cloudflare/SKILL.md',
  'factory/agents/neon/SKILL.md',
  // Templates
  'fleet/car-template/docs/PRD_HUB.md',
  'fleet/checklists/HUB_COMPLIANCE.md',
  // Top-level
  'CLAUDE.md',
  'OPERATOR_PROFILE.md',
  'CONSTITUTION.md',
];

function getDomain(filePath: string): string {
  for (const [prefix, domain] of Object.entries(DOMAIN_MAP)) {
    if (filePath.startsWith(prefix)) return domain;
  }
  return 'general';
}

function extractTitle(content: string, filePath: string): string {
  // Try to get the first markdown heading
  const match = content.match(/^#\s+(.+)$/m);
  if (match) return match[1].trim();
  // Fallback to filename
  const parts = filePath.split('/');
  return parts[parts.length - 1].replace('.md', '');
}

async function ingest(filePath: string, content: string): Promise<void> {
  const domain = getDomain(filePath);
  const title = extractTitle(content, filePath);

  const response = await fetch(`${API_URL}/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      domain,
      source_path: filePath,
      title,
      content,
      doc_version: '3.5.0',
    }),
  });

  const result = await response.json() as Record<string, unknown>;
  console.log(`  ${response.status === 201 ? '✓' : response.status === 200 ? '○' : '✗'} [${domain}] ${filePath} → ${(result as any).action || 'error'} (${(result as any).chunks_created || 0} chunks)`);
}

async function seedADRs(): Promise<void> {
  const adrDir = join(IMO_ROOT, 'docs', 'adr');
  try {
    const files = readdirSync(adrDir).filter(f => f.endsWith('.md') && f !== 'ADR_INDEX.md');
    for (const file of files) {
      const filePath = `docs/adr/${file}`;
      const content = readFileSync(join(adrDir, file), 'utf-8');
      await ingest(filePath, content);

      // Also extract ADR metadata for the decisions table
      const adrMatch = file.match(/^ADR-(\d+)/i);
      if (adrMatch) {
        const adrNumber = `ADR-${adrMatch[1].padStart(3, '0')}`;
        const title = extractTitle(content, filePath);
        const statusMatch = content.match(/\*\*Status\*\*[:\s]*(\w+)/i) || content.match(/Status[:\s|]*(\w+)/i);
        const dateMatch = content.match(/\d{4}-\d{2}-\d{2}/);

        await fetch(`${API_URL}/decisions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            adr_number: adrNumber,
            title,
            status: statusMatch?.[1]?.toLowerCase() || 'accepted',
            domain: 'decisions',
            summary: title,
            decided_at: dateMatch?.[0] || '2026-01-01',
          }),
        });
      }
    }
  } catch (e: any) {
    console.log(`  ⚠ ADR directory not found or empty: ${e.message}`);
  }
}

async function main(): Promise<void> {
  console.log(`\nsvg-brain seed script`);
  console.log(`API: ${API_URL}`);
  console.log(`IMO: ${IMO_ROOT}\n`);

  // Health check
  try {
    const health = await fetch(`${API_URL}/health`);
    const data = await health.json() as Record<string, unknown>;
    console.log(`Health: ${(data as any).status} (${(data as any).documents} existing docs)\n`);
  } catch {
    console.error('Cannot reach API. Is the worker running? (npx wrangler dev)\n');
    process.exit(1);
  }

  // Seed explicit files
  console.log('─── Seeding Doctrine Files ───');
  for (const filePath of SEED_PATHS) {
    const fullPath = join(IMO_ROOT, filePath);
    try {
      const content = readFileSync(fullPath, 'utf-8');
      await ingest(filePath, content);
    } catch (e: any) {
      console.log(`  ✗ ${filePath} — ${e.message}`);
    }
  }

  // Seed ADRs
  console.log('\n─── Seeding ADRs ───');
  await seedADRs();

  // Final status
  console.log('\n─── Done ───');
  const health = await fetch(`${API_URL}/health`);
  const data = await health.json() as Record<string, unknown>;
  console.log(`Total documents: ${(data as any).documents}\n`);
}

main().catch(console.error);
