// ═══════════════════════════════════════════════════════════════
// Ingestion Pipeline — IMO Flow
// ═══════════════════════════════════════════════════════════════
// Ingress: Validate request shape (schema only, no decisions)
// Middle:  Hash → dedup → chunk → embed → store
// Egress:  Return result summary (read-only view)
// ═══════════════════════════════════════════════════════════════

import { upsertDocument } from '../data/documents';
import { insertChunks, deleteChunksByDocument, syncFts, getChunksByDocument } from '../data/chunks';
import { embedAndUpsert, deleteVectors } from '../ai/embeddings';
import { recordError } from '../data/errors';
import { chunkDocument } from './chunker';
import type { IngestRequest, Env } from '../types';

interface IngestResult {
  document_id: string;
  action: 'inserted' | 'updated' | 'skipped';
  chunks_created: number;
  chunks_embedded: number;
  errors: string[];
}

// ── Ingress: Schema Validation ───────────────────────────────
function validateIngestRequest(body: unknown): { valid: true; data: IngestRequest } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' };
  }

  const obj = body as Record<string, unknown>;

  if (!obj.domain || typeof obj.domain !== 'string') {
    return { valid: false, error: 'domain is required (string)' };
  }
  if (!obj.source_path || typeof obj.source_path !== 'string') {
    return { valid: false, error: 'source_path is required (string)' };
  }
  if (!obj.title || typeof obj.title !== 'string') {
    return { valid: false, error: 'title is required (string)' };
  }
  if (!obj.content || typeof obj.content !== 'string') {
    return { valid: false, error: 'content is required (string)' };
  }

  return {
    valid: true,
    data: {
      domain: obj.domain as string,
      source_path: obj.source_path as string,
      title: obj.title as string,
      content: obj.content as string,
      doc_version: (obj.doc_version as string) || '1.0.0',
    },
  };
}

// ── Middle: Full Ingestion Pipeline ──────────────────────────
export async function ingestDocument(env: Env, body: unknown): Promise<IngestResult> {
  const validation = validateIngestRequest(body);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const { data } = validation;
  const documentId = crypto.randomUUID();
  const errors: string[] = [];

  // Content-hash for dedup
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data.content));
  const contentHash = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Step 1: Upsert document record
  let result: { action: 'inserted' | 'updated' | 'skipped'; document_id: string };
  try {
    result = await upsertDocument(env.D1_BRAIN, {
      document_id: documentId,
      domain: data.domain,
      source_path: data.source_path,
      title: data.title,
      content_hash: contentHash,
      doc_version: data.doc_version ?? '1.0.0',
    });
  } catch (e: any) {
    await recordError(env.D1_BRAIN, {
      table: 'documents_error',
      fk_column: 'document_id',
      fk_value: documentId,
      error_code: 'INGEST_UPSERT_FAILED',
      error_message: e.message,
      source_path: data.source_path,
    });
    throw e;
  }

  // If content unchanged, skip re-chunking and re-embedding
  if (result.action === 'skipped') {
    return {
      document_id: result.document_id,
      action: 'skipped',
      chunks_created: 0,
      chunks_embedded: 0,
      errors: [],
    };
  }

  const activeDocId = result.document_id;

  // Step 2: If updated, delete old chunks and vectors
  if (result.action === 'updated') {
    const oldChunks = await getChunksByDocument(env.D1_BRAIN, activeDocId);
    const oldChunkIds = oldChunks.map(c => c.chunk_id);
    await deleteVectors(env.VECTORIZE, oldChunkIds);
    await deleteChunksByDocument(env.D1_BRAIN, activeDocId);
  }

  // Step 3: Chunk the content (deterministic)
  const chunks = chunkDocument(activeDocId, data.content);

  // Step 4: Insert chunks into D1
  try {
    await insertChunks(env.D1_BRAIN, chunks);
  } catch (e: any) {
    await recordError(env.D1_BRAIN, {
      table: 'documents_error',
      fk_column: 'document_id',
      fk_value: activeDocId,
      error_code: 'CHUNK_INSERT_FAILED',
      error_message: e.message,
      source_path: data.source_path,
    });
    errors.push(`Chunk insert failed: ${e.message}`);
  }

  // Step 5: Sync FTS5 index
  try {
    await syncFts(env.D1_BRAIN, chunks.map(c => ({ chunk_id: c.chunk_id, content: c.content })));
  } catch (e: any) {
    errors.push(`FTS sync failed: ${e.message}`);
  }

  // Step 6: Embed chunks and upsert to Vectorize
  let chunksEmbedded = 0;
  try {
    const embeddingResult = await embedAndUpsert(
      env.AI,
      env.VECTORIZE,
      chunks.map(c => ({
        chunk_id: c.chunk_id,
        content: c.content,
        document_id: activeDocId,
        domain: data.domain,
      }))
    );
    chunksEmbedded = embeddingResult.embedded;
    errors.push(...embeddingResult.errors);
  } catch (e: any) {
    await recordError(env.D1_BRAIN, {
      table: 'documents_error',
      fk_column: 'document_id',
      fk_value: activeDocId,
      error_code: 'EMBEDDING_FAILED',
      error_message: e.message,
      source_path: data.source_path,
    });
    errors.push(`Embedding failed: ${e.message}`);
  }

  return {
    document_id: activeDocId,
    action: result.action,
    chunks_created: chunks.length,
    chunks_embedded: chunksEmbedded,
    errors,
  };
}
