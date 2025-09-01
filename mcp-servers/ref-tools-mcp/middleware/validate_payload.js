const validatePayload = (req, res, next) => {
  const required = ['unique_id', 'process_id', 'orbt_layer', 'blueprint_version'];
  const missing = required.filter(field => !req.body[field]);
  
  if (missing.length > 0) {
    return res.status(400).json({
      error: 'Missing required HEIR/ORBT fields',
      missing_fields: missing,
      server: 'ref-tools-mcp',
      documentation_access: true
    });
  }
  
  if (req.body.orbt_layer > 5) {
    return res.status(403).json({
      error: 'ORBT Layer 5 maximum exceeded',
      server: 'ref-tools-mcp',
      documentation_access: true
    });
  }
  
  // Validate documentation search fields
  if (req.body.tool === 'search_documentation') {
    if (!req.body.data?.query || typeof req.body.data.query !== 'string') {
      return res.status(400).json({
        error: 'Missing or invalid query parameter for documentation search',
        server: 'ref-tools-mcp'
      });
    }
    
    if (req.body.data.query.length > 200) {
      return res.status(400).json({
        error: 'Query too long - maximum 200 characters for token efficiency',
        server: 'ref-tools-mcp'
      });
    }
  }
  
  // Validate URL reading fields
  if (req.body.tool === 'read_documentation_url') {
    if (!req.body.data?.url) {
      return res.status(400).json({
        error: 'Missing URL parameter for documentation reading',
        server: 'ref-tools-mcp'
      });
    }
    
    try {
      new URL(req.body.data.url);
    } catch {
      return res.status(400).json({
        error: 'Invalid URL format provided',
        server: 'ref-tools-mcp'
      });
    }
  }
  
  next();
};

module.exports = validatePayload;