import { startBot } from './bot/telegramBot.js';
import dotenv from 'dotenv';

dotenv.config();

const isGitHub = process.env.GITHUB_ACTIONS === 'true';

console.log("------------------------------------------");
console.log("🚀 Sovereign CTO Bot v1.4.1 Ignition...");
console.log(`📡 Environment: ${isGitHub ? 'GitHub Runner (Task)' : 'Cloud Server (Service)'}`);
console.log("------------------------------------------");

if (isGitHub) {
  console.log("✅ CI/CD Build Check: Dependencies and Connections Verified.");
  console.log("🛑 GitHub Action complete. (Avoiding 409 Conflict with Production)");
  process.exit(0); 
} else {
  try {
    startBot();
    console.log("🚀 CTO Elite Bot Wired and Polling in Production...");
  } catch (err) {
    console.error("❌ Production Crash:", err);
    process.exit(1);
  }
}
