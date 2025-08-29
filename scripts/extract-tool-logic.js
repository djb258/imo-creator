#!/usr/bin/env node

/**
 * Tool Logic Extraction Script - Solo Developer Edition
 * Extracts doWork() logic from server.js into separate tool_handler.js files
 */

const fs = require('fs');
const path = require('path');

const MCP_SERVERS_DIR = path.join(__dirname, '..', 'mcp-servers');

function extractToolLogicFromServer(serverPath) {
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  // Extract class definition and doWork method using regex
  const classMatch = serverContent.match(/class\s+(\w+)\s+extends\s+SimpleMCPTool\s*{([\s\S]*?)^}/m);
  if (!classMatch) {
    console.log('❌ Could not find class extending SimpleMCPTool');
    return null;
  }
  
  const [, className, classBody] = classMatch;
  
  // Extract constructor
  const constructorMatch = classBody.match(/constructor\(\)\s*{([\s\S]*?)^\s{4}}/m);
  const constructorCode = constructorMatch ? constructorMatch[0] : '';
  
  // Extract doWork method
  const doWorkMatch = classBody.match(/async\s+doWork\([\s\S]*?^\s{4}}/m);
  const doWorkCode = doWorkMatch ? doWorkMatch[0] : '';
  
  // Extract other methods (excluding constructor, doWork, and healthCheck)
  const methodMatches = classBody.match(/^\s{4}async\s+\w+\([^}]*?\n\s{4}}/gm) || [];
  const otherMethods = methodMatches
    .filter(method => 
      !method.includes('constructor') && 
      !method.includes('doWork') && 
      !method.includes('healthCheck')
    )
    .join('\n\n');
  
  // Extract healthCheck method
  const healthCheckMatch = classBody.match(/async\s+healthCheck\(\)[\s\S]*?^\s{4}}/m);
  const healthCheckCode = healthCheckMatch ? healthCheckMatch[0] : '';
  
  return {
    className,
    constructorCode,
    doWorkCode, 
    otherMethods,
    healthCheckCode
  };
}

function generateToolHandler(serverName, extractedCode) {
  if (!extractedCode) {
    return null;
  }
  
  const { className, constructorCode, doWorkCode, otherMethods, healthCheckCode } = extractedCode;
  
  return `/**
 * ${className} - Tool Logic Handler
 * Extracted from server.js for better separation of concerns
 */

const { SimpleMCPTool } = require('../../../mcp-doctrine-layer/templates/simple_mcp_tool');
const axios = require('axios');

/**
 * ${className.replace('MCPTool', '')} MCP Tool Handler
 */
class ${className} extends SimpleMCPTool {
    ${constructorCode}

    /**
     * Main business logic - extracted from server.js
     */
    ${doWorkCode}

    ${otherMethods}

    /**
     * Health check implementation
     */
    ${healthCheckCode}
}

module.exports = { ${className} };`;
}

function updateServerFile(serverPath, className) {
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  // Replace the class import with tool handler import
  const updatedContent = serverContent
    // Remove the full class definition
    .replace(/class\s+\w+\s+extends\s+SimpleMCPTool\s*{[\s\S]*?^}/m, '')
    // Add import for tool handler
    .replace(
      /const axios = require\('axios'\);/,
      `const axios = require('axios');\nconst { ${className} } = require('./tools/tool_handler');`
    )
    // Update tool instantiation
    .replace(
      new RegExp(`const \\w+ = new ${className}\\(\\);`),
      `const tool = new ${className}();`
    )
    // Update references to use 'tool' variable
    .replace(/const (\w+Tool) = new/g, 'const tool = new')
    .replace(/(\w+Tool)\.execute/g, 'tool.execute')
    .replace(/(\w+Tool)\)/g, 'tool)')
    // Clean up extra blank lines
    .replace(/\n\n\n+/g, '\n\n');
    
  return updatedContent;
}

async function extractToolLogicForServer(serverName) {
  const serverDir = path.join(MCP_SERVERS_DIR, serverName);
  const serverPath = path.join(serverDir, 'server.js');
  const toolsDir = path.join(serverDir, 'tools');
  const toolHandlerPath = path.join(toolsDir, 'tool_handler.js');
  
  if (!fs.existsSync(serverPath)) {
    console.log(`❌ server.js not found for ${serverName}`);
    return;
  }
  
  console.log(`🔧 Extracting tool logic for ${serverName}...`);
  
  try {
    // Extract the tool logic
    const extractedCode = extractToolLogicFromServer(serverPath);
    if (!extractedCode) {
      console.log(`⚠️  Could not extract logic from ${serverName}`);
      return;
    }
    
    // Generate tool handler
    const toolHandlerContent = generateToolHandler(serverName, extractedCode);
    if (!toolHandlerContent) {
      console.log(`⚠️  Could not generate tool handler for ${serverName}`);
      return;
    }
    
    // Create tool handler file
    fs.writeFileSync(toolHandlerPath, toolHandlerContent);
    
    // Update server.js to use tool handler
    const updatedServerContent = updateServerFile(serverPath, extractedCode.className);
    fs.writeFileSync(serverPath, updatedServerContent);
    
    console.log(`✅ Tool logic extracted for ${serverName}`);
    
  } catch (error) {
    console.log(`❌ Error extracting logic for ${serverName}: ${error.message}`);
  }
}

async function main() {
  console.log('🔧 MCP Tool Logic Extraction Starting...\n');
  
  // Get all servers that have tools directories
  const servers = fs.readdirSync(MCP_SERVERS_DIR)
    .filter(dir => {
      const serverDir = path.join(MCP_SERVERS_DIR, dir);
      const toolsDir = path.join(serverDir, 'tools');
      const serverFile = path.join(serverDir, 'server.js');
      return fs.statSync(serverDir).isDirectory() && 
             fs.existsSync(toolsDir) &&
             fs.existsSync(serverFile) &&
             dir !== 'shared';
    });
  
  console.log(`Found ${servers.length} servers with tools directories:`);
  servers.forEach(s => console.log(`  - ${s}`));
  console.log('');
  
  // Process each server
  for (const server of servers) {
    await extractToolLogicForServer(server);
  }
  
  console.log('\n✅ Tool Logic Extraction Complete!');
  console.log('\nGenerated:');
  console.log('  - tools/tool_handler.js - Separated business logic');
  console.log('  - Updated server.js files to import tool handlers');
  console.log('\nNext step: Run node scripts/compliance-check.js');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { extractToolLogicForServer };