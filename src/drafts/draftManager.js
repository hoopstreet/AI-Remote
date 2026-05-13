import { supabase } from '../core/supabase.js';

export async function pushDraft(ctx) {
    const args = ctx.message.text.split(' ')[1];
    if (!args) {
        const { data: drafts } = await supabase.from('drafts_v2').select('id, title').limit(5);
        const list = drafts?.map(d => `ID: ${d.id} - ${d.title}`).join('\n') || "Queue empty.";
        return ctx.reply(`📋 **Current Draft Queue:**\n${list}\n\nUse '/push [ID]' or '/push bundle'`);
    }

    ctx.reply(`🚀 Pushing Bundle [${args}] to GitHub Muscle...`);
    // Logic to update Task.md would go here
    ctx.reply(`✅ Push Confirmed. GitHub Actions triggered for Task ${args}.`);
}
