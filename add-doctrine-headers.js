#!/usr/bin/env node

/**
 * Add Doctrine Headers Script for IMO-Creator
 * Adds Barton ID headers and altitude compliance to API files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate Barton ID for IMO-Creator files
function generateBartonId(filePath, fileContent) {
  const fileName = path.basename(filePath, path.extname(filePath));

  // IMO-Creator specific ID patterns
  const patterns = {
    'hello': '01.01.01.07.10000.001',
    'llm': '01.02.01.07.10000.002',
    'save': '02.01.01.07.10000.003',
    'subagents': '01.03.01.07.10000.004',
    'test': '01.04.01.07.10000.005',
    'useSubagents': '03.01.01.07.10000.006',
    'imo-logger': '03.02.01.07.10000.007',
    'index': '04.01.01.07.10000.008' // garage-mcp
  };

  return patterns[fileName] || '99.99.99.07.10000.999';
}

// Check if file has doctrine header
function hasDoctrineHeader(content) {
  return /\/\*\*[\s\S]*?Doctrine Spec:/i.test(content) ||
         /\/\/[\s\S]*?Doctrine Spec:/i.test(content);
}

// Generate doctrine header for different file types
function generateDoctrineHeader(filePath, bartonId) {
  const fileName = path.basename(filePath);
  const isTypeScript = filePath.endsWith('.ts') || filePath.endsWith('.tsx');
  const isAPI = filePath.includes('/api/') || filePath.includes('\\api\\');

  let purpose = 'General utility';
  let altitude = '10000 (Execution Layer)';
  let input = 'various parameters';
  let output = 'processed results';
  let mcp = 'N/A';

  // Determine purpose based on file
  if (fileName.includes('hello')) {
    purpose = 'Simple API health check endpoint';
    input = 'HTTP request';
    output = 'JSON status response';
  } else if (fileName.includes('llm')) {
    purpose = 'LLM API proxy with provider selection';
    input = 'prompt, model, system message';
    output = 'AI response text or JSON';
  } else if (fileName.includes('save')) {
    purpose = 'SSOT processing with Barton ID compliance';
    input = 'SSOT data object';
    output = 'processed SSOT with IDs';
  } else if (fileName.includes('subagents')) {
    purpose = 'Subagent registry with garage-mcp integration';
    input = 'HTTP GET request';
    output = 'subagent list JSON';
    mcp = 'Garage-MCP (registry integration)';
  } else if (fileName.includes('useSubagents')) {
    purpose = 'React hook for subagent data fetching';
    input = 'component state';
    output = 'subagent data';
  } else if (fileName.includes('imo-logger')) {
    purpose = 'IMO logging utility';
    input = 'log messages and metadata';
    output = 'formatted log entries';
  } else if (fileName.includes('index') && filePath.includes('garage-mcp')) {
    purpose = 'MCP server for garage management operations';
    input = 'MCP tool requests';
    output = 'tool execution results';
    mcp = 'Model Control Protocol (MCP)';
  }

  const header = `/**
 * Doctrine Spec:
 * - Barton ID: ${bartonId}
 * - Altitude: ${altitude}
 * - Purpose: ${purpose}
 * - Input: ${input}
 * - Output: ${output}
 * - MCP: ${mcp}
 */`;

  return header;
}

// Add doctrine header to file
function addDoctrineHeader(filePath) {
  console.log(`🔧 Processing ${filePath}...`);

  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️  File not found`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already has doctrine header
  if (hasDoctrineHeader(content)) {
    console.log(`  ✓ Already has Doctrine header`);
    return;
  }

  // Generate appropriate header
  const bartonId = generateBartonId(filePath, content);
  const header = generateDoctrineHeader(filePath, bartonId);

  // Add header at the top
  const newContent = header + '\n' + content;

  // Write updated content
  fs.writeFileSync(filePath, newContent);
  console.log(`  ✅ Added Doctrine header with Barton ID: ${bartonId}`);
}

// Find all relevant files
function findTargetFiles() {
  const files = [];
  const searchPaths = [
    'api',
    'src/app/lib',
    'src',
    'garage-mcp/src'
  ];

  for (const searchPath of searchPaths) {
    if (fs.existsSync(searchPath)) {
      const walkDir = (dir) => {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            walkDir(fullPath);
          } else if (item.match(/\.(js|ts|tsx)$/) && !item.includes('-before-doctrine')) {
            files.push(fullPath);
          }
        }
      };
      walkDir(searchPath);
    }
  }

  return files;
}

// Main execution
function main() {
  console.log('🚀 Adding Doctrine headers to IMO-Creator files...\n');

  const targetFiles = findTargetFiles();
  console.log(`Found ${targetFiles.length} files to process\n`);

  let processed = 0;
  let modified = 0;

  for (const file of targetFiles) {
    const beforeContent = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    addDoctrineHeader(file);

    const afterContent = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    processed++;

    if (beforeContent !== afterContent) {
      modified++;
    }
  }

  console.log('\n✅ Doctrine header addition complete!');
  console.log(`📊 Summary:`);
  console.log(`  - Files processed: ${processed}`);
  console.log(`  - Files modified: ${modified}`);
  console.log(`\n🔍 Next: Update CI/CD for compliance validation`);
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}