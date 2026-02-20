/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AUDIT LOGGER — CTB Write Audit Trail
 * ═══════════════════════════════════════════════════════════════════════════════
 * Authority: imo-creator (Constitutional)
 * Purpose: Log every database write with full CTB context
 * Doctrine: CTB_REGISTRY_ENFORCEMENT.md §5.2
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { GatekeeperConfig, WriteAuditEntry } from "./types.ts";

export class AuditLogger {
  private config: GatekeeperConfig;
  private entries: WriteAuditEntry[] = [];

  constructor(config: GatekeeperConfig) {
    this.config = config;
  }

  /**
   * Record a write operation.
   * Called by Gatekeeper after every successful write.
   */
  log(
    table_schema: string,
    table_name: string,
    operation: "INSERT" | "UPDATE" | "DELETE",
    row_count: number,
    promotion_source?: string,
  ): WriteAuditEntry {
    const entry: WriteAuditEntry = {
      process_id: this.config.process_id,
      hub_id: this.config.hub_id,
      subhub_id: this.config.subhub_id,
      blueprint_version_hash: this.config.blueprint_version_hash,
      table_schema,
      table_name,
      operation,
      row_count,
      timestamp: new Date().toISOString(),
      ...(promotion_source ? { promotion_source } : {}),
    };

    this.entries.push(entry);

    // Also log to console in structured format for observability
    console.log(
      JSON.stringify({
        level: "audit",
        msg: `CTB_WRITE: ${operation} ${table_schema}.${table_name} (${row_count} rows)`,
        ...entry,
      }),
    );

    return entry;
  }

  /** Get all audit entries for this session */
  getEntries(): ReadonlyArray<WriteAuditEntry> {
    return this.entries;
  }

  /** Get entry count */
  getCount(): number {
    return this.entries.length;
  }

  /** Clear entries (for testing or rotation) */
  clear(): void {
    this.entries = [];
  }
}
