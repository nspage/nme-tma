#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "Installing Vercel CLI..."
  npm install -g vercel
fi

# Build the project
echo "Building project..."
npm run build

# Run tests if they exist
if [ -f "package.json" ] && grep -q "\"test\":" "package.json"; then
  echo "Running tests..."
  npm test
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
if [ "$1" == "production" ]; then
  vercel --prod
else
  vercel
fi

echo "Deployment completed!"
