#!/bin/bash

# Comprehensive script to fix common ESLint issues

echo "🔧 Starting ESLint auto-fix..."

# 1. Run ESLint with auto-fix
echo "📝 Running ESLint auto-fix..."
npx eslint "src/**/*.{ts,tsx,js,jsx}" --fix --quiet

# 2. Run Prettier to format code
echo "🎨 Running Prettier..."
npx prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,md}" --log-level warn

echo "✅ Auto-fix complete!"
echo "⚠️  Please review the changes and run 'npm run lint' to check remaining issues"

