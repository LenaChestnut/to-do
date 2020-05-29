import PubSub from 'pubsub-js'

const projects = ["General", "Hobby", "Work"];

PubSub.subscribe('MENU OPEN', getProjects);

export function getProjects() {
    console.log(projects);
}