export async function fetchSubagents() {
  const res = await fetch("/api/subagents", { cache: "no-store" });
  if (!res.ok) return { items: [] as Array<{id:string;bay:string;desc:string}> };
  return res.json();
}