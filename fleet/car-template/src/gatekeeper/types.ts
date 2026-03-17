/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GATEKEEPER TYPES — CTB Write Enforcement
 * ═══════════════════════════════════════════════════════════════════════════════
 * Authority: imo-creator (Constitutional)
 * Purpose: Type definitions for the Gatekeeper database write wrapper
 * Doctrine: CTB_REGISTRY_ENFORCEMENT.md §5
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/** Configuration for Gatekeeper initialization */
export interface GatekeeperConfig {
  /** Hub identity (CC-02) */
  hub_id: string;
  /** Sub-hub identity (CC-03) */
  subhub_id: string;
  /** Blueprint version hash from column_registry.yml */
  blueprint_version_hash: string;
  /** Database connection string or pool reference */
  db_url: string;
  /** Process ID (CC-04 PID) for audit trail */
  process_id: string;
  /** Whether to enforce promotion paths on CANONICAL writes */
  enforce_promotions?: boolean;
}

/** A row in ctb.table_registry */
export interface TableRegistryEntry {
  id: number;
  table_schema: string;
  table_name: string;
  hub_id: string;
  subhub_id: string;
  leaf_type: "CANONICAL" | "ERROR" | "STAGING" | "MV" | "REGISTRY";
  is_frozen: boolean;
  blueprint_version_hash: string | null;
  description: string | null;
  registered_at: string;
  registered_by: string;
}

/** Audit log entry for every write operation */
export interface WriteAuditEntry {
  process_id: string;
  hub_id: string;
  subhub_id: string;
  blueprint_version_hash: string;
  table_schema: string;
  table_name: string;
  operation: "INSERT" | "UPDATE" | "DELETE";
  row_count: number;
  timestamp: string;
  promotion_source?: string;
}

/** Result of a Gatekeeper operation */
export interface GatekeeperResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  audit: WriteAuditEntry;
}

/** Promotion path declaration */
export interface PromotionPath {
  source_schema: string;
  source_table: string;
  target_schema: string;
  target_table: string;
  hub_id: string;
  subhub_id: string;
  is_active: boolean;
}
