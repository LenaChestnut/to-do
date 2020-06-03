import { elements, toggleMenuPanel, projectCardModule, removeNode, hideElement, showElement } from './domManipulation.js'
import { createProjectForm, getFormInput, validateInput, getSaveButton } from './formController.js';
import PubSub from 'pubsub-js'
import ProjectFactory from './projectController.js';
import { getProjects } from './storage.js'

const eventHandler = (() => {
    elements.menuBtn.addEventListener('click', toggleMenuPanel);

    //When project cards are created, assign event listenerss
    PubSub.subscribe("View projects", function() {
        const projectCards = projectCardModule.getProjectCard();

        for (let i = 0; i < projectCards.length; i++) {
            projectCards[i].addEventListener('click', function(e) {
                alert('project clicked');
            });
        }
    });

    elements.newProjectBtn.addEventListener('click', () => {
        hideElement(elements.newProjectBtn);
        createProjectForm(elements.menuPanel, 'project-form');
    });

    PubSub.subscribe('Create form', function() {
        const form = document.querySelector('form');
        form.addEventListener('click', function(e) {
            let target = getEventTarget(e);
            if (target.tagName.toLowerCase() === 'button') {
                let type = getTargetClass(target);
                if (type === 'save') {
                    e.preventDefault();
                    alert(getFormInput(form.name));
                } else if (type === 'cancel') {
                    removeNode(form);
                    showElement(elements.newProjectBtn);
                }
            }
        });

        form.addEventListener('input', function() {
            const saveButton = getSaveButton(form);
            if (validateInput(form)) {
                saveButton.disabled = false;
            } else {
                saveButton.disabled = true;
            }
        });
    });
})();

function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}

function getTargetClass(eventTarget) {
    return eventTarget.getAttribute('class');
}

export default eventHandler