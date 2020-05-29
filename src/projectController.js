const ProjectFactory = (projectName) => {
    let name = projectName;
    const tasks = [];
  
    function getName() {
        return name;
    }

    function editName(newProjectName) {
        name = newProjectName;
    }

    function addTask(newTask) {
        tasks.push(newTask);
    }
  
    function getTasks() {
        return tasks;
    }

    function removeTask(task) {
        const i = tasks.indexOf(task);
        tasks.splice(i, 0);
    }
  
    return {
        getName,
        addTask,
        getTasks,
        editName,
        removeTask,
    }
}

export default ProjectFactory
