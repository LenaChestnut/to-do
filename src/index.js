import eventHandler from './eventHandlers.js'
import ProjectFactory from './projectController.js'
import TaskFactory from './taskController.js'

PubSub.publish('Change active project', {
    projectIndex: 0,
});