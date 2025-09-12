#!/usr/bin/env ts-node

/**
 * Smoke test runner for Instantly × Composio integration
 * Usage: npm run smoke:instantly
 */

import 'dotenv/config';
import { runAndReportSmokeTests } from '../src/composio/smoke-tests';

async function main() {
  console.log('🧪 Starting Instantly × Composio smoke tests...\n');
  
  const exitCode = await runAndReportSmokeTests();
  
  process.exit(exitCode);
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});