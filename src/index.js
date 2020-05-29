import eventHandler from './eventHandlers.js'
import ProjectFactory from './projectController'

//when user clicks on menu button
// show/hide the menu +
// view all created projects
    // Load projects
//     check localStorage
//     IF localProject is available, load projects
//     IF not, load default tutorial project
// - on click redirect to the project
// 1. when the project title is clicked, load all its tasks
// - edit button
// 1. when the edit button is clicked, display text field with the project name and a save button
// 2. cancel on lose focus

// updateProjectView
// add existing projects to the project panel

// #### Storage
// WHEN the page is first loaded, check localStorage
//     IF localStorage is populated, get projects and tasks from it
//     IF localStorage is empty, return false