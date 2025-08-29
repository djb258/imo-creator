/**
 * Kill Switch middleware
 * Checks for emergency kill switch activation
 */

const fs = require('fs');
const path = require('path');

const KILL_SWITCH_FILE = path.join(__dirname, '..', '..', 'mcp-doctrine-layer', 'emergency', '.kill-switch');

function checkKillSwitch(req, res, next) {
  // Check environment variable kill switch
  if (process.env.MCP_KILL_SWITCH === 'true') {
    return res.status(503).json({
      success: false,
      error: 'MCP Kill Switch Activated - All operations suspended',
      compliance_status: 'EMERGENCY_SHUTDOWN',
      timestamp: new Date().toISOString()
    });
  }
  
  // Check file-based kill switch
  if (fs.existsSync(KILL_SWITCH_FILE)) {
    try {
      const killSwitchData = JSON.parse(fs.readFileSync(KILL_SWITCH_FILE, 'utf8'));
      if (killSwitchData.active === true) {
        return res.status(503).json({
          success: false,
          error: 'MCP Kill Switch Activated - All operations suspended',
          reason: killSwitchData.reason || 'Emergency shutdown',
          activated_at: killSwitchData.activated_at,
          compliance_status: 'EMERGENCY_SHUTDOWN'
        });
      }
    } catch (error) {
      // If kill switch file is corrupted, assume active for safety
      return res.status(503).json({
        success: false,
        error: 'Kill switch file corrupted - Safety shutdown activated',
        compliance_status: 'SAFETY_SHUTDOWN'
      });
    }
  }
  
  next();
}

module.exports = checkKillSwitch;