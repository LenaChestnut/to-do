import PubSub from 'pubsub-js'
import { getProjects, getAllTasks } from './storage.js'

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

function isMenuOpen() {
    if (elements.container.contains(elements.menuPanel)) {
        return true;
    }
}

function loadMenuPanel() {
    elements.container.appendChild(elements.menuPanel);
    elements.menuPanel.appendChild(elements.projectList);
    appendProjectCards();
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
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
  
    const taskContainer = document.createElement('div');
  
    const taskInfo = document.createElement('div');
    taskInfo.classList.add('task-info-container');
  
    if (task.priority.toLowerCase() === 'high') {
        taskCard.classList.add('high-priority');
    } else if (task.priority.toLowerCase() === 'medium') {
        taskCard.classList.add('medium-priority');
    } else if (task.priority.toLowerCase() === 'low') {
        taskCard.classList.add('low-priority');
    }
  
    const expandBtn = document.createElement('button');
    expandBtn.innerHTML = '<img src="../dist/assets/chevron-down.svg" alt="Expand">'
    expandBtn.setAttribute('type', 'button');
    expandBtn.classList.add('expand-btn');
    taskCard.appendChild(expandBtn);
  
    const taskTitle = document.createElement('p');
    taskTitle.textContent = task.title;
    taskContainer.appendChild(taskTitle);
  
    const taskDate = document.createElement('p');
    taskDate.textContent = 'Due: ' + task.dueDate;
    taskDate.classList.add('task-info');
    taskInfo.appendChild(taskDate);
  
    let numOfSubtasks = task.subTasks.length;
    if (numOfSubtasks > 0) {
        const subTasksInfo = document.createElement('p');
        subTasksInfo.textContent = numOfSubtasks + ' subtask';
        if (numOfSubtasks !== 1) {
        subTasksInfo.textContent = subTasksInfo.textContent + 's';
        }
        subTasksInfo.classList.add('task-info');
        taskInfo.appendChild(subTasksInfo);
    }
  
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
  
    elements.taskList.appendChild(taskCard);
    elements.taskList.appendChild(taskCard);

    PubSub.publish('Load task card', {
        taskCard: taskCard,
        expandBtn: expandBtn,
        checkbox: checkbox,
        task: task,
    });
}

export function expandTaskCard(task) {
    alert(task.title + ' ' + task.description + ' ' + task.project);
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
}