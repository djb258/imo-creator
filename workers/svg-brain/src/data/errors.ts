// ═══════════════════════════════════════════════════════════════
// Error Recording — writes to per-sub-hub ERROR tables
// ═══════════════════════════════════════════════════════════════
// CTB: Every sub-hub has exactly 1 ERROR table.
// All failures are INSERT-only. No updates. No deletes.
// ═══════════════════════════════════════════════════════════════

type ErrorTable = 'documents_error' | 'glossary_error' | 'decisions_error' | 'relationships_error';

interface ErrorRecord {
  table: ErrorTable;
  fk_column: string;
  fk_value: string | null;
  error_code: string;
  error_message: string;
  payload_snapshot?: string;
  source_path?: string;
}

export async function recordError(db: D1Database, record: ErrorRecord): Promise<void> {
  const errorId = crypto.randomUUID();

  if (record.table === 'documents_error') {
    await db.prepare(
      `INSERT INTO documents_error (error_id, document_id, error_code, error_message, source_path, payload_snapshot)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(
      errorId,
      record.fk_value,
      record.error_code,
      record.error_message,
      record.source_path ?? null,
      record.payload_snapshot ?? null
    ).run();
  } else if (record.table === 'glossary_error') {
    await db.prepare(
      `INSERT INTO glossary_error (error_id, term_id, error_code, error_message)
       VALUES (?, ?, ?, ?)`
    ).bind(errorId, record.fk_value, record.error_code, record.error_message).run();
  } else if (record.table === 'decisions_error') {
    await db.prepare(
      `INSERT INTO decisions_error (error_id, decision_id, error_code, error_message)
       VALUES (?, ?, ?, ?)`
    ).bind(errorId, record.fk_value, record.error_code, record.error_message).run();
  } else if (record.table === 'relationships_error') {
    await db.prepare(
      `INSERT INTO relationships_error (error_id, relationship_id, error_code, error_message)
       VALUES (?, ?, ?, ?)`
    ).bind(errorId, record.fk_value, record.error_code, record.error_message).run();
  }
}
