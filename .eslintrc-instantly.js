// Simplified ESLint configuration for Instantly compliance
// Focus on basic patterns rather than complex custom rules
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  // Skip extends for now to avoid dependency issues
  rules: {
    // Disable some rules and provide basic warnings
    'no-restricted-globals': ['warn', {
      'name': 'fetch',
      'message': 'Review fetch usage - ensure not making direct Instantly API calls'
    }],
    'no-restricted-syntax': [
      'warn',
      {
        'selector': 'CallExpression[callee.name="fetch"]',
        'message': 'Direct fetch calls detected - ensure not calling Instantly API directly'
      }
    ],
    // Disable some TypeScript rules that might cause issues
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off'
  },
  env: {
    'node': true,
    'es2022': true
  },
  parserOptions: {
    'ecmaVersion': 2022,
    'sourceType': 'module',
    'project': './tsconfig.json'
  }
}