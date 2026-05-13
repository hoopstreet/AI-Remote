import { Telegraf } from 'telegraf';
import { handleCommand } from '../core/router.js';
import { runFullDiagnostic } from '../core/sentinel.js';
import { generateTaskReport } from '../core/taskGenerator.js';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

export function setupCommands() {
    // 1. /status
    bot.command('status', async (ctx) => {
        const health = await runFullDiagnostic();
        ctx.reply(`📊 System Status:\n- DB: ${health.db ? '✅' : '❌'}\n- Schema: ${health.schema ? '✅' : '❌'}\n- Location: AI-Remote-Table`);
    });

    // 2. /connect
    bot.command('connect', async (ctx) => {
        const repoUrl = ctx.message.text.split(' ')[1];
        if (!repoUrl) return ctx.reply('❌ Usage: /connect [url]');
        ctx.reply('🧬 DNA Indexing started...');
        await handleCommand('task', repoUrl, { action: 'index_dna' });
    });

    // 3. /push
    bot.command('push', async (ctx) => {
        ctx.reply('🚀 Dispatching logic to GitHub Muscle...');
        const result = await handleCommand('push');
        ctx.reply(result.status === 'Synced' ? '✅ Push Successful.' : '❌ Push Failed.');
    });

    // 🧠 NATURAL AI CONVERSATION HANDLER
    bot.on('text', async (ctx) => {
        const userInput = ctx.message.text;
        if (userInput.startsWith('/')) return; // Ignore commands here

        ctx.reply("🧠 Thinking... Analyzing your request against Project DNA.");
        try {
            const result = await generateTaskReport(userInput);
            ctx.reply(`✅ Analysis Complete.\nDraft ID: ${result.id}\nProposed: ${userInput}\n\nType /push to send to GitHub task.md.`);
        } catch (err) {
            ctx.reply(`❌ Analysis Error: ${err.message}`);
        }
    });
}

export async function startTelegramBot(settings) {
    setupCommands();
    return bot;
}
export default bot;
