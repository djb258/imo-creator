#!/usr/bin/env node

/**
 * MCP Compliance Checker - Solo Developer Edition
 * Validates all MCP servers against Barton Doctrine requirements
 */

const fs = require('fs');
const path = require('path');

const MCP_SERVERS_DIR = path.join(__dirname, '..', 'mcp-servers');

class ComplianceChecker {
  constructor() {
    this.results = {};
    this.totalScore = 0;
    this.maxScore = 0;
  }

  checkToolManifest(serverName, serverDir) {
    const manifestPath = path.join(serverDir, 'manifests', 'tool_manifest.json');
    const score = { current: 0, max: 25 };
    const issues = [];

    if (!fs.existsSync(manifestPath)) {
      issues.push('❌ Missing tool_manifest.json');
      return { score, issues };
    }

    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      // Check required fields
      if (manifest.tool_name) score.current += 5;
      else issues.push('❌ Missing tool_name');
      
      if (manifest.version) score.current += 3;
      else issues.push('❌ Missing version');
      
      if (manifest.manifest?.required_fields) score.current += 7;
      else issues.push('❌ Missing required_fields schema');
      
      if (manifest.compliance_checklist) score.current += 5;
      else issues.push('❌ Missing compliance_checklist');
      
      if (manifest.orbt_escalation_matrix) score.current += 5;
      else issues.push('❌ Missing orbt_escalation_matrix');
      
      if (score.current === 25) issues.push('✅ Tool manifest complete');
      
    } catch (error) {
      issues.push(`❌ Invalid JSON: ${error.message}`);
    }

    return { score, issues };
  }

  checkMockInfrastructure(serverName, serverDir) {
    const mockDir = path.join(serverDir, 'mock');
    const score = { current: 0, max: 15 };
    const issues = [];

    if (!fs.existsSync(mockDir)) {
      issues.push('❌ Missing mock directory');
      return { score, issues };
    }

    const samplePayloadPath = path.join(mockDir, 'sample_payload.json');
    const mockResponsePath = path.join(mockDir, 'mock_response.json');

    if (fs.existsSync(samplePayloadPath)) {
      score.current += 7;
      try {
        const payload = JSON.parse(fs.readFileSync(samplePayloadPath, 'utf8'));
        if (payload.unique_id && payload.process_id && payload.orbt_layer) {
          score.current += 3;
        } else {
          issues.push('❌ Sample payload missing HEIR/ORBT fields');
        }
      } catch (error) {
        issues.push('❌ Invalid sample payload JSON');
      }
    } else {
      issues.push('❌ Missing sample_payload.json');
    }

    if (fs.existsSync(mockResponsePath)) {
      score.current += 5;
    } else {
      issues.push('❌ Missing mock_response.json');
    }

    if (score.current === 15) issues.push('✅ Mock infrastructure complete');

    return { score, issues };
  }

  checkMiddleware(serverName, serverDir) {
    const middlewareDir = path.join(serverDir, 'middleware');
    const score = { current: 0, max: 20 };
    const issues = [];

    if (!fs.existsSync(middlewareDir)) {
      issues.push('❌ Missing middleware directory');
      return { score, issues };
    }

    const requiredFiles = [
      'validate_payload.js',
      'kill_switch.js', 
      'log_to_mantis.js'
    ];

    requiredFiles.forEach(file => {
      const filePath = path.join(middlewareDir, file);
      if (fs.existsSync(filePath)) {
        score.current += Math.floor(20 / requiredFiles.length);
      } else {
        issues.push(`❌ Missing ${file}`);
      }
    });

    // Bonus points for proper implementation
    if (score.current >= 18) {
      score.current = Math.min(20, score.current + 2);
      issues.push('✅ Middleware structure complete');
    }

    return { score, issues };
  }

  checkDocumentation(serverName, serverDir) {
    const readmePath = path.join(serverDir, 'README.md');
    const score = { current: 0, max: 15 };
    const issues = [];

    if (!fs.existsSync(readmePath)) {
      issues.push('❌ Missing README.md');
      return { score, issues };
    }

    try {
      const readme = fs.readFileSync(readmePath, 'utf8');
      
      if (readme.includes('Environment Variables')) score.current += 3;
      else issues.push('❌ Missing environment variables section');
      
      if (readme.includes('Usage Example')) score.current += 4;
      else issues.push('❌ Missing usage examples');
      
      if (readme.includes('Operations')) score.current += 3;
      else issues.push('❌ Missing operations documentation');
      
      if (readme.includes('Health Check')) score.current += 2;
      else issues.push('❌ Missing health check documentation');
      
      if (readme.includes('HEIR/ORBT Compliance')) score.current += 3;
      else issues.push('❌ Missing compliance documentation');
      
      if (score.current === 15) issues.push('✅ Documentation complete');
      
    } catch (error) {
      issues.push(`❌ Error reading README: ${error.message}`);
    }

    return { score, issues };
  }

  checkStructuredLogic(serverName, serverDir) {
    const toolsDir = path.join(serverDir, 'tools');
    const serverPath = path.join(serverDir, 'server.js');
    const score = { current: 0, max: 10 };
    const issues = [];

    if (!fs.existsSync(toolsDir)) {
      issues.push('❌ Missing tools directory');
      return { score, issues };
    }

    const toolHandlerPath = path.join(toolsDir, 'tool_handler.js');
    if (fs.existsSync(toolHandlerPath)) {
      score.current += 5;
    } else {
      issues.push('❌ Missing tool_handler.js');
    }

    if (fs.existsSync(serverPath)) {
      const serverContent = fs.readFileSync(serverPath, 'utf8');
      if (serverContent.includes('./tools/tool_handler')) {
        score.current += 5;
        issues.push('✅ Tool logic properly separated');
      } else {
        issues.push('❌ Server.js not using tool handler');
      }
    }

    return { score, issues };
  }

  checkHealthAndKillSwitch(serverName, serverDir) {
    const serverPath = path.join(serverDir, 'server.js');
    const score = { current: 0, max: 15 };
    const issues = [];

    if (!fs.existsSync(serverPath)) {
      issues.push('❌ Missing server.js');
      return { score, issues };
    }

    try {
      const serverContent = fs.readFileSync(serverPath, 'utf8');
      
      if (serverContent.includes('/mcp/health')) {
        score.current += 7;
        issues.push('✅ Health endpoint implemented');
      } else {
        issues.push('❌ Missing health endpoint');
      }
      
      if (serverContent.includes('setupKillSwitch')) {
        score.current += 8;
        issues.push('✅ Kill switch implemented');
      } else {
        issues.push('❌ Missing kill switch setup');
      }
      
    } catch (error) {
      issues.push(`❌ Error reading server.js: ${error.message}`);
    }

    return { score, issues };
  }

  async checkServerCompliance(serverName) {
    const serverDir = path.join(MCP_SERVERS_DIR, serverName);
    
    if (!fs.existsSync(serverDir) || !fs.statSync(serverDir).isDirectory()) {
      return {
        serverName,
        totalScore: 0,
        maxScore: 100,
        percentage: 0,
        issues: ['❌ Server directory not found']
      };
    }

    console.log(`🔍 Checking compliance for ${serverName}...`);

    const checks = [
      this.checkToolManifest(serverName, serverDir),
      this.checkMockInfrastructure(serverName, serverDir), 
      this.checkMiddleware(serverName, serverDir),
      this.checkDocumentation(serverName, serverDir),
      this.checkStructuredLogic(serverName, serverDir),
      this.checkHealthAndKillSwitch(serverName, serverDir)
    ];

    const totalScore = checks.reduce((sum, check) => sum + check.score.current, 0);
    const maxScore = checks.reduce((sum, check) => sum + check.score.max, 0);
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    const allIssues = checks.reduce((issues, check) => [...issues, ...check.issues], []);

    return {
      serverName,
      totalScore,
      maxScore, 
      percentage,
      issues: allIssues,
      breakdown: {
        manifest: checks[0],
        mocks: checks[1],
        middleware: checks[2],
        docs: checks[3], 
        structure: checks[4],
        health: checks[5]
      }
    };
  }

  async runComplianceCheck() {
    console.log('🚀 MCP Compliance Check Starting...\n');

    const servers = fs.readdirSync(MCP_SERVERS_DIR)
      .filter(dir => {
        const serverDir = path.join(MCP_SERVERS_DIR, dir);
        return fs.statSync(serverDir).isDirectory() && dir !== 'shared';
      });

    console.log(`Found ${servers.length} servers to check:`);
    servers.forEach(s => console.log(`  - ${s}`));
    console.log('');

    const results = [];
    let totalScoreSum = 0;
    let totalMaxSum = 0;

    for (const server of servers) {
      const result = await this.checkServerCompliance(server);
      results.push(result);
      totalScoreSum += result.totalScore;
      totalMaxSum += result.maxScore;
    }

    const overallPercentage = Math.round((totalScoreSum / totalMaxSum) * 100);

    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPLIANCE REPORT SUMMARY');
    console.log('='.repeat(60));

    results.forEach(result => {
      const status = result.percentage >= 80 ? '✅' : result.percentage >= 60 ? '⚠️ ' : '❌';
      console.log(`${status} ${result.serverName.padEnd(20)} ${result.percentage}% (${result.totalScore}/${result.maxScore})`);
    });

    console.log('='.repeat(60));
    console.log(`🎯 OVERALL COMPLIANCE: ${overallPercentage}% (${totalScoreSum}/${totalMaxSum})`);
    
    if (overallPercentage >= 90) {
      console.log('🏆 EXCELLENT - Barton Doctrine compliance achieved!');
    } else if (overallPercentage >= 70) {
      console.log('👍 GOOD - Minor improvements needed');
    } else if (overallPercentage >= 50) {
      console.log('⚠️  NEEDS WORK - Significant gaps remain');  
    } else {
      console.log('❌ CRITICAL - Major compliance failures');
    }

    console.log('\n📋 DETAILED ISSUES:');
    results.forEach(result => {
      if (result.percentage < 100) {
        console.log(`\n🔧 ${result.serverName}:`);
        result.issues.forEach(issue => console.log(`  ${issue}`));
      }
    });

    console.log('\n✅ Compliance check complete!');
    return { results, overallPercentage };
  }
}

async function main() {
  const checker = new ComplianceChecker();
  const report = await checker.runComplianceCheck();
  
  // Save detailed report
  const reportPath = path.join(__dirname, '..', 'COMPLIANCE_CHECK_RESULTS.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n💾 Detailed report saved to: ${reportPath}`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ComplianceChecker };