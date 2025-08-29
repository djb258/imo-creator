/**
 * GitHub MCP Server - Repository Operations
 * Built on MCP Doctrine Layer foundation
 */

const express = require('express');
const { SimpleMCPTool } = require('../../mcp-doctrine-layer/templates/simple_mcp_tool');
const { setupHealthChecking } = require('../../mcp-doctrine-layer/health/simple_health_check');
const { setupKillSwitch } = require('../../mcp-doctrine-layer/emergency/kill_switch');
const axios = require('axios');
const { GitHubMCPTool } = require('./tools/tool_handler');
const crypto = require('crypto');

/**
 * GitHub Operations MCP Tool
 */


/**
 * Express Server Setup
 */
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.raw({ type: 'application/json', limit: '10mb' })); // For webhooks

// Initialize MCP tool
const tool = new GitHubMCPTool();

// Setup kill switch
setupKillSwitch(app);

// Setup health checking
setupHealthChecking(app, {
    'github-analyzer': githubTool
});

// Webhook endpoint (before other routes to avoid JSON parsing)
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'webhook_handler',
            headers: req.headers,
            payload: JSON.parse(req.body.toString())
        });
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Main MCP endpoint
app.post('/execute', async (req, res) => {
    try {
        const result = await tool.execute(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Specific operation endpoints
app.get('/repo/:owner/:repo', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'get_repo_info',
            owner: req.params.owner,
            repo: req.params.repo
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/repo/:owner/:repo/files/*', async (req, res) => {
    try {
        const path = req.params[0] || '';
        const result = await tool.execute({
            operation: 'list_files',
            owner: req.params.owner,
            repo: req.params.repo,
            path: path,
            branch: req.query.branch
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/repo/:owner/:repo/content/*', async (req, res) => {
    try {
        const path = req.params[0];
        const result = await tool.execute({
            operation: 'get_file_content',
            owner: req.params.owner,
            repo: req.params.repo,
            path: path,
            branch: req.query.branch
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/repo/:owner/:repo/analyze', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'analyze_structure',
            owner: req.params.owner,
            repo: req.params.repo,
            branch: req.query.branch
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'GitHub MCP Server',
        version: '1.2.0',
        status: 'operational',
        endpoints: [
            'POST /execute - Main MCP execution endpoint',
            'POST /webhook - GitHub webhook handler',
            'GET /repo/:owner/:repo - Get repository info',
            'GET /repo/:owner/:repo/files/* - List files in path',
            'GET /repo/:owner/:repo/content/* - Get file content',
            'GET /repo/:owner/:repo/analyze - Analyze repository structure',
            'GET /mcp/health - Health check'
        ],
        documentation: 'https://github.com/djb258/imo-creator/blob/main/mcp-servers/github-mcp/README.md'
    });
});

// Start server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`
    📱 GitHub MCP Server Running
    ================================
    Port: ${PORT}
    Health: http://localhost:${PORT}/mcp/health
    Webhook: http://localhost:${PORT}/webhook
    Kill Switch: ${process.env.MCP_KILL_SWITCH === 'true' ? '🚨 ACTIVE' : '✅ Inactive'}
    
    HEIR Compliance: ✅
    ORBT Layer: 4 (Senior Developer)
    Mantis Logging: ✅
    
    GitHub Token: ${process.env.GITHUB_TOKEN ? 'Configured' : '⚠️  Public API Only'}
    Webhook Secret: ${process.env.GITHUB_WEBHOOK_SECRET ? 'Configured' : '⚠️  Not Set'}
    ================================
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down GitHub MCP Server...');
    process.exit(0);
});

module.exports = { GitHubMCPTool };