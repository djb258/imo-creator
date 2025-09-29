#!/usr/bin/env node

const { Composio } = require('composio-core');

async function checkInstantlyAI() {
    try {
        const client = new Composio(process.env.COMPOSIO_API_KEY || 'ak_t-F0AbvfZHUZSUrqAGNn');

        console.log('🔍 Checking for Instantly.ai in Composio...');

        // Get all available apps
        const apps = await client.apps.list({});
        console.log('Total apps found:', apps.items?.length || 0);

        // Search for instantly or similar
        const instantlyApps = apps.items?.filter(app =>
            app.name?.toLowerCase().includes('instantly') ||
            app.key?.toLowerCase().includes('instantly')
        );

        console.log('Instantly apps found:', instantlyApps?.length || 0);

        if (instantlyApps && instantlyApps.length > 0) {
            console.log('✅ Found Instantly.ai apps:');
            instantlyApps.forEach(app => {
                console.log(`- ${app.name} (key: ${app.key})`);
                console.log(`  Description: ${app.description || 'No description'}`);
                console.log(`  Authentication: ${app.auth_scheme || 'Unknown'}`);
            });
        } else {
            console.log('❌ Instantly.ai not found in available apps');
            console.log('\\nChecking for email/marketing related apps:');
            const emailApps = apps.items?.filter(app =>
                app.name?.toLowerCase().includes('email') ||
                app.name?.toLowerCase().includes('mail') ||
                app.name?.toLowerCase().includes('marketing') ||
                app.name?.toLowerCase().includes('campaign')
            );

            if (emailApps && emailApps.length > 0) {
                emailApps.slice(0, 5).forEach(app => {
                    console.log(`- ${app.name} (key: ${app.key})`);
                });
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkInstantlyAI();