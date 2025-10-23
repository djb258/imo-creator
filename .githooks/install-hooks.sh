#!/bin/bash
# CTB Git Hooks Installer
# Installs CTB compliance hooks into .git/hooks

echo "🔧 Installing CTB git hooks..."

# Create .git/hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy pre-commit hook
cp .githooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

echo "✅ CTB pre-commit hook installed successfully!"
echo ""
echo "To disable hooks temporarily, use: git commit --no-verify"
echo "To uninstall hooks, run: rm .git/hooks/pre-commit"
