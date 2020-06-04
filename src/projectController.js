const ProjectFactory = (projectName) => {
    const name = projectName;
    const tasks = [];
  
    // function getName() {
    //     return name;
    // }

    // function editName(newProjectName) {
    //     name = newProjectName;
    // }

    // function addTask(newTask) {
    //     tasks.push(newTask);
    // }
  
    // function getTasks() {
    //     return tasks;
    // }

    // function removeTask(task) {
    //     const i = tasks.indexOf(task);
    //     tasks.splice(i, 0);
    // }
  
    return {
        name,
        tasks,
    }
}

export default ProjectFactory
