const fs = require("fs-extra");
const path = require("path");

const GM_PATH = path.join(__dirname, "gm.memory.json");
const PROJECT_STORE_PATH = path.join(__dirname, "projectStore.json");

// --- Global Memory (GM) ---
async function getGM() {
  try {
    return await fs.readJson(GM_PATH);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Initialize with default GM if file doesn't exist
      const defaultGM = {
        response_style: {
          tone: "concise, structured, actionable",
          max_suggestions: 5
        },
        rules: [
          "always provide analysis first",
          "bundle related tasks",
          "avoid breaking changes",
          "respect versioning"
        ],
        learned: []
      };
      await fs.writeJson(GM_PATH, defaultGM, { spaces: 2 });
      return defaultGM;
    }
    throw error;
  }
}

async function updateGM(entry) {
  const gm = await getGM();
  gm.learned.push(entry);
  await fs.writeJson(GM_PATH, gm, { spaces: 2 });
}

// --- Project Store ---
let projectsCache = {}; // In-memory cache for current session

async function loadProjectStore() {
  try {
    projectsCache = await fs.readJson(PROJECT_STORE_PATH);
  } catch (error) {
    if (error.code === 'ENOENT') {
      projectsCache = {};
      await fs.writeJson(PROJECT_STORE_PATH, projectsCache, { spaces: 2 });
    } else {
      throw error;
    }
  }
}

async function saveProjectStore() {
  await fs.writeJson(PROJECT_STORE_PATH, projectsCache, { spaces: 2 });
}

async function setProject(userId, projectFullName) {
  if (Object.keys(projectsCache).length === 0) {
    await loadProjectStore();
  }
  projectsCache[userId] = projectFullName;
  await saveProjectStore();
}

function getProject(userId) {
  // For simplicity, directly access cache. In a larger app, ensure cache is loaded.
  return projectsCache[userId];
}

// Initialize project store on module load
loadProjectStore();

module.exports = { getGM, updateGM, setProject, getProject };
