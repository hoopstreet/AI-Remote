import { bot } from './core/bot.js';
import { setupCommands } from './bot/telegramBot.js';

async function startBot() {
    try {
        console.log("🛰️ Initializing CTO Elite Commands...");
        
        // This is the missing link!
        setupCommands();

        console.log("🚀 Bot is now Polling...");
        await bot.launch();

    } catch (error) {
        console.error("❌ Startup Error:", error.message);
    }
}

// Global Handlers
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

startBot();
