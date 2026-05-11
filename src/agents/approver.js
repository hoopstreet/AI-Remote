function autoApprove(task, risk) {
  // Auto-approve if risk is LOW and task does not contain critical keywords
  const criticalKeywords = ["delete", "auth", "database", "production"];
  const containsCritical = criticalKeywords.some(keyword => task.content.toLowerCase().includes(keyword));

  if (risk === "LOW" && !containsCritical) {
    return {
      approved: true,
      reason: "Low risk task, safe to proceed without extensive review."
    };
  }
  return {
    approved: false,
    reason: "Requires human review due to risk level or critical keywords."
  };
}

module.exports = { autoApprove };
