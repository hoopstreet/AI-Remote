import { supabase } from '../core/supabase.js';

export async function handleConnect(ctx, url) {
  if (!url) {
    const { data } = await supabase.from('projects').select('name, repo_url');
    const list = data.map((p, i) => `${i+1}. ${p.name} (${p.repo_url})`).join('\n');
    return ctx.reply(`📂 **Active Project DNA:**\n\n${list || 'No projects found.'}\n\n*Use /connect [url] to add a new one.*`);
  }
  ctx.reply(`🧬 Indexing DNA for: ${url}...`);
  // Logic to save and index repo here
}
