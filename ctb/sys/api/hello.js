// # CTB Metadata
// # Generated: 2025-10-23T14:32:35.488028
// # CTB Version: 1.3.3
// # Division: System Infrastructure
// # Category: api
// # Compliance: 100%
// # HEIR ID: HEIR-2025-10-SYS-API-01

/**
 * Doctrine Spec:
 * - Barton ID: 01.01.01.07.10000.001
 * - Altitude: 10000 (Execution Layer)
 * - Purpose: Simple API health check endpoint
 * - Input: HTTP request
 * - Output: JSON status response
 * - MCP: N/A
 */
export default function handler(request, response) {
  response.status(200).json({
    message: 'Hello from Vercel API!',
    url: request.url,
    method: request.method
  });
}