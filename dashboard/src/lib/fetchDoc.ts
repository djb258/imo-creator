/**
 * Fetches a markdown file from disk via the Vite docs plugin.
 * In dev mode, hits /__docs?path=<absolutePath>.
 * Returns the raw markdown string, or null on failure.
 */
export async function fetchDoc(absolutePath: string): Promise<string | null> {
  try {
    const res = await fetch(`/__docs?path=${encodeURIComponent(absolutePath)}`);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}
