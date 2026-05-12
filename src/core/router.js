import { supabase } from './supabase.js';

const GH_TOKEN = process.env.GH_TOKEN;
const REPO_OWNER = "hoopstreet";

export const dispatchTask = async (repoName, workflowId = 'status-check.yml') => {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${repoName}/actions/workflows/${workflowId}/dispatches`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GH_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({ ref: 'main' })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return { success: true, message: `Task dispatched to ${repoName}` };
  } catch (err) {
    console.error("❌ Router Error:", err.message);
    return { success: false, error: err.message };
  }
};
