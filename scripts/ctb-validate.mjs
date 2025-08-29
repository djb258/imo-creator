#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import yaml from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

/**
 * CTB Blueprint Validator
 * Validates /ctb/ctb_blueprint.yaml against JSON schema
 * Prefers .imo-kit/schemas/ctb_blueprint.schema.json, falls back to local schema
 */

function loadSchema() {
  // Prefer submodule schema
  const submoduleSchemaPath = join(rootDir, '.imo-kit', 'schemas', 'ctb_blueprint.schema.json');
  const localSchemaPath = join(rootDir, 'ctb', 'ctb_blueprint.schema.json');
  
  let schemaPath;
  let schemaSource;
  
  if (existsSync(submoduleSchemaPath)) {
    schemaPath = submoduleSchemaPath;
    schemaSource = 'submodule (.imo-kit)';
  } else if (existsSync(localSchemaPath)) {
    schemaPath = localSchemaPath;
    schemaSource = 'local (ctb/)';
  } else {
    console.error('❌ No CTB schema found. Expected:');
    console.error('  - .imo-kit/schemas/ctb_blueprint.schema.json (preferred)');
    console.error('  - ctb/ctb_blueprint.schema.json (fallback)');
    process.exit(1);
  }
  
  try {
    const schemaContent = readFileSync(schemaPath, 'utf8');
    const schema = JSON.parse(schemaContent);
    console.log(`📋 Using schema from: ${schemaSource}`);
    return schema;
  } catch (error) {
    console.error(`❌ Failed to load schema from ${schemaPath}:`);
    console.error(error.message);
    process.exit(1);
  }
}

function loadBlueprint() {
  const blueprintPath = join(rootDir, 'ctb', 'ctb_blueprint.yaml');
  
  if (!existsSync(blueprintPath)) {
    console.error('❌ CTB blueprint not found: ctb/ctb_blueprint.yaml');
    process.exit(1);
  }
  
  try {
    const blueprintContent = readFileSync(blueprintPath, 'utf8');
    const blueprint = yaml.parse(blueprintContent);
    console.log('📄 Loaded CTB blueprint: ctb/ctb_blueprint.yaml');
    return blueprint;
  } catch (error) {
    console.error('❌ Failed to parse CTB blueprint YAML:');
    console.error(error.message);
    process.exit(1);
  }
}

function validateBlueprint(schema, blueprint) {
  const ajv = new Ajv({ allErrors: true, verbose: true });
  const validate = ajv.compile(schema);
  
  console.log('🔍 Validating CTB blueprint...');
  
  const valid = validate(blueprint);
  
  if (valid) {
    console.log('✅ CTB blueprint is valid!');
    
    // Additional validation checks
    const warnings = [];
    
    if (blueprint.star?.name?.includes('PLACEHOLDER') || blueprint.star?.name?.includes('YOUR_')) {
      warnings.push('⚠️  Star name appears to contain placeholder text');
    }
    
    if (blueprint.branches?.length === 0) {
      warnings.push('⚠️  No branches defined in blueprint');
    }
    
    if (blueprint.ctb_keys?.board_id?.includes('YOUR_')) {
      warnings.push('⚠️  CTB keys contain placeholder values');
    }
    
    if (warnings.length > 0) {
      console.log('\\n📝 Warnings:');
      warnings.forEach(warning => console.log(`   ${warning}`));
    }
    
    return true;
  } else {
    console.log('❌ CTB blueprint validation failed!\\n');
    
    console.log('🐛 Validation errors:');
    validate.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error.instancePath || 'root'}: ${error.message}`);
      if (error.data !== undefined) {
        console.log(`      Got: ${JSON.stringify(error.data)}`);
      }
      if (error.schema !== undefined) {
        console.log(`      Expected: ${JSON.stringify(error.schema)}`);
      }
    });
    
    return false;
  }
}

function main() {
  console.log('🚀 CTB Blueprint Validator');
  console.log('==========================\\n');
  
  try {
    const schema = loadSchema();
    const blueprint = loadBlueprint();
    const isValid = validateBlueprint(schema, blueprint);
    
    console.log('\\n' + '='.repeat(50));
    if (isValid) {
      console.log('✅ Validation completed successfully');
      process.exit(0);
    } else {
      console.log('❌ Validation failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Unexpected error during validation:');
    console.error(error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}