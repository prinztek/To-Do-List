import Task from "../data/taskClass.js";
import taskContainer from "./taskContainer.js";

function manageLocalStorage() {
  // adds all the content of localStorage to task_container
  if (localStorage.getItem("TaskContainer")) {
    const localStorageItems = JSON.parse(localStorage.getItem("TaskContainer"));
    for (let i = 0; i < localStorageItems.length; i++) {
      const task = localStorageItems[i];
      const taskFromStorage = new Task(
        task.id,
        task.name,
        task.description,
        task.target_date,
        task.state,
        task.archived
      );

      taskContainer.addTask(taskFromStorage);
    }
  }
}

export default manageLocalStorage;
