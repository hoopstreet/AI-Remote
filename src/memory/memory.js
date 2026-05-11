const fs = require('fs-extra');
const path = require('path');
const MEMORY_FILE = path.join(__dirname, 'projectStore.json');

function getProject(userId) {
    if (!fs.existsSync(MEMORY_FILE)) return null;
    const store = fs.readJsonSync(MEMORY_FILE);
    return store[userId] || null;
}

function setProject(userId, repoFullName) {
    const store = fs.existsSync(MEMORY_FILE) ? fs.readJsonSync(MEMORY_FILE) : {};
    store[userId] = repoFullName;
    fs.writeJsonSync(MEMORY_FILE, store);
}

module.exports = { getProject, setProject };
