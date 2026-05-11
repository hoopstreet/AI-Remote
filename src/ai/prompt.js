function buildPrompt({ userInput, projectContext, gm }) {
  return `
You are an AI DevOps Architect.
GENERAL MEMORY:
${JSON.stringify(gm)}
PROJECT CONTEXT:
${projectContext}
USER INPUT:
${userInput}
OUTPUT FORMAT:
🧠 Analysis:
...
📌 Recommended Tasks:
1.
2.
3.
(up to 5)
⚡ Suggested Bundle:
...
🧭 Next Action:
...
`;
}
module.exports = { buildPrompt };