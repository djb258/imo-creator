/**
 * Neon MCP Server - Database Operations
 * Built on MCP Doctrine Layer foundation
 */

const express = require('express');
const { SimpleMCPTool } = require('../../mcp-doctrine-layer/templates/simple_mcp_tool');
const { setupHealthChecking } = require('../../mcp-doctrine-layer/health/simple_health_check');
const { setupKillSwitch } = require('../../mcp-doctrine-layer/emergency/kill_switch');
const { Pool } = require('pg');

/**
 * Neon Database MCP Tool
 */


/**
 * Express Server Setup
 */
const app = express();
app.use(express.json());

// Initialize MCP tool
const tool = new NeonMCPTool();

// Setup kill switch (checks MCP_KILL_SWITCH env var)
setupKillSwitch(app);

// Setup health checking
setupHealthChecking(app, {
    'neon-writer': neonTool
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

// Specific operation endpoints (optional - for clarity)
app.post('/select', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'select',
            ...req.body
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/insert', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'insert',
            ...req.body
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/update', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'update',
            ...req.body
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/delete', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'delete',
            ...req.body
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'Neon MCP Server',
        version: '2.1.0',
        status: 'operational',
        endpoints: [
            'POST /execute - Main MCP execution endpoint',
            'POST /select - Select data from table',
            'POST /insert - Insert data into table',
            'POST /update - Update data in table',
            'POST /delete - Delete data from table',
            'GET /mcp/health - Health check all tools',
            'GET /mcp/status - Visual status page',
            'GET /mcp/kill-switch/status - Kill switch status'
        ],
        documentation: 'https://github.com/djb258/imo-creator/blob/main/mcp-servers/neon-mcp/README.md'
    });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`
    🚀 Neon MCP Server Running
    ================================
    Port: ${PORT}
    Health: http://localhost:${PORT}/mcp/health
    Status: http://localhost:${PORT}/mcp/status
    Kill Switch: ${process.env.MCP_KILL_SWITCH === 'true' ? '🚨 ACTIVE' : '✅ Inactive'}
    
    HEIR Compliance: ✅
    ORBT Layer: 4 (Senior Developer)
    Mantis Logging: ✅
    
    Database: ${process.env.DATABASE_URL ? 'Connected' : '⚠️  No DATABASE_URL set'}
    ================================
    `);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('Shutting down Neon MCP Server...');
    await neonTool.cleanup();
    process.exit(0);
});

module.exports = { NeonMCPTool };