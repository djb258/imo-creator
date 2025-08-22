import { checkToken } from '../../../src/security/guard.mjs';
import { execFile } from 'node:child_process';
export default async function handler(req,res){
  if(!checkToken(req,res)) return;
  const { appName } = req.body||{};
  if(!appName) return res.status(400).json({error:'missing appName'});
  execFile('bash',['factory/ui/init.sh', appName],{timeout:180000},(err,stdout,stderr)=>{
    if(err) return res.status(500).json({ error:String(err), stderr });
    res.status(200).json({ ok:true, stdout, wiki:`/docs/wiki/${appName}/index.md`, cockpit:`/cockpit?repo=${encodeURIComponent('local/'+appName)}&mode=factory` });
  });
}