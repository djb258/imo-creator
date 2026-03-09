/**
 * Fleet data for the dashboard.
 *
 * CANONICAL SOURCES (authoritative for these fields):
 *   - sys/registry/repo_registry.json → name, path, github_url, default_branch, enabled
 *   - sys/registry/fleet_inventory.json → alignment status (has_heir, has_ci_gate, etc.)
 *   - FLEET_REGISTRY.yaml → child_version, last_synced (human-observed)
 *
 * DASHBOARD-ONLY FIELDS (maintained here):
 *   - docs, workPackets, todos, subHubs, tier
 *
 * To regenerate from registries: node scripts/generate-fleet-data.js
 * Last synced with registries: 2026-03-09
 */
import type { FleetRepo } from './types';
import { utSubHubs } from './ut-subhubs';

export const fleet: FleetRepo[] = [
  {
    name: 'imo-creator',
    path: '.',
    purpose: 'Sovereign doctrine repository — the Garage',
    tier: 'Garage',
    doctrineVersion: '3.5.0',
    syncStatus: 'SOVEREIGN',
    status: 'ACTIVE',
    docs: [
      { file: 'CLAUDE.md', status: 'PRESENT' },
      { file: 'CONSTITUTION.md', status: 'PRESENT' },
      { file: 'FLEET_REGISTRY.yaml', status: 'PRESENT' },
      { file: 'templates/doctrine/ARCHITECTURE.md', status: 'PRESENT' },
      { file: 'templates/doctrine/CTB_REGISTRY_ENFORCEMENT.md', status: 'PRESENT' },
      { file: 'templates/integrations/TOOLS.md', status: 'PRESENT' },
      { file: 'templates/semantic/OSAM.md', status: 'PRESENT' },
    ],
    subHubs: utSubHubs,
    workPackets: [
      {
        id: 'WP-001',
        title: 'UT Dashboard — Fleet Control Panel',
        repo: 'imo-creator',
        status: 'COMPLETE',
        agent: 'builder-1',
        currentPhase: 'Phase 6 — Deliver',
        pipelineStage: 'MERGE',
        createdAt: '2026-03-09T10:00:00Z',
        updatedAt: '2026-03-09T18:00:00Z',
      },
    ],
    todos: [
      { id: 'T-001', text: 'Register TOOL-012 in SNAP_ON_TOOLBOX.yaml (ADR-026)', priority: 'HIGH', done: true },
      { id: 'T-002', text: 'Write ADR-026 for UT Tool Registration', priority: 'HIGH', done: true },
      { id: 'T-003', text: 'Convert agents to skill format', priority: 'HIGH', done: true },
      { id: 'T-004', text: 'Fix registry drift (repo_registry, fleet_inventory, taxonomy)', priority: 'HIGH', done: true },
    ],
  },
  {
    name: 'barton-outreach-core',
    path: '../barton-outreach-core',
    purpose: 'Outreach operations hub',
    tier: 'Car',
    doctrineVersion: '3.5.0',
    syncStatus: 'SYNCED',
    status: 'ACTIVE',
    docs: [
      { file: 'CLAUDE.md', status: 'PRESENT' },
      { file: 'README.md', status: 'PRESENT' },
      { file: 'CONSTITUTION.md', status: 'PRESENT' },
      { file: 'docs/OSAM.md', status: 'PRESENT' },
      { file: 'docs/adr/ADR-INDEX.md', status: 'PRESENT' },
      { file: 'docs/checklists/HUB_COMPLIANCE.md', status: 'PRESENT' },
    ],
    workPackets: [
      {
        id: 'WP-003',
        title: 'Doctrine v3.5.0 sync + fleet standardization',
        repo: 'barton-outreach-core',
        status: 'COMPLETE',
        agent: 'builder-2',
        currentPhase: 'Phase 6 — Deliver',
        pipelineStage: 'MERGE',
        createdAt: '2026-03-08T09:00:00Z',
        updatedAt: '2026-03-09T18:00:00Z',
      },
    ],
    todos: [
      { id: 'T-010', text: 'Create docs/OSAM.md from template', priority: 'CRITICAL', done: true },
      { id: 'T-011', text: 'Sync to doctrine v3.5.0', priority: 'HIGH', done: true },
    ],
  },
  {
    name: 'client',
    path: '../client',
    purpose: 'Client management hub',
    tier: 'Car',
    doctrineVersion: '3.5.0',
    syncStatus: 'SYNCED',
    status: 'ACTIVE',
    docs: [
      { file: 'CLAUDE.md', status: 'PRESENT' },
      { file: 'README.md', status: 'PRESENT' },
      { file: 'CONSTITUTION.md', status: 'PRESENT' },
      { file: 'docs/OSAM.md', status: 'PRESENT' },
      { file: 'docs/adr/ADR-INDEX.md', status: 'PRESENT' },
      { file: 'docs/checklists/HUB_COMPLIANCE.md', status: 'PRESENT' },
    ],
    workPackets: [],
    todos: [],
  },
  {
    name: 'company-lifecycle-cl',
    path: '../CL/company-lifecycle-cl',
    purpose: 'Company lifecycle management hub',
    tier: 'Car',
    doctrineVersion: '3.5.0',
    syncStatus: 'SYNCED',
    status: 'ACTIVE',
    docs: [
      { file: 'CLAUDE.md', status: 'PRESENT' },
      { file: 'README.md', status: 'PRESENT' },
      { file: 'CONSTITUTION.md', status: 'PRESENT' },
      { file: 'docs/OSAM.md', status: 'PRESENT' },
      { file: 'docs/adr/ADR-INDEX.md', status: 'PRESENT' },
      { file: 'docs/checklists/HUB_COMPLIANCE.md', status: 'PRESENT' },
    ],
    workPackets: [],
    todos: [],
  },
  {
    name: 'sales',
    path: '../Sales Process',
    purpose: 'Sales operations hub',
    tier: 'Car',
    doctrineVersion: '3.5.0',
    syncStatus: 'SYNCED',
    status: 'ACTIVE',
    docs: [
      { file: 'CLAUDE.md', status: 'PRESENT' },
      { file: 'README.md', status: 'PRESENT' },
      { file: 'CONSTITUTION.md', status: 'PRESENT' },
      { file: 'docs/OSAM.md', status: 'PRESENT' },
      { file: 'docs/adr/ADR-INDEX.md', status: 'PRESENT' },
      { file: 'docs/checklists/HUB_COMPLIANCE.md', status: 'PRESENT' },
    ],
    workPackets: [],
    todos: [],
  },
  {
    name: 'barton-storage',
    path: '../storage container go-nogo',
    purpose: 'Storage container hub',
    tier: 'Car',
    doctrineVersion: '3.5.0',
    syncStatus: 'SYNCED',
    status: 'ACTIVE',
    docs: [
      { file: 'CLAUDE.md', status: 'PRESENT' },
      { file: 'README.md', status: 'PRESENT' },
      { file: 'CONSTITUTION.md', status: 'PRESENT' },
      { file: 'docs/OSAM.md', status: 'PRESENT' },
      { file: 'docs/adr/ADR-INDEX.md', status: 'PRESENT' },
      { file: 'docs/checklists/HUB_COMPLIANCE.md', status: 'PRESENT' },
    ],
    workPackets: [],
    todos: [],
  },
  {
    name: 'research',
    path: '[TBD]',
    purpose: 'Research hub',
    tier: 'Car',
    doctrineVersion: 'NOT FOUND',
    syncStatus: 'NEVER',
    status: 'PLANNED',
    docs: [
      { file: 'CLAUDE.md', status: 'MISSING' },
      { file: 'README.md', status: 'MISSING' },
      { file: 'CONSTITUTION.md', status: 'MISSING' },
      { file: 'docs/OSAM.md', status: 'MISSING' },
      { file: 'docs/adr/ADR-INDEX.md', status: 'MISSING' },
      { file: 'docs/checklists/HUB_COMPLIANCE.md', status: 'MISSING' },
    ],
    workPackets: [],
    todos: [
      { id: 'T-060', text: 'Create local repo', priority: 'NORMAL', done: false },
      { id: 'T-061', text: 'Bootstrap: create all required docs', priority: 'NORMAL', done: false },
    ],
  },
];
