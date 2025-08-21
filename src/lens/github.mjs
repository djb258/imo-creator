const { request } = require('undici');

async function listRepos({ owner, filter }) {
  const token = process.env.GITHUB_TOKEN; if (!token) throw new Error('Missing GITHUB_TOKEN');
  const headers = { 'Authorization': `Bearer ${token}`, 'User-Agent': 'imo-lens' };
  const url = `https://api.github.com/users/${owner}/repos?per_page=100&sort=updated`;
  const res = await request(url,{headers}); const data = await res.body.json(); let repos = Array.isArray(data)?data:[];
  if (filter && filter.trim()) repos = repos.filter(r=>r.name.includes(filter));
  return repos.map(r=>({ name:r.name, full:r.full_name, url:r.html_url, defaultBranch:r.default_branch, updatedAt:r.updated_at }));
}

module.exports = { listRepos };