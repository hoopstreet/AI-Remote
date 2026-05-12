#!/bin/sh
cd ~/ai-remote

# Extract and sanitize the token aggressively
RAW_TOKEN=$(grep '^GH_TOKEN=' .env | cut -d'=' -f2 | tr -d '"' | tr -d '\r' | tr -d ' ')
USER="hoopstreet"
REPO="github.com/hoopstreet/ai-remote.git"

if [ -z "$RAW_TOKEN" ]; then
    echo "❌ Error: GH_TOKEN is empty or not found in .env"
    exit 1
fi

# Configure Git to use the token for this session
git config user.name "hoopstreet"
git config user.email "hoopstreet143@gmail.com"

echo "📦 Committing changes..."
git add .
git commit -m "iSH Sync: $(date)"

echo "🚀 Pushing to GitHub..."
# Using the token directly in the push URL
git push -f "https://${USER}:${RAW_TOKEN}@${REPO}" main
