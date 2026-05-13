import { supabase } from '../core/supabase.js';

export async function orchestrateTask(ctx) {
    const prompt = ctx.message.text.replace('/task', '').trim();
    if (!prompt) return ctx.reply("💡 Describe what you want to build (e.g., 'Add a logout button')");

    ctx.reply("🧠 Agents are debating the architecture...");
    
    // Simulate AI generation & Risk Audit
    const draftId = Math.floor(1000 + Math.random() * 9000);
    const { error } = await supabase.from('drafts_v2').insert({ id: draftId, title: prompt, status: 'pending' });

    if (error) return ctx.reply("❌ Memory Error: Could not save draft.");

    ctx.reply(`✅ **Draft Generated (ID: ${draftId})**\nRequirement: "${prompt}"\nRisk Score: Low\n\n**Recommendations:**\n1. Generate unit tests\n2. Bundle with existing UI tasks\n3. Push to GitHub\n\n*Reply 'generate 1' or 'push ${draftId}'*`);
}
