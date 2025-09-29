#!/usr/bin/env node

const { Composio } = require('composio-core');

async function checkComposioApps() {
    try {
        const client = new Composio(process.env.COMPOSIO_API_KEY || 'ak_t-F0AbvfZHUZSUrqAGNn');

        console.log('🔍 Checking all available apps in Composio...');

        // Get all available apps
        const apps = await client.apps.list({});
        console.log('📱 Total apps available:', apps.items?.length || 0);

        if (apps.items && apps.items.length > 0) {
            // Search for Relevance.ai specifically
            const relevanceApps = apps.items.filter(app =>
                app.name?.toLowerCase().includes('relevance') ||
                app.key?.toLowerCase().includes('relevance')
            );

            console.log('🎯 Relevance.ai apps found:', relevanceApps?.length || 0);

            if (relevanceApps && relevanceApps.length > 0) {
                console.log('✅ Found Relevance.ai apps:');
                relevanceApps.forEach(app => {
                    console.log(`- ${app.name} (key: ${app.key})`);
                    console.log(`  Description: ${app.description || 'No description'}`);
                });
            } else {
                console.log('❌ No Relevance.ai apps found');
            }

            // Show first 10 apps for context
            console.log('\n📋 Sample of available apps:');
            apps.items.slice(0, 10).forEach(app => {
                console.log(`- ${app.name} (${app.key})`);
            });

        } else {
            console.log('❌ No apps returned from Composio API');
        }

        // Try to get tools/actions for any app
        console.log('\n🔧 Checking for tools in first app...');
        if (apps.items && apps.items.length > 0) {
            const firstApp = apps.items[0];
            try {
                const tools = await client.tools.list({
                    appNames: [firstApp.key]
                });
                console.log(`📋 Tools available for ${firstApp.name}:`, tools.items?.length || 0);
            } catch (toolError) {
                console.log('❌ Error getting tools:', toolError.message);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
    }
}

checkComposioApps();