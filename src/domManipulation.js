import PubSub from 'pubsub-js'
import { getProjects } from './storage.js'

export const elements = {
    container: document.getElementById("container"),
    menuBtn: document.querySelector('.menu-btn'),
    menuPanel: document.createElement('div'),
    projectList: document.createElement('ul'),
};

elements.menuPanel.classList.add('menu-panel');
elements.projectList.classList.add('projects-container');

export function toggleMenuPanel() {
    if (isMenuOpen()) {
        hideMenuPanel();
    } else {
        loadMenuPanel();
    }
}

function isMenuOpen() {
    if (elements.container.contains(elements.menuPanel)) {

        return true;
    }
}

function loadMenuPanel() {
    elements.container.appendChild(elements.menuPanel);
    elements.menuPanel.appendChild(elements.projectList);
    appendProjectCards();
}

function hideMenuPanel() {
    clearProjectList();
    elements.menuPanel.remove();
}

function appendProjectCards() {
    const projects = getProjects();
    for (let i = 0; i < projects.length; i++) {
        projectCardModule.buildCard(projects[i]);
    }
    PubSub.publish("View projects");
}

export const projectCardModule = (() => {
    function buildCard(project) {
        const projectCard = document.createElement('li');
        projectCard.classList.add('project-card');

        const projectName = document.createElement('p');
        projectName.textContent = project;
        projectCard.appendChild(projectName);

        const editButton = document.createElement('button');
        editButton.classList.add("edit-btn")
        editButton.textContent = "Edit";

        const removeButton = document.createElement('button');
        removeButton.classList.add("remove-btn")
        removeButton.textContent = "Remove";

        projectCard.appendChild(editButton);
        projectCard.appendChild(removeButton);

        elements.projectList.appendChild(projectCard);
    }

    function getProjectCard() {
        const projectCards = document.querySelectorAll(".project-card");
        return projectCards;
    }

    return {
        buildCard,
        getProjectCard,
    }
})();

function clearProjectList() {
    while (elements.projectList.firstChild) {
        elements.projectList.removeChild(elements.projectList.firstChild);
    }
}
