#!/bin/sh
# Navigate to the root directory
cd ..

# Extract the GitHub token safely
GH_TOKEN=$(grep GH_TOKEN .env | cut -d'=' -f2 | tr -d '"' | tr -d '\r')
USER="hoopstreet"
REPO="github.com/hoopstreet/ai-remote.git"

echo "📦 Pushing changes to GitHub for Northflank deployment..."

git add .
git commit -m "Build update from iSH: $(date)"
git push -f "https://${USER}:${GH_TOKEN}@${REPO}" main

echo "🚀 Push complete. Check Northflank for auto-deploy status."
