const { Telegraf } = require('telegraf');
const { handleMessage } = require('./core/orchestrator');
require('dotenv').config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error('Error: TELEGRAM_BOT_TOKEN is not defined in environment variables.');
    process.exit(1);
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => ctx.reply('🚀 AI-Remote Heavyweight Active. Use /connect owner/repo to start.'));

bot.on('text', async (ctx) => {
    try {
        await handleMessage(ctx);
    } catch (err) {
        console.error('Orchestrator Error:', err);
        ctx.reply('... System Error: ' + err.message);
    }
});

bot.launch().then(() => {
    console.log('✅ Bot successfully deployed and listening...');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
