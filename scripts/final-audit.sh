#!/bin/sh
echo "🔍 Starting Deep-Link Conflict Audit..."

# 1. Check for export/import mismatches in Core
echo "📁 Checking Core Handshakes..."
grep -r "import" ~/ai-remote/src/core/ | grep "\.js"

# 2. Verify Schema Consistency (Elite 11 Check)
echo "📁 Scanning for Schema Hardcoding..."
grep -r "public" ~/ai-remote/src/ | grep -v "node_modules" && echo "⚠️ WARNING: Found references to 'public' schema. Should be 'AI-Remote-Table'."

# 3. Check Telegram Module Exports
echo "📁 Verifying Telegram Engine Exports..."
grep "export" ~/ai-remote/src/bot/telegramBot.js

# 4. Verify main.js Integrity
echo "📁 Checking Process Lifespan Logic..."
grep "bot.launch" ~/ai-remote/src/main.js || echo "❌ ERROR: No bot.launch found in main.js. Process will crash."

# 5. Check Package Integrity
echo "📁 Auditing Dependencies..."
if grep -q "telegraf" ~/ai-remote/package.json; then
    echo "✅ Telegraf found in package.json"
else
    echo "❌ ERROR: Telegraf missing from package.json"
fi

echo "🚀 Audit Complete. If no errors shown, proceed to Push."
