import { supabase } from '../core/supabase.js';

export async function loadProjectContext(repoName, url) {
    try {
        const { error } = await supabase
            .from('projects')
            .upsert([
                { 
                    repository_name: repoName, 
                    repository_url: url
                }
            ], { onConflict: 'repository_name' }); // Matches the renamed column

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
        .select('id, repository_name, repository_url'); // Now including ID for internal mapping
    
    if (error) {
        console.error("❌ List Projects Error:", error.message);
        return [];
    }
    return data;
}
