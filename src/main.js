import { runFullDiagnostic } from './core/sentinel.js';
import { launch } from './core/bot.js';

async function start() {
    console.log("🚀 [SYSTEM] Initializing 24/7 Autonomous Mode...");
    
    // Run the health check
    const status = await runFullDiagnostic();
    
    if (status.db && status.schema) {
        console.log("✅ [SYSTEM] All connections mapped. Launching Bot...");
        
        try {
            const botInstance = await launch();
            
            if (botInstance) {
                console.log("🛰️ [BOT] System settings loaded. Bot is now ONLINE.");
                
                // CRITICAL: Keep the process alive
                // If your bot uses Telegraf, it needs to stay running:
                if (botInstance.launch) {
                    await botInstance.launch();
                    console.log("✅ [TELEGRAM] Polling started. Listening for messages...");
                }
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
