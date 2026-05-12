const fs = require('fs-extra');
const path = require('path');

async function updateGM(userInput, aiOutput) {
    const gmPath = path.join(__dirname, '../memory/gm.memory.json');
    try {
        const gm = await fs.readJson(gmPath);
        if (userInput.includes("shorter")) gm.response_style.tone = "very concise";
        gm.learned.push({
            input: userInput,
            pattern: aiOutput.substring(0, 100),
            date: new Date().toISOString()
        });
        await fs.writeJson(gmPath, gm, { spaces: 2 });
    } catch (e) {
        console.log("GM update skipped: file not found.");
    }
}

module.exports = { updateGM };
