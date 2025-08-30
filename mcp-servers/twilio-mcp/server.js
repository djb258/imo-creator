const express = require('express');
const cors = require('cors');
const toolHandler = require('./tools/tool_handler');
const validatePayload = require('./middleware/validate_payload');
const killSwitch = require('./middleware/kill_switch');
const logToMantis = require('./middleware/log_to_mantis');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/mcp/health', (req, res) => {
  const healthStatus = {
    status: 'healthy',
    server: 'twilio-mcp',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: {
      twilio_account_configured: !!process.env.TWILIO_ACCOUNT_SID,
      twilio_auth_configured: !!process.env.TWILIO_AUTH_TOKEN,
      default_phone_configured: !!process.env.TWILIO_PHONE_NUMBER
    }
  };
  
  res.json(healthStatus);
});

// Kill switch status
app.get('/mcp/kill-switch', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const killFile = path.join(__dirname, '.kill_switch');
  
  res.json({
    active: fs.existsSync(killFile) || process.env.KILL_SWITCH_ACTIVE === 'true',
    server: 'twilio-mcp'
  });
});

// Tool capabilities endpoint
app.get('/mcp/tools', (req, res) => {
  res.json({
    server: 'twilio-mcp',
    available_tools: [
      {
        name: 'send_sms',
        description: 'Send SMS message via Twilio',
        required_env: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER']
      },
      {
        name: 'make_call',
        description: 'Make voice call via Twilio',
        required_env: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER']
      }
    ]
  });
});

// Main tool endpoint
app.post('/tool', validatePayload, killSwitch, logToMantis, async (req, res) => {
  try {
    const result = await toolHandler.handleToolCall(req.body);
    res.json(result);
  } catch (error) {
    console.error('Tool execution error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      server: 'twilio-mcp',
      heir_tracking: {
        unique_id: req.body.unique_id,
        process_lineage: [req.body.process_id],
        error_occurred: true,
        error_type: 'server_error',
        timestamp: new Date().toISOString()
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 twilio-mcp server running on port ${PORT}`);
  console.log(`📱 SMS and voice communication ready`);
  console.log(`🔒 HEIR/ORBT compliance: Active`);
  
  // Environment validation
  const requiredEnv = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'];
  const missingEnv = requiredEnv.filter(key => !process.env[key]);
  
  if (missingEnv.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missingEnv.join(', ')}`);
    console.warn('🔧 Server will run but Twilio operations will fail');
  }
});