import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.BOT_TOKEN) {
    console.error("❌ CRITICAL: BOT_TOKEN is missing from environment variables!");
}

export const bot = new Telegraf(process.env.BOT_TOKEN);
