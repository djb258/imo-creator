/**
 * Whimsical MCP Server - Diagram Operations
 * Built on MCP Doctrine Layer foundation
 */

const express = require('express');
const { SimpleMCPTool } = require('../../mcp-doctrine-layer/templates/simple_mcp_tool');
const { setupHealthChecking } = require('../../mcp-doctrine-layer/health/simple_health_check');
const { setupKillSwitch } = require('../../mcp-doctrine-layer/emergency/kill_switch');
const axios = require('axios');
const { WhimsicalMCPTool } = require('./tools/tool_handler');

/**
 * Whimsical Diagram MCP Tool
 */


/**
 * Express Server Setup
 */
const app = express();
app.use(express.json({ limit: '50mb' })); // Large limit for diagram data

// Initialize MCP tool
const tool = new WhimsicalMCPTool();

// Setup kill switch
setupKillSwitch(app);

// Setup health checking
setupHealthChecking(app, {
    'whimsical-updater': whimsicalTool
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
app.post('/create-board', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'create_board',
            ...req.body
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/board/:boardId', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'update_board',
            boardId: req.params.boardId,
            diagramData: req.body
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/board/:boardId', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'get_board',
            boardId: req.params.boardId
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/workspaces', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'list_workspaces'
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/ctb-diagram', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'update_ctb_diagram',
            boardId: req.body.boardId,
            ctbStructure: req.body.ctbStructure
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'Whimsical MCP Server',
        version: '1.1.0',
        status: 'operational',
        endpoints: [
            'POST /execute - Main MCP execution endpoint',
            'POST /create-board - Create new diagram board',
            'PUT /board/:id - Update existing board',
            'GET /board/:id - Get board by ID',
            'GET /workspaces - List available workspaces',
            'POST /ctb-diagram - Create/update CTB structure diagram',
            'GET /mcp/health - Health check'
        ],
        documentation: 'https://github.com/djb258/imo-creator/blob/main/mcp-servers/whimsical-mcp/README.md'
    });
});

// Start server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`
    📊 Whimsical MCP Server Running
    ================================
    Port: ${PORT}
    Health: http://localhost:${PORT}/mcp/health
    Status: http://localhost:${PORT}/mcp/status
    Kill Switch: ${process.env.MCP_KILL_SWITCH === 'true' ? '🚨 ACTIVE' : '✅ Inactive'}
    
    HEIR Compliance: ✅
    ORBT Layer: 5 (Developer)
    Mantis Logging: ✅
    
    Whimsical API: ${process.env.WHIMSICAL_API_KEY ? 'Connected' : '⚠️  Mock Mode - No API KEY'}
    ================================
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down Whimsical MCP Server...');
    process.exit(0);
});

module.exports = { WhimsicalMCPTool };