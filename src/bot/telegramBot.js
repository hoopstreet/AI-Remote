import TelegramBot from 'telegraf'; // Switching to telegraf (as per package.json)
import { exec } from 'child_process';
import { getRecommendations, analyzeTask } from './intelligence.js';
import { analyzeArchitecture } from './evolution.js';

const botToken = process.env.TELEGRAM_BOT_TOKEN;

export const startBot = async () => {
    if (!botToken) throw new Error("TELEGRAM_BOT_TOKEN is missing");

    // Using Telegraf logic to match your package.json dependency
    const { Telegraf } = await import('telegraf');
    const bot = new Telegraf(botToken);

    bot.start((ctx) => {
        const recs = getRecommendations();
        ctx.reply(`🤖 *AI-Remote CTO Agent Online*\n\n${recs}\n\nUse /evolve to check health.`, { parse_mode: 'Markdown' });
    });

    bot.command('evolve', (ctx) => {
        const report = analyzeArchitecture();
        ctx.reply(report, { parse_mode: 'Markdown' });
    });

    bot.on('text', async (ctx) => {
        const text = ctx.message.text;
        if (text.startsWith('/task')) {
            const taskContent = text.replace('/task', '').trim();
            const analysis = analyzeTask(taskContent);
            exec(`sh scripts/orchestrator.sh "${taskContent}"`, () => {
                ctx.reply(`${analysis}\n\n *Logged.* Type /confirm to push.`, { parse_mode: 'Markdown' });
            });
        }
        if (text === '/confirm') {
            ctx.reply("🚀 *Pushing via SSH Bridge...*");
            exec('sh scripts/push.sh', (err) => {
                if (err) return ctx.reply("❌ SSH Push failed.");
                ctx.reply("🏁 *Success!* GitHub Actions is now generating code.");
            });
        }
    });

    console.log("✅ Telegram Bot Polling Started...");
    return bot.launch();
};
