import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'AI-Remote-Table' 
  },
  global: {
    // This is the CRITICAL fix for Node 20
    fetch: (...args) => fetch(...args),
  },
  realtime: {
    // Explicitly passing the WebSocket constructor
    transport: ws 
  }
});

console.log("✅ Supabase Engine Handshaked with Schema: AI-Remote-Table");
