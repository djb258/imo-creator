#!/bin/bash

# DeepSeek Agent Installation Script
# This script installs and sets up the DeepSeek Agent extension for VS Code

set -e

echo "🚀 DeepSeek Agent Installation Script"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if VS Code is installed
if ! command -v code &> /dev/null; then
    echo "❌ VS Code is not installed or not in PATH."
    echo "   Please install VS Code or add it to your PATH."
    exit 1
fi

echo "✅ VS Code detected"
echo ""

# Navigate to extension directory
EXTENSION_DIR="extensions/deepseek-agent"

if [ ! -d "$EXTENSION_DIR" ]; then
    echo "❌ Extension directory not found: $EXTENSION_DIR"
    exit 1
fi

cd "$EXTENSION_DIR"
echo "📁 Working directory: $(pwd)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Ask if user wants to package the extension
echo "Would you like to package the extension? (y/n)"
read -r PACKAGE_RESPONSE

if [ "$PACKAGE_RESPONSE" = "y" ] || [ "$PACKAGE_RESPONSE" = "Y" ]; then
    echo ""
    echo "📦 Packaging extension..."
    
    # Install vsce if not already installed
    if ! command -v vsce &> /dev/null; then
        echo "Installing @vscode/vsce..."
        npm install -g @vscode/vsce
    fi
    
    npm run package
    
    if [ $? -eq 0 ]; then
        echo "✅ Extension packaged successfully"
        echo ""
        
        # Find the .vsix file
        VSIX_FILE=$(ls -t *.vsix 2>/dev/null | head -1)
        
        if [ -n "$VSIX_FILE" ]; then
            echo "📦 Package created: $VSIX_FILE"
            echo ""
            echo "Would you like to install the extension now? (y/n)"
            read -r INSTALL_RESPONSE
            
            if [ "$INSTALL_RESPONSE" = "y" ] || [ "$INSTALL_RESPONSE" = "Y" ]; then
                echo ""
                echo "🔧 Installing extension..."
                code --install-extension "$VSIX_FILE"
                
                if [ $? -eq 0 ]; then
                    echo "✅ Extension installed successfully"
                else
                    echo "❌ Failed to install extension"
                    exit 1
                fi
            fi
        fi
    else
        echo "❌ Failed to package extension"
        exit 1
    fi
fi

echo ""
echo "======================================"
echo "✅ Installation Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Get your DeepSeek API key from: https://platform.deepseek.com"
echo "2. Open VS Code Settings (Ctrl+,)"
echo "3. Search for 'deepseek'"
echo "4. Enter your API key in 'DeepSeek: Api Key'"
echo "5. Press Ctrl+Shift+D to start chatting with DeepSeek!"
echo ""
echo "📚 Documentation:"
echo "   - README: extensions/deepseek-agent/README.md"
echo "   - Quick Start: extensions/deepseek-agent/QUICKSTART.md"
echo "   - Integration Guide: extensions/deepseek-agent/INTEGRATION.md"
echo ""
echo "🎉 Happy coding with DeepSeek!"
