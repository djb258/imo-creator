// ═══════════════════════════════════════════════════════════════
// Chunking Engine — Deterministic Text Splitter
// ═══════════════════════════════════════════════════════════════
// IMO Layer: Middle (processing logic)
// Pure deterministic — no LLM, no randomness.
// RecursiveCharacterTextSplitter: ~512 chars, 100 overlap.
// ═══════════════════════════════════════════════════════════════

const CHUNK_SIZE = 512;
const CHUNK_OVERLAP = 100;
const SEPARATORS = ['\n\n', '\n', '. ', ' ', ''];

interface ChunkOutput {
  chunk_id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  token_count: number;
}

export function chunkDocument(documentId: string, content: string): ChunkOutput[] {
  const rawChunks = recursiveSplit(content, SEPARATORS, CHUNK_SIZE, CHUNK_OVERLAP);

  return rawChunks.map((text, index) => ({
    chunk_id: crypto.randomUUID(),
    document_id: documentId,
    chunk_index: index,
    content: text.trim(),
    token_count: estimateTokens(text),
  }));
}

function recursiveSplit(
  text: string,
  separators: string[],
  chunkSize: number,
  overlap: number
): string[] {
  if (text.length <= chunkSize) {
    return text.trim() ? [text] : [];
  }

  const separator = findBestSeparator(text, separators);

  if (separator === '') {
    // Hard split at chunkSize boundary
    return hardSplit(text, chunkSize, overlap);
  }

  const parts = text.split(separator);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const part of parts) {
    const candidate = currentChunk ? currentChunk + separator + part : part;

    if (candidate.length > chunkSize && currentChunk) {
      chunks.push(currentChunk);
      // Overlap: start the next chunk with the tail of the current one
      const overlapStart = Math.max(0, currentChunk.length - overlap);
      currentChunk = currentChunk.slice(overlapStart) + separator + part;
    } else {
      currentChunk = candidate;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk);
  }

  // If any chunk is still too large, recurse with next separator level
  const remainingSeparators = separators.slice(separators.indexOf(separator) + 1);
  const result: string[] = [];
  for (const chunk of chunks) {
    if (chunk.length > chunkSize && remainingSeparators.length > 0) {
      result.push(...recursiveSplit(chunk, remainingSeparators, chunkSize, overlap));
    } else {
      result.push(chunk);
    }
  }

  return result.filter(c => c.trim().length > 0);
}

function findBestSeparator(text: string, separators: string[]): string {
  for (const sep of separators) {
    if (sep === '' || text.includes(sep)) {
      return sep;
    }
  }
  return '';
}

function hardSplit(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start = end - overlap;
    if (start >= text.length) break;
  }
  return chunks;
}

// Rough token estimate: ~4 chars per token (English text)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
