const validatePayload = (req, res, next) => {
  const required = ['unique_id', 'process_id', 'orbt_layer', 'blueprint_version'];
  const missing = required.filter(field => !req.body[field]);
  
  if (missing.length > 0) {
    return res.status(400).json({
      error: 'Missing required HEIR/ORBT fields',
      missing_fields: missing,
      server: 'twilio-mcp'
    });
  }
  
  if (req.body.orbt_layer > 5) {
    return res.status(403).json({
      error: 'ORBT Layer 5 maximum exceeded',
      server: 'twilio-mcp'
    });
  }
  
  next();
};

module.exports = validatePayload;