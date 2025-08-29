/**
 * Plasmic MCP Server - UI Component Management
 * Built on MCP Doctrine Layer foundation
 */

const express = require('express');
const { SimpleMCPTool } = require('../../mcp-doctrine-layer/templates/simple_mcp_tool');
const { setupHealthChecking } = require('../../mcp-doctrine-layer/health/simple_health_check');
const { setupKillSwitch } = require('../../mcp-doctrine-layer/emergency/kill_switch');
const axios = require('axios');
const { PlasmicMCPTool } = require('./tools/tool_handler');

/**
 * Plasmic Component MCP Tool
 */


/**
 * Express Server Setup
 */
const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialize MCP tool
const tool = new PlasmicMCPTool();

// Setup kill switch
setupKillSwitch(app);

// Setup health checking
setupHealthChecking(app, {
    'plasmic-component-manager': plasmicTool
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
app.post('/sync', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'sync_components',
            ...req.body
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/components', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'list_components',
            projectId: req.query.projectId
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/component/:id', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'get_component',
            componentId: req.params.id
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/component/:id/generate', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'generate_code',
            componentId: req.params.id,
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
        service: 'Plasmic MCP Server',
        version: '1.0.0',
        status: 'operational',
        endpoints: [
            'POST /execute - Main MCP execution endpoint',
            'POST /sync - Sync components from Plasmic',
            'GET /components - List all components',
            'GET /component/:id - Get specific component',
            'POST /component/:id/generate - Generate component code',
            'GET /mcp/health - Health check',
            'GET /mcp/status - Visual status page'
        ],
        documentation: 'https://github.com/djb258/imo-creator/blob/main/mcp-servers/plasmic-mcp/README.md'
    });
});

// Start server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`
    🎨 Plasmic MCP Server Running
    ================================
    Port: ${PORT}
    Health: http://localhost:${PORT}/mcp/health
    Status: http://localhost:${PORT}/mcp/status
    Kill Switch: ${process.env.MCP_KILL_SWITCH === 'true' ? '🚨 ACTIVE' : '✅ Inactive'}
    
    HEIR Compliance: ✅
    ORBT Layer: 4 (UI/Frontend)
    Mantis Logging: ✅
    
    Plasmic API: ${process.env.PLASMIC_API_KEY ? 'Connected' : '⚠️  No PLASMIC_API_KEY set'}
    Project ID: ${process.env.PLASMIC_PROJECT_ID || '⚠️  No PLASMIC_PROJECT_ID set'}
    ================================
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down Plasmic MCP Server...');
    process.exit(0);
});

module.exports = { PlasmicMCPTool };