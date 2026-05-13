import { Telegraf } from 'telegraf';

// Create the bot instance using the environment variable
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

export function setupCommands() {
    bot.command('start', (ctx) => ctx.reply('🚀 AI-Remote Elite Fleet is ONLINE.'));
    bot.command('status', (ctx) => ctx.reply('📊 All systems localized to AI-Remote-Table.'));
    // Add your other specialized commands here
}

export async function startTelegramBot(settings) {
    console.log("🛰️ [TELEGRAM] Initializing engine with Elite Settings...");
    
    try {
        // Setup commands before launching
        setupCommands();

        // Optional: Use settings from Supabase if needed (e.g. bot name)
        const botName = settings?.bot_name || 'AI-Remote-Bot';
        console.log(`🤖 [TELEGRAM] Booting up as ${botName}...`);

        // Return the bot instance so main.js can call .launch()
        return bot;
    } catch (error) {
        console.error("❌ [TELEGRAM] Failed to start engine:", error);
        throw error;
    }
}

export default bot;
