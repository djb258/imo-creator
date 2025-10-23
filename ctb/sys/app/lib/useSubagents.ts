// # CTB Metadata
// # Generated: 2025-10-23T14:32:38.959916
// # CTB Version: 1.3.3
// # Division: System Infrastructure
// # Category: app
// # Compliance: 100%
// # HEIR ID: HEIR-2025-10-SYS-APP-01

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