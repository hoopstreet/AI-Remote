import { supabase } from '../core/supabase.js';

export async function connectProject(ctx) {
    const url = ctx.message.text.split(' ')[1];

    if (!url) {
        const { data: projects } = await supabase.from('projects').select('name, repo_url');
        if (!projects || projects.length === 0) return ctx.reply("📂 No projects found. Use: /connect [GitHub URL]");
        
        const list = projects.map((p, i) => `${i + 1}. 📂 **${p.name}**\n🔗 ${p.repo_url}`).join('\n\n');
        return ctx.reply(`🏗️ **Existing Project DNA:**\n\n${list}\n\n*Reply with a number to switch context.*`);
    }

    ctx.reply("🧬 Indexing New Project DNA...");
    const repoName = url.split('/').pop().replace('.git', '');
    await supabase.from('projects').upsert({ name: repoName, repo_url: url });
    ctx.reply(`✅ Connected to **${repoName}**! DNA indexing complete.`);
}
