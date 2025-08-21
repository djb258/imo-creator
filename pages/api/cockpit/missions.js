import { add, list, byRepo, clearRepo } from '../../../src/missions/missions.mjs';
export default async function handler(req,res){
  const { method } = req;
  if(method==='POST'){ const { repo, type, notes } = req.body||{}; if(!repo||!type) return res.status(400).json({error:'missing'}); return res.status(200).json({ missions: add({repo,type,notes}) }); }
  if(method==='GET'){ const { repo } = req.query||{}; return res.status(200).json({ missions: repo?byRepo(repo):list() }); }
  if(method==='DELETE'){ const { repo } = req.query||{}; if(!repo) return res.status(400).json({error:'missing repo'}); clearRepo(repo); return res.status(200).json({ ok:true }); }
  res.status(405).end();
}