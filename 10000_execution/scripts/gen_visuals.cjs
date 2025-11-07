#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";

const dir = "docs/visuals";
if (!fs.existsSync(dir)) {
  console.log(`No visuals directory found at ${dir}`);
  process.exit(0);
}

const files = fs.readdirSync(dir).filter(f => f.endsWith(".mmd"));
files.forEach(f => {
  const base = f.replace(/\.mmd$/, "");
  execSync(`npx --yes @mermaid-js/mermaid-cli -i ${dir}/${f} -o ${dir}/${base}.svg`, { stdio: "inherit" });
  console.log(`✅ Generated ${base}.svg`);
});


