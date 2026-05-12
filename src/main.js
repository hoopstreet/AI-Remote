import dotenv from 'dotenv';
dotenv.config();
import './router.js';
import { startBot } from './bot/telegramBot.js';
console.log("🚀 Sovereign CTO Bot v1.1.2 Ignition...");
startBot().catch(err => console.error("🔥 Ignition Failure:", err));
