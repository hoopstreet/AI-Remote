import { runFullDiagnostic } from './core/sentinel.js';
import * as BotModule from './core/bot.js'; 

async function init() {
    console.log("🚀 [SYSTEM] Initializing 24/7 Autonomous Mode...");
    
    const health = await runFullDiagnostic();
    
    if (health.db && health.schema) {
        console.log("✅ [SYSTEM] All connections mapped. Launching Bot...");
        
        // This checks for common export names: startBot, launch, or the default export
        const launcher = BotModule.startBot || BotModule.default || Object.values(BotModule)[0];
        
        if (typeof launcher === 'function') {
            launcher();
        } else {
            console.error("❌ [SYSTEM] Could not find a launch function in bot.js");
        }
    } else {
        console.error("⚠️ [SYSTEM] Mapping failed. Retrying in 30 seconds...");
        setTimeout(init, 30000);
    }
}

// Background Heartbeat
setInterval(async () => {
    console.log("🛡️ [SENTINEL] Running scheduled 24/7 diagnostic...");
    await runFullDiagnostic();
}, 3600000);

init();
