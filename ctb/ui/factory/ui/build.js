import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

console.log("[Factory] Build Process");
console.log("======================");

// Check for apps directory
const appsDir = path.join(rootDir, 'apps');
if (!fs.existsSync(appsDir)) {
  console.log("No apps found to build");
  process.exit(0);
}

const apps = fs.readdirSync(appsDir).filter(f => 
  fs.statSync(path.join(appsDir, f)).isDirectory()
);

if (apps.length === 0) {
  console.log("No apps found to build");
  process.exit(0);
}

console.log(`Found ${apps.length} app(s) to build:`);

for (const app of apps) {
  const appPath = path.join(appsDir, app);
  const packageJsonPath = path.join(appPath, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.log(`  [${app}] No package.json - skipping`);
    continue;
  }
  
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log(`  [${app}] Building v${pkg.version}...`);
  
  // Check compliance
  const complianceFile = path.join(appPath, '.imo-compliance.json');
  if (fs.existsSync(complianceFile)) {
    const compliance = JSON.parse(fs.readFileSync(complianceFile, 'utf8'));
    console.log(`    Compliance Score: ${compliance.repo_metadata?.current_compliance_score}%`);
  }
  
  // Here you would run actual build commands
  // For now, just validate structure
  const requiredFiles = ['.env.example', 'src/index.js'];
  const missing = requiredFiles.filter(f => !fs.existsSync(path.join(appPath, f)));
  
  if (missing.length > 0) {
    console.log(`    ⚠️  Missing: ${missing.join(', ')}`);
  } else {
    console.log(`    ✅ Structure valid`);
  }
}

console.log("\n[Factory] Build complete");