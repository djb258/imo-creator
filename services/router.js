/**
 * IMO-Creator Middle Layer Router
 * Routes integrations through Composio by default with fallback support
 */

import registry from '../branches/composio/mcp_registry.json' assert { type: 'json' };

// Cache for endpoint health status
const healthCache = new Map();
const HEALTH_CHECK_INTERVAL = 60000; // 1 minute
const TIMEOUT_MS = parseInt(process.env.MCP_TIMEOUT || '5000');

/**
 * Main routing function - determines integration path
 * @param {string} app - Application/tool name to route to
 * @param {object} payload - Request payload
 * @param {object} options - Additional options (timeout, retries, etc)
 * @returns {Promise<object>} Integration response
 */
export async function routeIntegration(app, payload, options = {}) {
  const tool = registry.find(t => t.tool.toLowerCase() === app.toLowerCase());

  if (!tool) {
    throw new Error(`Tool not found in registry: ${app}`);
  }

  if (tool.status !== 'active') {
    throw new Error(`Tool ${app} is currently ${tool.status}`);
  }

  // Log routing decision for observability
  console.log(`[Router] Routing ${app} through ${tool.type} (${tool.doctrine_id})`);

  try {
    if (tool.type === "MCP") {
      // Primary path: Route through Composio/MCP
      return await callComposio(tool, payload, options);
    } else {
      // Fallback path: Direct spoke integration
      return await callFallback(tool, payload, options);
    }
  } catch (error) {
    console.error(`[Router] Failed to route ${app}:`, error);

    // If MCP fails, try fallback if available
    if (tool.type === "MCP") {
      const fallback = await findFallback(app);
      if (fallback) {
        console.log(`[Router] Attempting fallback for ${app} via ${fallback.tool}`);
        return await callFallback(fallback, payload, options);
      }
    }

    throw error;
  }
}

/**
 * Call Composio MCP endpoint
 * @private
 */
async function callComposio(tool, payload, options = {}) {
  const controller = new AbortController();
  const timeout = options.timeout || TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(tool.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Doctrine-ID': tool.doctrine_id,
        'X-Branch': tool.branch,
        'Authorization': `Bearer ${process.env.COMPOSIO_API_KEY}`
      },
      body: JSON.stringify({
        tool: tool.tool,
        payload: payload,
        metadata: {
          doctrine_id: tool.doctrine_id,
          timestamp: new Date().toISOString(),
          source: 'imo-creator'
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`MCP call failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    // Mark endpoint as healthy
    healthCache.set(tool.endpoint, {
      healthy: true,
      lastCheck: Date.now()
    });

    return {
      success: true,
      type: 'MCP',
      tool: tool.tool,
      doctrine_id: tool.doctrine_id,
      data: result
    };
  } catch (error) {
    clearTimeout(timeoutId);

    // Mark endpoint as unhealthy
    healthCache.set(tool.endpoint, {
      healthy: false,
      lastCheck: Date.now(),
      error: error.message
    });

    throw error;
  }
}

/**
 * Call fallback spoke endpoint
 * @private
 */
async function callFallback(tool, payload, options = {}) {
  const controller = new AbortController();
  const timeout = options.timeout || TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(tool.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Doctrine-ID': tool.doctrine_id,
        'X-Branch': tool.branch,
        'X-Fallback': 'true'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Fallback call failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    return {
      success: true,
      type: 'Fallback',
      tool: tool.tool,
      doctrine_id: tool.doctrine_id,
      fallback: true,
      data: result
    };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Find available fallback for a given app
 * @private
 */
async function findFallback(app) {
  // Look for explicit fallback mappings
  const fallbackMap = {
    'Neon': 'n8n',
    'Firebase': 'Make.com',
    'Apify': 'Zapier'
  };

  const fallbackName = fallbackMap[app];
  if (fallbackName) {
    return registry.find(t =>
      t.tool === fallbackName &&
      t.type === 'Fallback' &&
      t.status === 'active'
    );
  }

  // Return first available active fallback
  return registry.find(t =>
    t.type === 'Fallback' &&
    t.status === 'active'
  );
}

/**
 * Check health of an endpoint
 * @param {string} endpoint - Endpoint URL to check
 * @returns {Promise<boolean>} Health status
 */
export async function checkEndpointHealth(endpoint) {
  // Check cache first
  const cached = healthCache.get(endpoint);
  if (cached && (Date.now() - cached.lastCheck) < HEALTH_CHECK_INTERVAL) {
    return cached.healthy;
  }

  try {
    const response = await fetch(`${endpoint}/health`, {
      method: 'GET',
      timeout: 2000
    });

    const healthy = response.ok;
    healthCache.set(endpoint, {
      healthy,
      lastCheck: Date.now()
    });

    return healthy;
  } catch (error) {
    healthCache.set(endpoint, {
      healthy: false,
      lastCheck: Date.now(),
      error: error.message
    });
    return false;
  }
}

/**
 * Get status of all registered tools
 * @returns {Promise<Array>} Tool status list
 */
export async function getToolStatus() {
  const statuses = await Promise.all(
    registry.map(async (tool) => {
      const health = await checkEndpointHealth(tool.endpoint);
      return {
        ...tool,
        healthy: health,
        checked_at: new Date().toISOString()
      };
    })
  );

  return statuses;
}

/**
 * Refresh registry from source
 * @returns {Promise<void>}
 */
export async function refreshRegistry() {
  try {
    // In production, this could fetch from a remote source
    const module = await import('../branches/composio/mcp_registry.json', {
      assert: { type: 'json' }
    });

    // Update registry in memory
    registry.length = 0;
    registry.push(...module.default);

    console.log(`[Router] Registry refreshed: ${registry.length} tools loaded`);
  } catch (error) {
    console.error('[Router] Failed to refresh registry:', error);
    throw error;
  }
}

// Auto-refresh registry every hour
setInterval(refreshRegistry, 3600000);

export default {
  routeIntegration,
  checkEndpointHealth,
  getToolStatus,
  refreshRegistry
};