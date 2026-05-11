const { Telegraf } = require('telegraf');
const { Octokit } = require('@octokit/rest');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
require('dotenv').config();

// Clients
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const octokit = new Octokit({ auth: process.env.GH_TOKEN });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const REPO_OWNER = 'hoopstreet';
const REPO_NAME = 'ai-remote';

bot.on('text', async (ctx) => {
    const userInput = ctx.message.text;
    if (userInput.startsWith('/')) return; // Handle commands separately

    ctx.reply("🤖 AI Agent (via OpenRouter) is analyzing...");

    try {
        // 1. Get AI Suggestion from OpenRouter
        const aiResponse = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'google/gemini-2.0-flash-001',
            messages: [{ role: 'user', content: `Task: ${userInput}. System Context: Solo-developer DevOps bot.` }]
        }, {
            headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` }
        });

        const suggestion = aiResponse.data.choices[0].message.content;

        // 2. Log Task to Supabase (Database)
        await supabase.from('tasks').insert([{ description: userInput, suggestion: suggestion }]);

        // 3. Push Task to GitHub (Action Trigger)
        const taskContent = `# TASK\n${userInput}\n\n# AI SUGGESTION\n${suggestion}`;
        await octokit.repos.createOrUpdateFileContents({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: 'docs/Task.md',
            message: `remote-task: ${userInput.substring(0, 20)}`,
            content: Buffer.from(taskContent).toString('base64')
        });

        ctx.reply(`✅ Task Logged & Pushed!\n\n${suggestion.substring(0, 500)}...`);
    } catch (err) {
        ctx.reply("❌ System Error: " + err.message);
    }
});

bot.launch();
console.log("Remote Control Online...");
