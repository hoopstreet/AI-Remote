import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Explicitly forcing the search path to our custom schema
export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { 
    schema: 'AI-Remote-Table' 
  },
  global: {
    headers: { 'x-my-custom-header': 'ai-remote-elite' }
  },
  realtime: { transport: ws }
});
