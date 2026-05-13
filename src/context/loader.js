import { supabase } from '../core/supabase.js';

// Configuration for the Sentinel-ready schema
const SCHEMA_PATH = '"AI-Remote-Table"';

export async function connectProject(repoName, url) {
    try {
        console.log(`🛰️ Attempting mapping: ${repoName} -> ${SCHEMA_PATH}`);
        const { error } = await supabase
            .from(`${SCHEMA_PATH}.projects`)
            .upsert([
                { repository_name: repoName, repository_url: url }
            ], { onConflict: 'repository_name' });

        if (error) throw error;
        return { success: true, message: "Project DNA Indexed" };
    } catch (err) {
        console.error("❌ Auto-Fix Triggered: Schema Mapping Error", err.message);
        return { success: false, error: err.message };
    }
}

export async function getSystemStatus() {
    try {
        const { count, error } = await supabase
            .from(`${SCHEMA_PATH}.drafts_v2`)
            .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        return { online: true, drafts: count || 0 };
    } catch (err) {
        return { online: false, error: "Database Desync" };
    }
}
