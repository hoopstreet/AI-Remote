const fs = require("fs-extra");
const path = require("path");

const SYSTEM_PATTERNS_PATH = path.join(__dirname, "system-patterns.json");
const FAILURE_CLUSTERS_PATH = path.join(__dirname, "failure-clusters.json");
const REDESIGN_PROPOSALS_PATH = path.join(__dirname, "redesign-proposals.json");

async function loadSystemPatterns() {
  return await fs.readJson(SYSTEM_PATTERNS_PATH).catch(() => ({}));
}

async function saveSystemPatterns(data) {
  await fs.writeJson(SYSTEM_PATTERNS_PATH, data, { spaces: 2 });
}

async function loadFailureClusters() {
  return await fs.readJson(FAILURE_CLUSTERS_PATH).catch(() => ({}));
}

async function saveFailureClusters(data) {
  await fs.writeJson(FAILURE_CLUSTERS_PATH, data, { spaces: 2 });
}

async function loadRedesignProposals() {
  return await fs.readJson(REDESIGN_PROPOSALS_PATH).catch(() => ({}));
}

async function saveRedesignProposals(data) {
  await fs.writeJson(REDESIGN_PROPOSALS_PATH, data, { spaces: 2 });
}

module.exports = {
  loadSystemPatterns,
  saveSystemPatterns,
  loadFailureClusters,
  saveFailureClusters,
  loadRedesignProposals,
  saveRedesignProposals,
};
