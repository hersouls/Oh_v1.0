#!/bin/bash

# Moonwave Production Deployment Script
# Usage: ./scripts/deploy.sh

set -e

echo "🚀 Starting Moonwave Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Checking Node.js version..."
NODE_VERSION=$(node --version)
print_status "Node.js version: $NODE_VERSION"

# Clean previous builds
print_status "Cleaning previous builds..."
npm run clean

# Install dependencies
print_status "Installing dependencies..."
npm ci --production=false

# Run linting
print_status "Running linting checks..."
npm run lint

# Run type checking
print_status "Running TypeScript type checking..."
npm run type-check

# Run tests
print_status "Running tests..."
npm run test:ci

# Build for production
print_status "Building for production..."
npm run build:prod

# Check build output
if [ ! -d "dist" ]; then
    print_error "Build failed - dist directory not found"
    exit 1
fi

print_status "Build completed successfully!"

# Check bundle size
print_status "Analyzing bundle size..."
npm run analyze

# Create deployment package
print_status "Creating deployment package..."
tar -czf moonwave-production-$(date +%Y%m%d-%H%M%S).tar.gz dist/

print_status "✅ Production deployment package ready!"
print_status "📦 Files to deploy:"
ls -la dist/

print_status "🌐 Deployment URL: https://oh.moonwave.kr"
print_status "📋 Next steps:"
echo "   1. Upload dist/ contents to your web server"
echo "   2. Configure your web server for SPA routing"
echo "   3. Set up HTTPS certificates"
echo "   4. Configure CDN if needed"

print_status "🎉 Deployment script completed successfully!"