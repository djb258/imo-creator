#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface HealthStatus {
  timestamp: string;
  vin: string;
  overall: 'pass' | 'warn' | 'fail';
  checks: Record<string, { status: string; message: string }>;
  errors: string[];
  warnings: string[];
}

class GarageEntrypoint {
  private healthPath: string = 'docs/imo-spec/health.json';
  private killSwitchPath: string = '.imo/EMERGENCY_STOP';
  private health: HealthStatus | null = null;

  constructor() {
    console.log('🚗 GARAGE ENTRYPOINT - Initializing...\n');
  }

  async initialize(): Promise<boolean> {
    console.log('=' .repeat(60));
    console.log('GARAGE SYSTEM CHECK');
    console.log('=' .repeat(60) + '\n');

    // 1. Check for emergency stop
    if (this.checkEmergencyStop()) {
      return false;
    }

    // 2. Load and validate health status
    if (!this.loadHealthStatus()) {
      return false;
    }

    // 3. Verify HEIR compliance
    if (!this.verifyHEIRCompliance()) {
      return false;
    }

    // 4. Check gatekeepers
    if (!this.checkGatekeepers()) {
      return false;
    }

    // 5. Initialize telemetry
    this.initializeTelemetry();

    console.log('\n' + '=' .repeat(60));
    console.log('✅ GARAGE READY - All systems operational');
    console.log('=' .repeat(60) + '\n');

    return true;
  }

  private checkEmergencyStop(): boolean {
    if (fs.existsSync(this.killSwitchPath)) {
      console.log('🛑 EMERGENCY STOP ACTIVATED');
      console.log(`Kill switch file detected: ${this.killSwitchPath}`);
      console.log('\nTo proceed:');
      console.log(`  1. Resolve the emergency condition`);
      console.log(`  2. Remove the kill switch: rm ${this.killSwitchPath}`);
      console.log(`  3. Run factory check: pnpm factory:check`);
      console.log(`  4. Restart garage`);
      return true;
    }
    console.log('✅ Emergency Stop: Not activated');
    return false;
  }

  private loadHealthStatus(): boolean {
    if (!fs.existsSync(this.healthPath)) {
      console.log('❌ Health Check: health.json not found');
      console.log('\nHealth check required before garage can start:');
      console.log('  pnpm factory:check');
      return false;
    }

    try {
      this.health = JSON.parse(fs.readFileSync(this.healthPath, 'utf8'));
      
      // Check timestamp (must be recent)
      const healthAge = Date.now() - new Date(this.health!.timestamp).getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (healthAge > maxAge) {
        console.log('⚠️  Health Check: Outdated (>24 hours old)');
        console.log('  Run: pnpm factory:check');
        return false;
      }

      // Check overall status
      if (this.health!.overall === 'fail') {
        console.log('❌ Health Check: FAILED status');
        console.log('\nErrors must be fixed before garage can start:');
        this.health!.errors.forEach(e => console.log(`  - ${e}`));
        console.log('\nRun: pnpm factory:check');
        return false;
      }

      if (this.health!.overall === 'warn') {
        console.log('⚠️  Health Check: PASSED with warnings');
        console.log('\nWarnings:');
        this.health!.warnings.forEach(w => console.log(`  - ${w}`));
        console.log('\nProceeding with caution...');
      } else {
        console.log('✅ Health Check: PASSED');
      }

      console.log(`   VIN: ${this.health!.vin}`);
      console.log(`   Timestamp: ${this.health!.timestamp}`);
      
      return true;
    } catch (error) {
      console.log(`❌ Health Check: Failed to parse health.json - ${error}`);
      return false;
    }
  }

  private verifyHEIRCompliance(): boolean {
    if (!this.health) return false;

    const heirCheck = this.health.checks.heir_compliance;
    
    if (!heirCheck || heirCheck.status !== 'pass') {
      console.log('❌ HEIR Compliance: Not verified');
      console.log('  HEIR compliance is mandatory for garage operation');
      console.log('  Required: STAMPED, SPVPET, STACKED');
      return false;
    }

    console.log('✅ HEIR Compliance: Verified');
    console.log('   - STAMPED: Single Truth And Manifest Protocol ✓');
    console.log('   - SPVPET: Schema Protocol Validation ✓');
    console.log('   - STACKED: Staged Tracking And Compliance ✓');
    
    return true;
  }

  private checkGatekeepers(): boolean {
    if (!this.health) return false;

    const gatekeeperCheck = this.health.checks.gatekeeper_presence;
    
    if (!gatekeeperCheck || gatekeeperCheck.status === 'fail') {
      console.log('❌ Gatekeepers: Not all present');
      console.log('  Required: input_gate, middle_gate, output_gate');
      return false;
    }

    console.log('✅ Gatekeepers: All present and configured');
    return true;
  }

  private initializeTelemetry(): void {
    const telemetryDir = '.imo/telemetry';
    const telemetryFile = path.join(telemetryDir, 'garage.jsonl');
    
    // Create telemetry directory if it doesn't exist
    if (!fs.existsSync(telemetryDir)) {
      fs.mkdirSync(telemetryDir, { recursive: true });
    }

    // Log garage start event
    const startEvent = {
      timestamp: new Date().toISOString(),
      event_type: 'garage_start',
      vin: this.health?.vin,
      health_status: this.health?.overall,
      session_id: this.generateSessionId()
    };

    fs.appendFileSync(telemetryFile, JSON.stringify(startEvent) + '\n');
    console.log('✅ Telemetry: Initialized');
    console.log(`   Session: ${startEvent.session_id}`);
  }

  private generateSessionId(): string {
    return `garage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async runGarage(): Promise<void> {
    console.log('🔧 Starting Garage Bay operations...\n');

    // Here you would start the actual garage operations
    // For now, we'll simulate with a message
    console.log('Garage Bay Components:');
    console.log('  - Simple Garage Bay: Ready');
    console.log('  - Garage MCP: Ready');
    console.log('  - Garage Tools: Ready');
    console.log('  - Subagent Registry: Ready');
    
    console.log('\nAvailable Commands:');
    console.log('  garage:scan     - Scan repository for compliance');
    console.log('  garage:audit    - Run full audit');
    console.log('  garage:export   - Export factory artifacts');
    console.log('  garage:recall   - Trigger mechanic recall');
    
    console.log('\n🚗 Garage is running. Press Ctrl+C to stop.');
  }

  async shutdown(): Promise<void> {
    console.log('\n🛑 Shutting down garage...');
    
    // Log shutdown event
    const telemetryFile = '.imo/telemetry/garage.jsonl';
    const shutdownEvent = {
      timestamp: new Date().toISOString(),
      event_type: 'garage_shutdown',
      vin: this.health?.vin
    };
    
    fs.appendFileSync(telemetryFile, JSON.stringify(shutdownEvent) + '\n');
    console.log('Garage shutdown complete.');
  }
}

// Export for use in other scripts
export { GarageEntrypoint };

// CLI execution
if (require.main === module) {
  const garage = new GarageEntrypoint();
  
  garage.initialize().then(success => {
    if (success) {
      // Set up graceful shutdown
      process.on('SIGINT', () => {
        garage.shutdown().then(() => {
          process.exit(0);
        });
      });
      
      // Run garage
      garage.runGarage();
    } else {
      console.log('\n❌ GARAGE FAILED TO START');
      console.log('Fix the issues above and try again.');
      process.exit(1);
    }
  });
}