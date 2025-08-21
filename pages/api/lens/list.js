import { listRepos } from '../../../src/lens/github.mjs';
export default async function handler(req,res){
  try{ const owner=process.env.GITHUB_OWNER; const filter=process.env.GITHUB_FILTER||''; const repos=await listRepos({owner,filter});
    res.status(200).json({ owner, count: repos.length, repos });
  }catch(e){ res.status(500).json({ error: String(e) }); }
}