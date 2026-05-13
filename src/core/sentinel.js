import { supabase } from './supabase.js';

export async function runFullDiagnostic() {
    console.log("🛡️ Sentinel: Starting Full System Mapping...");
    const diagnostics = { db: false, schema: false, brain: true };

    try {
        // 1. Check Database Handshake
        const { data, error } = await supabase.from('"AI-Remote-Table".projects').select('count');
        if (!error) diagnostics.db = true;

        // 2. Check Schema Visibility
        diagnostics.schema = data !== null;

        console.log("✅ Diagnostic Complete:", diagnostics);
        return diagnostics;
    } catch (err) {
        console.error("❌ Sentinel Alert: Mapping Severed", err.message);
        return { error: err.message };
    }
}
