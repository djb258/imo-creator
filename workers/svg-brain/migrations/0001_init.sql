-- ═══════════════════════════════════════════════════════════════
-- svg-brain — D1 Schema (SQLite)
-- ═══════════════════════════════════════════════════════════════
-- BAR-147 | CTB Compliant: 1 CANONICAL + 1 ERROR per sub-hub
-- 4 Sub-hubs: documents, glossary, decisions, graph
-- ═══════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────┐
-- │ SUB-HUB 1: DOCUMENTS                                       │
-- │ CANONICAL: documents                                       │
-- │ ERROR:     documents_error                                 │
-- │ STAGING:   chunks (derived from documents via chunking)    │
-- │ MV:        chunks_fts (FTS5 virtual table)                 │
-- └─────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS documents (
  document_id   TEXT PRIMARY KEY,
  domain        TEXT NOT NULL,
  source_path   TEXT NOT NULL,
  title         TEXT NOT NULL,
  content_hash  TEXT NOT NULL,
  doc_version   TEXT NOT NULL DEFAULT '1.0.0',
  ingested_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_documents_domain ON documents(domain);
CREATE INDEX IF NOT EXISTS idx_documents_source_path ON documents(source_path);
CREATE UNIQUE INDEX IF NOT EXISTS idx_documents_content_hash ON documents(content_hash);

CREATE TABLE IF NOT EXISTS documents_error (
  error_id        TEXT PRIMARY KEY,
  document_id     TEXT,
  error_code      TEXT NOT NULL,
  error_message   TEXT NOT NULL,
  source_path     TEXT,
  payload_snapshot TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_documents_error_code ON documents_error(error_code);

CREATE TABLE IF NOT EXISTS chunks (
  chunk_id      TEXT PRIMARY KEY,
  document_id   TEXT NOT NULL REFERENCES documents(document_id),
  chunk_index   INTEGER NOT NULL,
  content       TEXT NOT NULL,
  token_count   INTEGER NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_chunks_document_id ON chunks(document_id);

-- FTS5 virtual table for full-text search (MV leaf)
CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(
  content,
  content='chunks',
  content_rowid='rowid'
);

-- ┌─────────────────────────────────────────────────────────────┐
-- │ SUB-HUB 2: GLOSSARY                                        │
-- │ CANONICAL: glossary                                        │
-- │ ERROR:     glossary_error                                  │
-- └─────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS glossary (
  term_id             TEXT PRIMARY KEY,
  term                TEXT NOT NULL,
  definition          TEXT NOT NULL,
  domain              TEXT NOT NULL,
  source_document_id  TEXT REFERENCES documents(document_id),
  created_at          TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_glossary_term_domain ON glossary(term, domain);
CREATE INDEX IF NOT EXISTS idx_glossary_domain ON glossary(domain);

CREATE TABLE IF NOT EXISTS glossary_error (
  error_id      TEXT PRIMARY KEY,
  term_id       TEXT,
  error_code    TEXT NOT NULL,
  error_message TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_glossary_error_code ON glossary_error(error_code);

-- ┌─────────────────────────────────────────────────────────────┐
-- │ SUB-HUB 3: DECISIONS                                       │
-- │ CANONICAL: decisions                                       │
-- │ ERROR:     decisions_error                                 │
-- └─────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS decisions (
  decision_id         TEXT PRIMARY KEY,
  adr_number          TEXT NOT NULL,
  title               TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'accepted',
  domain              TEXT NOT NULL,
  summary             TEXT NOT NULL,
  source_document_id  TEXT REFERENCES documents(document_id),
  decided_at          TEXT NOT NULL,
  created_at          TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_decisions_adr ON decisions(adr_number);
CREATE INDEX IF NOT EXISTS idx_decisions_domain ON decisions(domain);
CREATE INDEX IF NOT EXISTS idx_decisions_status ON decisions(status);

CREATE TABLE IF NOT EXISTS decisions_error (
  error_id      TEXT PRIMARY KEY,
  decision_id   TEXT,
  error_code    TEXT NOT NULL,
  error_message TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_decisions_error_code ON decisions_error(error_code);

-- ┌─────────────────────────────────────────────────────────────┐
-- │ SUB-HUB 4: GRAPH (Relationships)                           │
-- │ CANONICAL: relationships                                   │
-- │ ERROR:     relationships_error                             │
-- └─────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS relationships (
  relationship_id TEXT PRIMARY KEY,
  source_type     TEXT NOT NULL,
  source_id       TEXT NOT NULL,
  target_type     TEXT NOT NULL,
  target_id       TEXT NOT NULL,
  relation        TEXT NOT NULL,
  weight          REAL NOT NULL DEFAULT 1.0,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_relationships_source ON relationships(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_relationships_target ON relationships(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_relationships_relation ON relationships(relation);
CREATE UNIQUE INDEX IF NOT EXISTS idx_relationships_unique ON relationships(source_type, source_id, target_type, target_id, relation);

CREATE TABLE IF NOT EXISTS relationships_error (
  error_id        TEXT PRIMARY KEY,
  relationship_id TEXT,
  error_code      TEXT NOT NULL,
  error_message   TEXT NOT NULL,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_relationships_error_code ON relationships_error(error_code);
