import ProjectFactory from './projectController.js'
// import { loadTaskView } from './domManipulation.js'
import TaskFactory from './taskController.js'
import { getFormInput } from './formController.js'

(function loadAllTasks() {
    if (!localStorage.length) {
        const general = ProjectFactory('All tasks');
        addProject(general);
    }
})();

function updateStorage(projectsArr) {
    localStorage.setItem('projects', JSON.stringify(projectsArr));
    PubSub.publish('Update storage');
}

// PROJECTS

export function getProjects() {
    let projects = JSON.parse(localStorage.getItem('projects'));
    if (!projects) {
        projects = [];
    }
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
    let currentProject = storedProjects.find((project) => {
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
    editedProject.tasks.forEach((task) => {
        task.project = editedProject.name;
    });
    updateStorage(storedProjects);
}

export function removeProject(projectIndex) {
    let storedProjects = getProjects();
    storedProjects.splice(projectIndex, 1);
    PubSub.publish('Change active project', {
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
    if (index === 0) {
        let allTasks = getAllTasks();
        return allTasks;
    }
    const currentProject = getProjectAtIndex(index);
    return currentProject.tasks;
}

export function addTask(task, project) {
    let storedProjects = getProjects();
    let currentProject = storedProjects.find(nextProject => nextProject.name === project);
    currentProject.tasks.push(task);
    updateStorage(storedProjects);
}

export function editTask(form) {
    // get path to original task and remove it
    const projectRegex = /(?<=^P).*(?=I\d+$)/gm;
    const origProject = form.id.match(projectRegex).join();
    const indexRegex = /(?<=I)\d+$/gm;
    const origTaskIndex = Number(form.id.match(indexRegex).join());
    removeTask(origProject, origTaskIndex);
    // create new task with the same index
    const input = getFormInput(form.name);
    const editedTask = TaskFactory(input.title, input.description, input.project, input.priority, input.date, origTaskIndex);
    addTask(editedTask, input.project);
}

export function removeTask(projectName, removedTaskIndex) {
    let storedProjects = getProjects();
    let currentProject = storedProjects.find(nextProject => nextProject.name === projectName);
    let index = currentProject.tasks.findIndex((task) => task.index === removedTaskIndex);
    currentProject.tasks.splice(index, 1);
    updateStorage(storedProjects);
}