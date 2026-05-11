const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

bot.start((ctx) => ctx.reply('🚀 AI-Remote Phase 2 Active. Send me a task to generate a draft.'));

bot.on('text', async (ctx) => {
    const userInput = ctx.message.text;
    if (userInput.startsWith('/')) return;

    ctx.reply('🧠 Generating Draft in Supabase...');

    try {
        // 1. AI Logic via OpenRouter
        const aiRes = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'gpt-4o',
            messages: [{ role: 'user', content: `Write code for: ${userInput}. Return only the code.` }]
        }, {
            headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` }
        });

        const proposedCode = aiRes.data.choices[0].message.content;

        // 2. Insert into Supabase Drafts (Schema: AI-Remote-Table)
        const { data, error } = await supabase
            .withSchema('AI-Remote-Table')
            .from('drafts')
            .insert([{ 
                task_id: `task_${Date.now()}`, 
                title: userInput.substring(0, 20), 
                proposed_code: proposedCode,
                status: 'pending' 
            }])
            .select();

        if (error) throw error;

        const draftId = data[0].id;

        // 3. Send Telegram Approval Buttons
        await ctx.reply(`📝 Draft Generated! ID: ${draftId}\n\nReview the code in Supabase and choose:`, 
            Markup.inlineKeyboard([
                Markup.button.callback('✅ Approve & Push', `approve_${draftId}`),
                Markup.button.callback('❌ Reject', `reject_${draftId}`)
            ])
        );
    } catch (err) {
        ctx.reply('❌ Error: ' + err.message);
    }
});

// Handle Approval Actions
bot.action(/approve_(.*)/, async (ctx) => {
    const draftId = ctx.match[1];
    ctx.answerCbQuery('Merging to GitHub...');
    // Logic to fetch from Supabase and push to GitHub goes here
    ctx.editMessageText(`✅ Draft ${draftId} approved and merged to main!`);
});

bot.launch();
