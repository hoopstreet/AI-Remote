import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();

// We explicitly pull the SERVICE_ROLE_KEY for administrative access
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const SCHEMA = 'AI-Remote-Table';

if (!supabaseKey) {
    console.error("❌ CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing!");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: SCHEMA
  },
  global: {
    headers: { 'x-my-custom-header': 'ai-remote-elite' }
  },
  realtime: {
    transport: ws 
  }
});

console.log(`✅ CTO ELITE: Connected via Service Role to ${SCHEMA}`);
