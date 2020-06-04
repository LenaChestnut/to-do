import ProjectFactory from './projectController.js'

const tutorial = ProjectFactory('Tutorial');

export function getProjects() {
    let projects = localStorage.getItem('projects');
    projects = projects ? JSON.parse(projects) : [tutorial];
    return projects;
}

export function addProject(newProject) {
    let storedProjects = localStorage.getItem('projects');
    storedProjects = storedProjects ? JSON.parse(storedProjects) : [];
    storedProjects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(storedProjects));
    PubSub.publish('Update storage');
}