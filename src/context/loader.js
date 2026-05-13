import { supabase } from '../core/supabase.js';

export async function connectProject(repoName, url) {
    try {
        // We call the table without the schema prefix because 
        // the client is already initialized to that schema
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
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('id, repository_name, repository_url');
        
        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error("❌ List Projects Error:", err.message);
        return [];
    }
}
