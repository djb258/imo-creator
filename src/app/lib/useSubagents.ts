/**
 * Doctrine Spec:
 * - Barton ID: 03.01.01.07.10000.006
 * - Altitude: 10000 (Execution Layer)
 * - Purpose: React hook for subagent data fetching
 * - Input: component state
 * - Output: subagent data
 * - MCP: N/A
 */
export async function fetchSubagents() {
  const res = await fetch("/api/subagents", { cache: "no-store" });
  if (!res.ok) return { items: [] as Array<{id:string;bay:string;desc:string}> };
  return res.json();
}