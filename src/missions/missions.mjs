import fs from 'fs'; import path from 'path';
const FILE = path.join('.imo','local','missions.json');
function _read(){ try{ return JSON.parse(fs.readFileSync(FILE,'utf8')); }catch{ return []; } }
function _write(x){ fs.mkdirSync(path.dirname(FILE),{recursive:true}); fs.writeFileSync(FILE, JSON.stringify(x,null,2)); }
export function list(){ return _read(); }
export function byRepo(full){ return _read().filter(m=>m.repo===full); }
export function add(m){ const all=_read(); all.push({...m, ts: Date.now()}); _write(all); return all; }
export function clearRepo(full){ _write(_read().filter(m=>m.repo!==full)); }