import { supabase } from '../src/core/supabase.js';

async function verify() {
    console.log("🔍 Querying Elite Schema: AI-Remote-Table...");
    const { data, error } = await supabase
        .from('drafts_v2')
        .select('*')
        .limit(5);

    if (error) {
        console.error("❌ Connection Error:", error.message);
    } else {
        console.log("✅ Success! Found", data.length, "drafts.");
        console.table(data);
    }
}

verify();
