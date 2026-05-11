const planner = require("../agents/planner");
const reviewer = require("../agents/reviewer");
const security = require("../agents/security");
const devops = require("../agents/devops");

async function runAgents(input, context) {
  console.log("--- Starting CTO Agent Pipeline ---");
  const plan = await planner.generate(input, context);
  const review = await reviewer.check(plan);
  const risk = await security.analyze(plan);
  const execution = await devops.prepare(plan);
  return { plan, review, risk, execution };
}
module.exports = { runAgents };
