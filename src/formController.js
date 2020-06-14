import { addProject, editProject, getProjectAtIndex, getProjects, addTask } from './storage.js'
import { elements, hideOverlay, removeNode, showElement } from './domManipulation.js'
import ProjectFactory from './projectController.js'
import TaskFactory from './taskController.js'
import { format } from 'date-fns'
import { currentProject } from './eventHandlers.js'

// BASIC FORM ELEMENTS
function createFormContainer(name) {
    const form = document.createElement('form');
    form.setAttribute('name', `${name}`);
    return form;
}

function createInput(type, name) {
    const input = document.createElement('input');
    input.setAttribute('type', `${type}`);
    input.setAttribute('name', `${name}`)
    return input;
}

function createSelect(selectName) {
    const select = document.createElement('select');
    select.name = selectName;
    select.required = true;

    if (selectName === 'project-select') {
        const projects = getProjects();
        for (let i = 0; i < projects.length; i++) {
            const option = document.createElement('option');
            option.textContent = projects[i].name;
            option.value = projects[i].name;
    
            if (currentProject === i) {
                option.selected = true;
            }
    
            select.appendChild(option);
        }
    }   else if (selectName === 'priority-select') {
        for (let j = 3; j >= 1; j--) {
            const option = document.createElement('option');
            option.value = j;
            option.textContent = (j === 1) ? 'High priority'
                                :(j === 2) ? 'Medium priority'
                                :'Low priority';
            select.appendChild(option);
        }
    }

    return select;
}

export function createButton(type, source, text, btnClass) {
    const button = document.createElement('button');
    button.setAttribute('type', `${type}`);
    const icon = document.createElement('img');
    button.setAttribute('class', `${btnClass}`);
    icon.setAttribute('src', `${source}`);
    icon.setAttribute('alt', `${text}`);

    if (type === 'submit') {
        button.disabled = true;
    }

    button.appendChild(icon);
    return button;
}

// FORM TYPES
export function createProjectForm(container, name, index = null) {
    const form = createFormContainer(name);

    const projectNameField = createInput('text', 'project-name');
    projectNameField.setAttribute('placeholder', 'Project name');
    projectNameField.required = true;

    const saveBtn = createButton('submit', '../dist/assets/plus.svg', 'save', 'save');
    const cancelBtn = createButton('reset', '../dist/assets/x.svg', 'cancel', 'cancel');

    if (name === 'edit-project') {
        form.setAttribute('id', index);
        const formTitle = document.createElement('h2');
        formTitle.textContent = "Edit project";
        form.appendChild(formTitle);

        let project = getProjectAtIndex(index);
        projectNameField.value = project.name;
    }

    form.appendChild(projectNameField);
    form.appendChild(saveBtn);
    form.appendChild(cancelBtn);
    container.appendChild(form);
    PubSub.publish('Create form', {
        form: form,
    });
};

export function createTaskForm(container, name, index = null) {
    const form = createFormContainer(name);
    form.classList.add('task-form');

    if (name === 'edit-task') {
        form.setAttribute('id', index);
        const formTitle = document.createElement('h2');
        formTitle.textContent = "Edit task";
        form.appendChild(formTitle);
        // let project = getProjectAtIndex(index);
        // projectNameField.value = project.name;
    } else if (name === 'new-task') {
        const formTitle = document.createElement('h2');
        formTitle.textContent = "New task";
        form.appendChild(formTitle);
    }

    const taskTitleField = createInput('text', 'task-title');
    taskTitleField.setAttribute('placeholder', 'Task title');
    taskTitleField.required = true;

    const taskDescription = document.createElement('textarea');
    taskDescription.name = 'task-description';
    taskDescription.setAttribute('placeholder', 'Task description');
    taskDescription.required = true;

    const projectLabel = document.createElement('p');
    projectLabel.textContent = 'Project';
    const projectSelect = createSelect('project-select');
    const priorityLabel = document.createElement('p');
    priorityLabel.textContent = 'Priority';
    const prioritySelect = createSelect('priority-select');

    const dueDate = createInput('date', 'due-date');
    dueDate.setAttribute('min', format(Date.now(), "yyyy-MM-dd"));
    dueDate.setAttribute('value', format(Date.now(), "yyyy-MM-dd"));
    dueDate.required = true;

    const saveBtn = createButton('submit', '../dist/assets/plus.svg', 'save', 'save');
    const cancelBtn = createButton('reset', '../dist/assets/x.svg', 'cancel', 'cancel');

    form.appendChild(taskTitleField);
    form.appendChild(taskDescription);
    form.appendChild(projectLabel);
    form.appendChild(projectSelect);
    form.appendChild(priorityLabel);
    form.appendChild(prioritySelect);
    form.appendChild(dueDate);

    form.appendChild(saveBtn);
    form.appendChild(cancelBtn);

    container.appendChild(form);
    PubSub.publish('Create form', {
        form: form,
    });
}

// FORM PROCESSING

export function validateInput(form) {
    const formElements = getFormElements(form);
    const requiredInputs = formElements.filter((item) => (item.required) ? true : false);
    return requiredInputs.every((input) => (input.value !== '') ? true : false);
}

function getFormElements(form) {
    const formElements = Array.from(form.elements);
    return formElements;
}

export function getFormInput(formName) {
    const form = document.forms[`${formName}`];
    if (formName === 'project-form' || formName === 'edit-project') {
        return form['project-name'].value;
    } else if (formName === 'new-task') {
        return {
            title: form['task-title'].value,
            description: form['task-description'].value,
            project: form['project-select'].value,
            priority: form['priority-select'].value,
            date: form['due-date'].value,
        }
    }
}

export function changeSaveButtonState(form) {
    //disable or enable save button depending on filled out required form fields
    const saveButton = getSaveButton(form);
    if (validateInput(form)) {
        saveButton.disabled = false;
    } else {
        saveButton.disabled = true;
    }
}

export function getSaveButton(form) {
    const formElements = getFormElements(form);
    const saveBtnArr = formElements.filter((item) => {
        if (item.type === 'submit') {
            return item;
        }
    });
    const saveBtn = saveBtnArr[0];
    return saveBtn;
}

export function handleSubmit(form) {
    let formName = form.name;
    if (formName === 'project-form') {
        const projectName = getFormInput(formName);
        const project = ProjectFactory(projectName);
        addProject(project);
        form.reset();
        changeSaveButtonState(form);
    } else if (formName === 'edit-project') {
        const projectName = getFormInput(formName);
        const projectIndex = Number(form.id);
        editProject(projectIndex, projectName);
        hideOverlay();
        setTimeout(() => { 
            removeNode(form);
        }, 150);
    } else if (formName === 'new-task') {
        const input = getFormInput(formName);
        const task = TaskFactory(input.title, input.description, input.project, input.priority, input.date);
        addTask(task, input.project);
        hideOverlay();
        setTimeout(() => { 
            removeNode(form);
        }, 150);
    }
}

export function handleCancel(form) {
    let formName = form.name;
    if (formName === 'project-form') {
        removeNode(form);
        showElement(elements.newProjectBtn);
    } else if (formName === 'edit-project' || formName === 'new-task' || formName === 'edit-task') {
        hideOverlay();
        setTimeout(() => { 
            removeNode(form);
        }, 150);
    }
}