import { startBot } from './bot/telegramBot.js';
import dotenv from 'dotenv';

dotenv.config();

console.log("------------------------------------------");
console.log("🚀 Sovereign CTO Bot v1.4.1 Ignition...");
console.log(`📡 Model: ${process.env.AI_MODEL || 'Not Set'}`);
console.log(`🤖 Bot Token: ${process.env.TELEGRAM_BOT_TOKEN ? 'Loaded' : 'MISSING'}`);
console.log("------------------------------------------");

// The Fix: Check if startBot exists and handle it safely
try {
  const botInstance = startBot();
  console.log("🚀 CTO Elite Bot Wired and Polling...");
  
  // If it's a promise, we handle it; if not, we just let it run
  if (botInstance && typeof botInstance.catch === 'function') {
    botInstance.catch(err => console.error("❌ Bot runtime error:", err));
  }
} catch (err) {
  console.error("❌ Failed to ignite bot:", err);
}
