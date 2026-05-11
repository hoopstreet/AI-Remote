const axios = require("axios");

async function simulateImpact(proposalContent, owner, repo) {
  const prompt = `
    You are an AI Impact Simulator. Given an architectural redesign proposal and a specific repository context, simulate the potential impact.
    Focus on:
    - Which parts of the system (files, modules, services) in this repository would be directly affected.
    - Potential breaking changes or high-risk areas.
    - Estimated effort (LOW, MEDIUM, HIGH) for this specific repository.
    - Key dependencies that would need to be updated or refactored.

    REPOSITORY CONTEXT (owner/repo):
    ${owner}/${repo}

    ARCHITECTURAL REDESIGN PROPOSAL:
    ${proposalContent}

    OUTPUT:
    Return ONLY the impact simulation report in a structured text format.
    `;

  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error simulating impact:", error.message);
    return "Failed to simulate impact.";
  }
}

module.exports = { simulateImpact };
