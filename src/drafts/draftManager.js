const fs = require('fs-extra');
const path = require('path');
const DRAFT_PATH = path.join(__dirname, 'draftStore.json');

async function addDraft(userId, taskContent, risk) {
    const store = await fs.readJson(DRAFT_PATH).catch(() => ({}));
    if (!store[userId]) store[userId] = [];
    
    store[userId].push({
        id: Date.now(),
        content: taskContent,
        risk: risk,
        status: "pending"
    });
    await fs.writeJson(DRAFT_PATH, store, { spaces: 2 });
}

async function getDrafts(userId) {
    const store = await fs.readJson(DRAFT_PATH).catch(() => ({}));
    return store[userId] || [];
}

module.exports = { addDraft, getDrafts };
