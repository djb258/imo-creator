#!/usr/bin/env node

const { Composio } = require('composio-core');

async function checkRelevanceAI() {
    try {
        const client = new Composio(process.env.COMPOSIO_API_KEY || 'ak_t-F0AbvfZHUZSUrqAGNn');

        console.log('🔍 Checking for Relevance.ai in Composio...');

        // Get all available apps
        const apps = await client.apps.list({});
        console.log('Total apps found:', apps.items?.length || 0);

        // Search for relevance or similar
        const relevanceApps = apps.items?.filter(app =>
            app.name?.toLowerCase().includes('relevance') ||
            app.key?.toLowerCase().includes('relevance')
        );

        console.log('Relevance apps found:', relevanceApps?.length || 0);

        if (relevanceApps && relevanceApps.length > 0) {
            console.log('✅ Found Relevance.ai apps:');
            relevanceApps.forEach(app => {
                console.log(`- ${app.name} (key: ${app.key})`);
                console.log(`  Description: ${app.description || 'No description'}`);
                console.log(`  Authentication: ${app.auth_scheme || 'Unknown'}`);
            });
        } else {
            console.log('❌ Relevance.ai not found in available apps');
            console.log('\nChecking for AI/ML related apps:');
            const aiApps = apps.items?.filter(app =>
                app.name?.toLowerCase().includes('ai') ||
                app.name?.toLowerCase().includes('ml') ||
                app.name?.toLowerCase().includes('intelligence')
            );

            if (aiApps && aiApps.length > 0) {
                aiApps.slice(0, 5).forEach(app => {
                    console.log(`- ${app.name} (key: ${app.key})`);
                });
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkRelevanceAI();