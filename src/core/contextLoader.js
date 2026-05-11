const { readFile } = require("../utils/githubClient");
const { embed } = require("../memory/vectorStore");

async function loadProjectContext(owner, repo) {
  const files = [
    "docs/DNA.md",
    "docs/Roadmap.md",
    "docs/SOURCE_MAP.md",
    "docs/KNOWLEDGE_BASE.md",
    "docs/VERSION.md",
  ];
  const data = {};
  for (let file of files) {
    try {
      data[file] = await readFile(owner, repo, file);
    } catch (error) {
      data[file] = `Error reading ${file}: ${error.message}`;
    }
  }
  return data;
}

async function summarizeContext(context) {
  // This function might be used to create a concise summary for the AI prompt
  // if the raw context is too large. For now, we'll just return a formatted string.
  return Object.entries(context)
    .map(([file, content]) => `## ${file}\n${content.slice(0, 1000)}...`)
    .join("\n\n");
}

module.exports = { loadProjectContext, summarizeContext };
