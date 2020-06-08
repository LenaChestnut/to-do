import ProjectFactory from './projectController.js'
import TaskFactory from './taskController.js'

const tutorial = ProjectFactory('Tutorial');

(function loadTutorial() {
    let existingTutorial = getProjectByName('Tutorial');
    if (!existingTutorial.length) {
        const tutorial = ProjectFactory('Tutorial');
        const task1 = TaskFactory('Create new task', 'Create new task in selected project', 'Tutorial', 'Medium', Date.now());
        const task2 = TaskFactory('Complete task', 'Press checkmark to complete the task', 'Tutorial', 'Low', Date.now());
        tutorial.tasks = [task1, task2];
        addProject(tutorial);
    }
})();

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

export function getProjectByName(projectName) {
    let storedProjects = getProjects();
    let currentProject = storedProjects.filter((project) => {
        if (project.name === projectName) {
            return project;
        }
    });
    return currentProject;
}

export function editProject(index, newName) {
    let storedProjects = getProjects();
    let editedProject = storedProjects[index];
    editedProject.name = newName;
    updateStorage(storedProjects);
}

export function removeProject(projectIndex) {
    let storedProjects = getProjects();
    let index = projectIndex;
    storedProjects.splice(index, 1);
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