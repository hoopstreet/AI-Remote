import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Force environment loading from the root workspace
dotenv.config();

import { startBot } from './bot/telegramBot.js';

console.log("------------------------------------------");
console.log("🚀 Sovereign CTO Bot v1.4.1 Ignition...");
console.log(`📡 Model: ${process.env.AI_MODEL || 'Not Set'}`);
console.log(`🤖 Bot Token: ${process.env.TELEGRAM_BOT_TOKEN ? 'Loaded' : 'MISSING'}`);
console.log("------------------------------------------");

startBot().catch(err => {
    console.error("🔥 Ignition Failure:", err);
    process.exit(1);
});
