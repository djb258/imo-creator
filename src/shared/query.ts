export function getQuery() {
  if (typeof window === 'undefined') return { repo: '', mode: 'factory' };
  const p = new URLSearchParams(window.location.search);
  return { repo: p.get('repo') || '', mode: p.get('mode') || 'factory' };
}