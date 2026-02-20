/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GATEKEEPER — CTB Application-Level Write Enforcement
 * ═══════════════════════════════════════════════════════════════════════════════
 * Authority: imo-creator (Constitutional)
 * Purpose: All database writes MUST go through this module
 * Doctrine: CTB_REGISTRY_ENFORCEMENT.md §5
 *
 * This module wraps all database write operations and enforces:
 *   - Table must be registered in ctb.table_registry
 *   - Frozen tables reject all writes
 *   - CANONICAL writes require registered promotion paths
 *   - Every write is logged with full audit trail
 *
 * Direct database access (bypassing Gatekeeper) is BANNED.
 * See: detect-banned-db-clients.sh
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type {
  GatekeeperConfig,
  GatekeeperResult,
  TableRegistryEntry,
} from "./types.ts";
import { AuditLogger } from "./audit-logger.ts";

export class Gatekeeper {
  private config: GatekeeperConfig;
  private registry: Map<string, TableRegistryEntry> = new Map();
  private auditLogger: AuditLogger;
  private initialized = false;

  constructor(config: GatekeeperConfig) {
    this.config = config;
    this.auditLogger = new AuditLogger(config);
  }

  /**
   * Load the table registry from ctb.table_registry.
   * Must be called before any write operations.
   */
  async loadRegistry(
    queryFn: (sql: string) => Promise<{ rows: TableRegistryEntry[] }>,
  ): Promise<void> {
    const result = await queryFn(
      "SELECT * FROM ctb.table_registry WHERE hub_id = $1",
    );

    this.registry.clear();
    for (const row of result.rows) {
      const key = `${row.table_schema}.${row.table_name}`;
      this.registry.set(key, row);
    }

    this.initialized = true;
  }

  /**
   * Check if a table is registered.
   */
  isRegistered(table_schema: string, table_name: string): boolean {
    const key = `${table_schema}.${table_name}`;
    return this.registry.has(key);
  }

  /**
   * Get registry entry for a table.
   */
  getEntry(
    table_schema: string,
    table_name: string,
  ): TableRegistryEntry | undefined {
    const key = `${table_schema}.${table_name}`;
    return this.registry.get(key);
  }

  /**
   * Write to a registered, non-frozen table.
   * This is the ONLY way application code should write to the database.
   *
   * @param table_schema - PostgreSQL schema (e.g. 'public')
   * @param table_name - Table name
   * @param operation - INSERT, UPDATE, or DELETE
   * @param executeFn - Function that executes the actual SQL and returns row count
   */
  async write<T = unknown>(
    table_schema: string,
    table_name: string,
    operation: "INSERT" | "UPDATE" | "DELETE",
    executeFn: () => Promise<{ rows: T[]; rowCount: number }>,
  ): Promise<GatekeeperResult<T[]>> {
    this.ensureInitialized();

    const key = `${table_schema}.${table_name}`;
    const entry = this.registry.get(key);

    // Check registration
    if (!entry) {
      const audit = this.auditLogger.log(
        table_schema,
        table_name,
        operation,
        0,
      );
      return {
        success: false,
        error: `CTB_GATEKEEPER: Table ${key} is not registered in ctb.table_registry`,
        audit,
      };
    }

    // Check frozen
    if (entry.is_frozen) {
      const audit = this.auditLogger.log(
        table_schema,
        table_name,
        operation,
        0,
      );
      return {
        success: false,
        error: `CTB_GATEKEEPER: Table ${key} is FROZEN — writes are blocked`,
        audit,
      };
    }

    // Check CANONICAL restriction (writes require promotion)
    if (
      entry.leaf_type === "CANONICAL" &&
      this.config.enforce_promotions !== false
    ) {
      const audit = this.auditLogger.log(
        table_schema,
        table_name,
        operation,
        0,
      );
      return {
        success: false,
        error:
          `CTB_GATEKEEPER: Direct write to CANONICAL table ${key} not allowed. Use promote() method.`,
        audit,
      };
    }

    // Execute the write
    const result = await executeFn();
    const audit = this.auditLogger.log(
      table_schema,
      table_name,
      operation,
      result.rowCount,
    );

    return {
      success: true,
      data: result.rows,
      audit,
    };
  }

  /**
   * Read from any table (unrestricted but logged).
   */
  async read<T = unknown>(
    table_schema: string,
    table_name: string,
    queryFn: () => Promise<{ rows: T[] }>,
  ): Promise<T[]> {
    this.ensureInitialized();

    // Reads are unrestricted but we log for observability
    console.log(
      JSON.stringify({
        level: "audit",
        msg: `CTB_READ: ${table_schema}.${table_name}`,
        process_id: this.config.process_id,
        hub_id: this.config.hub_id,
        timestamp: new Date().toISOString(),
      }),
    );

    const result = await queryFn();
    return result.rows;
  }

  /**
   * Promote data from a SUPPORTING table to a CANONICAL table.
   * Sets the ctb.promotion_source session variable and validates the path.
   *
   * @param source_schema - Source table schema
   * @param source_table - Source table name (SUPPORTING type)
   * @param target_schema - Target table schema
   * @param target_table - Target table name (CANONICAL type)
   * @param executeFn - Function that executes the promotion SQL
   * @param setSessionVarFn - Function to SET LOCAL ctb.promotion_source
   */
  async promote<T = unknown>(
    source_schema: string,
    source_table: string,
    target_schema: string,
    target_table: string,
    executeFn: () => Promise<{ rows: T[]; rowCount: number }>,
    setSessionVarFn: (source: string) => Promise<void>,
  ): Promise<GatekeeperResult<T[]>> {
    this.ensureInitialized();

    const targetKey = `${target_schema}.${target_table}`;
    const sourceKey = `${source_schema}.${source_table}`;
    const targetEntry = this.registry.get(targetKey);

    // Validate target is CANONICAL
    if (!targetEntry || targetEntry.leaf_type !== "CANONICAL") {
      const audit = this.auditLogger.log(
        target_schema,
        target_table,
        "INSERT",
        0,
      );
      return {
        success: false,
        error: `CTB_GATEKEEPER: Promotion target ${targetKey} must be a CANONICAL table`,
        audit,
      };
    }

    // Set the promotion source session variable (DB-level enforcement)
    await setSessionVarFn(sourceKey);

    // Execute the promotion
    const result = await executeFn();
    const audit = this.auditLogger.log(
      target_schema,
      target_table,
      "INSERT",
      result.rowCount,
      sourceKey,
    );

    return {
      success: true,
      data: result.rows,
      audit,
    };
  }

  /** Get the audit logger for inspection */
  getAuditLogger(): AuditLogger {
    return this.auditLogger;
  }

  /** Get loaded registry size */
  getRegistrySize(): number {
    return this.registry.size;
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error(
        "CTB_GATEKEEPER: Registry not loaded. Call loadRegistry() before any operations.",
      );
    }
  }
}

export type { GatekeeperConfig, GatekeeperResult, TableRegistryEntry } from "./types.ts";
export { AuditLogger } from "./audit-logger.ts";
