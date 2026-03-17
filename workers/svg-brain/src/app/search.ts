// ═══════════════════════════════════════════════════════════════
// Hybrid Search — FTS5 BM25 + Vectorize Cosine + RRF Fusion
// ═══════════════════════════════════════════════════════════════
// IMO Layer: Middle (all search logic here)
// Algorithm: Reciprocal Rank Fusion (k=60)
// Deterministic ranking — no LLM in the search path.
// ═══════════════════════════════════════════════════════════════

import { embedQuery } from '../ai/embeddings';
import type { QueryResult, Env } from '../types';

const RRF_K = 60;

interface FtsResult {
  chunk_id: string;
  content: string;
  rank: number;
}

interface VectorResult {
  chunk_id: string;
  score: number;
}

export async function hybridSearch(
  env: Env,
  query: string,
  domain: string | undefined,
  topK: number
): Promise<QueryResult[]> {
  // Run FTS5 and Vectorize searches in parallel
  const [ftsResults, vectorResults] = await Promise.all([
    ftsSearch(env.D1_BRAIN, query, topK * 2),
    vectorSearch(env, query, domain, topK * 2),
  ]);

  // RRF Fusion
  const scoreMap = new Map<string, { ftsRank: number; vecRank: number }>();

  ftsResults.forEach((result, idx) => {
    scoreMap.set(result.chunk_id, {
      ftsRank: idx + 1,
      vecRank: Infinity,
    });
  });

  vectorResults.forEach((result, idx) => {
    const existing = scoreMap.get(result.chunk_id);
    if (existing) {
      existing.vecRank = idx + 1;
    } else {
      scoreMap.set(result.chunk_id, {
        ftsRank: Infinity,
        vecRank: idx + 1,
      });
    }
  });

  // Calculate RRF scores
  const fused = Array.from(scoreMap.entries()).map(([chunkId, ranks]) => ({
    chunk_id: chunkId,
    score: (1 / (RRF_K + ranks.ftsRank)) + (1 / (RRF_K + ranks.vecRank)),
  }));

  // Sort by fused score descending
  fused.sort((a, b) => b.score - a.score);

  // Take top K and hydrate with document metadata
  const topChunkIds = fused.slice(0, topK).map(f => f.chunk_id);
  const scoreByChunk = new Map(fused.map(f => [f.chunk_id, f.score]));

  if (topChunkIds.length === 0) return [];

  // Hydrate chunks with document metadata
  const placeholders = topChunkIds.map(() => '?').join(', ');
  const hydrated = await env.D1_BRAIN.prepare(`
    SELECT c.chunk_id, c.document_id, c.content, d.source_path, d.title, d.domain
    FROM chunks c
    JOIN documents d ON c.document_id = d.document_id
    WHERE c.chunk_id IN (${placeholders})
  `).bind(...topChunkIds).all<{
    chunk_id: string;
    document_id: string;
    content: string;
    source_path: string;
    title: string;
    domain: string;
  }>();

  // Rebuild in fused-score order
  const hydratedMap = new Map(hydrated.results.map(r => [r.chunk_id, r]));

  return topChunkIds
    .map(id => {
      const row = hydratedMap.get(id);
      if (!row) return null;
      return {
        chunk_id: row.chunk_id,
        document_id: row.document_id,
        content: row.content,
        score: scoreByChunk.get(id) ?? 0,
        source_path: row.source_path,
        title: row.title,
        domain: row.domain,
      };
    })
    .filter((r): r is QueryResult => r !== null);
}

async function ftsSearch(db: D1Database, query: string, limit: number): Promise<FtsResult[]> {
  try {
    const result = await db.prepare(`
      SELECT c.chunk_id, c.content, f.rank
      FROM chunks_fts f
      JOIN chunks c ON c.rowid = f.rowid
      WHERE chunks_fts MATCH ?
      ORDER BY f.rank
      LIMIT ?
    `).bind(query, limit).all<FtsResult>();
    return result.results;
  } catch {
    // FTS5 MATCH can fail on malformed queries — return empty
    return [];
  }
}

async function vectorSearch(
  env: Env,
  query: string,
  domain: string | undefined,
  limit: number
): Promise<VectorResult[]> {
  try {
    const queryVector = await embedQuery(env.AI, query);

    const filter = domain ? { domain } : undefined;
    const results = await env.VECTORIZE.query(queryVector, {
      topK: limit,
      filter,
      returnMetadata: 'none',
    });

    return results.matches.map(m => ({
      chunk_id: m.id,
      score: m.score,
    }));
  } catch {
    return [];
  }
}
