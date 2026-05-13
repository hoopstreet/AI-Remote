import { supabase } from './supabase.js';

export async function runFullDiagnostic() {
  console.log("🛡️ Sentinel: Starting Full System Mapping...");
  const diagnostics = { db: false, schema: false, brain: true };
  
  try {
    // FORCE schema at the query-call level to bypass any client caching
    const forced = supabase
      .schema('AI-Remote-Table')
      .from('projects')
      .select('id')
      .limit(1);

    const { data, error } = await forced;

    if (!error) {
      diagnostics.db = true;
      diagnostics.schema = true;
      console.log("✅ Sentinel: Connection verified in AI-Remote-Table.", { rows: data?.length ?? 0 });
    } else {
      console.error("🔍 Sentinel DB Mapping Error:", {
        message: error.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
      });
    }
    
    console.log("✅ Diagnostic Complete:", diagnostics);
    return diagnostics;
  } catch (err) {
    console.error("❌ Critical Sentinel Failure:", err?.message ?? err);
    return diagnostics;
  }
}
