import { startTelegramBot } from '../bot/telegramBot.js';
import { supabase } from './supabase.js';

export async function launch() {
    try {
        console.log("🤖 [CORE] Initializing Bot Modules...");
        
        // 1. Fetch settings from the Elite 11 bot_settings table
        const { data: settings, error } = await supabase
            .from('bot_settings')
            .select('*')
            .single();

        if (error) throw error;

        // 2. Start the Telegram Engine
        // This refers to your file in src/bot/telegramBot.js
        const botInstance = await startTelegramBot(settings);
        
        return botInstance; 
    } catch (error) {
        console.error("❌ [CORE] Launch Sequence Interrupted:", error.message);
        return null;
    }
}
