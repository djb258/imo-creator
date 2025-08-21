const { request } = require('undici');

async function fetchJSON(url, headers={}){ try{ const r=await request(url,{headers,throwOnError:false}); return await r.body.json(); }catch{ return null; } }

async function repoHealth({hostBase, full}){ // expect a deployed /health endpoint (optional)
  const url = hostBase ? `${hostBase.replace(/\/$/,'')}/health` : null;
  const health = url ? await fetchJSON(url) : null;
  return { ok: !!(health && (health.ok===true||health.status==='ok')), raw: health };
}

module.exports = { fetchJSON, repoHealth };