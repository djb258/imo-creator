import { request } from 'undici';
export async function listRepos({ owner, filter }) {
  const token = process.env.GITHUB_TOKEN; if (!token) throw new Error('Missing GITHUB_TOKEN');
  const headers = { 'Authorization': `Bearer ${token}`, 'User-Agent': 'imo-ui' };
  const url = `https://api.github.com/users/${owner}/repos?per_page=100&sort=updated`;
  const res = await request(url,{headers}); if(res.statusCode===403){ const rl=res.headers['x-ratelimit-reset']; const when = rl ? new Date(Number(rl)*1000).toISOString() : null; const err = await res.body.text(); return { rate_limited: true, reset_at: when, error: err }; }
  const data = await res.body.json(); let repos = Array.isArray(data)?data:[];
  const f=(filter||'').trim(); if(f) repos = repos.filter(r=>r.name.includes(f));
  return repos.map(r=>({ name:r.name, full:r.full_name, url:r.html_url, defaultBranch:r.default_branch, updatedAt:r.updated_at }));
}