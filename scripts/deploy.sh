#!/bin/bash
# deploy.sh — Run on VPS after git pull
set -e

echo "🚀 Deploying Mission Control..."

# Pull latest
git pull origin main

# Install deps (only if package.json changed)
npm ci --production=false

# Build
npm run build

# Restart with pm2 (zero-downtime)
pm2 reload mission-control || pm2 start ecosystem.config.js

echo "✅ Mission Control deployed at http://localhost:3000"
