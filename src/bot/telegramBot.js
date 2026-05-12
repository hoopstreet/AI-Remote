const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const { getRecommendations, analyzeTask } = require('./intelligence');
require('dotenv').config({ path: '../../.env' });

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log('🚀 Northflank Bot Intelligence Active.');

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text) return;

    // 1. HELP / START (Includes Recommendations)
    if (text === '/start' || text === '/help') {
        const recs = getRecommendations();
        bot.sendMessage(chatId, `🧠 *AI-Remote Controller*\n\n${recs}\n\n📝 *Usage:*\n/task [description]\n/confirm to push to GitHub Actions`, { parse_mode: 'Markdown' });
    }

    // 2. TASK GENERATION (Includes CTO Analysis)
    else if (text.startsWith('/task')) {
        const taskContent = text.replace('/task', '').trim();
        const analysis = analyzeTask(taskContent);
        
        // Run orchestrator to update Task.md
        exec(`sh ../../scripts/orchestrator.sh "${taskContent}"`, (err, stdout) => {
            if (err) return bot.sendMessage(chatId, `❌ Error: ${err.message}`);
            bot.sendMessage(chatId, `${analysis}\n\n✅ *Status:*\n${stdout}\n\nType /confirm to trigger GitHub Actions.`, { parse_mode: 'Markdown' });
        });
    }

    // 3. CONFIRM (Triggers Push to GitHub)
    else if (text === '/confirm') {
        bot.sendMessage(chatId, "📤 *Initiating GitHub Push...*", { parse_mode: 'Markdown' });
        exec('sh ../../scripts/push.sh', (err, stdout, stderr) => {
            if (err) return bot.sendMessage(chatId, `❌ Push Failed: ${err.message}`);
            bot.sendMessage(chatId, `🚀 *Push Successful!*\nGitHub Actions is now generating code.\n\n${stdout}`, { parse_mode: 'Markdown' });
        });
    }
});
