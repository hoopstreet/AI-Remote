const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const app = express();

app.get("/data", async (req, res) => {
    const drafts = await fs.readJson(path.join(__dirname, "../src/drafts/draftStore.json")).catch(() => ({}));
    res.json(drafts);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "graphView.html"));
});

app.listen(3005, () => console.log("AI CTO Visualizer running on port 3005"));
