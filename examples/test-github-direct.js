#!/usr/bin/env node

/**
 * GitHub Direct API Test
 */

const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

async function testGitHubDirect() {
  console.log('🧪 Testing GitHub Direct API Operations\n');

  const headers = {
    'Authorization': `token ${process.env.GITHUB_API_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'IMO-Creator-Test/1.0',
  };

  try {
    // Test 1: Get user info
    console.log('👤 Test 1: Getting user info...');
    const userResponse = await axios.get('https://api.github.com/user', { headers });
    console.log(`✅ User: ${userResponse.data.login} (${userResponse.data.public_repos} public repos)`);

    // Test 2: List repositories
    console.log('\n📂 Test 2: Listing repositories...');
    const reposResponse = await axios.get('https://api.github.com/user/repos?sort=updated&per_page=3', { headers });
    console.log(`✅ Found ${reposResponse.data.length} repositories:`);
    reposResponse.data.forEach((repo, index) => {
      console.log(`   ${index + 1}. ${repo.full_name} (${repo.language || 'No language'})`);
    });

    // Test 3: Check specific repo (imo-creator)
    console.log('\n🔍 Test 3: Checking imo-creator repository...');
    const repoResponse = await axios.get('https://api.github.com/repos/djb258/imo-creator', { headers });
    console.log(`✅ imo-creator repo found:`);
    console.log(`   - Description: ${repoResponse.data.description || 'No description'}`);
    console.log(`   - Stars: ${repoResponse.data.stargazers_count}`);
    console.log(`   - Language: ${repoResponse.data.language}`);
    console.log(`   - Updated: ${new Date(repoResponse.data.updated_at).toLocaleDateString()}`);

    console.log('\n🎉 All GitHub API operations are working perfectly!');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

testGitHubDirect();