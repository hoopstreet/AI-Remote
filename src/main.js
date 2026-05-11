const { Telegraf } = require('telegraf');
const { Octokit } = require('@octokit/rest');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
require('dotenv').config();

// Clients - Initialized with specific schema access if needed, 
// though .from('"AI-Remote-Table"'.tableName) is the standard JS approach.
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const octokit = new Octokit({ auth: process.env.GH_TOKEN });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const REPO_OWNER = 'hoopstreet';
const REPO_NAME = 'ai-remote';

async function askAI(prompt, role) {
    const res = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'google/gemini-2.0-flash-001',
        messages: [
            { role: 'system', content: `You are the ${role}. Context: Solo-DevOps System.` },
            { role: 'user', content: prompt }
        ]
    }, {
        headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` }
    });
    return res.data.choices[0].message.content;
}

bot.on('text', async (ctx) => {
    const userInput = ctx.message.text;
    if (userInput.startsWith('/')) return;

    ctx.reply("🕵️ Agents are debating & logging to AI-Remote-Table...");

    try {
        // 1. Multi-Agent Debate
        const plan = await askAI(`Create a technical plan for: ${userInput}`, "Senior Architect");
        const review = await askAI(`Review this plan for security and CI/CD risks: ${plan}`, "Security Lead");

        // 2. Insert into "AI-Remote-Table".tasks
        const { data: taskData, error: taskError } = await supabase
            .from('tasks')
            .insert([{ 
                description: userInput, 
                suggestion: plan, 
                status: 'reviewed' 
            }])
            .select()
            .schema('AI-Remote-Table'); // Explicitly pointing to your custom schema

        if (taskError) throw taskError;

        // 3. Push to GitHub
        const finalTask = `# TASK: ${userInput}\n\n## PLAN\n${plan}\n\n## REVIEW\n${review}`;
        await octokit.repos.createOrUpdateFileContents({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: 'docs/Task.md',
            message: `remote-task: ${userInput.substring(0, 20)}`,
            content: Buffer.from(finalTask).toString('base64')
        });

        ctx.reply(`✅ System Synced.\n- Schema: AI-Remote-Table\n- Table: tasks\n- GitHub: docs/Task.md`);

    } catch (err) {
        ctx.reply("⚠️ Operational Error: " + err.message);
        console.error(err);
    }
});

bot.launch();
