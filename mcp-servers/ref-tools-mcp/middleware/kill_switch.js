const fs = require('fs');
const path = require('path');

const KILL_SWITCH_FILE = path.join(__dirname, '..', '.kill_switch');
const KILL_SWITCH_ENV = process.env.KILL_SWITCH_ACTIVE;

const killSwitch = (req, res, next) => {
  if (fs.existsSync(KILL_SWITCH_FILE) || KILL_SWITCH_ENV === 'true') {
    return res.status(503).json({
      error: 'Service temporarily unavailable - kill switch active',
      code: 'KILL_SWITCH_ACTIVE',
      server: 'ref-tools-mcp',
      documentation_access: false,
      ref_tools_blocked: true
    });
  }
  next();
};

module.exports = killSwitch;