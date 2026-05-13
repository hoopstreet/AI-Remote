import { supabase } from './supabase.js';

export async function runFullDiagnostic() {
    console.log("🛡️ Sentinel: Deep Diagnostic Starting...");
    const diagnostics = { db: false, schema: false, brain: true };

    try {
        // Try a direct RPC or a system table check to verify connection
        const { data: version, error: connError } = await supabase.rpc('get_size_by_schema', { schema_name: 'AI-Remote-Table' }).catch(() => ({error: null}));
        
        // Try to reach the projects table specifically with quotes
        const { data, error } = await supabase
            .from('projects')
            .select('id')
            .limit(1);

        if (!error) {
            diagnostics.db = true;
            diagnostics.schema = true;
        } else {
            console.error("🔍 DB Diagnostic Detail:", error.message);
        }

        console.log("✅ Diagnostic Result:", diagnostics);
        return diagnostics;
    } catch (err) {
        console.error("❌ Critical Sentinel Failure:", err.message);
        return diagnostics;
    }
}
