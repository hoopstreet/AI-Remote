const axios = require("axios");

async function readFile(owner, repo, path) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    });
    return Buffer.from(res.data.content, "base64").toString("utf-8");
}

async function loadProjectContext(owner, repo) {
    const criticalFiles = ["docs/DNA.md", "docs/Roadmap.md", "docs/SOURCE_MAP.md", "docs/VERSION.md"];
    let contextDump = "";
    for (const file of criticalFiles) {
        try {
            const content = await readFile(owner, repo, file);
            contextDump += `### FILE: ${file}\n${content}\n\n`;
        } catch (e) {
            contextDump += `### FILE: ${file}\n(Not found or empty)\n\n`;
        }
    }
    return contextDump;
}

module.exports = { loadProjectContext };
