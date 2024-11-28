#!/bin/bash

# Exit on error
set -e

# Environment check
if [ "$NODE_ENV" != "production" ]; then
  export NODE_ENV=production
fi

# Clean up previous build
echo "Cleaning up previous build..."
rm -rf dist

# Install dependencies
echo "Installing dependencies..."
npm ci

# Type check
echo "Running type check..."
npm run typecheck || { echo "Type check failed"; exit 1; }

# Build the application
echo "Building application..."
npm run build

# Verify build
if [ ! -d "dist" ]; then
  echo "Build failed - dist directory not found"
  exit 1
fi

# Copy necessary files
echo "Copying production files..."
cp vercel.json dist/
cp public/robots.txt dist/

# Generate PWA assets if they don't exist
if [ ! -f "public/pwa-192x192.png" ] || [ ! -f "public/pwa-512x512.png" ]; then
  echo "Warning: PWA icons not found. Please add them to the public directory"
fi

echo "Build completed successfully!"
