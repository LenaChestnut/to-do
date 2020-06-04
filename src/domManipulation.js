import PubSub from 'pubsub-js'
import { getProjects } from './storage.js'

export const elements = {
    container: document.getElementById("container"),
    menuBtn: document.querySelector('.menu-btn'),
    menuPanel: document.createElement('div'),
    projectList: document.createElement('ul'),
    newProjectBtn: document.createElement('button'),
};

elements.menuPanel.classList.add('menu-panel');
elements.projectList.classList.add('projects-container');
elements.newProjectBtn.classList.add('new-project-btn');

// MENU PANEL

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
    elements.newProjectBtn.textContent = '+ New project';
    elements.newProjectBtn.style.display = 'block';
    elements.menuPanel.appendChild(elements.newProjectBtn);
}

function hideMenuPanel() {
    elements.menuPanel.animate([
        { transform: 'translateX(0px)' },
        { transform: 'translateX(-305px)' },
    ], {
        duration: 300,
    });
    setTimeout(() => {
        removeNode(elements.menuPanel);
    }, 300);
}

// PROJECT CARDS

function appendProjectCards() {
    const projects = getProjects();
    for (let i = 0; i < projects.length; i++) {
        projectCardModule.buildCard(projects[i].name);
    }
    PubSub.publish("View projects");
}

export function updateProjectList() {
    elements.projectList.innerHTML = "";
    appendProjectCards();
}

export const projectCardModule = (() => {
    function buildCard(project) {
        const projectCard = document.createElement('li');
        projectCard.classList.add('project-card');

        const projectName = document.createElement('p');
        projectName.textContent = project;
        projectCard.appendChild(projectName);

        const editButton = document.createElement('button');
        editButton.classList.add("edit-btn");
        const editIcon = document.createElement('img');
        editIcon.setAttribute('src', '../dist/assets/edit.svg');
        editIcon.setAttribute('alt', 'Edit');
        editButton.appendChild(editIcon);

        const removeButton = document.createElement('button');
        removeButton.classList.add("remove-btn");
        const removeIcon = document.createElement('img');
        removeIcon.setAttribute('src', '../dist/assets/trash.svg');
        removeIcon.setAttribute('alt', 'remove');
        removeButton.appendChild(removeIcon);

        projectCard.appendChild(editButton);
        projectCard.appendChild(removeButton);

        elements.projectList.appendChild(projectCard);
    }

    // get cards for event listeners assignment
    function getProjectCards() {
        const projectCards = document.querySelectorAll(".project-card");
        return projectCards;
    }

    return {
        buildCard,
        getProjectCards,
    }
})();

// GENERAL

export function removeNode(node) {
    while (node.firstChild) {
        removeNode(node.firstChild);
    }
    node.remove();
}

export function hideElement(element) {
    element.style.display = 'none';
}

export function showElement(element) {
    element.style.display = 'block';
}