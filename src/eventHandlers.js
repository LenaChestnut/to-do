import * as DOM from './domManipulation.js'

const eventHandler = (() => {
    DOM.menuBtn.addEventListener('click', DOM.toggleMenuPanel);
})();

export default eventHandler