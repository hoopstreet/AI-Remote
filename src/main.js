const { Telegraf } = require('telegraf');
const { Octokit } = require('@octokit/rest');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
require('dotenv').config();

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

    ctx.reply("🕵️ Agents are debating your request...");

    try {
        // Agent 1: The Architect (Plan)
        const plan = await askAI(`Create a technical plan for: ${userInput}`, "Senior Architect");
        
        // Agent 2: The Security/DevOps Reviewer (Verify)
        const review = await askAI(`Review this plan for security and CI/CD risks: ${plan}`, "Security Lead");

        // Merge results for the Final Task
        const finalTask = `# TASK: ${userInput}\n\n## ARCHITECT PLAN\n${plan}\n\n## SECURITY REVIEW\n${review}`;

        // Update GitHub
        await octokit.repos.createOrUpdateFileContents({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: 'docs/Task.md',
            message: `multi-agent-task: ${userInput.substring(0, 20)}`,
            content: Buffer.from(finalTask).toString('base64')
        });

        // Store in Supabase
        await supabase.from('tasks').insert([{ description: userInput, suggestion: plan, status: 'reviewed' }]);

        ctx.reply(`✅ Debate Complete. Task Pushed.\n\nSummary:\n${plan.substring(0, 300)}...`);
    } catch (err) {
        ctx.reply("⚠️ Debate Failed: " + err.message);
    }
});

bot.launch();
