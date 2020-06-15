import { elements, toggleMenuPanel, isMenuOpen, projectCardModule, hideElement,
        updateProjectList, showOverlay, expandTaskCard, changeToCollapse, changeToExpand,
        collapseTaskCard, loadTaskView } from './domManipulation.js'
import { createProjectForm, createTaskForm, changeSaveButtonState, handleCancel, handleSubmit } from './formController.js';
import PubSub from 'pubsub-js'
import { removeProject, getProjectTasks, removeTask } from './storage.js'

const eventHandler = (() => {
    elements.menuBtn.addEventListener('click', toggleMenuPanel);

    // PROJECT MENU EVENTS
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
                    // Load project tasks if the card is clicked
                    const currentProjectTasks = getProjectTasks(i);
                    loadTaskView(currentProjectTasks);
                    projectCards.forEach((project) => {project.classList.remove('selected-project')});
                    projectCards[i].classList.add('selected-project');
                    // store info about current project in case changes are made and the page is updated
                    PubSub.publish('Active project', {
                        projectIndex: i,
                    });
                }
            });
        }
    });

    // Update projects (if open) and task view when changes are made to existing data
    PubSub.subscribe('Update storage', function() {
        if (isMenuOpen()) {
            updateProjectList();
        }
        loadTaskView(getProjectTasks(currentProject));
    });

    // FORM EVENTS
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

    // TASK VIEW EVENTS
    elements.newTaskBtn.addEventListener('click', () => {
        showOverlay();
        setTimeout(() => {
            createTaskForm(elements.container, 'new-task');
        }, 150);
    });

    // Assign events to controls of newly created task card
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
        data.checkbox.addEventListener('click', function() {
            removeTask(data.task.project, data.task.index);
        });
    });

    PubSub.subscribe('Task expanded', function(tag, data) {
        data.editButton.addEventListener('click', function() {
            showOverlay();
            setTimeout(() => {
                createTaskForm(elements.container, 'edit-task', data.task);
            }, 150);
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

export let currentProject = 0;

PubSub.subscribe('Active project', function(tag, data) {
    currentProject = data.projectIndex;
});

export default eventHandler