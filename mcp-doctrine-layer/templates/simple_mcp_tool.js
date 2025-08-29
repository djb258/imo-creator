/**
 * Simple MCP Tool Template - Single Developer Edition
 * Just copy this file, change the tool name, and add your logic
 * HEIR/ORBT compliance built-in, no over-engineering
 */

const { MantisLogger } = require('../logging/log_wrapper');

class SimpleMCPTool {
    constructor(toolName, config = {}) {
        this.toolName = toolName;
        this.version = config.version || '1.0.0';
        this.orbtLayer = config.orbtLayer || 5; // Default to developer level
        
        // Simple logging setup
        this.logger = new MantisLogger({
            service_name: `${toolName}-mcp-server`,
            heir_system_code: config.systemCode || 'MCPTOOL',
            default_orbt_layer: this.orbtLayer
        });

        // Emergency kill switch check
        if (process.env.MCP_KILL_SWITCH === 'true') {
            throw new Error('🚨 MCP Kill Switch Activated - All tools disabled');
        }
    }

    /**
     * Main tool execution - override this in your specific tool
     */
    async execute(params) {
        const startTime = Date.now();
        const uniqueId = this.generateUniqueId();
        const processId = this.generateProcessId();

        try {
            // Auto-log start
            await this.logger.info(`${this.toolName} execution started`, {
                unique_id: uniqueId,
                process_id: processId,
                tool_name: this.toolName,
                orbt_layer: this.orbtLayer
            });

            // Your tool logic goes here
            const result = await this.doWork(params);

            // Auto-log success
            await this.logger.logToolExecution({
                tool_name: this.toolName,
                tool_version: this.version,
                unique_id: uniqueId,
                process_id: processId,
                execution_start: startTime,
                execution_end: Date.now(),
                success: true,
                result_data: result,
                orbt_layer: this.orbtLayer
            });

            return { success: true, data: result, unique_id: uniqueId };

        } catch (error) {
            // Auto-log error
            await this.logger.logToolExecution({
                tool_name: this.toolName,
                tool_version: this.version,
                unique_id: uniqueId,
                process_id: processId,
                execution_start: startTime,
                execution_end: Date.now(),
                success: false,
                error_details: { message: error.message, stack: error.stack },
                orbt_layer: this.orbtLayer
            });

            throw error;
        }
    }

    /**
     * Override this method with your actual tool logic
     */
    async doWork(params) {
        throw new Error('doWork() method must be implemented by specific tool');
    }

    /**
     * Simple HEIR unique ID generation
     */
    generateUniqueId() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const systemCode = this.getSystemCode();
        const mode = 'EXEC';
        const version = '01';
        
        return `HEIR-${year}-${month}-${systemCode}-${mode}-${version}`;
    }

    /**
     * Simple Process ID generation
     */
    generateProcessId() {
        const systemCode = this.getSystemCode().padEnd(8, '0').substring(0, 8);
        const timestamp = Date.now().toString();
        return `PRC-${systemCode}-${timestamp}`;
    }

    /**
     * Get system code based on tool name
     */
    getSystemCode() {
        const codeMap = {
            'neon-writer': 'NEONWRT',
            'apify-scraper': 'APFYSC',
            'email-validator': 'EMLVAL',
            'whimsical-updater': 'WHMSUP',
            'github-analyzer': 'GHBANAL',
            'ctb-parser': 'CTBPARS'
        };
        
        return codeMap[this.toolName] || 'MCPTOOL';
    }

    /**
     * Simple health check
     */
    async healthCheck() {
        return {
            tool_name: this.toolName,
            version: this.version,
            status: 'healthy',
            orbt_layer: this.orbtLayer,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Example Usage - Neon Database Writer
 */
class NeonWriter extends SimpleMCPTool {
    constructor() {
        super('neon-writer', {
            version: '2.1.0',
            orbtLayer: 4, // Senior developer level for DB writes
            systemCode: 'NEONWRT'
        });
        
        // Tool-specific setup
        this.connectionString = process.env.DATABASE_URL;
    }

    async doWork(params) {
        const { query, data } = params;
        
        // Simple validation
        if (!query) throw new Error('Query is required');
        if (query.toUpperCase().includes('DROP')) {
            throw new Error('DROP statements not allowed');
        }

        // Your actual database work here
        const result = {
            query: query,
            rowsAffected: 1,
            timestamp: new Date().toISOString()
        };

        return result;
    }
}

/**
 * Example Usage - Apify Scraper  
 */
class ApifyScraper extends SimpleMCPTool {
    constructor() {
        super('apify-scraper', {
            version: '1.3.2',
            orbtLayer: 5, // Developer level for external APIs
            systemCode: 'APFYSC'
        });
        
        this.apiKey = process.env.APIFY_API_KEY;
    }

    async doWork(params) {
        const { url, actorId } = params;
        
        // Simple validation
        if (!url) throw new Error('URL is required');
        if (!url.startsWith('https://')) throw new Error('Only HTTPS URLs allowed');

        // Your scraping logic here
        const result = {
            url: url,
            actorId: actorId,
            dataExtracted: [],
            timestamp: new Date().toISOString()
        };

        return result;
    }
}

/**
 * Express.js MCP Server Setup (optional)
 */
function createMCPServer(tool) {
    const express = require('express');
    const app = express();
    
    app.use(express.json());
    
    // Health check
    app.get('/health', async (req, res) => {
        const health = await tool.healthCheck();
        res.json(health);
    });
    
    // Main tool endpoint
    app.post('/execute', async (req, res) => {
        try {
            const result = await tool.execute(req.body);
            res.json(result);
        } catch (error) {
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    });
    
    return app;
}

module.exports = { 
    SimpleMCPTool, 
    NeonWriter, 
    ApifyScraper,
    createMCPServer 
};

/**
 * Quick Start Example:
 * 
 * 1. Copy this file
 * 2. Create your tool:
 * 
 * class MyTool extends SimpleMCPTool {
 *   constructor() {
 *     super('my-tool', { orbtLayer: 5 });
 *   }
 * 
 *   async doWork(params) {
 *     // Your logic here
 *     return { result: 'success' };
 *   }
 * }
 * 
 * 3. Run it:
 * const tool = new MyTool();
 * tool.execute({ some: 'params' });
 * 
 * That's it! HEIR/ORBT compliance built-in.
 */