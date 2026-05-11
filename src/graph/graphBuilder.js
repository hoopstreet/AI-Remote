function buildGraph(tasks) {
  const graph = {};
  tasks.forEach(task => {
    graph[task.id] = {
      node: task,
      dependsOn: task.dependsOn,
      blockedBy: []
    };
  });

  // Populate blockedBy relationships
  tasks.forEach(task => {
    task.dependsOn.forEach(depId => {
      if (graph[depId]) {
        graph[depId].blockedBy.push(task.id);
      }
    });
  });
  return graph;
}

function getExecutionOrder(tasks) {
  const graph = buildGraph(tasks);
  const visited = new Set();
  const tempStack = new Set(); // To detect cycles
  const result = [];

  function visit(nodeId) {
    if (tempStack.has(nodeId)) {
      throw new Error(`Cycle detected in dependency graph involving task ${nodeId}`);
    }
    if (visited.has(nodeId)) {
      return;
    }

    tempStack.add(nodeId);
    visited.add(nodeId);

    const node = graph[nodeId];
    if (node && node.dependsOn) {
      node.dependsOn.forEach(depId => visit(depId));
    }
    
    result.push(node.node); // Add after all dependencies are processed
    tempStack.delete(nodeId);
  }

  // Iterate over all tasks to ensure all are visited
  tasks.forEach(task => visit(task.id));
  
  return result.reverse(); // Reverse to get correct topological order
}

module.exports = { buildGraph, getExecutionOrder };
