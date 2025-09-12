// ESLint configuration for Abacus × Composio guardrails
// Prevents direct HTTP calls to tool backends outside src/composio/*

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // Prevent direct HTTP calls to common tool backend domains
    'no-restricted-syntax': [
      'error',
      {
        selector: 'CallExpression[callee.name="fetch"]',
        message: 'Direct fetch calls are forbidden outside src/composio/*. Use runTool() from src/composio/runTool.ts instead.'
      },
      {
        selector: 'ImportDeclaration[source.value="axios"]',
        message: 'Direct axios import is forbidden outside src/composio/*. Use runTool() instead.'
      },
      {
        selector: 'ImportDeclaration[source.value="node-fetch"]',
        message: 'Direct node-fetch import is forbidden outside src/composio/*. Use runTool() instead.'
      },
      {
        selector: 'ImportDeclaration[source.value="got"]',
        message: 'Direct got import is forbidden outside src/composio/*. Use runTool() instead.'
      },
      {
        selector: 'ImportDeclaration[source.value="request"]',
        message: 'Direct request import is forbidden outside src/composio/*. Use runTool() instead.'
      }
    ],
    
    // Warn about direct API endpoint strings
    'no-restricted-globals': [
      'warn',
      {
        name: 'fetch',
        message: 'Use runTool() from src/composio/runTool.ts for all external API calls'
      }
    ],
    
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off'
  },
  
  overrides: [
    {
      // Allow direct HTTP calls only in src/composio/*
      files: ['src/composio/**/*.ts', 'src/composio/**/*.js'],
      rules: {
        'no-restricted-syntax': 'off',
        'no-restricted-globals': 'off'
      }
    },
    {
      // Allow in test files
      files: ['**/*.test.ts', '**/*.spec.ts', 'scripts/smoke.ts'],
      rules: {
        'no-restricted-syntax': 'off',
        'no-restricted-globals': 'off'
      }
    }
  ],
  
  env: {
    node: true,
    es2022: true
  },
  
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
};