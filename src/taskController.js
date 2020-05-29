const TaskFactory = (taskTitle, taskDescr) => {
    let title = taskTitle;
     description = taskDescr;
  
    function getTitle() {
        return title;
    }
  
    function getDescr() {
        return description;
    }

    // function editTask(key, value) {
    //     key = value;
    // }
  
    return {
        getTitle,
        getDescr,
    }
}

export default TaskFactory