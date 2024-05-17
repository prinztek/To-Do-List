import manageLocalStorage from "./manageLocalStorage.js";
import generateRandomNumber from "./genrateRandomNumber.js";
import taskContainer from "./taskContainer.js";
import Task from "../data/taskClass.js";

// DOM elements
const taskContainerHTML = document.querySelector(".task-container");
const pendingTasksHTML = document.querySelector(".pending-tasks");
const fulfilledTasksHTML = document.querySelector(".fulfilled-tasks");
const rejectedTasksHTML = document.querySelector(".rejected-tasks");
const addTaskModal = document.querySelector("#add-task-dialog");
const closeAddTaskBtn = document.querySelector(".close-add-task-btn");
const confirmBtn = document.querySelector(".confirm-btn");
const viewTaskModal = document.querySelector("#view-task-dialog");
const closeViewTaskBtn = document.querySelector(".close-view-task-btn");
const saveBtn = document.querySelector(".save-changes-btn");
const addTaskBtn = document.querySelector(".add-task-btn");
const showTaskContainerBtn = document.querySelector(".show-task-container-btn");
const show_localStorage_btn = document.querySelector(".show-localStorage-btn");
let selectedTaskOpen;

// save the changes made to the input fields
// on load =  render the tasks in localStorage if there are any and add it to task container object
manageLocalStorage();
renderTasks(pendingTasksHTML, fulfilledTasksHTML, rejectedTasksHTML);

function renderTasks(pendingContainer, fulfilledContainer, rejectedContainer) {
  pendingContainer.innerHTML = taskContainer.getAllPendingTaskHTML();
  fulfilledContainer.innerHTML = taskContainer.getAllFulfilledTaskHTML();
  rejectedContainer.innerHTML = taskContainer.getAllRejectedTaskHTML();
}

function renderPendingTasks(elementContainer) {
  elementContainer.innerHTML = taskContainer.getAllPendingTaskHTML();
}

function renderFulfilledTasks(elementContainer) {
  elementContainer.innerHTML = taskContainer.getAllFulfilledTaskHTML();
}

function renderRejectedTasks(elementContainer) {
  elementContainer.innerHTML = taskContainer.getAllRejectedTaskHTML();
}

// Opens the add task modal
if (addTaskBtn) {
  addTaskBtn.addEventListener("click", () => {
    addTaskModal.showModal();
  });
}

// Closes the add task modal
if (closeAddTaskBtn) {
  closeAddTaskBtn.addEventListener("click", () => {
    addTaskModal.close();
  });
}

// Closes the add task modal
if (closeViewTaskBtn) {
  closeViewTaskBtn.addEventListener("click", () => {
    viewTaskModal.close();
  });
}

function isWhiteSpaceOnly(input_string) {
  return input_string.trim() === "";
}

// adds new task to (taskContainer)
if (confirmBtn) {
  confirmBtn.addEventListener("click", () => {
    // get user input from task modal
    let nameInput = document.querySelector(".task-name-input").value;
    let descInput = document.querySelector(".task-description-input").value;
    let dateInput = document.querySelector(".task-target-date-input").value;

    if (isWhiteSpaceOnly(nameInput)) {
      alert("Empty Promises are not allowed!");
      return;
    }
    // creates an instance of (task) and then
    const newTask = new Task(
      generateRandomNumber(),
      nameInput,
      descInput,
      dateInput,
      { pending: true, fulfilled: false, rejected: false },
      false
    );

    taskContainer.addTask(newTask); // console.log(new_task);

    addTaskModal.close(); // Closes the add task modal

    renderPendingTasks(pendingTasksHTML); // render added task
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

  if (isWhiteSpaceOnly(nameInput.value)) {
    alert("Empty Promises are not allowed!");
    return;
  }

  selectedTask.name = nameInput.value;
  selectedTask.description = descInput.value;
  selectedTask.target_date = dateInput.value;

  taskContainer.saveToStorage();
  viewTaskModal.close();
  selectedTaskOpen = null;
  renderTasks(pendingTasksHTML, fulfilledTasksHTML, rejectedTasksHTML);
}

if (taskContainerHTML) {
  taskContainerHTML.addEventListener("click", (event) => {
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

      // previous state = render the current state HTML (task removal)
      let prevState = selectedTask.getCurrentState();

      // next state = render the next state HTML (task addition)
      selectedTask.setState(newState);
      taskContainer.saveToStorage();

      // update ui
      if (prevState === "pending") {
        renderPendingTasks(pendingTasksHTML);
      } else if (prevState === "fulfilled") {
        renderFulfilledTasks(fulfilledTasksHTML);
      } else if (prevState === "rejected") {
        renderRejectedTasks(rejectedTasksHTML);
      }

      if (newState === "pending") {
        renderPendingTasks(pendingTasksHTML);
      } else if (newState === "fulfilled") {
        renderFulfilledTasks(fulfilledTasksHTML);
      } else if (newState === "rejected") {
        renderRejectedTasks(rejectedTasksHTML);
      }
    }

    // DELETE TASK
    if (target.className === "delete-btn") {
      const currentTaskState = selectedTask.getCurrentState();
      taskContainer.deleteTask(taskId);
      taskContainer.saveToStorage();

      // update ui
      if (currentTaskState === "pending") {
        renderPendingTasks(pendingTasksHTML);
      } else if (currentTaskState === "fulfilled") {
        renderFulfilledTasks(fulfilledTasksHTML);
      } else {
        renderRejectedTasks(rejectedTasksHTML);
      }
    }

    // ARCHIVE TASK
    if (target.className === "archive-btn") {
      const currentTaskState = selectedTask.getCurrentState();
      selectedTask.setArchived();
      taskContainer.saveToStorage();

      // update ui
      if (currentTaskState === "pending") {
        renderPendingTasks(pendingTasksHTML);
      } else if (currentTaskState === "fulfilled") {
        renderFulfilledTasks(fulfilledTasksHTML);
      } else {
        renderRejectedTasks(rejectedTasksHTML);
      }
    }
  });
}

// shows taskContainer content
if (showTaskContainerBtn) {
  showTaskContainerBtn.addEventListener("click", () => {
    console.log(taskContainer.getAllTask());
  });
}

// shows localStorage content
// CLEAR LOCAL STORAGE USING = localStorage.clear("Task_Container")
if (show_localStorage_btn) {
  show_localStorage_btn.addEventListener("click", () => {
    const localStorageItems = JSON.parse(
      localStorage.getItem("Task_Container")
    );
    console.log(localStorageItems);
  });
}
