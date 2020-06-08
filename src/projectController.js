const ProjectFactory = (projectName) => {
    const name = projectName;
    const tasks = [];
  
    return {
        name,
        tasks,
    }
}

export default ProjectFactory
