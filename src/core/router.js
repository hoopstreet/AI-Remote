import { supabase } from './supabase.js';

const CREDENTIALS = {
  gh: process.env.GH_TOKEN,
  lock: "lockode"
};

export const handleCommand = async (command, repo = "ai-remote", payload = {}) => {
  console.log(`🔐 Dispatching: ${command} to ${repo}`);
  
  // Ensure the repo name doesn't contain the full URL if passed accidentally
  const repoName = repo.split('/').pop();
  
  const routes = {
    "status": `https://api.github.com/repos/hoopstreet/${repoName}/actions/workflows/status-check.yml/dispatches`,
    "push": `https://api.github.com/repos/hoopstreet/${repoName}/dispatches`,
    "task": `https://api.github.com/repos/hoopstreet/${repoName}/actions/workflows/task-runner.yml/dispatches`
  };

  if (!routes[command]) return { error: "Invalid Node Command" };

  try {
    const response = await fetch(routes[command], {
      method: 'POST',
      headers: {
        'Authorization': `token ${CREDENTIALS.gh}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'AI-Remote-Elite'
      },
      body: JSON.stringify({ 
        event_type: 'remote_trigger',
        client_payload: payload,
        ref: 'main' 
      })
    });

    if (response.status === 204 || response.status === 201) {
      return { status: "Synced" };
    } else {
      const errData = await response.text();
      console.error(`❌ GitHub API Error: ${response.status}`, errData);
      return { status: "Failed", detail: response.status };
    }
  } catch (e) {
    return { status: "Error", detail: e.message };
  }
};
