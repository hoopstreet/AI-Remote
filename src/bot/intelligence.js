import { supabase } from '../core/supabase.js';

export async function getStatus(ctx) {
    const { count: draftCount } = await supabase.from('drafts_v2').select('*', { count: 'exact', head: true });
    const { data: projects } = await supabase.from('projects').select('name');

    ctx.reply(`📊 **Elite System Status**
------------------------
🟢 Engine: v1.0.4 (Real AI)
📡 DB: Connected
📦 Active Drafts: ${draftCount || 0}
🏗️ Contexts: ${projects?.length || 0} projects loaded.

*Use /push to view the queue.*`);
}
