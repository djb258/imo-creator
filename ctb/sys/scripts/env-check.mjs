import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const schemaPath = path.join(rootDir, 'tools/config/.env.schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

function parseEnvFile(p) {
  if (!fs.existsSync(p)) return {};
  const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);
  const out = {};
  for (const line of lines) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

function checkFile(file, required, optional = []) {
  const env = parseEnvFile(file);
  const allKnown = [...required, ...optional];
  const missing = required.filter(k => !(k in env));
  const extras = Object.keys(env).filter(k => !allKnown.includes(k));
  const present = Object.keys(env).filter(k => allKnown.includes(k));
  return { missing, extras, present };
}

const required = schema.required;
const optional = schema.optional || [];
const rootExample = path.join(rootDir, '.env.example');
const { missing: rootMissing, extras: rootExtras, present: rootPresent } = checkFile(rootExample, required, optional);

let ok = true;
function report(ctx, res) {
  if (res.missing.length) { 
    ok = false; 
    console.error(`[${ctx}] Missing required keys: ${res.missing.join(', ')}`); 
  }
  if (res.extras.length) { 
    console.warn(`[${ctx}] Extra keys (review for typos): ${res.extras.join(', ')}`); 
  }
  if (res.present.length) {
    console.log(`[${ctx}] Present keys: ${res.present.length} of ${required.length + optional.length} total`);
  }
}

console.log('== ENV CHECK ==');
console.log(`Schema: ${required.length} required, ${optional.length} optional keys`);

if (!fs.existsSync(rootExample)) {
  console.warn('[root] .env.example not found — generating template from schema');
  const requiredLines = required.map(k => `${k}=`);
  const optionalLines = optional.map(k => `# ${k}=`);
  const tmpl = [...requiredLines, '', '# Optional:', ...optionalLines].join('\n') + '\n';
  fs.writeFileSync(rootExample, tmpl);
  console.log('[root] Created .env.example with required keys (empty values) and optional keys (commented)');
} else {
  report('root', { missing: rootMissing, extras: rootExtras, present: rootPresent });
}

// Check each app under /apps/*/.env.example if present
const appsDir = path.join(rootDir, 'apps');
if (fs.existsSync(appsDir)) {
  const entries = fs.readdirSync(appsDir);
  if (entries.length > 0) {
    console.log(`\nChecking ${entries.length} app(s)...`);
    for (const entry of entries) {
      const p = path.join(appsDir, entry);
      if (fs.lstatSync(p).isDirectory()) {
        const file = path.join(p, '.env.example');
        if (fs.existsSync(file)) {
          const r = checkFile(file, required, optional);
          report(`apps/${entry}`, r);
        } else {
          console.warn(`[apps/${entry}] No .env.example found`);
        }
      }
    }
  }
}

// Also check for compliance config
const complianceConfig = path.join(rootDir, '.imo-compliance.json');
if (fs.existsSync(complianceConfig)) {
  const config = JSON.parse(fs.readFileSync(complianceConfig, 'utf8'));
  console.log(`\n[Compliance] Version: ${config.imo_creator_version}, Score: ${config.repo_metadata?.current_compliance_score}%`);
}

if (!ok) {
  console.error('\n❌ ENV check failed - fix missing keys');
  process.exit(1);
}
console.log('\n✅ ENV OK');