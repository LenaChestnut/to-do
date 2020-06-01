import { elements, toggleMenuPanel, projectCardModule, createProjectForm } from './domManipulation.js'
import PubSub from 'pubsub-js'
import { getProjects } from './storage.js'

const eventHandler = (() => {
    elements.menuBtn.addEventListener('click', toggleMenuPanel);

    //When project cards are created, assign event listenerss
    PubSub.subscribe("View projects", function() {
        const projectCards = projectCardModule.getProjectCard();

        for (let i = 0; i < projectCards.length; i++) {
            projectCards[i].addEventListener('click', function(e) {
                checkConnect(event);
            });
        }
    });

    elements.newProjectBtn.addEventListener('click', createProjectForm);

    PubSub.subscribe('Create project form', function() {
        const form = document.querySelector('#new-project');
        form.addEventListener('click', function(e) {
            console.log(e.target);
        });
    });
})();

function checkConnect(e) {
    let targetClass = e.target.classList;
    console.log(`${targetClass}`);
}

export default eventHandler