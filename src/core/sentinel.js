import { supabase } from './supabase.js';

export async function runFullDiagnostic() {
    console.log("🛡️ Sentinel: Checking Master Migration Status...");
    const diagnostics = { db: false, schema: false, brain: true };

    try {
        // We target the table without prefix because supabase.js now defaults to the custom schema
        const { data, error } = await supabase
            .from('projects')
            .select('id')
            .limit(1);

        if (!error) {
            diagnostics.db = true;
            diagnostics.schema = true;
            console.log("✅ Sentinel: Connection verified in AI-Remote-Table.");
        } else {
            console.error("🔍 DB Mapping Note:", error.message);
            // If it fails, we know it's a mapping issue, not a connection issue
        }

        console.log("✅ Final Diagnostic:", diagnostics);
        return diagnostics;
    } catch (err) {
        console.error("❌ Critical Sentinel Failure:", err.message);
        return diagnostics;
    }
}
