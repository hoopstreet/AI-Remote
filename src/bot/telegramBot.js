const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const { getRecommendations, analyzeTask } = require('./intelligence');
require('dotenv').config({ path: '../../.env' });

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text) return;

    if (text === '/start' || text === '/help') {
        const recs = getRecommendations();
        const welcome = `🤖 *AI-Remote CTO Agent Activated*\n\nI am monitoring your repository: *hoopstreet/ai-remote*.\n\n${recs}\n\n*Commands:*\n/task [description] - Generate new engineering task\n/confirm - Push changes to GitHub`;
        bot.sendMessage(chatId, welcome, { parse_mode: 'Markdown' });
    } 
    
    else if (text.startsWith('/task')) {
        const taskContent = text.replace('/task', '').trim();
        const analysis = analyzeTask(taskContent);
        
        exec(`sh ../../scripts/orchestrator.sh "${taskContent}"`, (err) => {
            if (err) return bot.sendMessage(chatId, "❌ Orchestrator Error.");
            bot.sendMessage(chatId, analysis + "\n\n✅ *Task Logged.* Type /confirm to trigger GitHub Actions.", { parse_mode: 'Markdown' });
        });
    }

    else if (text === '/confirm') {
        bot.sendMessage(chatId, "🚀 *Pushing to GitHub Actions...*");
        exec('sh ../../scripts/push.sh', (err, stdout) => {
            if (err) return bot.sendMessage(chatId, "❌ Push failed.");
            bot.sendMessage(chatId, "🏁 *Success!* GitHub is now generating your code.");
        });
    }
});
