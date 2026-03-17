// ═══════════════════════════════════════════════════════════════
// Chunks — STAGING table operations + FTS5 sync
// ═══════════════════════════════════════════════════════════════
// Chunks are derived from documents via deterministic splitting.
// FTS5 virtual table is synced on insert/delete.
// ═══════════════════════════════════════════════════════════════

import type { Chunk } from '../types';

export async function insertChunks(db: D1Database, chunks: Omit<Chunk, 'created_at'>[]): Promise<void> {
  const batchSize = 25;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const stmts = batch.map(chunk =>
      db.prepare(
        `INSERT INTO chunks (chunk_id, document_id, chunk_index, content, token_count)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(chunk.chunk_id, chunk.document_id, chunk.chunk_index, chunk.content, chunk.token_count)
    );
    await db.batch(stmts);
  }
}

export async function deleteChunksByDocument(db: D1Database, documentId: string): Promise<number> {
  // Get rowids for FTS5 cleanup before deleting
  const existing = await db.prepare(
    'SELECT rowid, content FROM chunks WHERE document_id = ?'
  ).bind(documentId).all<{ rowid: number; content: string }>();

  if (existing.results.length === 0) return 0;

  // Delete from FTS5 first
  const ftsStmts = existing.results.map(row =>
    db.prepare(
      `INSERT INTO chunks_fts(chunks_fts, rowid, content) VALUES('delete', ?, ?)`
    ).bind(row.rowid, row.content)
  );
  if (ftsStmts.length > 0) {
    await db.batch(ftsStmts);
  }

  // Delete from chunks table
  await db.prepare('DELETE FROM chunks WHERE document_id = ?').bind(documentId).run();

  return existing.results.length;
}

export async function syncFts(db: D1Database, chunks: { chunk_id: string; content: string }[]): Promise<void> {
  // Get rowids for the inserted chunks
  const ids = chunks.map(c => c.chunk_id);
  for (const chunk of chunks) {
    const row = await db.prepare('SELECT rowid FROM chunks WHERE chunk_id = ?')
      .bind(chunk.chunk_id).first<{ rowid: number }>();
    if (row) {
      await db.prepare(
        `INSERT INTO chunks_fts(rowid, content) VALUES(?, ?)`
      ).bind(row.rowid, chunk.content).run();
    }
  }
}

export async function getChunksByDocument(db: D1Database, documentId: string): Promise<Chunk[]> {
  const result = await db.prepare(
    'SELECT * FROM chunks WHERE document_id = ? ORDER BY chunk_index'
  ).bind(documentId).all<Chunk>();
  return result.results;
}

export async function getChunksByIds(db: D1Database, chunkIds: string[]): Promise<Chunk[]> {
  if (chunkIds.length === 0) return [];
  const placeholders = chunkIds.map(() => '?').join(', ');
  const result = await db.prepare(
    `SELECT * FROM chunks WHERE chunk_id IN (${placeholders})`
  ).bind(...chunkIds).all<Chunk>();
  return result.results;
}
