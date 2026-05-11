const { Telegraf } = require('telegraf');
const { Octokit } = require('@octokit/rest');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const octokit = new Octokit({ auth: process.env.GH_TOKEN });

const REPO_OWNER = 'hoopstreet';
const REPO_NAME = 'ai-remote';

bot.on('text', async (ctx) => {
    const userInput = ctx.message.text;
    
    if (userInput.startsWith('/connect')) {
        return ctx.reply("✅ Connected to " + REPO_NAME);
    }
    
    ctx.reply(`🧠 Thinking... analyzing ${REPO_NAME} context...`);
    
    const taskContent = `# TASK: ${userInput}\n\n## Steps\n1. Analyze existing DNA.md\n2. Implement changes\n3. Validate & Merge`;
    
    try {
        await octokit.repos.createOrUpdateFileContents({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: 'docs/Task.md',
            message: `task: new request via Telegram`,
            content: Buffer.from(taskContent).toString('base64')
        });
        
        ctx.reply(`🚀 Task pushed to GitHub!\n\nReview DNA.md updates next.`);
    } catch (err) {
        ctx.reply("❌ GitHub Error: " + err.message);
    }
});

bot.launch();
console.log("Bot is running...");
