import { get, set, derivePath } from '../../../src/registry/registry.mjs';
export default async function handler(req,res){
  const { full, mode } = req.body||{}; if(!full) return res.status(400).json({error:'missing full'});
  const m = mode || process.env.DEFAULT_MODE || 'factory';
  // record an intent in registry (used by cockpit)
  set(full, { localPath: (get(full)?.localPath)||derivePath(full), lastOpen: Date.now(), mode: m });
  res.status(200).json({ url: `/cockpit?repo=${encodeURIComponent(full)}&mode=${m}` });
}