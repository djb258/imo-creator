/**
 * NeonMCPTool - Tool Logic Handler
 * Extracted from server.js for better separation of concerns
 */

const { SimpleMCPTool } = require('../../../mcp-doctrine-layer/templates/simple_mcp_tool');
const axios = require('axios');

/**
 * Neon MCP Tool Handler
 */
class NeonMCPTool extends SimpleMCPTool {
    constructor() {
        super('neon-writer', {
            version: '2.1.0',
            orbtLayer: 4, // Senior developer level for DB writes
            systemCode: 'NEONWRT'
        });
        
        // Initialize database connection
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });
    }

    /**
     * Main business logic - extracted from server.js
     */
    async doWork(params) {
        const { operation, table, data, query, conditions } = params;
        
        // Validate operation type
        const allowedOperations = ['select', 'insert', 'update', 'delete'];
        if (!allowedOperations.includes(operation)) {
            throw new Error(`Invalid operation: ${operation}`);
        }

        // Security checks
        if (query && (query.toUpperCase().includes('DROP') || query.toUpperCase().includes('TRUNCATE'))) {
            throw new Error('Dangerous operations not allowed');
        }

        let result;
        switch (operation) {
            case 'select':
                result = await this.select(table, conditions);
                break;
            case 'insert':
                result = await this.insert(table, data);
                break;
            case 'update':
                result = await this.update(table, data, conditions);
                break;
            case 'delete':
                result = await this.delete(table, conditions);
                break;
            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }

        return {
            operation,
            table,
            ...result,
            timestamp: new Date().toISOString()
        };
    }

        async cleanup() {
        await this.pool.end();
    }

    /**
     * Health check implementation
     */
    async healthCheck() {
        try {
            // Check database connection
            const result = await this.pool.query('SELECT NOW()');
            
            return {
                tool_name: this.toolName,
                version: this.version,
                status: 'healthy',
                database_connected: true,
                current_time: result.rows[0].now,
                pool_stats: {
                    total: this.pool.totalCount,
                    idle: this.pool.idleCount,
                    waiting: this.pool.waitingCount
                },
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                tool_name: this.toolName,
                version: this.version,
                status: 'unhealthy',
                database_connected: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}

module.exports = { NeonMCPTool };