#!/usr/bin/env node

/**
 * Cross-Repository Composio Configuration Sync
 *
 * This script syncs Composio configuration, MCP servers, and git hooks
 * from the central imo-creator repository to other repositories.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

class ComposioConfigSync {
  constructor() {
    // Load environment variables
    if (fs.existsSync('.env')) {
      const envContent = fs.readFileSync('.env', 'utf8');
      envContent.split('\n').forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const [key, ...valueParts] = trimmedLine.split('=');
          const value = valueParts.join('=');
          if (key && value && !process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    }

    this.githubToken = process.env.GITHUB_API_TOKEN;
    this.githubUser = 'djb258';
    this.centralRepo = 'imo-creator';
    this.baseURL = 'https://api.github.com';

    this.headers = {
      'Authorization': `token ${this.githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Composio-Config-Sync/1.0',
    };

    this.filesToSync = [
      '.claude/mcp.json',
      '.composio/global-config.json',
      'config/mcp-servers.json',
      'mcp-servers/github-composio-server.js',
      'mcp-servers/github-direct-server.js',
      'mcp-servers/smartsheet-server.js',
      'scripts/sync-composio-config.js',
      'start-github-mcp.bat',
      'start-github-direct.bat',
      'start-smartsheet-mcp.bat',
    ];

    this.hookFiles = [
      '.git/hooks/pre-commit',
      '.git/hooks/pre-push',
    ];
  }

  async getRepositories() {
    try {
      console.log('📂 Fetching user repositories...');

      const response = await axios.get(`${this.baseURL}/user/repos`, {
        headers: this.headers,
        params: {
          type: 'owner',
          sort: 'updated',
          per_page: 100,
        },
      });

      const repos = response.data.filter(repo =>
        !repo.archived &&
        !repo.fork &&
        repo.name !== this.centralRepo &&
        !repo.name.startsWith('temp-') &&
        !repo.name.startsWith('archived-') &&
        !repo.name.startsWith('experimental-')
      );

      console.log(`✅ Found ${repos.length} target repositories for sync`);
      return repos;

    } catch (error) {
      throw new Error(`Failed to fetch repositories: ${error.message}`);
    }
  }

  async syncConfigurationToRepo(repo) {
    console.log(`\n🔄 Syncing configuration to ${repo.full_name}...`);

    try {
      // Check if the repository has a package.json (indicating it's a Node.js project)
      const hasPackageJson = await this.fileExistsInRepo(repo.name, 'package.json');
      if (!hasPackageJson) {
        console.log(`⏭️  Skipping ${repo.name} - not a Node.js project`);
        return { skipped: true, reason: 'Not a Node.js project' };
      }

      let syncedFiles = 0;
      let errors = [];

      // Sync configuration files
      for (const filePath of this.filesToSync) {
        try {
          if (fs.existsSync(filePath)) {
            await this.syncFileToRepo(repo.name, filePath);
            syncedFiles++;
            console.log(`  ✅ Synced ${filePath}`);
          } else {
            console.log(`  ⚠️  Source file not found: ${filePath}`);
          }
        } catch (error) {
          errors.push(`${filePath}: ${error.message}`);
          console.log(`  ❌ Failed to sync ${filePath}: ${error.message}`);
        }
      }

      // Sync git hooks (special handling required)
      for (const hookPath of this.hookFiles) {
        try {
          if (fs.existsSync(hookPath)) {
            await this.syncGitHookToRepo(repo.name, hookPath);
            syncedFiles++;
            console.log(`  ✅ Synced ${hookPath}`);
          }
        } catch (error) {
          errors.push(`${hookPath}: ${error.message}`);
          console.log(`  ❌ Failed to sync ${hookPath}: ${error.message}`);
        }
      }

      return {
        success: true,
        syncedFiles,
        errors,
      };

    } catch (error) {
      console.log(`  ❌ Failed to sync to ${repo.name}: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async fileExistsInRepo(repoName, filePath) {
    try {
      await axios.get(`${this.baseURL}/repos/${this.githubUser}/${repoName}/contents/${filePath}`, {
        headers: this.headers,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async syncFileToRepo(repoName, filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const encodedContent = Buffer.from(fileContent).toString('base64');

    // Check if file exists in target repo
    let existingFile = null;
    try {
      const response = await axios.get(`${this.baseURL}/repos/${this.githubUser}/${repoName}/contents/${filePath}`, {
        headers: this.headers,
      });
      existingFile = response.data;
    } catch (error) {
      // File doesn't exist, will be created
    }

    const payload = {
      message: `sync: Update ${filePath} from central imo-creator config COMPOSIO_TRACE_ID=SYNC-${Date.now()}`,
      content: encodedContent,
      committer: {
        name: 'Composio Config Sync',
        email: 'sync@composio.dev',
      },
    };

    if (existingFile) {
      payload.sha = existingFile.sha;
    }

    await axios.put(`${this.baseURL}/repos/${this.githubUser}/${repoName}/contents/${filePath}`, payload, {
      headers: this.headers,
    });
  }

  async syncGitHookToRepo(repoName, hookPath) {
    // Git hooks can't be synced directly via GitHub API as they're not tracked
    // Instead, we'll create a script in the repo that can install the hooks
    const hookContent = fs.readFileSync(hookPath, 'utf8');
    const hookName = path.basename(hookPath);

    const scriptContent = `#!/bin/bash
# Auto-generated git hook installer for ${hookName}
# Run this script to install the Composio-integrated git hook

HOOK_FILE=".git/hooks/${hookName}"

echo "Installing ${hookName} hook with Composio integration..."

cat > "$HOOK_FILE" << 'EOF'
${hookContent}
EOF

chmod +x "$HOOK_FILE"

echo "✅ ${hookName} hook installed successfully"
echo "This hook includes both HEIR/ORBT validation and Composio integration"
`;

    const encodedContent = Buffer.from(scriptContent).toString('base64');
    const scriptPath = `scripts/install-${hookName}-hook.sh`;

    // Check if script exists
    let existingScript = null;
    try {
      const response = await axios.get(`${this.baseURL}/repos/${this.githubUser}/${repoName}/contents/${scriptPath}`, {
        headers: this.headers,
      });
      existingScript = response.data;
    } catch (error) {
      // Script doesn't exist, will be created
    }

    const payload = {
      message: `sync: Update ${hookName} hook installer from imo-creator COMPOSIO_TRACE_ID=HOOK-${Date.now()}`,
      content: encodedContent,
      committer: {
        name: 'Composio Hook Sync',
        email: 'hooks@composio.dev',
      },
    };

    if (existingScript) {
      payload.sha = existingScript.sha;
    }

    await axios.put(`${this.baseURL}/repos/${this.githubUser}/${repoName}/contents/${scriptPath}`, payload, {
      headers: this.headers,
    });
  }

  async createSyncSummaryIssue(results) {
    const timestamp = new Date().toISOString();
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success && !r.skipped).length;
    const skippedCount = results.filter(r => r.skipped).length;

    const issueBody = `## Composio Configuration Sync Report

**Timestamp:** ${timestamp}
**Central Repository:** ${this.githubUser}/${this.centralRepo}

### Summary
- ✅ **Successful:** ${successCount} repositories
- ❌ **Failed:** ${failureCount} repositories
- ⏭️ **Skipped:** ${skippedCount} repositories

### Synced Components
- Composio MCP configuration
- GitHub integration settings
- Smartsheet integration settings
- Git hooks with HEIR/ORBT + Composio integration
- Startup scripts and automation tools

### Detailed Results

${results.map(result => {
  if (result.skipped) {
    return `#### ⏭️ ${result.repo} - Skipped\n- Reason: ${result.reason}`;
  } else if (result.success) {
    return `#### ✅ ${result.repo} - Success\n- Files synced: ${result.syncedFiles}\n${result.errors.length > 0 ? `- Errors: ${result.errors.length}` : ''}`;
  } else {
    return `#### ❌ ${result.repo} - Failed\n- Error: ${result.error}`;
  }
}).join('\n\n')}

### Next Steps
1. Review any failed repositories
2. Run hook installers in target repositories:
   \`\`\`bash
   # In each target repository:
   chmod +x scripts/install-*-hook.sh
   ./scripts/install-pre-commit-hook.sh
   ./scripts/install-pre-push-hook.sh
   \`\`\`

3. Verify MCP servers are working:
   \`\`\`bash
   # Test GitHub integration
   node examples/test-github-direct.js

   # Test Smartsheet integration
   node scripts/test-smartsheet.js
   \`\`\`

---
*Generated by Composio Config Sync v1.0*
`;

    try {
      await axios.post(`${this.baseURL}/repos/${this.githubUser}/${this.centralRepo}/issues`, {
        title: `Composio Config Sync Report - ${new Date().toLocaleDateString()}`,
        body: issueBody,
        labels: ['automation', 'composio', 'sync'],
      }, {
        headers: this.headers,
      });

      console.log('\n✅ Sync summary issue created in central repository');
    } catch (error) {
      console.log(`\n⚠️ Failed to create sync summary issue: ${error.message}`);
    }
  }

  async run() {
    console.log('🚀 Starting Composio Configuration Sync\n');
    console.log('=' .repeat(60));

    try {
      // Validate prerequisites
      if (!this.githubToken) {
        throw new Error('GITHUB_API_TOKEN not found in environment');
      }

      if (!fs.existsSync('.claude/mcp.json')) {
        throw new Error('Central MCP configuration not found');
      }

      // Get target repositories
      const repositories = await this.getRepositories();

      if (repositories.length === 0) {
        console.log('No target repositories found for sync');
        return;
      }

      // Sync to each repository
      const results = [];
      for (const repo of repositories) {
        const result = await this.syncConfigurationToRepo(repo);
        results.push({
          repo: repo.full_name,
          ...result,
        });

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Generate summary
      console.log('\n' + '=' .repeat(60));
      console.log('📊 Sync Summary:');
      console.log(`✅ Successful: ${results.filter(r => r.success).length}`);
      console.log(`❌ Failed: ${results.filter(r => !r.success && !r.skipped).length}`);
      console.log(`⏭️ Skipped: ${results.filter(r => r.skipped).length}`);

      // Create issue with detailed results
      await this.createSyncSummaryIssue(results);

      console.log('\n🎉 Composio configuration sync completed!');

    } catch (error) {
      console.error('💥 Sync failed:', error.message);
      process.exit(1);
    }
  }
}

// Main execution
if (require.main === module) {
  const sync = new ComposioConfigSync();
  sync.run().catch(console.error);
}

module.exports = { ComposioConfigSync };