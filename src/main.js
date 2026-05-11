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

    ctx.reply("🧪 Generating Architecture Plan & Code Draft...");

    try {
        // 1. Plan & Review
        const plan = await askAI(`Plan for: ${userInput}`, "Senior Architect");
        const codeDraft = await askAI(`Write only the code for this plan: ${plan}. Return raw code only.`, "Senior Lead Developer");

        // 2. Insert Task
        const { data: task, error: tErr } = await supabase.schema('AI-Remote-Table')
            .from('tasks').insert([{ description: userInput, suggestion: plan }]).select().single();
        if (tErr) throw tErr;

        // 3. Insert Draft (Linked to Task)
        const { error: dErr } = await supabase.schema('AI-Remote-Table')
            .from('drafts').insert([{
                task_id: task.id,
                title: `Draft for: ${userInput.substring(0, 30)}`,
                proposed_code: codeDraft,
                status: 'pending'
            }]);
        if (dErr) throw dErr;

        // 4. Update GitHub Source of Truth
        const finalDoc = `# TASK: ${userInput}\n\n## PLAN\n${plan}\n\n## DRAFT STATUS\nPending in Supabase Drafts`;
        await octokit.repos.createOrUpdateFileContents({
            owner: REPO_OWNER, repo: REPO_NAME, path: 'docs/Task.md',
            message: `draft-ready: ${task.id}`,
            content: Buffer.from(finalDoc).toString('base64')
        });

        ctx.reply(`🏗️ Draft Created!\n\nTask ID: ${task.id}\nCheck your Supabase "drafts" table to review the code.`);

    } catch (err) {
        ctx.reply("⚠️ Draft Error: " + err.message);
    }
});

bot.launch();

// Approval Command: /approve [TASK_ID]
bot.command('approve', async (ctx) => {
    const taskId = ctx.message.text.split(' ')[1];
    if (!taskId) return ctx.reply("❌ Please provide a Task ID: /approve ID");

    ctx.reply(`⚙️ Approving Task ${taskId}... Preparing GitHub update...`);

    try {
        // 1. Fetch the draft from Supabase
        const { data: draft, error } = await supabase.schema('AI-Remote-Table')
            .from('drafts').select('*').eq('task_id', taskId).single();
        
        if (error || !draft) throw new Error("Draft not found.");

        // 2. Signal GitHub (Update a specific 'status' file to trigger a push)
        await octokit.repos.createOrUpdateFileContents({
            owner: REPO_OWNER, repo: REPO_NAME,
            path: 'docs/APPROVED_CHANGES.md',
            message: `approved-task: ${taskId}`,
            content: Buffer.from(`TASK: ${taskId}\nCODE:\n${draft.proposed_code}`).toString('base64')
        });

        // 3. Update Status in Supabase
        await supabase.schema('AI-Remote-Table')
            .from('drafts').update({ status: 'approved' }).eq('task_id', taskId);

        ctx.reply("🚀 Approved! GitHub is now deploying the code changes.");
    } catch (err) {
        ctx.reply("❌ Approval Error: " + err.message);
    }
});
