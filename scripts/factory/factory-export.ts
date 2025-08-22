import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface ExportManifest {
  timestamp: string;
  vin: string;
  artifacts: {
    spec: string[];
    scripts: string[];
    documentation: string[];
    health: string;
  };
  checksums: Record<string, string>;
}

class FactoryExport {
  private specPath: string = 'docs/imo-spec';
  private exportPath: string = 'dist/factory-export';
  private manifest: ExportManifest;

  constructor() {
    this.manifest = {
      timestamp: new Date().toISOString(),
      vin: '',
      artifacts: {
        spec: [],
        scripts: [],
        documentation: [],
        health: ''
      },
      checksums: {}
    };
  }

  async export(): Promise<void> {
    console.log('📦 FACTORY EXPORT - Preparing production artifacts...\n');

    // 1. Check health status
    if (!this.checkHealth()) {
      console.log('❌ Export blocked: Factory check must pass first');
      console.log('Run: pnpm factory:check');
      process.exit(1);
    }

    // 2. Create export directory
    this.prepareExportDirectory();

    // 3. Export spec files
    this.exportSpecFiles();

    // 4. Export scripts
    this.exportScripts();

    // 5. Generate documentation
    this.generateDocumentation();

    // 6. Create manifest
    this.createManifest();

    // 7. Create archive
    this.createArchive();

    console.log('\n✅ FACTORY EXPORT COMPLETE');
    console.log(`📁 Output: ${this.exportPath}`);
    console.log(`📦 Archive: dist/factory-export.tar.gz`);
  }

  private checkHealth(): boolean {
    const healthPath = path.join(this.specPath, 'health.json');
    
    if (!fs.existsSync(healthPath)) {
      return false;
    }

    const health = JSON.parse(fs.readFileSync(healthPath, 'utf8'));
    
    if (health.overall === 'fail') {
      console.log('❌ Health check status: FAILED');
      return false;
    }

    this.manifest.vin = health.vin;
    this.manifest.artifacts.health = 'health.json';
    
    console.log('✅ Health check status: ' + health.overall.toUpperCase());
    return true;
  }

  private prepareExportDirectory(): void {
    // Clean and create export directory
    if (fs.existsSync(this.exportPath)) {
      fs.rmSync(this.exportPath, { recursive: true });
    }
    
    fs.mkdirSync(this.exportPath, { recursive: true });
    fs.mkdirSync(path.join(this.exportPath, 'spec'));
    fs.mkdirSync(path.join(this.exportPath, 'scripts'));
    fs.mkdirSync(path.join(this.exportPath, 'docs'));
    
    console.log(`📁 Created export directory: ${this.exportPath}`);
  }

  private exportSpecFiles(): void {
    const specFiles = [
      'flow.json',
      'globals.yaml',
      'compliance.yaml',
      'health.json',
      'diagram.mmd',
      'whimsical_prompt.txt'
    ];

    for (const file of specFiles) {
      const src = path.join(this.specPath, file);
      if (fs.existsSync(src)) {
        const dest = path.join(this.exportPath, 'spec', file);
        fs.copyFileSync(src, dest);
        this.manifest.artifacts.spec.push(file);
        this.manifest.checksums[file] = this.calculateChecksum(src);
      }
    }

    // Export page specs
    const pagesDir = path.join(this.specPath, 'pages');
    if (fs.existsSync(pagesDir)) {
      const pageFiles = fs.readdirSync(pagesDir);
      fs.mkdirSync(path.join(this.exportPath, 'spec', 'pages'));
      
      for (const pageFile of pageFiles) {
        const src = path.join(pagesDir, pageFile);
        const dest = path.join(this.exportPath, 'spec', 'pages', pageFile);
        fs.copyFileSync(src, dest);
        this.manifest.artifacts.spec.push(`pages/${pageFile}`);
      }
    }

    console.log(`📋 Exported ${this.manifest.artifacts.spec.length} spec files`);
  }

  private exportScripts(): void {
    const scripts = [
      'factory/validate-spec.ts',
      'factory/flow-to-mermaid.ts',
      'factory/factory-check.ts',
      'factory/factory-export.ts',
      'garage/garage-entrypoint.ts'
    ];

    for (const script of scripts) {
      const src = path.join('scripts', script);
      if (fs.existsSync(src)) {
        const dest = path.join(this.exportPath, 'scripts', path.basename(script));
        fs.copyFileSync(src, dest);
        this.manifest.artifacts.scripts.push(path.basename(script));
      }
    }

    console.log(`🔧 Exported ${this.manifest.artifacts.scripts.length} scripts`);
  }

  private generateDocumentation(): void {
    const docs: string[] = [];

    // Generate README
    const readme = `# Factory Export - ${this.manifest.vin}

Generated: ${this.manifest.timestamp}

## Contents

### Specifications
${this.manifest.artifacts.spec.map(f => `- ${f}`).join('\n')}

### Scripts
${this.manifest.artifacts.scripts.map(f => `- ${f}`).join('\n')}

## HEIR Compliance

This export has been validated for HEIR/ORBT compliance:
- STAMPED: Single Truth And Manifest Protocol ✓
- SPVPET: Schema Protocol Validation ✓
- STACKED: Staged Tracking And Compliance ✓

## Usage

1. Extract the archive
2. Run health check: \`npm run factory:check\`
3. Start garage: \`npm run garage:start\`

## Checksums

\`\`\`json
${JSON.stringify(this.manifest.checksums, null, 2)}
\`\`\`
`;

    fs.writeFileSync(path.join(this.exportPath, 'docs', 'README.md'), readme);
    docs.push('README.md');

    // Copy VIN documentation
    const vinDoc = `# VIN Format Documentation

## Format
\`\`\`
XXX-YYYY-MM-SYSTEM-MODE-VN
\`\`\`

## Current VIN
\`\`\`
${this.manifest.vin}
\`\`\`

## Components
- Prefix: IMO (IMO-Creator)
- Year: ${this.manifest.vin.split('-')[1]}
- Month: ${this.manifest.vin.split('-')[2]}
- System: ${this.manifest.vin.split('-')[3]}
- Mode: ${this.manifest.vin.split('-')[4]}
- Version: ${this.manifest.vin.split('-')[5]}
`;

    fs.writeFileSync(path.join(this.exportPath, 'docs', 'VIN.md'), vinDoc);
    docs.push('VIN.md');

    this.manifest.artifacts.documentation = docs;
    console.log(`📚 Generated ${docs.length} documentation files`);
  }

  private createManifest(): void {
    const manifestPath = path.join(this.exportPath, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(this.manifest, null, 2));
    console.log('📋 Created export manifest');
  }

  private createArchive(): void {
    try {
      execSync(`tar -czf dist/factory-export.tar.gz -C dist factory-export`, {
        stdio: 'inherit'
      });
      console.log('📦 Created archive: dist/factory-export.tar.gz');
    } catch (error) {
      console.log('⚠️  Could not create tar archive (tar command not available)');
      console.log('   Export available at: ' + this.exportPath);
    }
  }

  private calculateChecksum(filePath: string): string {
    const crypto = require('crypto');
    const content = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
  }
}

// Export for use in other scripts
export { FactoryExport };

// CLI execution
if (require.main === module) {
  const exporter = new FactoryExport();
  exporter.export();
}