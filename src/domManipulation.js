import PubSub from 'pubsub-js'
import { getProjects } from './storage.js'
import { createButton } from './formController.js'
import { currentProject } from './eventHandlers.js'

export const elements = {
    container: document.getElementById("container"),
    menuBtn: document.querySelector('.menu-btn'),
    menuPanel: document.createElement('div'),
    projectList: document.createElement('ul'),
    newProjectBtn: document.createElement('button'),
    taskList: document.createElement('div'),
    newTaskBtn: document.createElement('button'),
    overlay: document.createElement('div'),
};

elements.menuPanel.classList.add('menu-panel');
elements.projectList.classList.add('projects-container');
elements.newProjectBtn.classList.add('new-project-btn');
elements.overlay.classList.add('overlay');
elements.taskList.classList.add('task-list');
elements.newTaskBtn.classList.add('new-task-btn');

// MENU PANEL

export function toggleMenuPanel() {
    if (isMenuOpen()) {
        hideMenuPanel();
    } else {
        loadMenuPanel();
    }
}

export function isMenuOpen() {
    if (elements.container.contains(elements.menuPanel)) {
        return true;
    }
}

function loadMenuPanel() {
    elements.container.appendChild(elements.menuPanel);
    elements.menuPanel.appendChild(elements.projectList);
    updateProjectList();
    elements.newProjectBtn.innerHTML = '<p><img src="../dist/assets/plus.svg">New project</p>';
    elements.newProjectBtn.style.display = 'block';
    elements.menuPanel.appendChild(elements.newProjectBtn);
}

function hideMenuPanel() {
    elements.menuPanel.animate([
        { transform: 'translateX(0px)' },
        { transform: 'translateX(-305px)' },
    ], {
        duration: 300,
        easing: 'ease-in',
    });
    setTimeout(() => {
        removeNode(elements.menuPanel);
    }, 300);
}

// TASK VIEW

export function loadTaskView(requestedTasks) {
    elements.taskList.innerHTML = '';
    appendTaskCards(requestedTasks);
    elements.newTaskBtn.innerHTML = '<p><img src="../dist/assets/plus.svg">New task</p>';
    elements.newTaskBtn.style.display = 'block';
    elements.taskList.appendChild(elements.newTaskBtn);
    elements.container.appendChild(elements.taskList);
}

function appendTaskCards(requestedTasks) {
    requestedTasks.forEach((task) => {buildTaskCard(task)});
}

function buildTaskCard(task) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
  
    const taskContainer = document.createElement('div');
  
    const taskInfo = document.createElement('div');
    taskInfo.classList.add('task-info-container');
  
    if (task.priority === 1) {
        cardContainer.classList.add('high-priority');
    } else if (task.priority === 2) {
        cardContainer.classList.add('medium-priority');
    } else if (task.priority === 3) {
        cardContainer.classList.add('low-priority');
    }

    const expandBtn = createButton('button', '../dist/assets/chevron-down.svg', '', 'expand-btn');
    taskCard.appendChild(expandBtn);
  
    const taskTitle = document.createElement('p');
    taskTitle.textContent = task.title;
    taskContainer.appendChild(taskTitle);
  
    const taskDate = document.createElement('p');
    taskDate.textContent = 'Due: ' + task.dueDate;
    taskDate.classList.add('task-info');
    taskInfo.appendChild(taskDate);
  
    taskContainer.appendChild(taskInfo);
    taskCard.appendChild(taskContainer);
  
    const checkId = task.title.replace(/\s/g, '-').toLowerCase();
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', `checkbox`);
    checkbox.setAttribute('id', `${checkId}`);
    taskCard.appendChild(checkbox);
    const label = document.createElement('label');
    label.setAttribute('for', `${checkId}`);
    taskCard.appendChild(label);

    cardContainer.appendChild(taskCard);
    elements.taskList.appendChild(cardContainer);

    PubSub.publish('Load task card', {
        card: cardContainer,
        expandBtn: expandBtn,
        checkbox: checkbox,
        task: task,
    });
}

export function expandTaskCard(task, card) {
    const expandedInfoContainer = document.createElement('div');
    expandedInfoContainer.classList.add('expanded-info-container');

    const description = document.createElement('p');
    description.textContent = task.description;
    expandedInfoContainer.appendChild(description);

    const project = document.createElement('p');
    project.classList.add('task-project-info');
    project.textContent = task.project;
    expandedInfoContainer.appendChild(project);

    const editTask = document.createElement('button');
    editTask.classList.add('edit');
    editTask.textContent = 'Edit task';
    expandedInfoContainer.appendChild(editTask);

    card.appendChild(expandedInfoContainer);

    PubSub.publish('Task expanded', {
        editButton: editTask,
        task: task,
    });
}

export function collapseTaskCard(card) {
    card.removeChild(card.lastChild);
}

export function changeToCollapse(button) {
    button.setAttribute('class', 'collapse-btn');
}

export function changeToExpand(button) {
    button.setAttribute('class', 'expand-btn');
}

// PROJECTS VIEW

function appendProjectCards() {
    const projects = getProjects();
    for (let i = 0; i < projects.length; i++) {
        projectCardModule.buildCard(projects[i].name);
    }
    let projectCards = projectCardModule.getProjectCards();
    projectCards[currentProject].classList.add('selected-project');
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
        editButton.classList.add("edit");
        const editIcon = document.createElement('img');
        editIcon.setAttribute('src', '../dist/assets/edit.svg');
        editIcon.setAttribute('alt', 'Edit');
        editButton.appendChild(editIcon);

        const removeButton = document.createElement('button');
        removeButton.classList.add("remove");
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

export function showOverlay() {
    elements.container.appendChild(elements.overlay);
    elements.overlay.animate([
        { backgroundColor: 'rgba(0, 0, 0, 0)' },
        { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    ], {
        duration: 150,
    });
}

export function hideOverlay() {
    elements.overlay.animate([
        { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        { backgroundColor: 'rgba(0, 0, 0, 0)' },
    ], {
        duration: 150,
    });
    setTimeout(() => { 
        removeNode(elements.overlay);
    }, 150);
}