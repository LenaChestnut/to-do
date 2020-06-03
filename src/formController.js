import { elements } from "./domManipulation";

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

export function createProjectForm(container, name) {
    const form = createFormContainer(name);

    const projectNameField = createInput('text', 'project-name');
    projectNameField.setAttribute('placeholder', 'Project name');
    projectNameField.required = true;

    const saveBtn = createButton('submit', '../dist/assets/plus.svg', 'save', 'save');
    const cancelBtn = createButton('reset', '../dist/assets/x.svg', 'cancel', 'cancel');

    form.appendChild(projectNameField);
    form.appendChild(saveBtn);
    form.appendChild(cancelBtn);
    container.appendChild(form);
    PubSub.publish('Create form');
};

// FORM PROCESSING

export function getFormInput(formName) {
    const form = document.forms[`${formName}`];
    if (formName === 'project-form') {
        return form['project-name'].value;
    }
}

export function validateInput(form) {
    const formElements = getFormElements(form);
    const requiredInputs = formElements.filter((item) => (item.required) ? true : false);
    return requiredInputs.every((input) => (input.value !== '') ? true : false);
}

function getFormElements(form) {
    const formElements = Array.from(form.elements);
    return formElements;
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