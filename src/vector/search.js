const fs = require("fs-extra");

async function searchContext(query, storePath) {
    try {
        const store = await fs.readJson(storePath);
        const relevantDocs = store.filter(doc => 
            query.toLowerCase().split(" ").some(word => doc.content.includes(word))
        );
        return relevantDocs.map(d => d.content).join("\n\n") || "No specific DNA context found.";
    } catch (e) {
        return "New Project: No vector index found. Run /connect to index.";
    }
}

module.exports = { searchContext };
