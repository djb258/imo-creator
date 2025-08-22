import fs from 'fs'; import path from 'path';
const ROOT = process.env.WORKSPACE_ROOT || (process.platform==='win32' ? path.join(process.env.USERPROFILE,'imo-workspaces') : path.join(process.env.HOME||'', 'imo-workspaces'));
const REG = path.join('.imo','local','registry.json');
export function derivePath(full){ const [o,r]=full.split('/'); return path.join(ROOT,o,r); }
export function load(){ try{ return JSON.parse(fs.readFileSync(REG,'utf8')); }catch{ return {}; } }
export function save(x){ fs.mkdirSync(path.dirname(REG),{recursive:true}); fs.writeFileSync(REG, JSON.stringify(x,null,2)); }
export function get(full){ return load()[full]; }
export function set(full,info){ const r=load(); r[full]=info; save(r); }