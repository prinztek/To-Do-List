import Task from "../data/taskClass.js";
import task_container from "./taskContainer.js";

function manageLocalStorage() {
  // adds all the content of localStorage to task_container
  if (localStorage.getItem("Task_Container")) {
    const localStorageItems = JSON.parse(
      localStorage.getItem("Task_Container")
    );

    for (let x = 0; x < localStorageItems.length; x++) {
      const task = localStorageItems[x];
      const storage_task = new Task(
        task.id,
        task.name,
        task.description,
        task.target_date,
        task.state,
        task.archived
      );

      task_container.add_task(storage_task); // console.log("LocalStorage Task:", storage_task);
    }
  }
}

export default manageLocalStorage;
