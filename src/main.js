import { runFullDiagnostic } from './core/sentinel.js';
import { startBot } from './core/bot.js'; // Adjust based on your actual bot start file

async function init() {
    console.log("🚀 [SYSTEM] Initializing 24/7 Autonomous Mode...");
    
    // 1. Immediate Self-Heal on Startup
    const health = await runFullDiagnostic();
    
    if (health.db && health.schema) {
        console.log("✅ [SYSTEM] All connections mapped. Launching Bot...");
        startBot();
    } else {
        console.error("⚠️ [SYSTEM] Mapping failed. Retrying in 30 seconds...");
        setTimeout(init, 30000);
    }
}

// 2. Background Heartbeat (Self-Heals every 60 mins)
setInterval(async () => {
    console.log("🛡️ [SENTINEL] Running scheduled 24/7 diagnostic...");
    await runFullDiagnostic();
}, 3600000);

init();
