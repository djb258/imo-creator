/**
 * Doctrine Spec:
 * - Barton ID: 01.04.01.07.10000.005
 * - Altitude: 10000 (Execution Layer)
 * - Purpose: General utility
 * - Input: various parameters
 * - Output: processed results
 * - MCP: N/A
 */
export default function handler(req, res) {
  res.status(200).json({ 
    message: 'API is working!', 
    method: req.method,
    timestamp: new Date().toISOString()
  });
}