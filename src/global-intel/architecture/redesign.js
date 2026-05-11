const { saveRedesignProposals, loadRedesignProposals } = require("./store");
const axios = require("axios");

async function generateRedesign(insight) {
  const prompt = `
    You are an AI Architecture Designer. Based on the following systemic issue insight, propose a high-level architectural redesign blueprint.
    Focus on the core problem and a strategic solution, not implementation details.

    INSIGHT:
    Issue: ${insight.issue}
    Severity: ${insight.severity}
    Description: ${insight.description}
    Recommendation: ${insight.recommendation}

    Proposed Solution should include:
    - A clear, concise title for the redesign.
    - A summary of the current problem.
    - The proposed architectural change (e.g., introduce a new service, refactor a layer).
    - Expected benefits.
    - High-level components involved.
    - Estimated risk level for the redesign itself (LOW, MEDIUM, HIGH, CRITICAL).

    OUTPUT:
    Return ONLY the redesign proposal in a structured text format.
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
    const proposalContent = res.data.choices[0].message.content.trim();

    const proposal = {
      id: `REDESIGN-${Date.now()}`,
      insightId: insight.issue,
      proposal: proposalContent,
      riskLevel: extractRiskFromProposal(proposalContent), // Helper to extract risk
      requiresHumanApproval: true,
      timestamp: Date.now(),
    };

    const proposals = await loadRedesignProposals();
    proposals[proposal.id] = proposal;
    await saveRedesignProposals(proposals);
    return proposal;
  } catch (error) {
    console.error("Error generating redesign proposal:", error.message);
    return { error: "Failed to generate redesign proposal." };
  }
}

function extractRiskFromProposal(proposalContent) {
  const match = proposalContent.match(/Estimated risk level: (LOW|MEDIUM|HIGH|CRITICAL)/i);
  return match ? match[1].toUpperCase() : "UNKNOWN";
}

module.exports = { generateRedesign };
