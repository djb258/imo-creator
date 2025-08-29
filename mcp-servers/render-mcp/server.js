/**
 * Render MCP Server - Cloud Infrastructure Management
 * Built on MCP Doctrine Layer foundation
 */

const express = require('express');
const { SimpleMCPTool } = require('../../mcp-doctrine-layer/templates/simple_mcp_tool');
const { setupHealthChecking } = require('../../mcp-doctrine-layer/health/simple_health_check');
const { setupKillSwitch } = require('../../mcp-doctrine-layer/emergency/kill_switch');
const axios = require('axios');
const { RenderMCPTool } = require('./tools/tool_handler');

/**
 * Render Infrastructure MCP Tool
 */


/**
 * Express Server Setup
 */
const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialize MCP tool
const tool = new RenderMCPTool();

// Setup kill switch
setupKillSwitch(app);

// Setup health checking
setupHealthChecking(app, {
    'render-infrastructure-manager': renderTool
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
app.get('/services', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'list_services',
            options: req.query
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/service/:id', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'get_service',
            serviceId: req.params.id
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/services', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'create_service',
            options: req.body
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/service/:id/deploy', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'deploy_service',
            serviceId: req.params.id,
            options: req.body
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/service/:id/logs', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'get_logs',
            serviceId: req.params.id,
            options: req.query
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'Render MCP Server',
        version: '1.0.0',
        status: 'operational',
        endpoints: [
            'POST /execute - Main MCP execution endpoint',
            'GET /services - List all services',
            'GET /service/:id - Get specific service',
            'POST /services - Create new service',
            'POST /service/:id/deploy - Deploy service',
            'GET /service/:id/logs - Get service logs',
            'GET /mcp/health - Health check',
            'GET /mcp/status - Visual status page'
        ],
        documentation: 'https://github.com/djb258/imo-creator/blob/main/mcp-servers/render-mcp/README.md'
    });
});

// Start server
const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
    console.log(`
    ☁️  Render MCP Server Running
    ================================
    Port: ${PORT}
    Health: http://localhost:${PORT}/mcp/health
    Status: http://localhost:${PORT}/mcp/status
    Kill Switch: ${process.env.MCP_KILL_SWITCH === 'true' ? '🚨 ACTIVE' : '✅ Inactive'}
    
    HEIR Compliance: ✅
    ORBT Layer: 3 (Infrastructure)
    Mantis Logging: ✅
    
    Render API: ${process.env.RENDER_API_KEY ? 'Connected' : '⚠️  No RENDER_API_KEY set'}
    ================================
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down Render MCP Server...');
    process.exit(0);
});

module.exports = { RenderMCPTool };