import { checkToken } from '../../../src/security/guard.mjs';
import { get } from '../../../src/registry/registry.mjs';
import { healthFrom } from '../../../src/health/status.mjs';
export default async function handler(req,res){
  if(!checkToken(req,res)) return;
  const { repo, dashboard } = req.query||{};
  if(!repo) return res.status(400).json({error:'missing repo'});
  const reg=get(repo)||{};
  const health = await healthFrom(dashboard||'');
  res.status(200).json({ repo, local: reg.localPath||null, lastOpen: reg.lastOpen||null, lastRecall: reg.lastRecall||null, health });
}