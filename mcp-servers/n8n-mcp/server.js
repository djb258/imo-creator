/**
 * N8N MCP Server - Workflow Automation Management
 * Built on MCP Doctrine Layer foundation
 */

const express = require('express');
const { SimpleMCPTool } = require('../../mcp-doctrine-layer/templates/simple_mcp_tool');
const { setupHealthChecking } = require('../../mcp-doctrine-layer/health/simple_health_check');
const { setupKillSwitch } = require('../../mcp-doctrine-layer/emergency/kill_switch');
const axios = require('axios');
const { N8NMCPTool } = require('./tools/tool_handler');

/**
 * N8N Workflow MCP Tool
 */


/**
 * Express Server Setup
 */
const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialize MCP tool
const tool = new N8NMCPTool();

// Setup kill switch
setupKillSwitch(app);

// Setup health checking
setupHealthChecking(app, {
    'n8n-workflow-manager': n8nTool
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
app.get('/workflows', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'list_workflows',
            options: req.query
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/workflow/:id', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'get_workflow',
            workflowId: req.params.id
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/workflows', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'create_workflow',
            options: req.body
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/workflow/:id/execute', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'execute_workflow',
            workflowId: req.params.id,
            options: req.body
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/workflow/:id/activate', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'activate_workflow',
            workflowId: req.params.id
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/webhook/:path(*)', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'trigger_webhook',
            webhookPath: req.params.path,
            options: {
                method: req.method,
                data: req.body,
                headers: req.headers
            }
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'N8N MCP Server',
        version: '1.0.0',
        status: 'operational',
        endpoints: [
            'POST /execute - Main MCP execution endpoint',
            'GET /workflows - List all workflows',
            'GET /workflow/:id - Get specific workflow',
            'POST /workflows - Create new workflow',
            'POST /workflow/:id/execute - Execute workflow',
            'POST /workflow/:id/activate - Activate workflow',
            'POST /webhook/:path - Trigger webhook',
            'GET /mcp/health - Health check',
            'GET /mcp/status - Visual status page'
        ],
        documentation: 'https://github.com/djb258/imo-creator/blob/main/mcp-servers/n8n-mcp/README.md'
    });
});

// Start server
const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
    console.log(`
    🔄 N8N MCP Server Running
    ================================
    Port: ${PORT}
    Health: http://localhost:${PORT}/mcp/health
    Status: http://localhost:${PORT}/mcp/status
    Kill Switch: ${process.env.MCP_KILL_SWITCH === 'true' ? '🚨 ACTIVE' : '✅ Inactive'}
    
    HEIR Compliance: ✅
    ORBT Layer: 4 (Workflow/Automation)
    Mantis Logging: ✅
    
    N8N API: ${process.env.N8N_API_KEY ? 'Connected' : '⚠️  No N8N_API_KEY set'}
    N8N URL: ${process.env.N8N_BASE_URL || 'http://localhost:5678/api/v1 (default)'}
    ================================
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down N8N MCP Server...');
    process.exit(0);
});

module.exports = { N8NMCPTool };