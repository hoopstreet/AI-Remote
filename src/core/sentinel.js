import { supabase } from './supabase.js';

export async function runFullDiagnostic() {
  console.log("🛡️ Sentinel: Forced Schema Diagnostic Starting...");
  const diagnostics = { db: false, schema: false, brain: true };
  
  try {
    // We use .schema() to force the 'Accept-Profile' header to "AI-Remote-Table"
    const { data, error } = await supabase
      .schema('AI-Remote-Table')
      .from('projects')
      .select('id')
      .limit(1);

    if (!error) {
      diagnostics.db = true;
      diagnostics.schema = true;
      console.log("✅ Sentinel: Connection SUCCESS in AI-Remote-Table.");
    } else {
      // 406 Error Catching
      console.error("🔍 Sentinel DB Mapping Error:", {
        status: error.code,
        message: error.message,
        hint: "If this is 406, check Supabase Dashboard > API > Exposed Schemas"
      });
    }
    
    console.log("✅ Diagnostic Complete:", diagnostics);
    return diagnostics;
  } catch (err) {
    console.error("❌ Critical Sentinel Failure:", err.message);
    return diagnostics;
  }
}
