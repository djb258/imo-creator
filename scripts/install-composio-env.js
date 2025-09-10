#!/usr/bin/env node

/**
 * Install Composio .env file to any repository
 * Usage: node install-composio-env.js [target-directory]
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function installComposioEnv(targetDir = process.cwd()) {
  log('\n🚀 Installing Composio MCP Environment Configuration', 'bright');
  log('================================================\n', 'blue');

  // Resolve paths
  const scriptDir = __dirname;
  const masterEnvPath = path.join(scriptDir, '..', 'config', 'master.env');
  const targetPath = path.resolve(targetDir);
  
  // Check if master.env exists
  if (!fs.existsSync(masterEnvPath)) {
    log('❌ Master .env file not found at: ' + masterEnvPath, 'red');
    log('   Please ensure config/master.env exists', 'yellow');
    process.exit(1);
  }

  // Check if target directory exists
  if (!fs.existsSync(targetPath)) {
    log('❌ Target directory does not exist: ' + targetPath, 'red');
    process.exit(1);
  }

  // Define target locations
  const targets = [
    { 
      path: path.join(targetPath, '.env'),
      description: 'Root .env file'
    },
    { 
      path: path.join(targetPath, 'mcp-servers', 'composio-mcp', '.env'),
      description: 'Composio MCP server'
    },
    { 
      path: path.join(targetPath, 'services', '.env'),
      description: 'Services directory'
    }
  ];

  log(`📁 Target directory: ${targetPath}`, 'blue');
  log(`📄 Master env source: ${masterEnvPath}\n`, 'blue');

  // Read master .env content
  const envContent = fs.readFileSync(masterEnvPath, 'utf8');
  
  // Process each target
  let installed = 0;
  let skipped = 0;
  
  targets.forEach(target => {
    const targetDir = path.dirname(target.path);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      log(`📁 Created directory: ${targetDir}`, 'yellow');
    }
    
    // Check if .env already exists
    if (fs.existsSync(target.path)) {
      // Create backup
      const backupPath = target.path + '.backup.' + Date.now();
      fs.copyFileSync(target.path, backupPath);
      log(`📦 Backed up existing: ${target.description} → ${path.basename(backupPath)}`, 'yellow');
    }
    
    // Write new .env file
    try {
      fs.writeFileSync(target.path, envContent);
      log(`✅ Installed: ${target.description}`, 'green');
      installed++;
    } catch (error) {
      log(`⚠️  Skipped: ${target.description} (${error.message})`, 'yellow');
      skipped++;
    }
  });

  // Also copy to common MCP server locations if they exist
  const mcpServers = [
    'neon-mcp',
    'smartsheet-mcp', 
    'instantly-mcp',
    'heyreach-mcp',
    'lovable-mcp',
    'builder-mcp',
    'figma-mcp'
  ];

  mcpServers.forEach(server => {
    const serverPath = path.join(targetPath, 'mcp-servers', server, '.env');
    const serverDir = path.dirname(serverPath);
    
    if (fs.existsSync(serverDir)) {
      try {
        fs.writeFileSync(serverPath, envContent);
        log(`✅ Installed: ${server}`, 'green');
        installed++;
      } catch (error) {
        // Silent skip if can't write
      }
    }
  });

  // Summary
  log('\n' + '='.repeat(50), 'blue');
  log(`\n📊 Installation Summary:`, 'bright');
  log(`   ✅ Installed: ${installed} locations`, 'green');
  if (skipped > 0) {
    log(`   ⚠️  Skipped: ${skipped} locations`, 'yellow');
  }
  
  log('\n💡 Next Steps:', 'bright');
  log('   1. Review the installed .env files', 'blue');
  log('   2. Update any project-specific values if needed', 'blue');
  log('   3. Add .env to .gitignore if not already present', 'blue');
  
  // Check and update .gitignore
  const gitignorePath = path.join(targetPath, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    if (!gitignoreContent.includes('.env')) {
      fs.appendFileSync(gitignorePath, '\n# Environment files\n.env\n.env.local\n.env.*.local\n');
      log('\n✅ Updated .gitignore to exclude .env files', 'green');
    }
  }

  log('\n✨ Composio environment successfully installed!\n', 'green');
}

// Handle command line arguments
const args = process.argv.slice(2);
const targetDir = args[0] || process.cwd();

// Run installation
installComposioEnv(targetDir);