#!/usr/bin/env ts-node

/**
 * CTB System Status Check Script
 *
 * Purpose: Monitors health of all CTB roles (AI_ENGINE, WORKBENCH_DB, VAULT_DB, INTEGRATION_BRIDGE)
 * Updates: /manual/troubleshooting/system_diagnostics.json
 * Viewer-Ready: JSON output consumable by CTB Viewer App
 *
 * Version: 1.3.0
 * Last Updated: 2025-10-23
 */

import * as fs from 'fs';
import * as path from 'path';

// Type Definitions
interface RoleDiagnostics {
  status: 'connected' | 'healthy' | 'degraded' | 'disconnected';
  latency_ms: number;
  driver: string;
  health_endpoint: string;
  last_check: string;
  issues: string[];
  [key: string]: any;
}

interface SystemDiagnostics {
  version: string;
  last_updated: string;
  scan_interval_ms: number;
  roles: Record<string, RoleDiagnostics>;
  system_health: {
    overall_status: 'healthy' | 'degraded' | 'critical';
    roles_healthy: number;
    roles_degraded: number;
    roles_down: number;
    last_incident: string | null;
  };
  alerts: string[];
  viewer_schema: {
    json_endpoint: string;
    update_script: string;
    websocket_support: boolean;
    polling_recommended_ms: number;
  };
}

interface DriverManifest {
  role: string;
  current_driver: string;
  altitude: string;
  status_endpoint: string;
  interface_contract?: any;
}

interface SystemMap {
  version: string;
  roles: string[];
  nodes: Array<{ id: string; altitude: string; color: string }>;
  links: Array<{ from: string; to: string; type: string }>;
}

// Constants
const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const SYSTEM_MAP_PATH = path.join(PROJECT_ROOT, 'manual/system-map/ctb_system_map.json');
const DIAGNOSTICS_PATH = path.join(PROJECT_ROOT, 'manual/troubleshooting/system_diagnostics.json');
const DRIVERS_DIR = path.join(PROJECT_ROOT, 'drivers');

/**
 * Read System Map Configuration
 */
function readSystemMap(): SystemMap {
  try {
    const content = fs.readFileSync(SYSTEM_MAP_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Failed to read system map: ${error}`);
    process.exit(1);
  }
}

/**
 * Read Driver Manifest for a specific role
 */
function readDriverManifest(role: string): DriverManifest | null {
  const manifestPath = path.join(DRIVERS_DIR, role, 'driver_manifest.json');

  try {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`⚠️  Failed to read driver manifest for ${role}: ${error}`);
    return null;
  }
}

/**
 * Simulate Health Check for a Role
 * (Stub implementation - replace with real checks in production)
 */
async function checkRoleHealth(role: string, manifest: DriverManifest): Promise<RoleDiagnostics> {
  const startTime = Date.now();

  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));

  const latency = Date.now() - startTime;
  const now = new Date().toISOString();

  // Stub status determination (in production, check actual endpoints)
  const status = latency < 300 ?
    (manifest.altitude === '20k' ? 'connected' : 'healthy') :
    'degraded';

  const diagnostics: RoleDiagnostics = {
    status,
    latency_ms: latency,
    driver: manifest.current_driver,
    health_endpoint: getHealthEndpoint(role, manifest),
    last_check: now,
    issues: latency > 300 ? [`High latency detected: ${latency}ms`] : []
  };

  // Add role-specific diagnostics
  switch (role) {
    case 'ai_engine':
      diagnostics.model = 'gemini-2.5-flash';
      break;

    case 'workbench_db':
      diagnostics.database_url = 'https://project.firebaseio.com';
      diagnostics.document_count = Math.floor(Math.random() * 100);
      diagnostics.validation_queue_size = Math.floor(Math.random() * 10);
      break;

    case 'vault_db':
      diagnostics.connection_pool = 'active';
      diagnostics.access_policy_enforced = true;
      diagnostics.validator_layer_active = true;
      break;

    case 'integration_bridge':
      diagnostics.registered_tools = 100;
      diagnostics.active_connections = Math.floor(Math.random() * 20);
      break;
  }

  return diagnostics;
}

/**
 * Get health endpoint for a role
 */
function getHealthEndpoint(role: string, manifest: DriverManifest): string {
  // Map roles to their health endpoints
  const endpointMap: Record<string, string> = {
    ai_engine: 'http://localhost:3001/tool',
    workbench_db: 'firebase://health',
    vault_db: 'postgresql://health',
    integration_bridge: 'http://localhost:3001/mcp/health'
  };

  return endpointMap[role] || 'unknown';
}

/**
 * Calculate System-Wide Health Status
 */
function calculateSystemHealth(roles: Record<string, RoleDiagnostics>): SystemDiagnostics['system_health'] {
  const roleArray = Object.values(roles);

  const healthy = roleArray.filter(r => r.status === 'healthy' || r.status === 'connected').length;
  const degraded = roleArray.filter(r => r.status === 'degraded').length;
  const down = roleArray.filter(r => r.status === 'disconnected').length;

  let overall_status: 'healthy' | 'degraded' | 'critical';

  if (down > 0) {
    overall_status = 'critical';
  } else if (degraded > 0) {
    overall_status = 'degraded';
  } else {
    overall_status = 'healthy';
  }

  return {
    overall_status,
    roles_healthy: healthy,
    roles_degraded: degraded,
    roles_down: down,
    last_incident: down > 0 ? new Date().toISOString() : null
  };
}

/**
 * Generate System Alerts
 */
function generateAlerts(roles: Record<string, RoleDiagnostics>): string[] {
  const alerts: string[] = [];

  for (const [roleName, diagnostics] of Object.entries(roles)) {
    if (diagnostics.status === 'disconnected') {
      alerts.push(`🔴 CRITICAL: ${roleName} is disconnected`);
    } else if (diagnostics.status === 'degraded') {
      alerts.push(`🟡 WARNING: ${roleName} is degraded (${diagnostics.latency_ms}ms latency)`);
    }

    if (diagnostics.issues.length > 0) {
      diagnostics.issues.forEach(issue => {
        alerts.push(`⚠️  ${roleName}: ${issue}`);
      });
    }
  }

  return alerts;
}

/**
 * Main Status Check Routine
 */
async function runStatusCheck(): Promise<void> {
  console.log('🔍 CTB System Status Check - Starting...\n');

  // Read system configuration
  const systemMap = readSystemMap();
  console.log(`📋 System Version: ${systemMap.version}`);
  console.log(`🔧 Roles to Check: ${systemMap.roles.join(', ')}\n`);

  // Check each role
  const roleDiagnostics: Record<string, RoleDiagnostics> = {};

  for (const role of systemMap.roles) {
    console.log(`Checking ${role}...`);

    const manifest = readDriverManifest(role);
    if (!manifest) {
      roleDiagnostics[role] = {
        status: 'disconnected',
        latency_ms: 0,
        driver: 'unknown',
        health_endpoint: 'unknown',
        last_check: new Date().toISOString(),
        issues: ['Failed to load driver manifest']
      };
      console.log(`  ❌ Status: disconnected (manifest not found)\n`);
      continue;
    }

    const diagnostics = await checkRoleHealth(role, manifest);
    roleDiagnostics[role] = diagnostics;

    const statusIcon = diagnostics.status === 'healthy' || diagnostics.status === 'connected' ? '✅' :
                      diagnostics.status === 'degraded' ? '🟡' : '❌';

    console.log(`  ${statusIcon} Status: ${diagnostics.status}`);
    console.log(`  ⏱️  Latency: ${diagnostics.latency_ms}ms`);
    console.log(`  🔌 Driver: ${diagnostics.driver}\n`);
  }

  // Calculate system-wide health
  const systemHealth = calculateSystemHealth(roleDiagnostics);
  const alerts = generateAlerts(roleDiagnostics);

  // Build diagnostics report
  const diagnosticsReport: SystemDiagnostics = {
    version: systemMap.version,
    last_updated: new Date().toISOString(),
    scan_interval_ms: 30000,
    roles: roleDiagnostics,
    system_health: systemHealth,
    alerts,
    viewer_schema: {
      json_endpoint: '/manual/troubleshooting/system_diagnostics.json',
      update_script: '/manual/scripts/status_check.ts',
      websocket_support: false,
      polling_recommended_ms: 30000
    }
  };

  // Write diagnostics to file
  try {
    fs.writeFileSync(
      DIAGNOSTICS_PATH,
      JSON.stringify(diagnosticsReport, null, 2),
      'utf-8'
    );
    console.log(`✅ Diagnostics written to: ${DIAGNOSTICS_PATH}\n`);
  } catch (error) {
    console.error(`❌ Failed to write diagnostics: ${error}`);
    process.exit(1);
  }

  // Print summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 SYSTEM HEALTH SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Overall Status:   ${systemHealth.overall_status.toUpperCase()}`);
  console.log(`Roles Healthy:    ${systemHealth.roles_healthy}`);
  console.log(`Roles Degraded:   ${systemHealth.roles_degraded}`);
  console.log(`Roles Down:       ${systemHealth.roles_down}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (alerts.length > 0) {
    console.log('🚨 ALERTS:');
    alerts.forEach(alert => console.log(`  ${alert}`));
    console.log('');
  }

  console.log('✅ Status check complete.\n');

  // Exit with appropriate code
  if (systemHealth.overall_status === 'critical') {
    process.exit(1);
  }
}

// Execute status check
runStatusCheck().catch(error => {
  console.error('❌ Fatal error during status check:', error);
  process.exit(1);
});
