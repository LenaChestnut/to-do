import { addProject, editProject, getProjectAtIndex } from './storage.js'
import { elements, hideOverlay, removeNode, showElement } from './domManipulation.js'
import ProjectFactory from './projectController.js';

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

function createButton(type, source, text, btnClass) {
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
    }
}

export function changeSaveButtonState(form) {
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
            removeNode(elements.overlay);
            removeNode(form);
        }, 150);
    }
}

export function handleCancel(form) {
    let formName = form.name;
    if (formName === 'project-form') {
        removeNode(form);
        showElement(elements.newProjectBtn);
    } else if (formName === 'edit-project') {
        hideOverlay();
        setTimeout(() => { 
            removeNode(elements.overlay);
            removeNode(form);
        }, 150);
    }
}