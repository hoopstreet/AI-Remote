import { supabase } from './supabase.js';

const CREDENTIALS = {
  gh: process.env.GH_TOKEN,
  sb: process.env.SUPABASE_SERVICE_ROLE_KEY,
  ai: process.env.OPENROUTER_API_KEY,
  lock: "lockode"
};

export const handleCommand = async (command, repo = "ai-remote", payload = {}) => {
  console.log(`🔐 System Lock Active: Executing ${command}`);
  
  const routes = {
    "status": `https://api.github.com/repos/hoopstreet/${repo}/actions/workflows/status-check.yml/dispatches`,
    "push": `https://api.github.com/repos/hoopstreet/${repo}/dispatches`,
    "task": `https://api.github.com/repos/hoopstreet/${repo}/actions/workflows/task-runner.yml/dispatches`
  };

  if (!routes[command]) return { error: "Invalid Node Command" };

  const response = await fetch(routes[command], {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CREDENTIALS.gh}`,
      'Accept': 'application/vnd.github+json',
    },
    body: JSON.stringify({ ref: 'main', inputs: payload })
  });

  return response.ok ? { status: "Synced" } : { status: "Failed" };
};
