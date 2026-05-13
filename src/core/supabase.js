import { createClient } from '@supabase/supabase-js';
import fetch, { Headers, Request, Response } from 'node-fetch';
import ws from 'ws';

// Polyfill Fetch for iSH/Node 16
if (!globalThis.fetch) {
    globalThis.fetch = fetch;
    globalThis.Headers = Headers;
    globalThis.Request = Request;
    globalThis.Response = Response;
}

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
    throw new Error("CRITICAL: Supabase environment variables are missing!");
}

// Initialize client with 'ws' transport to fix the WebSocket error
export const supabase = createClient(url, key, {
  realtime: {
    transport: ws,
  },
});
