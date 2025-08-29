/**
 * Vercel MCP Server - Deployment & Infrastructure Management
 * Built on MCP Doctrine Layer foundation
 */

const express = require('express');
const { SimpleMCPTool } = require('../../mcp-doctrine-layer/templates/simple_mcp_tool');
const { setupHealthChecking } = require('../../mcp-doctrine-layer/health/simple_health_check');
const { setupKillSwitch } = require('../../mcp-doctrine-layer/emergency/kill_switch');
const axios = require('axios');
const { VercelMCPTool } = require('./tools/tool_handler');

/**
 * Vercel Deployment MCP Tool
 */


/**
 * Express Server Setup
 */
const app = express();
app.use(express.json({ limit: '50mb' })); // Large limit for file uploads

// Initialize MCP tool
const tool = new VercelMCPTool();

// Setup kill switch
setupKillSwitch(app);

// Setup health checking
setupHealthChecking(app, {
    'vercel-deployment-manager': vercelTool
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
app.post('/deploy', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'deploy_project',
            ...req.body
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/deployments', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'list_deployments',
            projectName: req.query.project,
            options: req.query
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/deployment/:id', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'get_deployment',
            deploymentId: req.params.id
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/projects', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'list_projects',
            options: req.query
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/project/:name', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'get_project',
            projectName: req.params.name
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/project/:name/env', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'set_env_vars',
            projectName: req.params.name,
            options: { variables: req.body }
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/project/:name/domain', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'add_domain',
            projectName: req.params.name,
            domain: req.body.domain,
            options: req.body
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'Vercel MCP Server',
        version: '1.0.0',
        status: 'operational',
        endpoints: [
            'POST /execute - Main MCP execution endpoint',
            'POST /deploy - Deploy project to Vercel',
            'GET /deployments - List deployments',
            'GET /deployment/:id - Get specific deployment',
            'GET /projects - List all projects',
            'GET /project/:name - Get specific project',
            'POST /project/:name/env - Set environment variables',
            'POST /project/:name/domain - Add domain to project',
            'GET /mcp/health - Health check',
            'GET /mcp/status - Visual status page'
        ],
        documentation: 'https://github.com/djb258/imo-creator/blob/main/mcp-servers/vercel-mcp/README.md'
    });
});

// Start server
const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
    console.log(`
    🚀 Vercel MCP Server Running
    ================================
    Port: ${PORT}
    Health: http://localhost:${PORT}/mcp/health
    Status: http://localhost:${PORT}/mcp/status
    Kill Switch: ${process.env.MCP_KILL_SWITCH === 'true' ? '🚨 ACTIVE' : '✅ Inactive'}
    
    HEIR Compliance: ✅
    ORBT Layer: 3 (Infrastructure)
    Mantis Logging: ✅
    
    Vercel API: ${process.env.VERCEL_TOKEN ? 'Connected' : '⚠️  No VERCEL_TOKEN set'}
    Team ID: ${process.env.VERCEL_TEAM_ID || '⚠️  No VERCEL_TEAM_ID set'}
    ================================
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down Vercel MCP Server...');
    process.exit(0);
});

module.exports = { VercelMCPTool };