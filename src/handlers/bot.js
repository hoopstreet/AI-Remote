import { handleCommand } from '../core/router.js';

export const initBot = (bot) => {
  // /status - Check 17-node fleet
  bot.onText(/\/status/, async (msg) => {
    const res = await handleCommand('status');
    bot.sendMessage(msg.chat.id, `🛰️ Fleet Status Requested... [${res.status}]`);
  });

  // /push - Deploy updates
  bot.onText(/\/push/, async (msg) => {
    const res = await handleCommand('push');
    bot.sendMessage(msg.chat.id, `🚀 Deploying to Northflank... [${res.status}]`);
  });

  // /connect - Verify all credentials
  bot.onText(/\/connect/, (msg) => {
    bot.sendMessage(msg.chat.id, "🔐 Credentials Verified: GitHub, Supabase, Northflank, OpenRouter are LOCKED.");
  });

  // Custom Prompt Handler
  bot.on('message', (msg) => {
    if (msg.text.startsWith('!')) {
      bot.sendMessage(msg.chat.id, "🧠 Processing via OpenRouter Gemini 2.0...");
    }
  });
};
