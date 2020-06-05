import ProjectFactory from './projectController.js'

const tutorial = ProjectFactory('Tutorial');

export function getProjects() {
    let projects = localStorage.getItem('projects');
    projects = projects ? JSON.parse(projects) : [tutorial];
    return projects;
}

export function getProjectAtIndex(index) {
    let storedProjects = getProjects();
    let currentProject = storedProjects[index];
    return currentProject;
}

export function addProject(newProject) {
    let storedProjects = getProjects();
    storedProjects.push(newProject);
    updateStorage(storedProjects);
}


export function removeProject(projectIndex) {
    let storedProjects = getProjects();
    let index = projectIndex;
    storedProjects.splice(index, 1);
    updateStorage(storedProjects);
}

function updateStorage(projectsArr) {
    localStorage.setItem('projects', JSON.stringify(projectsArr));
    PubSub.publish('Update storage');
}