import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// MASTER LOCK: Force the client to use double-quotes for the custom schema
export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: '"AI-Remote-Table"' },
  global: { fetch: (...args) => fetch(...args) },
  realtime: { transport: ws }
});
