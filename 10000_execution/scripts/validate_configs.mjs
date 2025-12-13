#!/usr/bin/env node
import Ajv from "ajv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ajv = new Ajv({ allErrors: true, strict: false });

// Lazy load js-yaml to avoid ESM/CJS friction
const loadYaml = (content) => {
  const yaml = require("js-yaml");
  return yaml.load(content);
};

const schemaDir = path.join(process.cwd(), "doctrine", "schemas");

const manifestMap = {
  // Map to canonical CTB paths in this repo
  "ctb/docs/doctrine/doctrine/doctrine_system_manifest.yaml": "system_manifest.schema.json",
  "ctb/docs/global-config/global_manifest.yaml": "global_manifest.schema.json",
  "ctb/docs/doctrine/agents/doctrine_global_agents.yaml": "agents.schema.json",
  // Optional: acronyms as YAML if later added
  // "ctb/docs/doctrine/doctrine/doctrine_acronyms.yaml": "acronyms.schema.json"
};

let hadError = false;

for (const [file, schemaName] of Object.entries(manifestMap)) {
  const absFile = path.join(process.cwd(), file);
  const absSchema = path.join(schemaDir, schemaName);

  if (!fs.existsSync(absFile)) {
    console.error(`❌ Missing manifest: ${file}`);
    hadError = true;
    continue;
  }
  if (!fs.existsSync(absSchema)) {
    console.error(`❌ Missing schema: doctrine/schemas/${schemaName}`);
    hadError = true;
    continue;
  }

  const raw = fs.readFileSync(absFile, "utf8");
  const data = raw.trim().startsWith("{") ? JSON.parse(raw) : loadYaml(raw);
  const schema = JSON.parse(fs.readFileSync(absSchema, "utf8"));

  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    console.error(`❌ Schema validation failed for ${file}`);
    console.error(validate.errors);
    hadError = true;
  } else {
    console.log(`✅ ${file} passed schema validation`);
  }
}

if (hadError) process.exit(1);
console.log("All manifests validated successfully.");


