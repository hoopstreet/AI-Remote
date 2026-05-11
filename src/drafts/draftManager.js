const fs = require("fs-extra");
const path = require("path");

const DRAFT_STORE_PATH = path.join(__dirname, "draftStore.json");

async function loadDrafts() {
  try {
    return await fs.readJson(DRAFT_STORE_PATH);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {}; // Return empty object if file doesn't exist
    }
    throw error;
  }
}

async function saveDrafts(data) {
  await fs.writeJson(DRAFT_STORE_PATH, data, { spaces: 2 });
}

async function addDraft(userId, draft) {
  const drafts = await loadDrafts();
  if (!drafts[userId]) drafts[userId] = [];
  
  // Assign a unique ID to the draft
  draft.id = Date.now(); 
  drafts[userId].push(draft);
  await saveDrafts(drafts);
}

async function getDrafts(userId) {
  const drafts = await loadDrafts();
  return drafts[userId] || [];
}

async function updateDraftStatus(userId, draftId, status) {
  const drafts = await loadDrafts();
  if (drafts[userId]) {
    const draftIndex = drafts[userId].findIndex(d => d.id === draftId);
    if (draftIndex !== -1) {
      drafts[userId][draftIndex].status = status;
      await saveDrafts(drafts);
      return true;
    }
  }
  return false;
}

module.exports = { addDraft, getDrafts, updateDraftStatus };
