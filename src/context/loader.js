import { supabase } from '../core/supabase.js';

// We hard-quote the schema to prevent Postgres from misinterpreting hyphens
const TABLE_PATH = '"AI-Remote-Table".projects';

export async function connectProject(repoName, url) {
    try {
        const { error } = await supabase
            .from(TABLE_PATH)
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
            .from(TABLE_PATH)
            .select('id, repository_name, repository_url');
        
        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error("❌ List Projects Error:", err.message);
        return [];
    }
}
