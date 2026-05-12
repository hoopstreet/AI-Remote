import { supabase } from '../core/supabase.js';

export async function loadProjectContext(repoName, url) {
    try {
        // Upsert uses the unique constraint on repo_name to prevent duplicates
        const { error } = await supabase
            .from('projects')
            .upsert([
                { 
                    name: repoName, 
                    repo_url: url, 
                    repo_name: repoName.includes('/') ? repoName : `hoopstreet/${repoName}`
                }
            ], { onConflict: 'repo_name' });

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
        .select('name, repo_url');
    
    if (error) {
        console.error("❌ List Projects Error:", error.message);
        return [];
    }
    return data;
}
