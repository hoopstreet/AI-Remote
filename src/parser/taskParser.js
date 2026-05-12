function parseSelection(aiResponse, selectionString) {
    const tasks = aiResponse.match(/^\d+\..*/gm) || [];
    const indices = selectionString.split(',').map(s => parseInt(s.trim()) - 1);
    return indices.map(i => tasks[i]).filter(Boolean).join('\n');
}

module.exports = { parseSelection };
