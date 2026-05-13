import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ URL:", supabaseUrl ? "DETECTED" : "MISSING");
    console.error("❌ KEY:", supabaseKey ? "DETECTED" : "MISSING");
    throw new Error("CRITICAL: Supabase environment variables are missing!");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'AI-Remote-Table' }
});

console.log("✅ Supabase Memory Linked: AI-Remote-Table");
