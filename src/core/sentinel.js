import { supabase } from './supabase.js';

export async function runFullDiagnostic() {
    console.log("🛡️ Sentinel: Autonomous Mapping Starting...");
    const diagnostics = { db: false, schema: false, brain: true };

    try {
        // Because we forced the header in supabase.js, we just call the table name
        const { data, error } = await supabase
            .from('projects')
            .select('id')
            .limit(1);

        if (!error) {
            diagnostics.db = true;
            diagnostics.schema = true;
            console.log("✅ Sentinel: Handshake Successful.");
        } else {
            console.error("🔍 Sentinel Mapping Error:", error.message);
            console.error("💡 Hint: Ensure 'AI-Remote-Table' is added to 'Exposed Schemas' in Supabase Dashboard.");
        }

        console.log("✅ Diagnostic Result:", diagnostics);
        return diagnostics;
    } catch (err) {
        console.error("❌ Sentinel Exception:", err.message);
        return diagnostics;
    }
}
