import manageLocalStorage from "./manageLocalStorage.js";
import taskContainer from "./taskContainer.js";

const allTaskContainer = document.querySelector(".all-task-container");
const viewTaskModal = document.querySelector("#view-task-dialog");
const closeViewTaskBtn = document.querySelector(".close-view-task-btn");
const saveBtn = document.querySelector(".save-changes-btn");
let selectedTaskOpen;

manageLocalStorage();
allTaskContainer.innerHTML = taskContainer.getAllTaskHTML();

// Closes the add task modal
if (closeViewTaskBtn) {
  closeViewTaskBtn.addEventListener("click", () => {
    viewTaskModal.close();
  });
}

if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    saveChanges(selectedTaskOpen);
  });
}

function saveChanges(taskId) {
  const selectedTask = taskContainer.getTask(taskId);
  let nameInput = document.querySelector(".view-task-name-input");
  let descInput = document.querySelector(".view-task-description-input");
  let dateInput = document.querySelector(".view-task-target-date-input");
  selectedTask.name = nameInput.value;
  selectedTask.description = descInput.value;
  selectedTask.target_date = dateInput.value;

  taskContainer.saveToStorage();
  viewTaskModal.close();
  selectedTaskOpen = null;
  allTaskContainer.innerHTML = taskContainer.getAllTaskHTML();
}

allTaskContainer.addEventListener("click", (event) => {
  let target = event.target; // console.log(target.tagName, target.className);

  if (
    target.tagName != "INPUT" &&
    target.tagName != "BUTTON" &&
    target.tagName != "DIV" &&
    target.tagName != "P"
  )
    return;

  let regex = /[0-9]*[0-9]/;
  const taskHTML = target.closest(".task");

  if (!taskHTML) return;

  const taskIdAttribute = taskHTML.id;
  const taskId = taskIdAttribute.match(regex)[0];
  const selectedTask = taskContainer.getTask(taskId);

  // VIEW TASK DETAILS
  if (
    target.tagName === "P" ||
    target.className === "task" ||
    target.className === "task-btns" ||
    target.className === "task-states"
  ) {
    viewTaskModal.showModal();

    // set the input value from the task
    let nameInput = document.querySelector(".view-task-name-input");
    let descInput = document.querySelector(".view-task-description-input");
    let dateInput = document.querySelector(".view-task-target-date-input");
    nameInput.value = selectedTask.name;
    descInput.value = selectedTask.description;
    dateInput.value = selectedTask.target_date;
    selectedTaskOpen = selectedTask.id;
  }

  // CHANGE TASK STATE
  if (target.tagName === "INPUT") {
    const inputRadioParentHTML = target.closest(".task-states");
    const inputRadioBtns = inputRadioParentHTML.querySelectorAll("input");
    const newState = target.value;

    inputRadioBtns.forEach((radiotBtn) => {
      if (newState === radiotBtn.defaultValue) radiotBtn.checked = true;
    });

    // next state = render the next state HTML (task addition)
    selectedTask.setState(newState);
    taskContainer.saveToStorage();
  }

  // DELETE TASK
  if (target.className === "delete-btn") {
    taskContainer.deleteTask(taskId);
    taskContainer.saveToStorage();

    // update ui
    allTaskContainer.innerHTML = taskContainer.getAllTaskHTML();
  }

  // ARCHIVE TASK
  if (
    target.className === "archive-btn" ||
    target.className === "unarchive-btn"
  ) {
    selectedTask.setArchived();
    taskContainer.saveToStorage();

    // update ui
    allTaskContainer.innerHTML = taskContainer.getAllTaskHTML();
  }
});
