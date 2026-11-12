#!/bin/bash

# Installation script for WFH Burnout Risk Classifier
# Usage: ./install.sh

set -e  # Exit on error

echo "🚀 WFH Burnout Risk Classifier - Installation Script"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js (v18 or higher) from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version is too old (v$NODE_VERSION)"
    echo "Please upgrade to Node.js v18 or higher"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Check for model file
if [ -f "public/burnout_model.onnx" ]; then
    echo "✅ Model file found: public/burnout_model.onnx"
elif [ -f "lib/burnout_model.onnx" ]; then
    echo "✅ Model file found: lib/burnout_model.onnx"
else
    echo "⚠️  WARNING: Model file not found!"
    echo ""
    echo "Please add your ONNX model file:"
    echo "  → public/burnout_model.onnx"
    echo "  OR"
    echo "  → lib/burnout_model.onnx"
    echo ""
    echo "See MODEL_TRAINING_GUIDE.md for help creating the model."
fi

echo ""
echo "=================================================="
echo "✅ Installation complete!"
echo ""
echo "📚 Next steps:"
echo "  1. Add model file (if not already done)"
echo "  2. Run: npm run dev"
echo "  3. Open: http://localhost:3000"
echo ""
echo "📖 Documentation:"
echo "  - QUICKSTART.md - Quick start guide"
echo "  - SETUP_GUIDE.md - Detailed setup"
echo "  - README.md - Full documentation"
echo ""
echo "Happy coding! 🎉"
