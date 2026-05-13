import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// This configuration forces the API to recognize the custom schema
export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { 
    schema: 'AI-Remote-Table' 
  },
  global: {
    headers: {
      'Accept-Profile': 'AI-Remote-Table',
      'Content-Profile': 'AI-Remote-Table'
    }
  },
  realtime: { transport: ws }
});
