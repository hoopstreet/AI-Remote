import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// We define the schema here exactly as it appears in the dashboard
const SCHEMA_NAME = 'AI-Remote-Table';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: SCHEMA_NAME
  },
  global: {
    fetch: (...args) => fetch(...args),
  },
  realtime: {
    transport: ws 
  }
});

console.log(`✅ Supabase Engine Handshaked: ${SCHEMA_NAME}`);
