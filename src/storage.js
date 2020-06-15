import ProjectFactory from './projectController.js'
import { loadTaskView } from './domManipulation.js'

(function loadTutorial() {
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

export function editTask(task, project) {
    //get projects
    //get current project
    //find index of the task in current project
    //update info in the task
    //update storage
}

export function removeTask(projectName, removedTaskIndex) {
    let storedProjects = getProjects();
    let currentProject = storedProjects.find(nextProject => nextProject.name === projectName);
    let index = currentProject.tasks.findIndex((task) => task.index === removedTaskIndex);
    currentProject.tasks.splice(index, 1);
    updateStorage(storedProjects);
}