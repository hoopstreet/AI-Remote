function groupExecution(tasks) {
  const groups = [];
  const executed = new Set(); // Keep track of tasks that have been grouped
  let remainingTasks = [...tasks];

  while (remainingTasks.length > 0) {
    const currentGroup = [];
    const nextRemaining = [];

    remainingTasks.forEach(task => {
      // A task can run if all its dependencies have been executed (or are not in the current set of remaining tasks)
      const canRun = task.dependsOn.every(depId => executed.has(depId));
      
      if (canRun) {
        currentGroup.push(task);
      } else {
        nextRemaining.push(task);
      }
    });

    if (currentGroup.length === 0 && nextRemaining.length > 0) {
      // This indicates a cycle or a logical error if tasks remain but none can run
      console.warn("Warning: No tasks could be added to the current group, but tasks remain. Possible cycle or unresolvable dependency.");
      // To prevent infinite loops in case of unresolvable dependencies, break or handle error
      break;
    }

    currentGroup.forEach(task => executed.add(task.id));
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    remainingTasks = nextRemaining;
  }

  return groups;
}

module.exports = { groupExecution };
