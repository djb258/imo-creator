#!/usr/bin/env node
/**
 * Composio → n8n Email Verification Bridge
 * Calls n8n workflow to verify emails via MillionVerifier
 *
 * Usage:
 *   node composio-n8n-email-verify.cjs test@example.com
 *
 * From Composio:
 *   Use HTTP Request action to call n8n webhook
 */

const https = require('https');

const N8N_URL = process.env.N8N_HOSTINGER_URL || 'https://srv1153077.hstgr.cloud:5678';
const WEBHOOK_PATH = '/webhook/verify-email';

/**
 * Verify email via n8n + MillionVerifier
 */
async function verifyEmail(email) {
  return new Promise((resolve, reject) => {
    const url = new URL(WEBHOOK_PATH, N8N_URL);

    const postData = JSON.stringify({ email });

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      rejectUnauthorized: false // For self-signed certs
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve({ raw: data });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * Direct MillionVerifier API (fallback if n8n unavailable)
 */
async function verifyEmailDirect(email) {
  const apiKey = process.env.MILLIONVERIFIER_API_KEY || '7hLlWoR3DCDoDwDllpafUh4U9';

  return new Promise((resolve, reject) => {
    const url = `https://api.millionverifier.com/api/v3/?api=${apiKey}&email=${encodeURIComponent(email)}`;

    https.get(url, { rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve({ error: 'Parse error', raw: data });
        }
      });
    }).on('error', reject);
  });
}

// Main execution
async function main() {
  const email = process.argv[2];

  if (!email) {
    console.log('Usage: node composio-n8n-email-verify.cjs <email>');
    console.log('Example: node composio-n8n-email-verify.cjs test@gmail.com');
    process.exit(1);
  }

  console.log(`\n🔍 Verifying: ${email}\n`);

  try {
    // Try n8n first
    console.log('Trying n8n webhook...');
    const n8nResult = await verifyEmail(email);

    if (n8nResult.success !== undefined) {
      console.log('✅ n8n Response:');
      console.log(JSON.stringify(n8nResult, null, 2));
      return;
    }
  } catch (err) {
    console.log('⚠️  n8n not available, using direct API...');
  }

  // Fallback to direct API
  try {
    const directResult = await verifyEmailDirect(email);
    console.log('✅ MillionVerifier Response:');
    console.log(JSON.stringify(directResult, null, 2));

    // Summary
    console.log('\n📊 Summary:');
    console.log(`   Email: ${directResult.email}`);
    console.log(`   Result: ${directResult.result}`);
    console.log(`   Quality: ${directResult.quality}`);
    console.log(`   Free: ${directResult.free}`);
    console.log(`   Disposable: ${directResult.subresult === 'disposable'}`);
    console.log(`   Credits remaining: ${directResult.credits}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

main();

// Export for use as module
module.exports = { verifyEmail, verifyEmailDirect };
