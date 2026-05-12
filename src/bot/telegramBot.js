const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const { getRecommendations, analyzeTask } = require('./intelligence');
const { analyzeArchitecture } = require('./evolution');
require('dotenv').config({ path: '../../.env' });

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text) return;

    if (text === '/start') {
        const recs = getRecommendations();
        bot.sendMessage(chatId, `🤖 *AI-Remote CTO Agent Online*\n\n${recs}\n\nUse /evolve to check system health.`, { parse_mode: 'Markdown' });
    } 

    else if (text === '/evolve') {
        const report = analyzeArchitecture();
        bot.sendMessage(chatId, report, { parse_mode: 'Markdown' });
    }
    
    else if (text.startsWith('/task')) {
        const taskContent = text.replace('/task', '').trim();
        const analysis = analyzeTask(taskContent);
        exec(`sh ../../scripts/orchestrator.sh "${taskContent}"`, () => {
            bot.sendMessage(chatId, `${analysis}\n\n✅ *Logged.* Type /confirm to push.`, { parse_mode: 'Markdown' });
        });
    }

    else if (text === '/confirm') {
        bot.sendMessage(chatId, "🚀 *Pushing via SSH Bridge...*");
        exec('sh ../../scripts/push.sh', (err) => {
            if (err) return bot.sendMessage(chatId, "❌ SSH Push failed.");
            bot.sendMessage(chatId, "🏁 *Success!* GitHub Actions is now generating code.");
        });
    }
});
