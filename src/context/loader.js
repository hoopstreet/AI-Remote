import { supabase } from '../core/supabase.js';

// Renamed to connectProject to match what telegramBot.js expects
export async function connectProject(repoName, url) {
    try {
        const { error } = await supabase
            .from('projects')
            .upsert([
                { 
                    repository_name: repoName, 
                    repository_url: url
                }
            ], { onConflict: 'repository_name' });

        if (error) throw error;
        return true;
    } catch (err) {
        console.error("❌ Context Loader Error:", err.message);
        return false;
    }
}

export async function listProjects() {
    const { data, error } = await supabase
        .from('projects')
        .select('id, repository_name, repository_url');
    
    if (error) {
        console.error("❌ List Projects Error:", error.message);
        return [];
    }
    return data;
}
