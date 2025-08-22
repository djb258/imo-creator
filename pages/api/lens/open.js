import { checkToken } from '../../../src/security/guard.mjs';
import { get, set, derivePath } from '../../../src/registry/registry.mjs';
export default async function handler(req,res){
  if(!checkToken(req,res)) return;
  const { full, mode } = req.body||{};
  if(!full) return res.status(400).json({error:'missing full'});
  const m = mode || process.env.DEFAULT_MODE || 'factory';
  set(full, { localPath: get(full)?.localPath || derivePath(full), lastOpen: Date.now(), mode: m });
  res.status(200).json({ url: `/cockpit?repo=${encodeURIComponent(full)}&mode=${m}` });
}