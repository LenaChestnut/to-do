import { format } from 'date-fns'

const TaskFactory = (taskTitle, taskDescr, taskProject, taskPriority, taskDate) => {
    const title = taskTitle;
    const description = taskDescr;
    const project = taskProject;
    const priority = taskPriority;
    const dueDate = format(taskDate, 'MM/dd/yyyy');

    return {
        title,
        description,
        project,
        priority,
        dueDate,
    }
}

export default TaskFactory