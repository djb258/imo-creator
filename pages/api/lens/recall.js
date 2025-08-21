import { execFile } from 'node:child_process'; import { derivePath, set } from '../../../src/registry/registry.mjs';
export default async function handler(req,res){
  const { full } = req.body||{}; if(!full) return res.status(400).json({error:'missing full'});
  const localPath = derivePath(full); // cloning is out-of-scope here; treat as pre-cloned or ephemeral
  execFile('bash', ['mechanic/recall/recall.sh', localPath], { timeout: 180000 }, (err, stdout, stderr)=>{
    if(err) return res.status(500).json({ error:String(err), stderr });
    set(full,{ localPath, lastRecall: Date.now(), mode:'mechanic' });
    res.status(200).json({ ok:true, stdout });
  });
}