function detectDependencies(drafts) {
  return drafts.map((draft, index) => {
    const content = draft.content.toLowerCase();
    let dependsOn = [];

    // Simple keyword-based dependency detection (can be enhanced with AI/NLP)
    drafts.forEach((otherDraft, i) => {
      if (i === index) return; // Don't depend on self
      const otherContent = otherDraft.content.toLowerCase();

      // Example rules:
      if (content.includes("frontend") && otherContent.includes("api")) {
        dependsOn.push(otherDraft.id); // Frontend depends on API
      }
      if (content.includes("deploy") && otherContent.includes("test")) {
        dependsOn.push(otherDraft.id); // Deploy depends on Test
      }
      if (content.includes("auth") && otherContent.includes("database schema")) {
        dependsOn.push(otherDraft.id); // Auth depends on DB schema
      }
      // Add more rules as needed
    });

    return {
      id: draft.id,
      title: draft.title,
      content: draft.content,
      risk: draft.risk,
      priority: draft.priority,
      dependsOn: [...new Set(dependsOn)] // Ensure unique dependencies
    };
  });
}

module.exports = { detectDependencies };
