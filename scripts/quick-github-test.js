#!/usr/bin/env node

/**
 * Quick GitHub Test - Simplified version
 */

const { Composio } = require('@composio/core');
const dotenv = require('dotenv');

dotenv.config();

async function quickTest() {
  console.log('🧪 Quick GitHub Test\n');

  const composio = new Composio({
    apiKey: process.env.COMPOSIO_API_KEY || 'ak_t-F0AbvfZHUZSUrqAGNn',
  });

  try {
    // Check connected accounts
    console.log('Checking GitHub connections...');
    const accounts = await composio.connectedAccounts.list({
      toolkit: 'github',
    });

    console.log(`Found ${accounts.items?.length || 0} GitHub connections`);

    if (accounts.items?.length > 0) {
      const firstAccount = accounts.items[0];
      console.log(`\nUsing connection: ${firstAccount.id}`);

      // Try to execute a simple tool
      console.log('\nTrying to get user info...');
      const result = await composio.tools.execute('GITHUB_GET_AUTHENTICATED_USER', {
        userId: firstAccount.userId || 'default',
        connectedAccountId: firstAccount.id,
        arguments: {},
      });

      if (result.successful) {
        console.log('✅ GitHub API working!');
        console.log(`Username: ${result.data?.login}`);
        console.log(`Name: ${result.data?.name}`);
        console.log(`Public repos: ${result.data?.public_repos}`);
      } else {
        console.log('❌ Failed:', result.error);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

quickTest();