import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

// Check both possible variable names
const token = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
    console.error("❌ CRITICAL: No bot token found in process.env.BOT_TOKEN or TELEGRAM_BOT_TOKEN");
    process.exit(1); 
}

export const bot = new Telegraf(token);
