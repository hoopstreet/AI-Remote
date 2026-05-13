import { runFullDiagnostic } from './core/sentinel.js';
import { launch } from './core/bot.js';

async function start() {
    console.log("🚀 [SYSTEM] Initializing 24/7 Autonomous Mode...");
    
    // Run the health check (Elite 11 Schema Check)
    const status = await runFullDiagnostic();
    
    if (status.db && status.schema) {
        console.log("✅ [SYSTEM] All connections mapped. Launching Bot...");
        
        try {
            // This calls core/bot.js which calls bot/telegramBot.js
            const botInstance = await launch();
            
            if (botInstance) {
                console.log("🛰️ [BOT] System settings loaded. Bot is now ONLINE.");
                
                // CRITICAL: This is the instruction that keeps the process alive
                await botInstance.launch();
                console.log("✅ [TELEGRAM] Polling started. Listening for messages...");
                
                // Enable graceful stop
                process.once('SIGINT', () => botInstance.stop('SIGINT'));
                process.once('SIGTERM', () => botInstance.stop('SIGTERM'));
            } else {
                console.error("❌ [SYSTEM] Bot launch failed: No instance returned.");
                process.exit(1);
            }
        } catch (error) {
            console.error("❌ [FATAL] Bot crashed during startup:", error);
            process.exit(1);
        }
    } else {
        console.error("🛡️ [SENTINEL] Diagnostic failed. System halted.");
        process.exit(1);
    }
}

// Global error handling to prevent silent "Exit 0"
process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
});

start();
