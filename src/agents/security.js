export function analyze(task) {
  let risk = 0;
  const content = JSON.stringify(task).toLowerCase();
  if (content.match(/(delete|remove|drop)/)) risk += 5;
  if (risk >= 4) return "HIGH";
  return "LOW";
}
