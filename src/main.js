import dotenv from 'dotenv';
dotenv.config();
import { startBot } from './bot/telegramBot.js';

async function start() {
    console.log("🚀 [SYSTEM] Initializing v1.4.3 Unified CTO Engine...");
    
    try {
        console.log("✅ [SYSTEM] Mapping connections to AI-Remote-Table...");
        
        // This launches the unified Telegraf instance from your bot folder
        await startBot();
        
        console.log("🛰️ [BOT] System settings loaded. Bot is now ONLINE.");
        console.log("✅ [TELEGRAM] Listening for DNA requests...");
        
    } catch (error) {
        console.error("❌ [FATAL] Bot crashed during ignition:", error);
        process.exit(1);
    }
}

// Prevent silent crashes in the cloud
process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ Unhandled Rejection:', reason);
});

start();
