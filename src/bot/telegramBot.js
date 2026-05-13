import { Telegraf } from 'telegraf';
import { handleConnect } from '../context/loader.js';
import { generateTaskReport } from '../core/taskGenerator.js';
import { supabase } from '../core/supabase.js';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

export function setupCommands() {
    // 1. /connect - The Combined Hub
    bot.command('connect', async (ctx) => {
        const url = ctx.message.text.split(' ')[1];
        await handleConnect(ctx, url);
    });

    // 2. /status - Audit Hub
    bot.command('status', async (ctx) => {
        const { count } = await supabase.from('drafts_v2').select('*', { count: 'exact', head: true });
        ctx.reply(`📊 **System Heartbeat**\n- Schema: AI-Remote-Table\n- Drafts in Queue: ${count || 0}\n- Logic: ESM v1.4.3`);
    });

    // 3. /push - The Muscle
    bot.command('push', async (ctx) => {
        ctx.reply("🚀 Syncing selected drafts to GitHub Task.md...");
        // Muscle logic here
    });

    // 🧠 Natural AI Conversation
    bot.on('text', async (ctx) => {
        const text = ctx.message.text;
        if (text.startsWith('/')) return;

        ctx.reply("🧠 Analyzing Project DNA...");
        const result = await generateTaskReport(text);
        ctx.reply(`✅ **Draft Created: ${result.id}**\n\n${result.recommendation}`);
    });
}

export async function startBot() {
    setupCommands();
    bot.launch();
    console.log("🤖 Telegram Bot UI Online");
}
