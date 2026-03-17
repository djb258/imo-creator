// ═══════════════════════════════════════════════════════════════
// svg-brain — Type Definitions
// ═══════════════════════════════════════════════════════════════

export interface Env {
  D1_BRAIN: D1Database;
  VECTORIZE: VectorizeIndex;
  AI: Ai;
  SVG_BRAIN_API_KEY: string;
}

// ── Sub-hub 1: Documents (CANONICAL) ─────────────────────────
export interface Document {
  document_id: string;
  domain: string;
  source_path: string;
  title: string;
  content_hash: string;
  doc_version: string;
  ingested_at: string;
  updated_at: string;
}

// ── Sub-hub 1: Documents Error ───────────────────────────────
export interface DocumentError {
  error_id: string;
  document_id: string | null;
  error_code: string;
  error_message: string;
  source_path: string | null;
  payload_snapshot: string | null;
  created_at: string;
}

// ── Sub-hub 1: Chunks (STAGING) ──────────────────────────────
export interface Chunk {
  chunk_id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  token_count: number;
  created_at: string;
}

// ── Sub-hub 2: Glossary (CANONICAL) ──────────────────────────
export interface GlossaryTerm {
  term_id: string;
  term: string;
  definition: string;
  domain: string;
  source_document_id: string | null;
  created_at: string;
  updated_at: string;
}

// ── Sub-hub 2: Glossary Error ────────────────────────────────
export interface GlossaryError {
  error_id: string;
  term_id: string | null;
  error_code: string;
  error_message: string;
  created_at: string;
}

// ── Sub-hub 3: Decisions (CANONICAL) ─────────────────────────
export interface Decision {
  decision_id: string;
  adr_number: string;
  title: string;
  status: string;
  domain: string;
  summary: string;
  source_document_id: string | null;
  decided_at: string;
  created_at: string;
  updated_at: string;
}

// ── Sub-hub 3: Decisions Error ───────────────────────────────
export interface DecisionError {
  error_id: string;
  decision_id: string | null;
  error_code: string;
  error_message: string;
  created_at: string;
}

// ── Sub-hub 4: Graph/Relationships (CANONICAL) ───────────────
export interface Relationship {
  relationship_id: string;
  source_type: string;
  source_id: string;
  target_type: string;
  target_id: string;
  relation: string;
  weight: number;
  created_at: string;
}

// ── Sub-hub 4: Relationships Error ───────────────────────────
export interface RelationshipError {
  error_id: string;
  relationship_id: string | null;
  error_code: string;
  error_message: string;
  created_at: string;
}

// ── API Types ────────────────────────────────────────────────
export interface IngestRequest {
  domain: string;
  source_path: string;
  title: string;
  content: string;
  doc_version?: string;
}

export interface QueryRequest {
  query: string;
  domain?: string;
  top_k?: number;
}

export interface QueryResult {
  chunk_id: string;
  document_id: string;
  content: string;
  score: number;
  source_path: string;
  title: string;
  domain: string;
}

export interface LookupRequest {
  term: string;
  domain?: string;
}
