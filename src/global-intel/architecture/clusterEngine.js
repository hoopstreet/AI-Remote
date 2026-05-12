function clusterFailures(failures) {
    const clusters = {};
    failures.forEach(f => {
        const key = f.taskType || "GENERAL";
        if (!clusters[key]) clusters[key] = [];
        clusters[key].push(f);
    });
    return clusters;
}

function detectSystemicIssues(clusters, threshold = 3) {
    return Object.keys(clusters)
        .filter(key => clusters[key].length >= threshold)
        .map(key => ({
            issue: key,
            count: clusters[key].length,
            recommendation: `Architectural refactor needed for ${key} layer.`
        }));
}

module.exports = { clusterFailures, detectSystemicIssues };
