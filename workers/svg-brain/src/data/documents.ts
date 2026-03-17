// ═══════════════════════════════════════════════════════════════
// Documents Sub-hub — CANONICAL table operations
// ═══════════════════════════════════════════════════════════════
// INSERT-only discipline. Content-hash dedup.
// ═══════════════════════════════════════════════════════════════

import type { Document } from '../types';

export async function upsertDocument(
  db: D1Database,
  doc: Omit<Document, 'ingested_at' | 'updated_at'>
): Promise<{ action: 'inserted' | 'updated' | 'skipped'; document_id: string }> {
  // Check if content_hash already exists (dedup)
  const existing = await db.prepare(
    'SELECT document_id, content_hash FROM documents WHERE source_path = ?'
  ).bind(doc.source_path).first<{ document_id: string; content_hash: string }>();

  if (existing) {
    if (existing.content_hash === doc.content_hash) {
      return { action: 'skipped', document_id: existing.document_id };
    }
    // Content changed — update the row
    await db.prepare(
      `UPDATE documents SET content_hash = ?, doc_version = ?, title = ?, domain = ?, updated_at = datetime('now')
       WHERE document_id = ?`
    ).bind(doc.content_hash, doc.doc_version, doc.title, doc.domain, existing.document_id).run();
    return { action: 'updated', document_id: existing.document_id };
  }

  // New document — insert
  await db.prepare(
    `INSERT INTO documents (document_id, domain, source_path, title, content_hash, doc_version)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(doc.document_id, doc.domain, doc.source_path, doc.title, doc.content_hash, doc.doc_version).run();

  return { action: 'inserted', document_id: doc.document_id };
}

export async function getDocument(db: D1Database, documentId: string): Promise<Document | null> {
  return db.prepare('SELECT * FROM documents WHERE document_id = ?')
    .bind(documentId).first<Document>();
}

export async function listDocuments(db: D1Database, domain?: string): Promise<Document[]> {
  if (domain) {
    const result = await db.prepare('SELECT * FROM documents WHERE domain = ? ORDER BY updated_at DESC')
      .bind(domain).all<Document>();
    return result.results;
  }
  const result = await db.prepare('SELECT * FROM documents ORDER BY updated_at DESC').all<Document>();
  return result.results;
}
