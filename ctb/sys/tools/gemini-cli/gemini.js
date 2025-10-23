#!/usr/bin/env node
// # CTB Metadata
// # Generated: 2025-10-23T14:32:36.271235
// # CTB Version: 1.3.3
// # Division: System Infrastructure
// # Category: tools
// # Compliance: 100%
// # HEIR ID: HEIR-2025-10-SYS-TOOLS-01

/**
 * Gemini CLI Tool
 * Google Generative AI Command-Line Interface
 *
 * Usage:
 *   node gemini.js <command> [options]
 *
 * Commands:
 *   chat <prompt>        - Interactive chat with Gemini
 *   generate <prompt>    - Generate text response
 *   analyze <file>       - Analyze file content
 *   models               - List available models
 *   test                 - Test API connection
 *
 * Environment Variables:
 *   GOOGLE_API_KEY       - Google AI API key (required)
 *   GEMINI_MODEL         - Model to use (default: gemini-pro)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Configuration
const API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

/**
 * Format output with colors
 */
function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

/**
 * Initialize Gemini API client
 */
function initGemini() {
  if (!API_KEY) {
    log('ERROR: GOOGLE_API_KEY environment variable not set', 'red');
    log('Please set your Google AI API key:', 'yellow');
    log('  export GOOGLE_API_KEY=your_api_key_here', 'cyan');
    log('  Or add it to your .env file', 'cyan');
    process.exit(1);
  }

  return new GoogleGenerativeAI(API_KEY);
}

/**
 * Test API connection
 */
async function testConnection() {
  log('Testing Gemini API connection...', 'blue');

  try {
    const genAI = initGemini();
    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });

    log(`Using model: ${DEFAULT_MODEL}`, 'cyan');

    const result = await model.generateContent('Say "Hello, Gemini CLI is working!"');
    const response = await result.response;
    const text = response.text();

    log('\n[OK] API Connection Successful', 'green');
    log(`Response: ${text}`, 'bright');

    return true;
  } catch (error) {
    log('[ERROR] API Connection Failed', 'red');
    log(`Error: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Generate text from prompt
 */
async function generateText(prompt) {
  log('Generating response...', 'blue');

  try {
    const genAI = initGemini();
    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    log('\n--- GEMINI RESPONSE ---', 'green');
    log(text, 'bright');
    log('--- END RESPONSE ---\n', 'green');

    return text;
  } catch (error) {
    log('[ERROR] Generation Failed', 'red');
    log(`Error: ${error.message}`, 'red');
    throw error;
  }
}

/**
 * Interactive chat mode
 */
async function chatMode(initialPrompt = null) {
  log('Starting Gemini chat mode...', 'blue');
  log('Type "exit" to quit\n', 'yellow');

  const genAI = initGemini();
  const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });
  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 2048,
    },
  });

  if (initialPrompt) {
    log(`You: ${initialPrompt}`, 'cyan');
    const result = await chat.sendMessage(initialPrompt);
    const response = await result.response;
    log(`\nGemini: ${response.text()}\n`, 'green');
  }

  // For CLI, we'll just do a single response since we can't do interactive input easily
  log('Chat session complete. Use with interactive input for full chat mode.', 'yellow');
}

/**
 * Analyze file content
 */
async function analyzeFile(filePath) {
  log(`Analyzing file: ${filePath}`, 'blue');

  if (!fs.existsSync(filePath)) {
    log(`[ERROR] File not found: ${filePath}`, 'red');
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const ext = path.extname(filePath);

  const prompt = `Analyze this ${ext} file and provide insights:\n\n${content}`;

  return await generateText(prompt);
}

/**
 * List available models
 */
async function listModels() {
  log('Available Gemini Models:', 'blue');
  log('  - gemini-2.5-flash (default)', 'cyan');
  log('  - gemini-2.5-flash-preview-05-20', 'cyan');
  log('  - gemini-2.5-pro-preview-03-25', 'cyan');
  log('  - gemini-2.5-pro-preview-05-06', 'cyan');
  log('  - gemini-2.5-flash-lite-preview-06-17', 'cyan');
  log('\nSet model with: export GEMINI_MODEL=<model-name>', 'yellow');
}

/**
 * Display help
 */
function showHelp() {
  log('\nGemini CLI Tool - Google Generative AI Interface\n', 'bright');
  log('Usage:', 'blue');
  log('  node gemini.js <command> [options]\n', 'cyan');

  log('Commands:', 'blue');
  log('  test                 - Test API connection', 'cyan');
  log('  generate <prompt>    - Generate text from prompt', 'cyan');
  log('  chat <prompt>        - Start chat with initial prompt', 'cyan');
  log('  analyze <file>       - Analyze file content', 'cyan');
  log('  models               - List available models', 'cyan');
  log('  help                 - Show this help message\n', 'cyan');

  log('Environment Variables:', 'blue');
  log('  GOOGLE_API_KEY       - Google AI API key (required)', 'cyan');
  log('  GEMINI_MODEL         - Model to use (default: gemini-pro)\n', 'cyan');

  log('Examples:', 'blue');
  log('  node gemini.js test', 'cyan');
  log('  node gemini.js generate "Explain quantum computing"', 'cyan');
  log('  node gemini.js analyze ./code.js', 'cyan');
  log('  node gemini.js chat "Hello, Gemini!"\n', 'cyan');
}

/**
 * Main CLI handler
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const commandArgs = args.slice(1);

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    process.exit(0);
  }

  try {
    switch (command) {
      case 'test':
        await testConnection();
        break;

      case 'generate':
        if (commandArgs.length === 0) {
          log('[ERROR] Missing prompt argument', 'red');
          log('Usage: node gemini.js generate "<prompt>"', 'yellow');
          process.exit(1);
        }
        await generateText(commandArgs.join(' '));
        break;

      case 'chat':
        await chatMode(commandArgs.join(' ') || null);
        break;

      case 'analyze':
        if (commandArgs.length === 0) {
          log('[ERROR] Missing file path argument', 'red');
          log('Usage: node gemini.js analyze <file-path>', 'yellow');
          process.exit(1);
        }
        await analyzeFile(commandArgs[0]);
        break;

      case 'models':
        await listModels();
        break;

      default:
        log(`[ERROR] Unknown command: ${command}`, 'red');
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    log(`[ERROR] Command failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run CLI
main();
