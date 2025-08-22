import { checkToken } from '../../../src/security/guard.mjs';
import { listRepos } from '../../../src/lens/github.mjs';
export default async function handler(req,res){
  if(!checkToken(req,res)) return;
  try{
    const owner=process.env.GITHUB_OWNER; const filter=process.env.GITHUB_FILTER||'';
    const data = await listRepos({owner,filter});
    if (data && data.rate_limited) return res.status(429).json(data);
    res.status(200).json({ owner, repos: data, count: Array.isArray(data)?data.length:0 });
  }catch(e){ res.status(500).json({ error: String(e) }); }
}