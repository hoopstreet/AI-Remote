const { Telegraf } = require('telegraf');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function askAI(prompt) {
  const res = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
    model: 'google/gemini-2.0-flash-001',
    messages: [{ role: 'user', content: prompt }]
  }, {
    headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` }
  });
  return res.data.choices[0].message.content;
}

bot.command('plan', async (ctx) => {
  const goal = ctx.message.text.replace('/plan ', '');
  const taskMd = await askAI(`Generate a Task.md for: ${goal}.`);
  const { data } = await supabase.from('drafts_v2').insert({ 
    repo_name: 'ai-remote', 
    content: taskMd 
  }).select();
  ctx.reply(`📝 Draft Created in drafts_v2 (ID: ${data[0].id})`);
});

bot.launch();
