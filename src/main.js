import { runFullDiagnostic } from './core/sentinel.js';
import { launch } from './core/bot.js';

async function start() {
    console.log("🚀 [SYSTEM] Initializing 24/7 Autonomous Mode...");
    
    const status = await runFullDiagnostic();
    
    if (status.db && status.schema) {
        console.log("✅ [SYSTEM] All connections mapped. Launching Bot...");
        const botStarted = await launch();
        if (!botStarted) {
            console.error("❌ [SYSTEM] Bot launch failed during execution.");
        }
    } else {
        console.error("🛡️ [SENTINEL] Diagnostic failed. System halted.");
    }
}

start();
