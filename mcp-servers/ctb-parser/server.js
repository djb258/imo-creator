/**
 * CTB Parser MCP Server - Christmas Tree Backbone Structure Analysis
 * Built on MCP Doctrine Layer foundation
 */

const express = require('express');
const { SimpleMCPTool } = require('../../mcp-doctrine-layer/templates/simple_mcp_tool');
const { setupHealthChecking } = require('../../mcp-doctrine-layer/health/simple_health_check');
const { setupKillSwitch } = require('../../mcp-doctrine-layer/emergency/kill_switch');
const yaml = require('js-yaml');
const toolHandler = require('./tools/tool_handler');

/**
 * CTB Structure Parser MCP Tool
 */


/**
 * Express Server Setup
 */
const app = express();
app.use(express.json({ limit: '50mb' })); // Large limit for complex structures

// Initialize MCP tool
const tool = new CTBParserMCPTool();

// Setup kill switch
setupKillSwitch(app);

// Setup health checking
setupHealthChecking(app, {
    'ctb-parser': ctbTool
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
app.post('/parse', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'parse_structure',
            input: req.body.structure,
            format: req.body.format
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/validate', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'validate_ctb',
            input: req.body.structure
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/analyze', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'analyze_hierarchy',
            input: req.body.structure
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/blueprint', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'generate_blueprint',
            input: req.body.structure,
            options: req.body.options
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'CTB Parser MCP Server',
        version: '1.4.0',
        status: 'operational',
        endpoints: [
            'POST /execute - Main MCP execution endpoint',
            'POST /parse - Parse structure to CTB format',
            'POST /validate - Validate CTB structure',
            'POST /analyze - Analyze hierarchy and complexity',
            'POST /blueprint - Generate implementation blueprint',
            'GET /mcp/health - Health check'
        ],
        supported_formats: ['yaml', 'json', 'directory'],
        altitude_range: '1000-40000 feet',
        documentation: 'https://github.com/djb258/imo-creator/blob/main/mcp-servers/ctb-parser/README.md'
    });
});

// Start server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`
    🌲 CTB Parser MCP Server Running
    ================================
    Port: ${PORT}
    Health: http://localhost:${PORT}/mcp/health
    Kill Switch: ${process.env.MCP_KILL_SWITCH === 'true' ? '🚨 ACTIVE' : '✅ Inactive'}
    
    HEIR Compliance: ✅
    ORBT Layer: 5 (Developer)
    Mantis Logging: ✅
    
    Supported Formats: YAML, JSON, Directory
    Altitude Range: 1,000-40,000 feet
    ================================
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down CTB Parser MCP Server...');
    process.exit(0);
});

module.exports = { CTBParserMCPTool };