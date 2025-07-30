#!/bin/bash

# Moonwave Deployment Script
# This script ensures all required files are properly built and deployed

set -e

echo "🚀 Starting Moonwave deployment..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Verify required files exist
echo "✅ Verifying required files..."

required_files=(
    "dist/index.html"
    "dist/manifest.json"
    "dist/moonwave_log.png"
    "dist/sw.js"
    "dist/robots.txt"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing required file: $file"
        exit 1
    else
        echo "✅ Found: $file"
    fi
done

# Verify assets directory
if [ ! -d "dist/assets" ]; then
    echo "❌ Missing assets directory"
    exit 1
else
    echo "✅ Assets directory found"
fi

# Check for JavaScript files in assets
js_files=$(find dist/assets -name "*.js" | wc -l)
if [ "$js_files" -eq 0 ]; then
    echo "❌ No JavaScript files found in assets"
    exit 1
else
    echo "✅ Found $js_files JavaScript files in assets"
fi

echo "🎉 Deployment verification complete!"
echo "📁 Build directory: dist/"
echo "📋 Files to deploy:"
ls -la dist/

echo ""
echo "📝 Next steps:"
echo "1. Copy the contents of dist/ to your web server"
echo "2. Ensure nginx configuration is properly set up"
echo "3. Restart nginx: sudo systemctl restart nginx"
echo "4. Test the application at https://oh.moonwave.kr"