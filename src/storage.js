const projects = ["General", "Hobby", "Work"];

export function getProjects() {
    if (localStorage.length) {
        return true;
    } else {
        return projects;
    }
}

function updateStorage(projectName) {
    localStorage.setItem(projectName, JSON.stringify(myLibrary));
}