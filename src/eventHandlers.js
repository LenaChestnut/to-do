import { elements, toggleMenuPanel, projectCardModule, hideElement,
        updateProjectList, showOverlay, expandTaskCard, changeToCollapse, changeToExpand,
        collapseTaskCard, loadTaskView } from './domManipulation.js'
import { createProjectForm, changeSaveButtonState, handleCancel, handleSubmit } from './formController.js';
import PubSub from 'pubsub-js'
import { removeProject, getProjectTasks } from './storage.js'

const eventHandler = (() => {
    elements.menuBtn.addEventListener('click', toggleMenuPanel);

    //When project cards are created, assign event listenerss
    PubSub.subscribe("View projects", function() {
        const projectCards = projectCardModule.getProjectCards();

        for (let i = 0; i < projectCards.length; i++) {
            projectCards[i].addEventListener('click', function(e) {
                let target = getEventTarget(e);
                if (target.tagName.toLowerCase() === 'button') {
                    let targetClass = getTargetClass(target);
                    if (targetClass === 'edit') {
                        showOverlay();
                        setTimeout(() => {
                            createProjectForm(elements.container, 'edit-project', i);
                        }, 150);
                    } else if (targetClass === 'remove') {
                        let userConfirm = confirm("Are you sure? You won't be able to cancel this action.")
                        if (userConfirm) {
                            removeProject(i);
                        }
                    }
                } else {
                    const currentProjectTasks = getProjectTasks(i);
                    loadTaskView(currentProjectTasks);
                    projectCards.forEach((project) => {project.classList.remove('selected-project')});
                    projectCards[i].classList.add('selected-project');
                    PubSub.publish('Active project', {
                        projectIndex: i,
                    });
                }
            });
        }
    });

    // Form events

    elements.newProjectBtn.addEventListener('click', () => {
        hideElement(elements.newProjectBtn);
        createProjectForm(elements.menuPanel, 'project-form');
    });

    PubSub.subscribe('Create form', function(tag, data) {
        // tag and data info passed from published event
        const form = data.form;
        form.addEventListener('click', function(e) {
            // process the event based on the type of clicked element
            let target = getEventTarget(e);
            if (target.tagName.toLowerCase() === 'button') {
                let targetClass = getTargetClass(target);
                if (targetClass === 'save') {
                    e.preventDefault();
                    handleSubmit(form);
                } else if (targetClass === 'cancel') {
                    handleCancel(form);
                }
            }
        });

        // disable or enable save button based on filled in required inputs
        form.addEventListener('input', function() {
            changeSaveButtonState(form);
        });
    });

    PubSub.subscribe('Update storage', updateProjectList);

    // TASK VIEW EVENTS
    PubSub.subscribe('Load task card', function(tag, data) {
        let taskExpanded = false;
        data.expandBtn.addEventListener('click', function() {
            if (taskExpanded) {
                taskExpanded = false;
                changeToExpand(data.expandBtn);
                collapseTaskCard(data.card);
            } else {
                taskExpanded = true;
                changeToCollapse(data.expandBtn);
                expandTaskCard(data.task, data.card);
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