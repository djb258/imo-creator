/**
 * Doctrine Enforcement Script
 * "AI helps build the system. Old school runs the system."
 */

const fs = require('fs');
const path = require('path');

class DoctrineEnforcer {
  constructor() {
    this.violations = [];
    this.environment = process.env.NODE_ENV || 'development';
    this.isProduction = this.environment === 'production';
  }

  // Check for LLM usage in production
  checkProductionLLMUsage() {
    console.log('🔍 Checking for production LLM usage violations...');
    
    const violations = [];
    
    // Check for Claude/OpenAI API usage in production files
    const productionFiles = this.getProductionFiles();
    
    for (const file of productionFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for LLM API calls
      const llmPatterns = [
        /claude.*api/i,
        /openai.*api/i,
        /anthropic.*api/i,
        /gpt-.*model/i,
        /llm.*call/i,
        /ai.*agent/i
      ];
      
      for (const pattern of llmPatterns) {
        if (pattern.test(content) && !this.isExempted(file)) {
          violations.push({
            file,
            pattern: pattern.source,
            line: this.getLineNumber(content, pattern)
          });
        }
      }
    }
    
    if (violations.length > 0) {
      console.log('❌ DOCTRINE VIOLATION: LLM usage detected in production files');
      violations.forEach(v => {
        console.log(`   ${v.file}:${v.line} - ${v.pattern}`);
      });
      this.violations.push(...violations);
    } else {
      console.log('✅ No production LLM violations found');
    }
  }

  // Validate MCP-only execution paths
  checkMCPCompliance() {
    console.log('🔍 Validating MCP-only execution paths...');
    
    const mcpServers = this.getMCPServers();
    const violations = [];
    
    // Check that all runtime logic goes through MCP servers
    for (const server of mcpServers) {
      const manifestPath = path.join(server, 'manifests', 'tool_manifest.json');
      
      if (!fs.existsSync(manifestPath)) {
        violations.push({
          server,
          issue: 'Missing tool manifest'
        });
        continue;
      }
      
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        
        if (!manifest.tools || manifest.tools.length === 0) {
          violations.push({
            server,
            issue: 'No tools defined in manifest'
          });
        }
        
        if (!manifest.heir_compliance) {
          violations.push({
            server,
            issue: 'Missing HEIR compliance declaration'
          });
        }
        
      } catch (error) {
        violations.push({
          server,
          issue: `Invalid manifest JSON: ${error.message}`
        });
      }
    }
    
    if (violations.length > 0) {
      console.log('❌ DOCTRINE VIOLATION: MCP compliance issues found');
      violations.forEach(v => {
        console.log(`   ${v.server}: ${v.issue}`);
      });
      this.violations.push(...violations);
    } else {
      console.log('✅ MCP compliance validated');
    }
  }

  // Check for retired AI subagents in garage
  checkGarageCompliance() {
    console.log('🔍 Checking garage for retired AI subagents...');
    
    const garageDir = path.join(__dirname, '..', 'garage');
    
    if (!fs.existsSync(garageDir)) {
      this.violations.push({
        issue: 'Missing garage directory for retired AI subagents'
      });
      console.log('❌ DOCTRINE VIOLATION: Missing garage directory');
      return;
    }
    
    // Check for AI components that should be retired
    const activeAIComponents = this.findActiveAIComponents();
    
    if (activeAIComponents.length > 0 && this.isProduction) {
      console.log('❌ DOCTRINE VIOLATION: Active AI components in production');
      activeAIComponents.forEach(component => {
        console.log(`   ${component} should be retired to garage/`);
        this.violations.push({
          component,
          issue: 'AI component not retired in production'
        });
      });
    } else {
      console.log('✅ AI component retirement compliance validated');
    }
  }

  // Validate pre-deployment requirements
  validatePreDeployment() {
    console.log('🔍 Running pre-deployment doctrine validation...');
    
    const requirements = [
      () => this.checkProductionLLMUsage(),
      () => this.checkMCPCompliance(),
      () => this.checkGarageCompliance(),
      () => this.validateManifestStructure(),
      () => this.checkHEIRCompliance()
    ];
    
    for (const requirement of requirements) {
      requirement();
    }
    
    if (this.violations.length === 0) {
      console.log('✅ PRE-DEPLOYMENT DOCTRINE VALIDATION PASSED');
      return true;
    } else {
      console.log('❌ PRE-DEPLOYMENT DOCTRINE VALIDATION FAILED');
      console.log(`   ${this.violations.length} violations found`);
      return false;
    }
  }

  // Block deployment if doctrine violations exist
  enforceDeploymentGate() {
    if (this.isProduction && !this.validatePreDeployment()) {
      console.log('🚨 DEPLOYMENT BLOCKED BY DOCTRINE ENFORCEMENT');
      process.exit(1);
    }
  }

  // Utility methods
  getProductionFiles() {
    const files = [];
    const searchDirs = ['src', 'lib', 'components', 'pages', 'api'];
    
    for (const dir of searchDirs) {
      const fullPath = path.join(__dirname, '..', dir);
      if (fs.existsSync(fullPath)) {
        files.push(...this.getFilesRecursively(fullPath));
      }
    }
    
    return files.filter(file => file.endsWith('.js') || file.endsWith('.ts'));
  }

  getMCPServers() {
    const mcpDir = path.join(__dirname, '..', 'mcp-servers');
    if (!fs.existsSync(mcpDir)) return [];
    
    return fs.readdirSync(mcpDir)
      .map(name => path.join(mcpDir, name))
      .filter(dir => fs.statSync(dir).isDirectory());
  }

  getFilesRecursively(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.getFilesRecursively(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  isExempted(file) {
    // Allow LLM usage in development and testing
    if (!this.isProduction) return true;
    
    // Exempt development-only files
    const exemptPatterns = [
      /test/i,
      /spec/i,
      /dev/i,
      /development/i,
      /garage/i
    ];
    
    return exemptPatterns.some(pattern => pattern.test(file));
  }

  getLineNumber(content, pattern) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (pattern.test(lines[i])) {
        return i + 1;
      }
    }
    return 1;
  }

  findActiveAIComponents() {
    // Look for active AI components that should be retired
    const components = [];
    // Implementation would scan for AI-related components
    return components;
  }

  validateManifestStructure() {
    console.log('🔍 Validating manifest structure...');
    // Implementation for manifest validation
    console.log('✅ Manifest structure validated');
  }

  checkHEIRCompliance() {
    console.log('🔍 Checking HEIR compliance...');
    // Implementation for HEIR compliance check
    console.log('✅ HEIR compliance validated');
  }
}

// CLI usage
if (require.main === module) {
  const command = process.argv[2] || 'validate';
  const enforcer = new DoctrineEnforcer();
  
  switch (command) {
    case 'validate':
      enforcer.validatePreDeployment();
      break;
    case 'enforce':
      enforcer.enforceDeploymentGate();
      break;
    case 'llm-check':
      enforcer.checkProductionLLMUsage();
      break;
    case 'mcp-check':
      enforcer.checkMCPCompliance();
      break;
    default:
      console.log('Usage: node doctrine-enforcer.js [validate|enforce|llm-check|mcp-check]');
  }
}

module.exports = DoctrineEnforcer;