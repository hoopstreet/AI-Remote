import { Telegraf } from 'telegraf';
import { orchestrateTask } from '../ai/agents.js';
import { connectProject } from '../context/loader.js';
import { supabase } from '../core/supabase.js';
import { exec } from 'child_process';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

export const startBot = () => {
    // 4-CORE COMMANDS
    bot.start((ctx) => ctx.reply("🔌 **CTO Online.** System v1.0.4. Ready for /connect."));
    
    bot.command('connect', (ctx) => connectProject(ctx));
    
    bot.command('task', (ctx) => orchestrateTask(ctx));
    
    bot.command('status', async (ctx) => {
        const { count: drafts } = await supabase.from('drafts_v2').select('*', { count: 'exact', head: true });
        ctx.reply(`📊 **AI-Remote Status**\n---\n🟢 Bot: Online\n📦 Drafts in Queue: ${drafts || 0}\n🛠 Version: 1.0.4-Elite`);
    });

    bot.command('push', (ctx) => {
        const target = ctx.message.text.split(' ')[1] || 'all';
        ctx.reply(`🚀 **Initiating Push for [${target}]...**`);
        exec('sh scripts/push.sh', (err) => {
            if (err) return ctx.reply("❌ Push failed. Check SSH.");
            ctx.reply("🏁 **GitHub Sync Complete.**");
        });
    });

    // NATURAL CHAT (Custom Prompt)
    bot.on('text', (ctx) => {
        if (!ctx.message.text.startsWith('/')) {
            orchestrateTask(ctx, ctx.message.text);
        }
    });

    bot.launch();
    console.log("🚀 CTO Elite Bot Wired and Polling...");
};
