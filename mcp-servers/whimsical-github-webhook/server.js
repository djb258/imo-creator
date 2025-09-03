#!/usr/bin/env node
/**
 * Whimsical GitHub Webhook Server
 * Automatically updates Whimsical diagrams when GitHub repos are updated
 */

const express = require('express');
const crypto = require('crypto');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());

const CONFIG = {
    port: process.env.PORT || 3007,
    webhook_secret: process.env.GITHUB_WEBHOOK_SECRET || '',
    whimsical_api_key: process.env.WHIMSICAL_API_KEY || '',
    whimsical_board_id: process.env.WHIMSICAL_BOARD_ID || '',
    python_path: process.env.PYTHON_PATH || 'python',
    visualizer_script: path.join(__dirname, '../../tools/whimsical_visualizer.py')
};

// Verify GitHub webhook signature
function verifySignature(payload, signature) {
    if (!CONFIG.webhook_secret) {
        console.warn('[WARN] No webhook secret configured - skipping signature verification');
        return true;
    }
    
    const hmac = crypto.createHmac('sha256', CONFIG.webhook_secret);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest)
    );
}

// Clone or update repository
async function updateRepository(repoUrl, repoName, ref = 'main') {
    const repoPath = path.join(__dirname, 'temp_repos', repoName);
    
    return new Promise((resolve, reject) => {
        // Remove existing directory if it exists
        if (fs.existsSync(repoPath)) {
            fs.rmSync(repoPath, { recursive: true, force: true });
        }
        
        // Clone repository
        const cloneProcess = spawn('git', ['clone', '--depth', '1', '--branch', ref, repoUrl, repoPath]);
        
        cloneProcess.on('close', (code) => {
            if (code === 0) {
                resolve(repoPath);
            } else {
                reject(new Error(`Git clone failed with code ${code}`));
            }
        });
        
        cloneProcess.on('error', reject);
    });
}

// Run whimsical visualizer
async function updateWhimsicalDiagram(repoPath) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn(CONFIG.python_path, [
            CONFIG.visualizer_script,
            repoPath,
            '--api-key', CONFIG.whimsical_api_key,
            '--board-id', CONFIG.whimsical_board_id
        ]);
        
        let output = '';
        let error = '';
        
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve({ output, error });
            } else {
                reject(new Error(`Visualizer failed with code ${code}: ${error}`));
            }
        });
    });
}

// GitHub webhook endpoint
app.post('/webhook/github', async (req, res) => {
    const signature = req.get('X-Hub-Signature-256');
    const event = req.get('X-GitHub-Event');
    
    // Verify signature
    if (!verifySignature(JSON.stringify(req.body), signature)) {
        return res.status(401).json({ error: 'Invalid signature' });
    }
    
    console.log(`[INFO] Received GitHub event: ${event}`);
    
    // Only process push events to main/master branches
    if (event === 'push') {
        const { repository, ref } = req.body;
        const branch = ref.split('/').pop();
        
        if (!['main', 'master'].includes(branch)) {
            console.log(`[INFO] Ignoring push to ${branch} branch`);
            return res.json({ message: 'Ignored non-main branch push' });
        }
        
        try {
            console.log(`[INFO] Processing push to ${repository.full_name}`);
            
            // Clone/update repository
            const repoPath = await updateRepository(
                repository.clone_url,
                repository.name,
                branch
            );
            
            // Update Whimsical diagram
            const result = await updateWhimsicalDiagram(repoPath);
            
            console.log(`[SUCCESS] Updated Whimsical diagram for ${repository.full_name}`);
            console.log(result.output);
            
            res.json({
                message: 'Whimsical diagram updated successfully',
                repository: repository.full_name,
                branch,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            console.error(`[ERROR] Failed to update diagram: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.json({ message: `Event ${event} ignored` });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'whimsical-github-webhook',
        timestamp: new Date().toISOString(),
        config: {
            webhook_secret_configured: !!CONFIG.webhook_secret,
            whimsical_api_key_configured: !!CONFIG.whimsical_api_key,
            whimsical_board_id_configured: !!CONFIG.whimsical_board_id
        }
    });
});

// Manual trigger endpoint
app.post('/trigger', async (req, res) => {
    const { repo_url, repo_name, ref = 'main' } = req.body;
    
    if (!repo_url || !repo_name) {
        return res.status(400).json({ error: 'repo_url and repo_name required' });
    }
    
    try {
        console.log(`[INFO] Manual trigger for ${repo_name}`);
        
        const repoPath = await updateRepository(repo_url, repo_name, ref);
        const result = await updateWhimsicalDiagram(repoPath);
        
        res.json({
            message: 'Whimsical diagram updated successfully',
            repository: repo_name,
            ref,
            output: result.output
        });
        
    } catch (error) {
        console.error(`[ERROR] Manual trigger failed: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Ensure temp directory exists
const tempDir = path.join(__dirname, 'temp_repos');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

app.listen(CONFIG.port, () => {
    console.log(`[INFO] Whimsical GitHub Webhook Server running on port ${CONFIG.port}`);
    console.log(`[INFO] Webhook endpoint: http://localhost:${CONFIG.port}/webhook/github`);
    console.log(`[INFO] Health check: http://localhost:${CONFIG.port}/health`);
    console.log(`[INFO] Manual trigger: http://localhost:${CONFIG.port}/trigger`);
});