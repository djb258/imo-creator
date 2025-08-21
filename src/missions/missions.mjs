const fs = require('fs'); 
const path = require('path');

const FILE = path.join('.imo','local','missions.json');

function list(){ return fs.existsSync(FILE)? JSON.parse(fs.readFileSync(FILE,'utf8')||"[]"):[]; }
function add(m){ const all=list(); all.push({...m, ts: Date.now()}); fs.mkdirSync(path.dirname(FILE),{recursive:true}); fs.writeFileSync(FILE, JSON.stringify(all,null,2)); return all; }
function byRepo(full){ return list().filter(m=>m.repo===full); }
function clearRepo(full){ const left = list().filter(m=>m.repo!==full); fs.writeFileSync(FILE, JSON.stringify(left,null,2)); }

module.exports = { list, add, byRepo, clearRepo };
