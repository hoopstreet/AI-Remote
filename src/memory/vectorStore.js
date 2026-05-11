const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const EMBEDDINGS_MODEL = "text-embedding-3-small";

async function embed(text) {
  try {
    const res = await axios.post(
      "https://api.openai.com/v1/embeddings",
      {
        model: EMBEDDINGS_MODEL,
        input: text,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error.response ? error.response.data : error.message);
    throw new Error("Failed to generate embedding.");
  }
}

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);
  if (magnitudeA === 0 || magnitudeB === 0) return 0; // Avoid division by zero
  return dotProduct / (magnitudeA * magnitudeB);
}

async function indexProject(owner, repo) {
  const { loadProjectContext } = require("../core/contextLoader"); // Lazy load to avoid circular dependency
  const projectContext = await loadProjectContext(owner, repo);
  const storePath = path.join(__dirname, `vector-${owner}-${repo}.json`);
  
  let store = [];
  for (const [file, content] of Object.entries(projectContext)) {
    if (content && !content.startsWith("Error reading")) { // Only index if content is valid
      // Split content into chunks if too large
      const chunkSize = 1000; // characters
      for (let i = 0; i < content.length; i += chunkSize) {
        const chunk = content.substring(i, Math.min(i + chunkSize, content.length));
        const vector = await embed(chunk);
        store.push({
          file,
          content: chunk,
          vector,
        });
      }
    }
  }
  await fs.writeJson(storePath, store, { spaces: 2 });
  console.log(`Project ${owner}/${repo} indexed successfully with ${store.length} chunks.`);
}

async function searchContext(query, storePath, topN = 5) {
  try {
    const store = await fs.readJson(storePath);
    if (store.length === 0) return "No context indexed for this project.";

    const queryVector = await embed(query);
    const scoredItems = store.map(item => ({
      ...item,
      score: cosineSimilarity(queryVector, item.vector),
    }));

    scoredItems.sort((a, b) => b.score - a.score);

    return scoredItems.slice(0, topN).map(item => `File: ${item.file}\nContent: ${item.content}`).join("\n\n");
  } catch (error) {
    console.error("Error searching context:", error.message);
    return "Failed to retrieve context.";
  }
}

module.exports = { embed, indexProject, searchContext };
