export const generateRedesignProposal = (clusterKey, frequency) => {
  const solutions = {
    "AUTH_SECURITY": {
      solution: "Centralized Auth Proxy",
      description: "Move JWT validation to a shared middleware layer to prevent cross-repo drift."
    },
    "DB_INFRA": {
      solution: "Connection Pooling (Supavisor)",
      description: "Implement Supavisor to handle high-frequency connections across serverless functions."
    }
  };

  return {
    system: clusterKey,
    severity: frequency >= 3 ? "CRITICAL" : "ADVISORY",
    proposal: solutions[clusterKey] || { solution: "Modular Refactor", description: "Standardize logic." },
    status: "PENDING_APPROVAL"
  };
};
