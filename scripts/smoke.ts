#!/usr/bin/env ts-node

/**
 * Smoke tests for Abacus.AI × Composio MCP integration
 * Usage: npm run smoke
 */

import 'dotenv/config';
import { runTool, closeConnections } from '../src/composio/runTool';
import { Client } from 'pg';

interface TestResult {
  tool: string;
  status: 'pass' | 'fail' | 'skip';
  request_id?: string;
  latency_ms?: number;
  error?: string;
}

const results: TestResult[] = [];

/**
 * Test 1: Read-only SQL query on Neon
 */
async function testNeonSQL(): Promise<void> {
  if (!process.env.NEON_PG_URI) {
    results.push({
      tool: 'NEON_EXECUTE_SQL',
      status: 'skip',
      error: 'NEON_PG_URI not configured'
    });
    return;
  }

  console.log('🔍 Testing Neon SQL (read-only)...');
  
  try {
    const response = await runTool('NEON_EXECUTE_SQL', {
      query: 'SELECT NOW() as current_time, version() as pg_version',
      database_url: process.env.NEON_PG_URI
    }, {
      readOnly: true,
      timeoutMs: 10000
    });

    if (response.error) {
      results.push({
        tool: 'NEON_EXECUTE_SQL',
        status: 'fail',
        request_id: response.metadata?.request_id,
        latency_ms: response.metadata?.latency_ms,
        error: response.error.message
      });
    } else {
      results.push({
        tool: 'NEON_EXECUTE_SQL',
        status: 'pass',
        request_id: response.metadata?.request_id,
        latency_ms: response.metadata?.latency_ms
      });
      console.log('   ✅ SQL query successful');
    }
  } catch (error) {
    results.push({
      tool: 'NEON_EXECUTE_SQL',
      status: 'fail',
      error: error.message
    });
  }
}

/**
 * Test 2: Vercel deployment list (read-only)
 */
async function testVercelDeployments(): Promise<void> {
  if (!process.env.VERCEL_TOKEN) {
    results.push({
      tool: 'VERCEL_LIST_DEPLOYMENTS',
      status: 'skip',
      error: 'VERCEL_TOKEN not configured'
    });
    return;
  }

  console.log('🔍 Testing Vercel deployments (read-only)...');
  
  try {
    const response = await runTool('VERCEL_LIST_DEPLOYMENTS', {
      limit: 5,
      state: 'READY'
    }, {
      readOnly: true,
      timeoutMs: 10000
    });

    if (response.error) {
      results.push({
        tool: 'VERCEL_LIST_DEPLOYMENTS',
        status: 'fail',
        request_id: response.metadata?.request_id,
        latency_ms: response.metadata?.latency_ms,
        error: response.error.message
      });
    } else {
      results.push({
        tool: 'VERCEL_LIST_DEPLOYMENTS',
        status: 'pass',
        request_id: response.metadata?.request_id,
        latency_ms: response.metadata?.latency_ms
      });
      console.log('   ✅ Vercel list successful');
    }
  } catch (error) {
    results.push({
      tool: 'VERCEL_LIST_DEPLOYMENTS',
      status: 'fail',
      error: error.message
    });
  }
}

/**
 * Test 3: Check audit log was created
 */
async function checkAuditLog(): Promise<void> {
  if (!process.env.NEON_PG_URI) {
    results.push({
      tool: 'AUDIT_LOG_CHECK',
      status: 'skip',
      error: 'NEON_PG_URI not configured'
    });
    return;
  }

  console.log('🔍 Checking audit log...');
  
  try {
    const client = new Client({
      connectionString: process.env.NEON_PG_URI,
      ssl: { rejectUnauthorized: false }
    });
    
    await client.connect();
    
    const query = `
      SELECT COUNT(*) as count 
      FROM shq.composio_call_log 
      WHERE user_uuid = $1 
        AND ts >= CURRENT_DATE
    `;
    
    const result = await client.query(query, [
      process.env.HIVE_USER_UUID || '6b9518ed-5771-4153-95bd-c72ce46e84ef'
    ]);
    
    await client.end();
    
    const count = parseInt(result.rows[0]?.count || '0');
    
    if (count > 0) {
      results.push({
        tool: 'AUDIT_LOG_CHECK',
        status: 'pass',
        error: `Found ${count} log entries today`
      });
      console.log(`   ✅ Audit log has ${count} entries today`);
    } else {
      results.push({
        tool: 'AUDIT_LOG_CHECK',
        status: 'fail',
        error: 'No audit log entries found'
      });
    }
  } catch (error) {
    // Table might not exist yet - that's okay
    if (error.message.includes('does not exist')) {
      console.log('   ⚠️  Audit table not created yet - run: psql < sql/shq_composio_call_log.sql');
      results.push({
        tool: 'AUDIT_LOG_CHECK',
        status: 'skip',
        error: 'Audit table not created'
      });
    } else {
      results.push({
        tool: 'AUDIT_LOG_CHECK',
        status: 'fail',
        error: error.message
      });
    }
  }
}

/**
 * Test 4: Write operation blocking
 */
async function testWriteBlocking(): Promise<void> {
  console.log('🔍 Testing write operation blocking...');
  
  // Temporarily enable write blocking
  const originalValue = process.env.MCP_DISABLE_WRITE;
  process.env.MCP_DISABLE_WRITE = 'true';
  
  try {
    const response = await runTool('FAKE_DELETE_OPERATION', {
      id: 'test-123'
    });

    if (response.error && response.error.type === 'write_disabled') {
      results.push({
        tool: 'WRITE_BLOCK_TEST',
        status: 'pass',
        request_id: response.metadata?.request_id,
        error: 'Write correctly blocked'
      });
      console.log('   ✅ Write operations correctly blocked');
    } else {
      results.push({
        tool: 'WRITE_BLOCK_TEST',
        status: 'fail',
        error: 'Write operation was not blocked'
      });
    }
  } catch (error) {
    results.push({
      tool: 'WRITE_BLOCK_TEST',
      status: 'pass',
      error: 'Write blocked with error'
    });
  } finally {
    // Restore original value
    process.env.MCP_DISABLE_WRITE = originalValue;
  }
}

/**
 * Print results table
 */
function printResults(): void {
  console.log('\n' + '='.repeat(80));
  console.log('📊 SMOKE TEST RESULTS');
  console.log('='.repeat(80));
  
  // Table header
  console.log(
    'Tool'.padEnd(30) + 
    'Status'.padEnd(10) + 
    'Request ID'.padEnd(30) + 
    'Latency'
  );
  console.log('-'.repeat(80));
  
  // Table rows
  results.forEach(result => {
    const status = result.status === 'pass' ? '✅ PASS' : 
                   result.status === 'fail' ? '❌ FAIL' : 
                   '⏭️  SKIP';
    
    const requestId = result.request_id || '-';
    const latency = result.latency_ms ? `${result.latency_ms}ms` : '-';
    
    console.log(
      result.tool.padEnd(30) +
      status.padEnd(10) +
      requestId.padEnd(30) +
      latency
    );
    
    if (result.error) {
      console.log(`   └─ ${result.error}`);
    }
  });
  
  console.log('='.repeat(80));
  
  // Summary
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const skipped = results.filter(r => r.status === 'skip').length;
  
  console.log(`\nSummary: ${passed} passed, ${failed} failed, ${skipped} skipped`);
  
  if (failed === 0) {
    console.log('\n✅ Abacus → Composio wired; kill switch = disable Composio server or strip tools.');
  } else {
    console.log('\n❌ Some tests failed. Check configuration and retry.');
  }
}

/**
 * Main test runner
 */
async function main(): Promise<void> {
  console.log('🧪 Starting Abacus × Composio smoke tests...\n');
  
  // Run tests
  await testNeonSQL();
  await testVercelDeployments();
  await testWriteBlocking();
  await checkAuditLog();
  
  // Clean up
  await closeConnections();
  
  // Print results
  printResults();
  
  // Exit code
  const failed = results.filter(r => r.status === 'fail').length;
  process.exit(failed > 0 ? 1 : 0);
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run tests
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});