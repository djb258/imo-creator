#!/usr/bin/env node
/**
 * Doppler Connection Test Script
 * Tests the connection to Doppler vault and lists available secrets
 *
 * Usage:
 *   Set DOPPLER_TOKEN environment variable, then run:
 *   node ctb/sys/scripts/test-doppler-connection.js
 *
 *   Or pass token as argument:
 *   node ctb/sys/scripts/test-doppler-connection.js dp.st.xxxx
 */

const https = require('https');

// Configuration
const DOPPLER_PROJECT = process.env.DOPPLER_PROJECT || 'imo-creator';
const DOPPLER_CONFIG = process.env.DOPPLER_CONFIG || 'prd';
const DOPPLER_TOKEN = process.argv[2] || process.env.DOPPLER_TOKEN;

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║           DOPPLER CONNECTION TEST                          ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

if (!DOPPLER_TOKEN) {
  console.error('❌ ERROR: No Doppler token provided!\n');
  console.log('Please set DOPPLER_TOKEN environment variable or pass as argument:');
  console.log('  node test-doppler-connection.js dp.st.your_token_here\n');
  console.log('Get your token from: https://dashboard.doppler.com → Access → Service Tokens');
  process.exit(1);
}

console.log(`📋 Project: ${DOPPLER_PROJECT}`);
console.log(`⚙️  Config:  ${DOPPLER_CONFIG}`);
console.log(`🔑 Token:   ${DOPPLER_TOKEN.substring(0, 10)}...${DOPPLER_TOKEN.substring(DOPPLER_TOKEN.length - 4)}\n`);

// Test 1: List all secrets (names only)
function listSecrets() {
  return new Promise((resolve, reject) => {
    const url = `https://api.doppler.com/v3/configs/config/secrets?project=${DOPPLER_PROJECT}&config=${DOPPLER_CONFIG}`;

    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${DOPPLER_TOKEN}`,
        'Accept': 'application/json'
      }
    };

    console.log('🔄 Testing connection to Doppler API...\n');

    const req = https.request(url, options, (res) => {
      let data = '';

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject({ statusCode: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Test 2: Get a specific secret
function getSecret(name) {
  return new Promise((resolve, reject) => {
    const url = `https://api.doppler.com/v3/configs/config/secret?project=${DOPPLER_PROJECT}&config=${DOPPLER_CONFIG}&name=${name}`;

    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${DOPPLER_TOKEN}`,
        'Accept': 'application/json'
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          resolve(null); // Secret not found
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  try {
    // Test 1: List secrets
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST 1: List Available Secrets');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const secretsData = await listSecrets();
    const secrets = secretsData.secrets || {};
    const secretNames = Object.keys(secrets);

    console.log(`✅ Connection successful! Found ${secretNames.length} secrets:\n`);

    secretNames.forEach((name, i) => {
      const value = secrets[name]?.computed || secrets[name]?.raw || '';
      const preview = value.length > 30 ? value.substring(0, 30) + '...' : value;
      const masked = preview.replace(/./g, (c, i) => i < 5 ? c : '*');
      console.log(`   ${i + 1}. ${name}: ${masked}`);
    });

    // Test 2: Check for specific secrets we need
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST 2: Check Required Secrets');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const requiredSecrets = [
      'N8N_WEBHOOK_URL',
      'COMPOSIO_API_KEY',
      'ANTHROPIC_API_KEY',
      'OPENAI_API_KEY',
      'GOOGLE_API_KEY',
      'DATABASE_URL'
    ];

    for (const secretName of requiredSecrets) {
      const exists = secretNames.includes(secretName);
      const status = exists ? '✅' : '❌';
      console.log(`   ${status} ${secretName}: ${exists ? 'Found' : 'Missing'}`);
    }

    // Test 3: Fetch N8N_WEBHOOK_URL specifically
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST 3: Fetch N8N_WEBHOOK_URL');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (secretNames.includes('N8N_WEBHOOK_URL')) {
      const n8nSecret = await getSecret('N8N_WEBHOOK_URL');
      if (n8nSecret && n8nSecret.value) {
        const url = n8nSecret.value.computed || n8nSecret.value.raw;
        console.log(`   ✅ N8N_WEBHOOK_URL retrieved successfully!`);
        console.log(`   📍 URL: ${url.substring(0, 40)}...`);
      }
    } else {
      console.log('   ⚠️  N8N_WEBHOOK_URL not found in Doppler');
      console.log('   💡 Add it to your Doppler project to enable n8n integration');
    }

    // Summary
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    TEST RESULTS                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    console.log('   ✅ Doppler API connection: SUCCESS');
    console.log(`   ✅ Project "${DOPPLER_PROJECT}" accessible`);
    console.log(`   ✅ Config "${DOPPLER_CONFIG}" accessible`);
    console.log(`   📊 Total secrets: ${secretNames.length}`);
    console.log('\n   🎉 Doppler integration is working!\n');

  } catch (error) {
    console.error('\n❌ CONNECTION FAILED!\n');

    if (error.statusCode === 401) {
      console.error('   Error: Invalid or expired token');
      console.error('   Solution: Generate a new service token from Doppler dashboard\n');
    } else if (error.statusCode === 403) {
      console.error('   Error: Token does not have access to this project/config');
      console.error(`   Project: ${DOPPLER_PROJECT}`);
      console.error(`   Config: ${DOPPLER_CONFIG}`);
      console.error('   Solution: Check token permissions in Doppler dashboard\n');
    } else if (error.statusCode === 404) {
      console.error(`   Error: Project "${DOPPLER_PROJECT}" or config "${DOPPLER_CONFIG}" not found`);
      console.error('   Solution: Verify project and config names in Doppler dashboard\n');
    } else {
      console.error('   Error:', error.message || error);
    }

    process.exit(1);
  }
}

runTests();
