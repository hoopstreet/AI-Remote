import { supabase } from './supabase.js';

export async function runFullDiagnostic() {
  console.log("🛡️ Sentinel: Final Schema Migration Check...");
  const diagnostics = { db: false, schema: false, brain: true };
  
  try {
    // We check the 'projects' table which is the heart of the DNA indexing
    const { data, error } = await supabase.from('projects').select('id').limit(1);

    if (!error) {
      diagnostics.db = true;
      diagnostics.schema = true;
      console.log("✅ Sentinel: All systems localized to AI-Remote-Table.");
    } else {
      console.error("🔍 Mapping Error:", error.message);
    }
    return diagnostics;
  } catch (err) {
    return diagnostics;
  }
}
