/**
 * 🔒 MASTER COMMAND ROUTER - VERSION 1.0.4 (LOCKED)
 * PASSCODE: lockode
 * CORE: task, push, status, connect
 */

import { supabase } from './supabase.js';
import { openRouter } from '../ai/engine.js';

export const routeCommand = async (cmd, payload) => {
  switch (cmd) {
    case 'task':    // PLANNING HUB (Planner + Reviewer)
      return await handleTask(payload);
    case 'push':    // EXECUTION HUB (Deployment)
      return await handlePush(payload);
    case 'status':  // AUDIT HUB (Heartbeat)
      return await handleStatus();
    case 'connect': // PROJECT HUB (DNA Indexing)
      return await handleConnect(payload);
    default:
      return "⚠️ Unknown command. AI-Remote standing by.";
  }
};
