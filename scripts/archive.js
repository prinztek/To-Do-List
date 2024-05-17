import manageLocalStorage from "./manageLocalStorage.js";
import taskContainer from "./taskContainer.js";

const archivedTask = document.querySelector(".archived-task-container");

manageLocalStorage();
archivedTask.innerHTML = taskContainer.getAllArchivedTaskHTML();

archivedTask.addEventListener("click", (event) => {
  const target = event.target;
  // console.log(target, target.tagName);
  if (target.tagName != "BUTTON") return;

  let regex = /[0-9]*[0-9]/;
  const taskHTML = target.closest(".task");
  const taskIdAttribute = taskHTML.id;
  const taskId = taskIdAttribute.match(regex)[0];
  const selectedTask = taskContainer.getTask(taskId);

  if (target.className === "delete-btn") {
    taskContainer.deleteTask(taskId);
    taskContainer.saveToStorage();
  }

  if (target.className === "unarchive-btn") {
    selectedTask.setArchived();
    console.log(selectedTask);
    taskContainer.saveToStorage();
  }

  archivedTask.innerHTML = taskContainer.getAllArchivedTaskHTML();
});

/* 
<button class="delete-btn">Delete</button>
<button class="unarchive-btn">Unarchive</button>
*/
