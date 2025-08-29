/**
 * Basic Test Runner - Solo Developer Edition
 * Simple testing without complex frameworks
 */

const fs = require('fs');
const path = require('path');

class BasicTestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('🧪 Running MCP Server Tests...\n');
    
    for (const { name, fn } of this.tests) {
      try {
        await fn();
        console.log(`✅ ${name}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${name}`);
        console.log(`   Error: ${error.message}\n`);
        this.failed++;
      }
    }
    
    console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed`);
    return this.failed === 0;
  }

  // Simple assertions
  static assert(condition, message = 'Assertion failed') {
    if (!condition) {
      throw new Error(message);
    }
  }

  static assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  }

  static async assertThrows(fn, message) {
    try {
      await fn();
      throw new Error(message || 'Expected function to throw');
    } catch (error) {
      if (error.message === message || error.message === 'Expected function to throw') {
        throw error;
      }
      // Function threw as expected
    }
  }
}

// Run tests for MCP servers
async function runMCPTests() {
  const runner = new BasicTestRunner();
  
  // Test database router
  runner.test('Database Router - Health Check', async () => {
    const dbRouter = require('../shared/database-router');
    const health = await dbRouter.healthCheck();
    BasicTestRunner.assert(typeof health === 'object', 'Health check should return object');
  });

  // Test error handler
  runner.test('Error Handler - Retry Logic', async () => {
    const ErrorHandler = require('../shared/error-handler');
    let attempts = 0;
    
    try {
      await ErrorHandler.withRetry(() => {
        attempts++;
        if (attempts < 3) throw new Error('Temporary error');
        return 'success';
      }, 3);
    } catch (error) {
      // Expected to succeed on 3rd attempt
    }
    
    BasicTestRunner.assert(attempts === 3, 'Should make 3 attempts');
  });

  // Test rate limiter
  runner.test('Rate Limiter - Basic Limiting', async () => {
    const rateLimiter = require('../shared/simple-rate-limiter');
    
    const result1 = rateLimiter.isAllowed('test-user', 2, 60000);
    BasicTestRunner.assert(result1.allowed, 'First request should be allowed');
    
    const result2 = rateLimiter.isAllowed('test-user', 2, 60000);
    BasicTestRunner.assert(result2.allowed, 'Second request should be allowed');
    
    const result3 = rateLimiter.isAllowed('test-user', 2, 60000);
    BasicTestRunner.assert(!result3.allowed, 'Third request should be blocked');
  });

  // Test MCP server health endpoints
  const serverDirs = fs.readdirSync(path.join(__dirname, '../mcp-servers'))
    .filter(dir => fs.statSync(path.join(__dirname, '../mcp-servers', dir)).isDirectory());

  for (const serverDir of serverDirs.slice(0, 3)) { // Test first 3 servers
    runner.test(`MCP Server - ${serverDir} structure`, async () => {
      const serverPath = path.join(__dirname, '../mcp-servers', serverDir);
      
      BasicTestRunner.assert(
        fs.existsSync(path.join(serverPath, 'server.js')),
        'server.js should exist'
      );
      
      BasicTestRunner.assert(
        fs.existsSync(path.join(serverPath, 'package.json')),
        'package.json should exist'
      );
      
      BasicTestRunner.assert(
        fs.existsSync(path.join(serverPath, 'manifests/tool_manifest.json')),
        'tool_manifest.json should exist'
      );
    });
  }

  return await runner.run();
}

if (require.main === module) {
  runMCPTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { BasicTestRunner, runMCPTests };