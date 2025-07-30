#!/bin/bash

# Moonwave Deployment Script
echo "🚀 Starting Moonwave deployment..."

# Build the application
echo "📦 Building application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Copy service worker to dist directory
echo "🔧 Copying service worker..."
cp public/sw.js dist/

# Copy manifest to dist directory
echo "📋 Copying manifest..."
cp public/manifest.json dist/

# Copy logo to dist directory
echo "🖼️ Copying logo..."
cp public/moonwave_log.png dist/

# Verify all required files exist
echo "✅ Verifying deployment files..."
required_files=("dist/index.html" "dist/sw.js" "dist/manifest.json" "dist/moonwave_log.png")

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing required file: $file"
        exit 1
    fi
done

echo "✅ All files verified!"

# Optional: Deploy to server (uncomment and modify as needed)
# echo "🌐 Deploying to server..."
# rsync -avz --delete dist/ user@your-server:/var/www/oh.moonwave.kr/

echo "🎉 Deployment completed successfully!"
echo "📁 Files are ready in the dist/ directory"