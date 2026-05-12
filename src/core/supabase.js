import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ CRITICAL: Missing Supabase Credentials");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    // CRITICAL: Pointing to your custom schema instead of 'public'
    schema: 'AI-Remote-Table' 
  },
  auth: {
    persistSession: false
  },
  realtime: {
    transport: ws
  }
});

console.log("✅ Supabase Engine Handshaked with Schema: AI-Remote-Table");
