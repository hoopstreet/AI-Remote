function detectConflicts(drafts) {
  const conflicts = [];
  // Simple keyword-based conflict detection for demonstration
  // In a real system, this would involve more sophisticated NLP or AST analysis

  for (let i = 0; i < drafts.length; i++) {
    for (let j = i + 1; j < drafts.length; j++) {
      const taskA = drafts[i].content.toLowerCase();
      const taskB = drafts[j].content.toLowerCase();

      // Example conflict rules:
      // If both tasks involve 'auth'
      if (taskA.includes("auth") && taskB.includes("auth")) {
        conflicts.push({
          taskA: i + 1,
          taskB: j + 1,
          files: ["auth-related files"], // Placeholder
          reason: "Overlapping authentication changes"
        });
      }
      // If both tasks involve 'database schema'
      if (taskA.includes("database schema") && taskB.includes("database schema")) {
        conflicts.push({
          taskA: i + 1,
          taskB: j + 1,
          files: ["db-migration-files"], // Placeholder
          reason: "Conflicting database schema modifications"
        });
      }
      // Add more rules as needed
    }
  }
  return conflicts;
}

// Helper to extract files (very basic, can be improved)
function extractFiles(text) {
  const matches = text.match(/([a-zA-Z0-9_-]+\.(js|ts|py|md|java|go|rb|php|html|css|sql))/g);
  return matches || [];
}

module.exports = { detectConflicts, extractFiles };
