const { Telegraf } = require('telegraf');
const { handleMessage } = require('./core/orchestrator');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => ctx.reply('🚀 AI-Remote Heavyweight Active. Use /connect owner/repo to start.'));

bot.on('text', async (ctx) => {
    try {
        await handleMessage(ctx);
    } catch (err) {
        console.error(err);
        ctx.reply('❌ System Error: ' + err.message);
    }
});

bot.launch();
