/**
 * Simple Emergency Kill Switch for MCP Tools
 * Single developer edition - just flip the switch
 */

const fs = require('fs');
const path = require('path');
const { MantisLogger } = require('../logging/log_wrapper');

class EmergencyKillSwitch {
    constructor() {
        this.killSwitchFile = path.join(__dirname, '../.kill_switch');
        this.reasonFile = path.join(__dirname, '../.kill_switch_reason');
        
        this.logger = new MantisLogger({
            service_name: 'mcp-kill-switch',
            heir_system_code: 'KILLSW',
            default_orbt_layer: 1 // Executive level
        });
    }

    /**
     * Check if kill switch is active
     */
    isActive() {
        return fs.existsSync(this.killSwitchFile) || process.env.MCP_KILL_SWITCH === 'true';
    }

    /**
     * Get kill switch reason
     */
    getReason() {
        if (process.env.MCP_KILL_SWITCH_REASON) {
            return process.env.MCP_KILL_SWITCH_REASON;
        }
        
        if (fs.existsSync(this.reasonFile)) {
            return fs.readFileSync(this.reasonFile, 'utf8').trim();
        }
        
        return 'No reason provided';
    }

    /**
     * Activate kill switch
     */
    async activate(reason = 'Emergency activation') {
        const timestamp = new Date().toISOString();
        
        // Create kill switch file
        fs.writeFileSync(this.killSwitchFile, timestamp);
        fs.writeFileSync(this.reasonFile, reason);
        
        // Set environment variable for immediate effect
        process.env.MCP_KILL_SWITCH = 'true';
        process.env.MCP_KILL_SWITCH_REASON = reason;
        
        // Log the activation
        await this.logger.fatal('🚨 EMERGENCY KILL SWITCH ACTIVATED', {
            unique_id: this.generateEmergencyId(),
            process_id: this.generateProcessId(),
            structured_data: {
                reason: reason,
                activated_at: timestamp,
                activated_by: process.env.USER || 'system'
            },
            security_flags: ['KILL_SWITCH_ACTIVATED', 'EMERGENCY_STOP'],
            compliance_status: 'EMERGENCY_RESPONSE',
            data_classification: 'RESTRICTED'
        });
        
        console.log('🚨 EMERGENCY KILL SWITCH ACTIVATED');
        console.log(`Reason: ${reason}`);
        console.log('All MCP tools will be disabled immediately');
        
        return true;
    }

    /**
     * Deactivate kill switch
     */
    async deactivate(resolution = 'Emergency resolved') {
        if (!this.isActive()) {
            console.log('Kill switch is not active');
            return false;
        }
        
        const timestamp = new Date().toISOString();
        
        // Remove kill switch files
        if (fs.existsSync(this.killSwitchFile)) {
            fs.unlinkSync(this.killSwitchFile);
        }
        if (fs.existsSync(this.reasonFile)) {
            fs.unlinkSync(this.reasonFile);
        }
        
        // Clear environment variables
        delete process.env.MCP_KILL_SWITCH;
        delete process.env.MCP_KILL_SWITCH_REASON;
        
        // Log the deactivation
        await this.logger.audit('✅ Emergency kill switch deactivated', {
            unique_id: this.generateEmergencyId(),
            process_id: this.generateProcessId(),
            structured_data: {
                resolution: resolution,
                deactivated_at: timestamp,
                deactivated_by: process.env.USER || 'system'
            },
            security_flags: ['KILL_SWITCH_DEACTIVATED', 'SYSTEM_RESTORED'],
            compliance_status: 'COMPLIANT',
            data_classification: 'RESTRICTED'
        });
        
        console.log('✅ Emergency kill switch deactivated');
        console.log(`Resolution: ${resolution}`);
        console.log('MCP tools are now enabled');
        
        return true;
    }

    /**
     * Get kill switch status
     */
    getStatus() {
        const isActive = this.isActive();
        const reason = isActive ? this.getReason() : null;
        
        let activatedAt = null;
        if (isActive && fs.existsSync(this.killSwitchFile)) {
            activatedAt = fs.readFileSync(this.killSwitchFile, 'utf8').trim();
        }
        
        return {
            active: isActive,
            reason: reason,
            activated_at: activatedAt,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Express middleware to check kill switch
     */
    middleware() {
        return async (req, res, next) => {
            if (this.isActive()) {
                const reason = this.getReason();
                
                // Log blocked request
                await this.logger.warn('Request blocked by kill switch', {
                    unique_id: this.generateEmergencyId(),
                    process_id: this.generateProcessId(),
                    structured_data: {
                        blocked_url: req.url,
                        blocked_method: req.method,
                        reason: reason,
                        client_ip: req.ip
                    }
                });
                
                return res.status(503).json({
                    error: 'Service Temporarily Unavailable',
                    message: 'MCP tools are currently disabled due to emergency kill switch',
                    reason: reason,
                    timestamp: new Date().toISOString()
                });
            }
            
            next();
        };
    }

    /**
     * Create CLI commands
     */
    createCLI() {
        const commands = {
            activate: (reason) => this.activate(reason),
            deactivate: (resolution) => this.deactivate(resolution),
            status: () => {
                const status = this.getStatus();
                console.log('Kill Switch Status:', JSON.stringify(status, null, 2));
                return status;
            }
        };
        
        return commands;
    }

    generateEmergencyId() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `HEIR-${year}-${month}-KILLSW-EMERG-01`;
    }

    generateProcessId() {
        const timestamp = Date.now().toString();
        return `PRC-KILLSW01-${timestamp}`;
    }
}

/**
 * CLI Script for easy kill switch management
 */
if (require.main === module) {
    const killSwitch = new EmergencyKillSwitch();
    const command = process.argv[2];
    const argument = process.argv[3];
    
    switch (command) {
        case 'activate':
            killSwitch.activate(argument || 'CLI activation').then(() => {
                process.exit(0);
            });
            break;
            
        case 'deactivate':
            killSwitch.deactivate(argument || 'CLI deactivation').then(() => {
                process.exit(0);
            });
            break;
            
        case 'status':
            killSwitch.createCLI().status();
            break;
            
        default:
            console.log('MCP Emergency Kill Switch CLI');
            console.log('');
            console.log('Usage:');
            console.log('  node kill_switch.js activate "reason"   - Activate kill switch');
            console.log('  node kill_switch.js deactivate "reason" - Deactivate kill switch');
            console.log('  node kill_switch.js status               - Check status');
            console.log('');
            console.log('Environment Variables:');
            console.log('  MCP_KILL_SWITCH=true                    - Enable kill switch');
            console.log('  MCP_KILL_SWITCH_REASON="reason"         - Set reason');
            break;
    }
}

/**
 * Simple integration with Express app
 */
function setupKillSwitch(app) {
    const killSwitch = new EmergencyKillSwitch();
    
    // Add middleware to all routes
    app.use(killSwitch.middleware());
    
    // Add kill switch control endpoints
    app.get('/mcp/kill-switch/status', (req, res) => {
        res.json(killSwitch.getStatus());
    });
    
    app.post('/mcp/kill-switch/activate', async (req, res) => {
        const { reason } = req.body;
        try {
            await killSwitch.activate(reason || 'API activation');
            res.json({ success: true, message: 'Kill switch activated' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    app.post('/mcp/kill-switch/deactivate', async (req, res) => {
        const { resolution } = req.body;
        try {
            await killSwitch.deactivate(resolution || 'API deactivation');
            res.json({ success: true, message: 'Kill switch deactivated' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    console.log('🚨 MCP Kill Switch enabled:');
    console.log('   GET /mcp/kill-switch/status');
    console.log('   POST /mcp/kill-switch/activate');
    console.log('   POST /mcp/kill-switch/deactivate');
    console.log('   CLI: node mcp-doctrine-layer/emergency/kill_switch.js status');
    
    return killSwitch;
}

module.exports = { EmergencyKillSwitch, setupKillSwitch };

/**
 * Quick Commands:
 * 
 * Activate: node mcp-doctrine-layer/emergency/kill_switch.js activate "Production incident"
 * Deactivate: node mcp-doctrine-layer/emergency/kill_switch.js deactivate "Issue resolved"  
 * Status: node mcp-doctrine-layer/emergency/kill_switch.js status
 * 
 * Or set environment variable: export MCP_KILL_SWITCH=true
 */