import { Telegraf } from 'telegraf';
import { handleCommand } from '../core/router.js';
import { runFullDiagnostic } from '../core/sentinel.js';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

export function setupCommands() {
    // 1. /status - Audit Hub
    bot.command('status', async (ctx) => {
        const health = await runFullDiagnostic();
        ctx.reply(`📊 System Status:\n- DB: ${health.db ? '✅' : '❌'}\n- Schema: ${health.schema ? '✅' : '❌'}\n- Location: AI-Remote-Table`);
    });

    // 2. /connect - Project Hub
    bot.command('connect', async (ctx) => {
        const repoUrl = ctx.message.text.split(' ')[1];
        if (!repoUrl) return ctx.reply('❌ Please provide a GitHub URL: /connect [url]');
        ctx.reply('🧬 DNA Indexing started for repository...');
        await handleCommand('task', repoUrl, { action: 'index_dna' });
    });

    // 3. /task - Planning Hub
    bot.command('task', async (ctx) => {
        ctx.reply('🧠 Planner & Reviewer are debating your request... Check Supabase for the draft.');
        // Trigger orchestrator logic here
    });

    // 4. /push - Execution Hub
    bot.command('push', async (ctx) => {
        ctx.reply('🚀 Dispatching logic to GitHub Muscle...');
        const result = await handleCommand('push');
        ctx.reply(result.status === 'Synced' ? '✅ Push Successful. Monitoring build...' : '❌ Push Failed.');
    });
}

export async function startTelegramBot(settings) {
    console.log("🛰️ [TELEGRAM] Initializing engine with Elite Settings...");
    setupCommands();
    return bot;
}

export default bot;
