function analyze(task) {
  let risk = 0;
  const content = JSON.stringify(task).toLowerCase();
  if (content.match(/(delete|remove|drop|truncate)/)) risk += 5;
  if (content.match(/(auth|login|password|token)/)) risk += 4;
  if (content.match(/(database|db|migration)/)) risk += 4;
  if (risk >= 7) return "CRITICAL";
  if (risk >= 4) return "HIGH";
  return "LOW";
}
module.exports = { analyze };
