import { Telegraf } from 'telegraf';
import { exec } from 'child_process';
import { getRecommendations, analyzeTask } from './intelligence.js';
import { analyzeArchitecture } from './evolution.js';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

export const startBot = async () => {
    // 1. [CONNECT] - Health Check & Greeting
    bot.start((ctx) => {
        ctx.reply("🔌 *CTO Connected.*\nSystem v1.4.1 online.\nUse /status to check internal heartbeat.", { parse_mode: 'Markdown' });
    });

    // 2. [STATUS] - Check Roadmap & Environment
    bot.command('status', (ctx) => {
        const recs = getRecommendations();
        ctx.reply(`📊 *SYSTEM STATUS*\n\n${recs}`, { parse_mode: 'Markdown' });
    });

    // 3. [TASK] - Log task & trigger Orchestrator
    bot.command('task', async (ctx) => {
        const taskContent = ctx.message.text.replace('/task', '').trim();
        if (!taskContent) return ctx.reply("❌ Please provide task details. Example: `/task fix login`", { parse_mode: 'Markdown' });
        
        const analysis = analyzeTask(taskContent);
        ctx.reply(`${analysis}\n\n⚙️ *Running Orchestrator...*`, { parse_mode: 'Markdown' });
        
        exec(`sh scripts/orchestrator.sh "${taskContent}"`, (err, stdout) => {
            if (err) return ctx.reply(`⚠️ Orchestrator Error: ${err.message}`);
            ctx.reply("📝 *Task Logged & Scored.* Type /push to deploy.", { parse_mode: 'Markdown' });
        });
    });

    // 4. [PUSH] - Trigger the SSH Bridge to GitHub
    bot.command('push', (ctx) => {
        ctx.reply("🚀 *Initiating Deployment Bridge...*", { parse_mode: 'Markdown' });
        exec('sh scripts/push.sh', (err, stdout) => {
            if (err) return ctx.reply("❌ Git Push Failed. Check SSH keys.");
            ctx.reply("🏁 *Push Successful!* GitHub Actions taking over.", { parse_mode: 'Markdown' });
        });
    });

    // Custom Prompt / Catch-all
    bot.on('text', (ctx) => {
        if (!ctx.message.text.startsWith('/')) {
            ctx.reply("🧠 *CTO Listening...* Use /task to start a new cycle.");
        }
    });

    console.log("✅ All 4 Core Channels Wired.");
    return bot.launch();
};
