import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase Credentials in Environment");
}

// The Fix: Explicitly providing the WebSocket transport for Node.js
export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    fetch: (...args) => fetch(...args),
  },
  realtime: {
    websocket: ws,
  },
});

console.log("✅ Supabase Client Initialized with WebSocket Transport");
