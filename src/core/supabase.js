import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Forced Schema Redirection to AI-Remote-Table
export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'AI-Remote-Table'
  },
  auth: {
    persistSession: false
  }
});

console.log("🛡️ [DB] Connection established. Schema: AI-Remote-Table");
