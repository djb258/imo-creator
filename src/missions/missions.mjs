import fs from 'fs'; import path from 'path';
const FILE = path.join('.imo','local','missions.json');
export function list(){ return fs.existsSync(FILE)? JSON.parse(fs.readFileSync(FILE,'utf8')||"[]"):[]; }
export function add(m){ const all=list(); all.push({...m, ts: Date.now()}); fs.mkdirSync(path.dirname(FILE),{recursive:true}); fs.writeFileSync(FILE, JSON.stringify(all,null,2)); return all; }
export function byRepo(full){ return list().filter(m=>m.repo===full); }
export function clearRepo(full){ const left = list().filter(m=>m.repo!==full); fs.writeFileSync(FILE, JSON.stringify(left,null,2)); }
