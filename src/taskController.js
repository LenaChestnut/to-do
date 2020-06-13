import { format, parseISO } from 'date-fns'

const TaskFactory = (taskTitle, taskDescr, taskProject, taskPriority, taskDate) => {
    const title = taskTitle;
    const description = taskDescr;
    const project = taskProject;
    const priority = Number(taskPriority);
    const dueDate = format(parseISO(taskDate), 'MM/dd/yyyy');

    return {
        title,
        description,
        project,
        priority,
        dueDate,
    }
}

export default TaskFactory