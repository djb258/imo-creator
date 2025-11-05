#!/usr/bin/env node
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '..');

console.log('📦 Staging all changes...');
try {
  execSync('git add -A', { 
    stdio: 'inherit', 
    cwd: repoRoot,
    shell: true,
    env: { ...process.env, MSYS_NO_PATHCONV: '1' }
  });
  
  console.log('💾 Committing changes...');
  execSync('git commit -m "📊 Add CTB manifest, repo dashboard config, ChartDB ERD visualizations, and update global manifest with repo-dashboard automation"', { 
    stdio: 'inherit', 
    cwd: repoRoot,
    shell: true,
    env: { ...process.env, MSYS_NO_PATHCONV: '1' }
  });
  
  console.log('🚀 Pushing to GitHub (origin master)...');
  execSync('git push origin master', { 
    stdio: 'inherit', 
    cwd: repoRoot,
    shell: true,
    env: { ...process.env, MSYS_NO_PATHCONV: '1' }
  });
  
  console.log('✅ Successfully pushed to GitHub!');
} catch (error) {
  console.error('❌ Error:', error.message);
  if (error.stdout) console.error('STDOUT:', error.stdout.toString());
  if (error.stderr) console.error('STDERR:', error.stderr.toString());
  process.exit(1);
}


