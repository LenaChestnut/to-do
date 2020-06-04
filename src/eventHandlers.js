import { elements, toggleMenuPanel, projectCardModule, removeNode, hideElement, showElement,
        updateProjectList } from './domManipulation.js'
import { createProjectForm, getFormInput, changeSaveButtonState } from './formController.js';
import PubSub from 'pubsub-js'
import ProjectFactory from './projectController.js';
import { addProject } from './storage.js'

const eventHandler = (() => {
    elements.menuBtn.addEventListener('click', toggleMenuPanel);

    //When project cards are created, assign event listenerss
    PubSub.subscribe("View projects", function() {
        const projectCards = projectCardModule.getProjectCards();

        for (let i = 0; i < projectCards.length; i++) {
            projectCards[i].addEventListener('click', function(e) {
                alert('project clicked');
            });
        }
    });

    // Form events

    elements.newProjectBtn.addEventListener('click', () => {
        hideElement(elements.newProjectBtn);
        createProjectForm(elements.menuPanel, 'project-form');
    });

    PubSub.subscribe('Create form', function() {
        const form = document.querySelector('form');
        form.addEventListener('click', function(e) {
            // process the event based on the type of clicked element and name of the form
            let target = getEventTarget(e);
            if (target.tagName.toLowerCase() === 'button') {
                let targetClass = getTargetClass(target);
                if (targetClass === 'save') {
                    e.preventDefault();
                    handleSubmit(form);
                } else if (targetClass === 'cancel') {
                    removeNode(form);
                    showElement(elements.newProjectBtn);
                }
            }
        });

        // disable or enable save button based on filled in required inputs
        form.addEventListener('input', function() {
            changeSaveButtonState(form);
        });
    });

    PubSub.subscribe('Update storage', updateProjectList);
})();

function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}

function getTargetClass(eventTarget) {
    return eventTarget.getAttribute('class');
}

function handleSubmit(form) {
    let formName = form.name;
    if (formName === 'project-form') {
        const projectName = getFormInput(formName);
        const project = ProjectFactory(projectName);
        addProject(project);
        form.reset();
        changeSaveButtonState(form);
    }
}

export default eventHandler