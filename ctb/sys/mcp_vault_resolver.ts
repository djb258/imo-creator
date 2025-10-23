/**
 * MCP Vault Environment Variable Resolver
 * Version: 1.0
 * Purpose: Runtime injection of environment variables from MCP vault
 *
 * Security Policy: ZERO TOLERANCE
 * - No .env files
 * - No hardcoded secrets
 * - All credentials via MCP vault
 */

interface MCPVaultConfig {
  endpoint: string;
  apiKey?: string;
  timeout?: number;
}

interface MCPVariable {
  key: string;
  value: string;
  encrypted: boolean;
  source: 'mcp' | 'doppler' | 'firebase' | 'cache';
  timestamp: string;
}

interface VaultSource {
  name: string;
  priority: number;
  resolver: (key: string) => Promise<string | null>;
}

class MCPVaultResolver {
  private static instance: MCPVaultResolver;
  private cache: Map<string, MCPVariable>;
  private config: MCPVaultConfig;
  private sources: VaultSource[];

  private constructor() {
    this.cache = new Map();
    this.config = {
      endpoint: process.env.MCP_VAULT_ENDPOINT || 'http://localhost:3001',
      timeout: 5000
    };

    // Initialize vault sources in priority order
    this.sources = [
      {
        name: 'mcp',
        priority: 1,
        resolver: this.resolveMCP.bind(this)
      },
      {
        name: 'doppler',
        priority: 2,
        resolver: this.resolveDoppler.bind(this)
      },
      {
        name: 'firebase',
        priority: 3,
        resolver: this.resolveFirebase.bind(this)
      }
    ];
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): MCPVaultResolver {
    if (!MCPVaultResolver.instance) {
      MCPVaultResolver.instance = new MCPVaultResolver();
    }
    return MCPVaultResolver.instance;
  }

  /**
   * Get environment variable from MCP vault
   * @param key - Variable name
   * @param useCache - Whether to use cached value (default: true)
   * @returns Variable value or throws error if not found
   */
  public async getVariable(key: string, useCache: boolean = true): Promise<string> {
    // Security check: Prevent accidental .env usage
    if (this.isLocalEnvAttempt(key)) {
      throw new Error(
        `❌ Local .env file detected — use MCP vault variables instead.\n` +
        `Replace: process.env.${key}\n` +
        `With: mcp.getVariable('${key}')`
      );
    }

    // Check cache first
    if (useCache && this.cache.has(key)) {
      const cached = this.cache.get(key)!;
      const age = Date.now() - new Date(cached.timestamp).getTime();

      // Cache valid for 5 minutes
      if (age < 300000) {
        console.log(`[MCP] Using cached value for: ${key} (source: ${cached.source})`);
        return cached.value;
      }
    }

    // Try each vault source in priority order
    for (const source of this.sources) {
      try {
        const value = await source.resolver(key);
        if (value !== null) {
          // Cache successful resolution
          this.cacheVariable(key, value, source.name as any);
          console.log(`[MCP] Resolved ${key} from ${source.name} vault`);
          return value;
        }
      } catch (error) {
        console.warn(`[MCP] Failed to resolve ${key} from ${source.name}:`, error);
      }
    }

    throw new Error(
      `❌ Environment variable '${key}' not found in any vault source.\n` +
      `Available sources: MCP, Doppler, Firebase\n` +
      `Ensure the variable is registered in the MCP vault.`
    );
  }

  /**
   * Get multiple variables at once
   */
  public async getVariables(keys: string[]): Promise<Record<string, string>> {
    const results: Record<string, string> = {};

    await Promise.all(
      keys.map(async (key) => {
        try {
          results[key] = await this.getVariable(key);
        } catch (error) {
          console.error(`[MCP] Failed to get variable ${key}:`, error);
          throw error;
        }
      })
    );

    return results;
  }

  /**
   * Resolve variable from MCP vault
   */
  private async resolveMCP(key: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.config.endpoint}/vault/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-MCP-Key': this.config.apiKey || ''
        },
        body: JSON.stringify({ key }),
        signal: AbortSignal.timeout(this.config.timeout!)
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.value || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Resolve variable from Doppler vault
   */
  private async resolveDoppler(key: string): Promise<string | null> {
    // Doppler integration would go here
    // This is a placeholder for future implementation
    return null;
  }

  /**
   * Resolve variable from Firebase secure variables
   */
  private async resolveFirebase(key: string): Promise<string | null> {
    // Firebase secure variables integration would go here
    // This is a placeholder for future implementation
    return null;
  }

  /**
   * Cache variable value
   */
  private cacheVariable(key: string, value: string, source: 'mcp' | 'doppler' | 'firebase'): void {
    this.cache.set(key, {
      key,
      value,
      encrypted: false,
      source,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Security check: Detect local .env file attempts
   */
  private isLocalEnvAttempt(key: string): boolean {
    // Check if there's a .env file in the repository
    try {
      const fs = require('fs');
      const path = require('path');

      const forbiddenFiles = [
        '.env',
        '.env.local',
        '.env.development',
        '.env.production'
      ];

      for (const file of forbiddenFiles) {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
          console.error(`❌ Security violation: ${file} detected in repository`);
          return true;
        }
      }
    } catch (error) {
      // Filesystem not available (browser environment)
      return false;
    }

    return false;
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.cache.clear();
    console.log('[MCP] Variable cache cleared');
  }

  /**
   * Get cache stats
   */
  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Template string processor for MCP variables
   * Usage: const url = mcp.template`The database URL is ${MCP:DATABASE_URL}`
   */
  public async template(strings: TemplateStringsArray, ...keys: string[]): Promise<string> {
    const values = await Promise.all(
      keys.map(async (key) => {
        // Extract MCP variable syntax: ${MCP:VARIABLE_NAME}
        const mcpMatch = key.match(/^MCP:(.+)$/);
        if (mcpMatch) {
          return await this.getVariable(mcpMatch[1]);
        }
        return key;
      })
    );

    return strings.reduce((result, str, i) => {
      return result + str + (values[i] || '');
    }, '');
  }
}

// Export singleton instance
export const mcp = MCPVaultResolver.getInstance();

// Export class for testing
export { MCPVaultResolver };

// Utility functions for common patterns
export const getMCPVariable = (key: string): Promise<string> => mcp.getVariable(key);
export const getMCPVariables = (keys: string[]): Promise<Record<string, string>> => mcp.getVariables(keys);

/**
 * Example Usage:
 *
 * ```typescript
 * import { mcp } from './mcp_vault_resolver';
 *
 * // Single variable
 * const databaseUrl = await mcp.getVariable('DATABASE_URL');
 *
 * // Multiple variables
 * const vars = await mcp.getVariables(['API_KEY', 'SECRET_KEY', 'DATABASE_URL']);
 *
 * // Template literals
 * const config = await mcp.template`Database: ${MCP:DATABASE_URL}, API: ${MCP:API_KEY}`;
 * ```
 */
