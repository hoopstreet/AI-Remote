import { Telegraf } from 'telegraf';
import { supabase } from '../core/supabase.js';
import { orchestrateTask } from '../ai/agents.js';
import { connectProject } from '../context/loader.js';
import { pushDraft } from '../drafts/draftManager.js';
import { getStatus } from './intelligence.js';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

export function setupCommands(bot) {
    // 1. PLANNING: /task & Custom Prompt
    bot.command('task', orchestrateTask);
    bot.on('text', async (ctx, next) => {
        if (ctx.message.text.startsWith('/')) return next();
        await orchestrateTask(ctx);
    });

    // 2. EXECUTION: /push (Single/Bulk/Bundle)
    bot.command('push', pushDraft);

    // 3. AUDIT: /status (Including Draft counts)
    bot.command('status', getStatus);

    // 4. PROJECT: /connect (List + New Repo)
    bot.command('connect', connectProject);
}

setupCommands(bot);
bot.launch();
console.log("🛰️ [BOT] Elite v1.0.4 Online");
