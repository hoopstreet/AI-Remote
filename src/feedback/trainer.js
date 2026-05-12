const fs = require('fs-extra');
const path = require('path');
const GM_PATH = path.join(__dirname, '../../memory/gm.memory.json');

async function updateBestPractices(lesson) {
    try {
        const gm = await fs.readJson(GM_PATH);
        if (!gm.best_practices) gm.best_practices = [];
        
        gm.best_practices.push({
            lesson: lesson,
            updatedAt: new Date().toISOString()
        });
        
        await fs.writeJson(GM_PATH, gm, { spaces: 2 });
        return true;
    } catch (e) {
        console.error("Failed to update GM:", e);
        return false;
    }
}

module.exports = { updateBestPractices };
