export const clusterFailures = (globalFailures) => {
  const clusters = {};
  globalFailures.forEach(f => {
    const key = detectPatternKey(f.error_message || f);
    if (!clusters[key]) clusters[key] = [];
    clusters[key].push(f);
  });
  return clusters;
};

const detectPatternKey = (msg) => {
  if (msg.includes("auth") || msg.includes("JWT")) return "AUTH_SECURITY";
  if (msg.includes("database") || msg.includes("connection pool")) return "DB_INFRA";
  if (msg.includes("timeout") || msg.includes("latency")) return "PERF_BOTTLE";
  return "GENERAL_LOGIC";
};
