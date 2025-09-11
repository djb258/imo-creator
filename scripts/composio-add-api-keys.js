#!/usr/bin/env node

/**
 * Add API Keys to Composio for Various Services
 * This script shows how to add API keys for different services
 */

const { Composio } = require('composio-core');
require('dotenv').config();

async function addAPIKeys() {
  const client = new Composio(process.env.COMPOSIO_API_KEY);
  
  console.log('🔑 Adding API Keys to Composio\n');
  console.log('=' .repeat(60));
  
  // Examples of adding different service API keys:
  
  try {
    // 1. OpenAI API Key
    if (process.env.OPENAI_API_KEY) {
      console.log('\n📝 Adding OpenAI...');
      const openaiAccount = await client.connectedAccounts.create({
        appName: 'openai',
        authMode: 'API_KEY',
        authConfig: {
          api_key: process.env.OPENAI_API_KEY
        }
      });
      console.log('✅ OpenAI connected:', openaiAccount.id);
    }
    
    // 2. Twilio API Key
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      console.log('\n📱 Adding Twilio...');
      const twilioAccount = await client.connectedAccounts.create({
        appName: 'twilio',
        authMode: 'API_KEY',
        authConfig: {
          account_sid: process.env.TWILIO_ACCOUNT_SID,
          auth_token: process.env.TWILIO_AUTH_TOKEN
        }
      });
      console.log('✅ Twilio connected:', twilioAccount.id);
    }
    
    // 3. Stripe API Key
    if (process.env.STRIPE_SECRET_KEY) {
      console.log('\n💳 Adding Stripe...');
      const stripeAccount = await client.connectedAccounts.create({
        appName: 'stripe',
        authMode: 'API_KEY',
        authConfig: {
          api_key: process.env.STRIPE_SECRET_KEY
        }
      });
      console.log('✅ Stripe connected:', stripeAccount.id);
    }
    
    // 4. Notion API Key
    if (process.env.NOTION_API_KEY) {
      console.log('\n📓 Adding Notion...');
      const notionAccount = await client.connectedAccounts.create({
        appName: 'notion',
        authMode: 'API_KEY',
        authConfig: {
          api_key: process.env.NOTION_API_KEY
        }
      });
      console.log('✅ Notion connected:', notionAccount.id);
    }
    
    // 5. Anthropic/Claude API Key
    if (process.env.ANTHROPIC_API_KEY) {
      console.log('\n🤖 Adding Anthropic...');
      const anthropicAccount = await client.connectedAccounts.create({
        appName: 'anthropic',
        authMode: 'API_KEY',
        authConfig: {
          api_key: process.env.ANTHROPIC_API_KEY
        }
      });
      console.log('✅ Anthropic connected:', anthropicAccount.id);
    }
    
    // 6. SendGrid API Key
    if (process.env.SENDGRID_API_KEY) {
      console.log('\n📧 Adding SendGrid...');
      const sendgridAccount = await client.connectedAccounts.create({
        appName: 'sendgrid',
        authMode: 'API_KEY',
        authConfig: {
          api_key: process.env.SENDGRID_API_KEY
        }
      });
      console.log('✅ SendGrid connected:', sendgridAccount.id);
    }
    
    // 7. Slack Bot Token
    if (process.env.SLACK_BOT_TOKEN) {
      console.log('\n💬 Adding Slack...');
      const slackAccount = await client.connectedAccounts.create({
        appName: 'slack',
        authMode: 'API_KEY',
        authConfig: {
          bot_token: process.env.SLACK_BOT_TOKEN
        }
      });
      console.log('✅ Slack connected:', slackAccount.id);
    }
    
    // 8. Discord Bot Token
    if (process.env.DISCORD_BOT_TOKEN) {
      console.log('\n🎮 Adding Discord...');
      const discordAccount = await client.connectedAccounts.create({
        appName: 'discord',
        authMode: 'API_KEY',
        authConfig: {
          bot_token: process.env.DISCORD_BOT_TOKEN
        }
      });
      console.log('✅ Discord connected:', discordAccount.id);
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('\n📋 To add more API keys, add them to your .env file:');
    console.log(`
# Add these to your .env file:
OPENAI_API_KEY=sk-...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
STRIPE_SECRET_KEY=sk_live_...
NOTION_API_KEY=secret_...
ANTHROPIC_API_KEY=sk-ant-...
SENDGRID_API_KEY=SG...
SLACK_BOT_TOKEN=xoxb-...
DISCORD_BOT_TOKEN=...
    `);
    
    console.log('Then run this script again: node scripts/composio-add-api-keys.js\n');
    
  } catch (error) {
    console.error('\n❌ Error adding API keys:', error.message);
    console.log('\nMake sure your API keys are valid and in the correct format.');
  }
}

// Run the script
addAPIKeys().catch(console.error);