import { supabase } from '../core/supabase.js';

export async function connectProject(ctx) {
    const url = ctx.message.text.split(' ')[1];

    if (!url) {
        const { data } = await supabase.from('projects').select('name, repo_url');
        const list = data?.map((p, i) => `${i+1}. 📂 **${p.name}**`).join('\n') || "No projects found.";
        return ctx.reply(`🏗️ **Existing Project DNA:**\n\n${list}\n\n*Use /connect <url> to add new.*`, { parse_mode: 'Markdown' });
    }

    const repoName = url.split('/').pop();
    await supabase.from('projects').upsert([{ name: repoName, repo_url: url }]);
    
    ctx.reply(`✅ **Connected to ${repoName}**\nAuto-Indexing DNA & Roadmap...`);
}
