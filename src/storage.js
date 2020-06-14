import ProjectFactory from './projectController.js'

const tutorial = ProjectFactory('Tutorial');

// (function loadTutorial() {
//     let existingTutorial = getProjectByName('Tutorial');
//     if (!existingTutorial.length) {
//         const tutorial = ProjectFactory('Tutorial');
//         const task1 = TaskFactory('Create new task', 'Create new task in selected project', 'Tutorial', 2, Date.now());
//         const task2 = TaskFactory('Complete task', 'Press checkmark to complete the task', 'Tutorial', 3, Date.now());
//         task1.subTasks = ['Do first thing', 'Do second thing'];
//         tutorial.tasks = [task1, task2];
//         addProject(tutorial);
//     }
// })();

function updateStorage(projectsArr) {
    localStorage.setItem('projects', JSON.stringify(projectsArr));
    PubSub.publish('Update storage');
}

// PROJECTS

export function getProjects() {
    const projects = JSON.parse(localStorage.getItem('projects'));
    return projects;
}

export function addProject(newProject) {
    let storedProjects = getProjects();
    storedProjects.push(newProject);
    updateStorage(storedProjects);
}

export function getProjectAtIndex(index) {
    let storedProjects = getProjects();
    let currentProject = storedProjects[index];
    return currentProject;
}

// export function getProjectByName(projectName) {
//     let storedProjects = getProjects();
//     let currentProject = storedProjects.find((project) => {
//         if (project.name === projectName) {
//             return project;
//         }
//     });
//     return currentProject;
// }

export function editProject(index, newName) {
    let storedProjects = getProjects();
    let editedProject = storedProjects[index];
    editedProject.name = newName;
    editedProject.tasks.forEach((task) => {
        task.project = editedProject.name;
    });
    updateStorage(storedProjects);
}

export function removeProject(projectIndex) {
    let storedProjects = getProjects();
    storedProjects.splice(projectIndex, 1);
    PubSub.publish('Active project', {
        projectIndex: 0,
    })
    updateStorage(storedProjects);
}

// TASKS

export function getAllTasks() {
    let storedProjects = getProjects();
    let storedTasks = [];
    storedProjects.map((project) => {
        project.tasks.forEach((task) => {
            storedTasks.push(task);
        });
    });
    return storedTasks;
};

export function getProjectTasks(index) {
    const currentProject = getProjectAtIndex(index);
    return currentProject.tasks;
}

export function addTask(task, project) {
    let storedProjects = getProjects();
    let currentProject = storedProjects.find(nextProject => nextProject.name === project);
    currentProject.tasks.push(task);
    updateStorage(storedProjects);
}

export function removeTask(projectName, removedTask) {
    let storedProjects = getProjects();
    let currentProject = storedProjects.find(nextProject => nextProject.name === projectName);
    let index = currentProject.tasks.findIndex((task) => task.title === removedTask.title);
    currentProject.tasks.splice(index, 1);
    updateStorage(storedProjects);
}