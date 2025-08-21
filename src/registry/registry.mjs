import fs from 'fs'; import path from 'path';
const ROOT = process.env.WORKSPACE_ROOT || (process.platform === 'win32' ? path.join(process.env.USERPROFILE, 'imo-workspaces') : path.join(process.env.HOME||'', 'imo-workspaces'));
const REG = path.join('.imo','local','registry.json');
export function derivePath(full){ const [owner,repo]=full.split('/'); return path.join(ROOT, owner, repo); }
export function load(){ if(!fs.existsSync(REG)) return {}; return JSON.parse(fs.readFileSync(REG,'utf8')||"{}"); }
export function save(reg){ fs.mkdirSync(path.dirname(REG),{recursive:true}); fs.writeFileSync(REG, JSON.stringify(reg,null,2)); }
export function get(full){ const r=load(); return r[full]; }
export function set(full, info){ const r=load(); r[full]=info; save(r); }
