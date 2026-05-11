require("dotenv").config();
const { Telegraf } = require("telegraf");
const { handleMessage } = require("../core/orchestrator"); // Orchestrator handles all logic

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => ctx.reply("Welcome to AI-Remote CTO System! Use /connect to start."));
bot.help((ctx) => ctx.reply("Send me a task description, or use /connect <owner/repo> to link a project."));

bot.on("text", handleMessage);

bot.launch();
console.log("🤖 Telegram AI-Remote CTO System running...");

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
