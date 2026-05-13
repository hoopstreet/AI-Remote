import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    // If "AI-Remote-Table" fails, we fall back to public 
    // and specify the schema in the .from() call later if needed.
    schema: 'AI-Remote-Table' 
  },
  global: {
    headers: { 'x-my-custom-header': 'ai-remote' },
  },
});

console.log("✅ Supabase Engine Handshaked");
