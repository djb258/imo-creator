import { spawn } from "node:child_process";

export default async function handler(req,res){
  const { repo } = req.body||{};
  if(!repo) return res.status(400).json({error:"missing repo"});
  // Stub: run HEIR (if present in scripts), then "finalize" by returning a payload
  const proc = spawn(process.platform === 'win32' ? 'cmd' : 'bash',
    process.platform === 'win32' ? ['/c','npm','run','heir:check'] : ['-lc','npm run heir:check'],
    { cwd: process.cwd() }
  );
  let out = "", err = "";
  proc.stdout.on('data', d=> out += d.toString());
  proc.stderr.on('data', d=> err += d.toString());
  proc.on('close', code=>{
    res.status(200).json({
      ok: code===0,
      heir_output: out || err,
      next: {
        tag: "v0.1.0",
        dashboard_hint: "Set DASHBOARD_URL in your repo wiki / README",
        reminder: "Set env in Vercel/Render; do NOT commit secrets."
      }
    });
  });
}