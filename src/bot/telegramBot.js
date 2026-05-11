const { Telegraf } = require('telegraf');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

bot.start((ctx) => ctx.reply('🚀 AI-Remote Controller Active. Send me a task description.'));

bot.on('text', async (ctx) => {
    const userInput = ctx.message.text;
    if (userInput.startsWith('/')) return;

    ctx.reply('🧠 Generating Task.md...');

    try {
        // 1. Generate Task via OpenRouter
        const aiRes = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'gpt-4o',
            messages: [{ role: 'user', content: `Generate a Task.md for: ${userInput}` }]
        }, {
            headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` }
        });

        const taskContent = aiRes.data.choices[0].message.content;

        // 2. Push to GitHub
        const githubUrl = `https://api.github.com/repos/${process.env.GH_OWNER}/${process.env.GH_REPO}/contents/docs/Task.md`;
        
        // Get SHA if file exists
        let sha;
        try {
            const existing = await axios.get(githubUrl, { headers: { Authorization: `token ${process.env.GH_TOKEN}` } });
            sha = existing.data.sha;
        } catch (e) {}

        await axios.put(githubUrl, {
            message: 'task: auto-generated via telegram',
            content: Buffer.from(taskContent).toString('base64'),
            sha: sha
        }, {
            headers: { Authorization: `token ${process.env.GH_TOKEN}` }
        });

        ctx.reply('✅ Task.md pushed to GitHub. Actions should trigger now.');
    } catch (error) {
        ctx.reply('❌ Error: ' + error.message);
    }
});

bot.launch();
