const Ajv = require('ajv');
const ajv = new Ajv();

function validatePayload(schema) {
  const validate = ajv.compile(schema);
  
  return (req, res, next) => {
    const valid = validate(req.body);
    
    if (!valid) {
      return res.status(400).json({
        error: 'Invalid payload',
        details: validate.errors
      });
    }
    
    // Check HEIR compliance
    if (!req.body.unique_id || !req.body.unique_id.match(/^HEIR-/)) {
      return res.status(400).json({
        error: 'Missing or invalid HEIR unique_id'
      });
    }
    
    next();
  };
}

module.exports = validatePayload;