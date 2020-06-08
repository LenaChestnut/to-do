import eventHandler from './eventHandlers.js'
import ProjectFactory from './projectController.js'
import TaskFactory from './taskController.js'
import { loadTaskView } from './domManipulation.js'
import { getAllTasks } from './storage.js'

const tasks = getAllTasks();
loadTaskView(tasks);