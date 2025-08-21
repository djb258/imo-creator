import { get } from '../../../src/registry/registry.mjs';
import { repoHealth } from '../../../src/health/status.mjs';
export default async function handler(req,res){
  const { repo, dashboard } = req.query||{}; if(!repo) return res.status(400).json({error:'missing repo'});
  const reg = get(repo)||{};
  const health = dashboard ? await repoHealth({hostBase: dashboard, full: repo}) : { ok: null, raw: null };
  // HEIR/env drift could be plugged here later
  res.status(200).json({ repo, local: reg.localPath||null, lastOpen: reg.lastOpen||null, lastRecall: reg.lastRecall||null, health });
}