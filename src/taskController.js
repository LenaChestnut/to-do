const TaskFactory = (taskTitle, taskDescr, taskProject, taskPriority, taskDate, taskIndex = null) => {
    const title = taskTitle;
    const description = taskDescr;
    const project = taskProject;
    const priority = Number(taskPriority);
    const dueDate = taskDate;
    const index = taskIndex || Date.now();

    return {
        title,
        description,
        project,
        priority,
        dueDate,
        index,
    }
}

export default TaskFactory