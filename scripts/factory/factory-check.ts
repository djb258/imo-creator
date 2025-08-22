import * as fs from 'fs';
import * as path from 'path';
import { SpecValidator } from './validate-spec';
import { FlowToMermaid } from './flow-to-mermaid';

interface HealthStatus {
  timestamp: string;
  vin: string;
  overall: 'pass' | 'warn' | 'fail';
  checks: {
    vin_format: CheckResult;
    schema_congruence: CheckResult;
    gatekeeper_presence: CheckResult;
    validator_status: CheckResult;
    telemetry_active: CheckResult;
    heir_compliance: CheckResult;
  };
  pages: Record<string, PageHealth>;
  errors: string[];
  warnings: string[];
}

interface CheckResult {
  status: 'pass' | 'warn' | 'fail';
  message: string;
}

interface PageHealth {
  status: 'pass' | 'warn' | 'fail';
  guards_present: boolean;
  validators_present: boolean;
  gatekeeper_linked: boolean;
  telemetry_enabled: boolean;
  issues: string[];
}

class FactoryCheck {
  private specPath: string;
  private health: HealthStatus;

  constructor(specPath: string = 'docs/imo-spec') {
    this.specPath = specPath;
    this.health = this.initializeHealth();
  }

  private initializeHealth(): HealthStatus {
    return {
      timestamp: new Date().toISOString(),
      vin: '',
      overall: 'fail',
      checks: {
        vin_format: { status: 'fail', message: 'Not checked' },
        schema_congruence: { status: 'fail', message: 'Not checked' },
        gatekeeper_presence: { status: 'fail', message: 'Not checked' },
        validator_status: { status: 'fail', message: 'Not checked' },
        telemetry_active: { status: 'fail', message: 'Not checked' },
        heir_compliance: { status: 'fail', message: 'Not checked' }
      },
      pages: {},
      errors: [],
      warnings: []
    };
  }

  async runFullCheck(): Promise<HealthStatus> {
    console.log('🏭 FACTORY CHECK - Starting comprehensive validation...\n');
    console.log('=' .repeat(60));

    try {
      // 1. Load flow spec
      const flowPath = path.join(this.specPath, 'flow.json');
      if (!fs.existsSync(flowPath)) {
        this.health.errors.push('flow.json not found');
        this.health.overall = 'fail';
        return this.health;
      }

      const flowData = JSON.parse(fs.readFileSync(flowPath, 'utf8'));
      this.health.vin = flowData.vin;

      // 2. Check VIN format
      await this.checkVINFormat(flowData.vin);

      // 3. Check schema congruence (HEIR rules)
      await this.checkSchemaCongruence(flowData);

      // 4. Check gatekeeper presence
      await this.checkGatekeeperPresence(flowData.flow);

      // 5. Check validator status
      await this.checkValidatorStatus(flowData.flow);

      // 6. Check telemetry
      await this.checkTelemetry(flowData.flow);

      // 7. Check HEIR compliance
      await this.checkHEIRCompliance(flowData);

      // 8. Check individual pages
      await this.checkPages(flowData.flow.pages);

      // 9. Run Zod validation
      await this.runZodValidation();

      // 10. Generate visualizations
      await this.generateVisualizations();

      // Calculate overall status
      this.calculateOverallStatus();

      // Save health report
      await this.saveHealthReport();

    } catch (error) {
      this.health.errors.push(`Fatal error: ${error}`);
      this.health.overall = 'fail';
    }

    return this.health;
  }

  private async checkVINFormat(vin: string): Promise<void> {
    const vinRegex = /^[A-Z]{3}-\d{4}-\d{2}-[A-Z]+-[A-Z]+-V\d+$/;
    
    if (vinRegex.test(vin)) {
      this.health.checks.vin_format = {
        status: 'pass',
        message: `Valid VIN: ${vin}`
      };
      console.log(`✅ VIN Format: ${vin}`);
    } else {
      this.health.checks.vin_format = {
        status: 'fail',
        message: `Invalid VIN format: ${vin}`
      };
      this.health.errors.push('VIN format validation failed');
      console.log(`❌ VIN Format: Invalid - ${vin}`);
    }
  }

  private async checkSchemaCongruence(flowData: any): Promise<void> {
    const requiredRules = ['STAMPED', 'SPVPET', 'STACKED'];
    const presentRules = flowData.compliance?.heir_rules || [];
    
    const missingRules = requiredRules.filter(r => !presentRules.includes(r));
    
    if (missingRules.length === 0) {
      this.health.checks.schema_congruence = {
        status: 'pass',
        message: 'All HEIR rules present'
      };
      console.log('✅ Schema Congruence: STAMPED, SPVPET, STACKED');
    } else {
      this.health.checks.schema_congruence = {
        status: 'fail',
        message: `Missing HEIR rules: ${missingRules.join(', ')}`
      };
      this.health.errors.push(`Missing HEIR rules: ${missingRules.join(', ')}`);
      console.log(`❌ Schema Congruence: Missing ${missingRules.join(', ')}`);
    }
  }

  private async checkGatekeeperPresence(flow: any): Promise<void> {
    const requiredGates = ['input_gate', 'middle_gate', 'output_gate'];
    const presentGates = Object.keys(flow.gatekeepers || {});
    
    const missingGates = requiredGates.filter(g => !presentGates.includes(g));
    
    if (missingGates.length === 0) {
      // Check that pages reference gatekeepers correctly
      let allLinked = true;
      for (const page of Object.values(flow.pages) as any[]) {
        if (page.gatekeeper && !flow.gatekeepers[page.gatekeeper]) {
          allLinked = false;
          this.health.warnings.push(`Page ${page.id} references non-existent gatekeeper`);
        }
      }
      
      this.health.checks.gatekeeper_presence = {
        status: allLinked ? 'pass' : 'warn',
        message: allLinked ? 'All gatekeepers present and linked' : 'Gatekeepers present but some links broken'
      };
      console.log(allLinked ? '✅ Gatekeepers: All present and linked' : '⚠️  Gatekeepers: Present but some links broken');
    } else {
      this.health.checks.gatekeeper_presence = {
        status: 'fail',
        message: `Missing gatekeepers: ${missingGates.join(', ')}`
      };
      this.health.errors.push(`Missing required gatekeepers: ${missingGates.join(', ')}`);
      console.log(`❌ Gatekeepers: Missing ${missingGates.join(', ')}`);
    }
  }

  private async checkValidatorStatus(flow: any): Promise<void> {
    let totalValidators = 0;
    let missingValidators = [];
    
    for (const [pageId, page] of Object.entries(flow.pages) as any[]) {
      if (!page.validators || page.validators.length === 0) {
        missingValidators.push(pageId);
      } else {
        totalValidators += page.validators.length;
      }
    }
    
    if (missingValidators.length === 0) {
      this.health.checks.validator_status = {
        status: 'pass',
        message: `All pages have validators (total: ${totalValidators})`
      };
      console.log(`✅ Validators: All pages validated (${totalValidators} total)`);
    } else if (missingValidators.length < Object.keys(flow.pages).length / 2) {
      this.health.checks.validator_status = {
        status: 'warn',
        message: `Some pages missing validators: ${missingValidators.join(', ')}`
      };
      this.health.warnings.push(`Pages without validators: ${missingValidators.join(', ')}`);
      console.log(`⚠️  Validators: ${missingValidators.length} pages missing validators`);
    } else {
      this.health.checks.validator_status = {
        status: 'fail',
        message: `Many pages missing validators: ${missingValidators.join(', ')}`
      };
      this.health.errors.push('Insufficient validator coverage');
      console.log(`❌ Validators: ${missingValidators.length} pages missing validators`);
    }
  }

  private async checkTelemetry(flow: any): Promise<void> {
    let telemetryEnabled = 0;
    let telemetryMissing = [];
    
    for (const [pageId, page] of Object.entries(flow.pages) as any[]) {
      if (page.telemetry?.required && page.telemetry?.events?.length > 0) {
        telemetryEnabled++;
      } else {
        telemetryMissing.push(pageId);
      }
    }
    
    const coverage = telemetryEnabled / Object.keys(flow.pages).length;
    
    if (coverage === 1) {
      this.health.checks.telemetry_active = {
        status: 'pass',
        message: 'Full telemetry coverage'
      };
      console.log('✅ Telemetry: 100% coverage');
    } else if (coverage >= 0.5) {
      this.health.checks.telemetry_active = {
        status: 'warn',
        message: `Partial telemetry coverage: ${Math.round(coverage * 100)}%`
      };
      this.health.warnings.push(`Pages without telemetry: ${telemetryMissing.join(', ')}`);
      console.log(`⚠️  Telemetry: ${Math.round(coverage * 100)}% coverage`);
    } else {
      this.health.checks.telemetry_active = {
        status: 'fail',
        message: `Insufficient telemetry: ${Math.round(coverage * 100)}%`
      };
      this.health.errors.push('Telemetry coverage below minimum threshold');
      console.log(`❌ Telemetry: Only ${Math.round(coverage * 100)}% coverage`);
    }
  }

  private async checkHEIRCompliance(flowData: any): Promise<void> {
    const compliance = {
      STAMPED: !!(flowData.metadata?.stamped && flowData.vin),
      SPVPET: !!(flowData.flow?.pages && flowData.flow?.gatekeepers),
      STACKED: !!(flowData.compliance?.enforcement_level === 'strict')
    };
    
    const allCompliant = Object.values(compliance).every(v => v);
    const failedRules = Object.entries(compliance)
      .filter(([_, v]) => !v)
      .map(([k]) => k);
    
    if (allCompliant) {
      this.health.checks.heir_compliance = {
        status: 'pass',
        message: 'Fully HEIR compliant'
      };
      console.log('✅ HEIR Compliance: STAMPED ✓ SPVPET ✓ STACKED ✓');
    } else {
      this.health.checks.heir_compliance = {
        status: 'fail',
        message: `Non-compliant with: ${failedRules.join(', ')}`
      };
      this.health.errors.push(`HEIR non-compliance: ${failedRules.join(', ')}`);
      console.log(`❌ HEIR Compliance: Failed ${failedRules.join(', ')}`);
    }
  }

  private async checkPages(pages: any): Promise<void> {
    for (const [pageId, page] of Object.entries(pages) as any[]) {
      const pageHealth: PageHealth = {
        status: 'pass',
        guards_present: page.guards?.length > 0,
        validators_present: page.validators?.length > 0,
        gatekeeper_linked: !!page.gatekeeper,
        telemetry_enabled: page.telemetry?.required === true,
        issues: []
      };
      
      if (!pageHealth.guards_present) {
        pageHealth.issues.push('No guards defined');
        pageHealth.status = 'warn';
      }
      
      if (!pageHealth.validators_present) {
        pageHealth.issues.push('No validators defined');
        pageHealth.status = 'warn';
      }
      
      if (!pageHealth.telemetry_enabled) {
        pageHealth.issues.push('Telemetry not enabled');
        if (pageHealth.status === 'pass') pageHealth.status = 'warn';
      }
      
      this.health.pages[pageId] = pageHealth;
    }
    
    const pageStatuses = Object.values(this.health.pages).map(p => p.status);
    const failedPages = Object.entries(this.health.pages)
      .filter(([_, p]) => p.status === 'fail')
      .map(([id]) => id);
    
    if (failedPages.length > 0) {
      console.log(`❌ Pages: ${failedPages.length} pages failed checks`);
    } else if (pageStatuses.includes('warn')) {
      console.log(`⚠️  Pages: Some pages have warnings`);
    } else {
      console.log(`✅ Pages: All ${Object.keys(pages).length} pages healthy`);
    }
  }

  private async runZodValidation(): Promise<void> {
    const validator = new SpecValidator(this.specPath);
    const result = await validator.validate();
    
    if (!result.valid) {
      this.health.errors.push(...result.errors);
    }
    this.health.warnings.push(...result.warnings);
    
    console.log(result.valid ? '✅ Zod Validation: Passed' : '❌ Zod Validation: Failed');
  }

  private async generateVisualizations(): Promise<void> {
    try {
      const converter = new FlowToMermaid(path.join(this.specPath, 'flow.json'));
      converter.saveToFile(path.join(this.specPath, 'diagram.mmd'));
      converter.saveWhimsicalPrompt(path.join(this.specPath, 'whimsical_prompt.txt'));
      console.log('✅ Visualizations: Generated diagram.mmd and whimsical_prompt.txt');
    } catch (error) {
      this.health.warnings.push(`Failed to generate visualizations: ${error}`);
      console.log('⚠️  Visualizations: Generation failed');
    }
  }

  private calculateOverallStatus(): void {
    const checks = Object.values(this.health.checks);
    const hasFailure = checks.some(c => c.status === 'fail');
    const hasWarning = checks.some(c => c.status === 'warn');
    
    if (hasFailure || this.health.errors.length > 0) {
      this.health.overall = 'fail';
    } else if (hasWarning || this.health.warnings.length > 0) {
      this.health.overall = 'warn';
    } else {
      this.health.overall = 'pass';
    }
  }

  private async saveHealthReport(): Promise<void> {
    const healthPath = path.join(this.specPath, 'health.json');
    fs.writeFileSync(healthPath, JSON.stringify(this.health, null, 2));
    console.log(`\n📋 Health report saved to ${healthPath}`);
  }

  printSummary(): void {
    console.log('\n' + '=' .repeat(60));
    console.log('FACTORY CHECK SUMMARY');
    console.log('=' .repeat(60));
    
    console.log(`\nVIN: ${this.health.vin}`);
    console.log(`Timestamp: ${this.health.timestamp}`);
    console.log(`Overall Status: ${this.getStatusEmoji(this.health.overall)} ${this.health.overall.toUpperCase()}`);
    
    console.log('\nCheck Results:');
    for (const [check, result] of Object.entries(this.health.checks)) {
      console.log(`  ${this.getStatusEmoji(result.status)} ${check}: ${result.message}`);
    }
    
    if (this.health.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.health.warnings.forEach(w => console.log(`  - ${w}`));
    }
    
    if (this.health.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.health.errors.forEach(e => console.log(`  - ${e}`));
    }
    
    console.log('\n' + '=' .repeat(60));
    
    if (this.health.overall === 'pass') {
      console.log('✅ FACTORY CHECK PASSED - Ready for production!');
    } else if (this.health.overall === 'warn') {
      console.log('⚠️  FACTORY CHECK PASSED WITH WARNINGS - Review before production');
    } else {
      console.log('❌ FACTORY CHECK FAILED - Must fix errors before proceeding');
    }
  }

  private getStatusEmoji(status: string): string {
    switch (status) {
      case 'pass': return '✅';
      case 'warn': return '⚠️';
      case 'fail': return '❌';
      default: return '❓';
    }
  }
}

// Export for use in other scripts
export { FactoryCheck, HealthStatus };

// CLI execution
if (require.main === module) {
  const checker = new FactoryCheck();
  
  checker.runFullCheck().then(health => {
    checker.printSummary();
    
    // Exit with appropriate code for CI
    if (health.overall === 'fail') {
      process.exit(1);
    } else {
      process.exit(0);
    }
  });
}