import manageLocalStorage from "./manageLocalStorage.js";
import generateRandomNumber from "./genrateRandomNumber.js";
import taskContainer from "./taskContainer.js";
import Task from "../data/taskClass.js";

// localStorage.clear("Task_Container")
// localStorage.clear("TaskContainer")

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

function renderTasks(pending_HTML, fulfilled_HTML, rejected_HTML) {
  const pending_tasks_HTML = taskContainer.get_all_pending_task_HTML();
  pending_HTML.innerHTML = pending_tasks_HTML;

  const fulfilled_tasks_HTML = taskContainer.get_all_fulfilled_task_HTML();
  fulfilled_HTML.innerHTML = fulfilled_tasks_HTML;

  const rejected_tasks_HTML = taskContainer.get_all_rejected_task_HTML();
  rejected_HTML.innerHTML = rejected_tasks_HTML;
}

function renderPendingTasks(HTML_element) {
  const pending_tasks_HTML = taskContainer.get_all_pending_task_HTML();
  HTML_element.innerHTML = pending_tasks_HTML;
}

function renderFulfilledTasks(HTML_element) {
  const fulfilled_tasks_HTML = taskContainer.get_all_fulfilled_task_HTML();
  HTML_element.innerHTML = fulfilled_tasks_HTML;
}

function renderRejectedTasks(HTML_element) {
  const rejected_tasks_HTML = taskContainer.get_all_rejected_task_HTML();
  HTML_element.innerHTML = rejected_tasks_HTML;
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
    let name_input = document.querySelector(".task-name-input").value;
    let desc_input = document.querySelector(".task-description-input").value;
    let date_input = document.querySelector(".task-target-date-input").value;

    if (isWhiteSpaceOnly(name_input)) {
      alert("Empty Promises are not allowed!");
      return;
    }
    // creates an instance of (task) and then
    const new_task = new Task(
      generateRandomNumber(),
      name_input,
      desc_input,
      date_input,
      { pending: true, fulfilled: false, rejected: false },
      false
    );

    taskContainer.add_task(new_task); // console.log(new_task);

    addTaskModal.close(); // Closes the add task modal

    renderPendingTasks(pendingTasksHTML); // render added task
  });
}

if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    save_changes(selectedTaskOpen);
  });
}

function save_changes(task_id) {
  const selectedTask = taskContainer.get_specific_task(task_id);
  let name = document.querySelector(".view-task-name-input");
  let desc = document.querySelector(".view-task-description-input");
  let date = document.querySelector(".view-task-target-date-input");

  if (isWhiteSpaceOnly(name.value)) {
    alert("Empty Promises are not allowed!");
    return;
  }

  selectedTask.name = name.value;
  selectedTask.description = desc.value;
  selectedTask.target_date = date.value;

  taskContainer.save_to_storage();
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
    console.log(taskId);

    // VIEW TASK DETAILS
    if (
      target.tagName === "P" ||
      target.className === "task" ||
      target.className === "task-btns" ||
      target.className === "task-states"
    ) {
      viewTaskModal.showModal();

      const selected_task = taskContainer.get_specific_task(taskId);

      // set the input value from the task
      let name = document.querySelector(".view-task-name-input");
      let desc = document.querySelector(".view-task-description-input");
      let date = document.querySelector(".view-task-target-date-input");
      name.value = selected_task.name;
      desc.value = selected_task.description;
      date.value = selected_task.target_date;

      selectedTaskOpen = selected_task.id;
    }

    // CHANGE TASK STATE
    if (target.tagName === "INPUT") {
      const selected_task = taskContainer.get_specific_task(taskId);
      const inputRadioParentHTML = target.closest(".task-states");
      const inputRadioBtns = inputRadioParentHTML.querySelectorAll("input");
      const newState = target.value;

      inputRadioBtns.forEach((radio_btn) => {
        if (newState === radio_btn.defaultValue) radio_btn.checked = true;
      });

      // previous state = render the current state HTML (task removal)
      let prevState = "";
      for (const [key, value] of Object.entries(selected_task.get_state())) {
        if (value === true) {
          prevState = key; // console.log(prev_state);
          break;
        }
      }
      // next state = render the next state HTML (task addition)
      selected_task.set_state(newState); // console.log(state_value);

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
      taskContainer.save_to_storage();
    }

    // DELETE TASK
    if (target.tagName === "BUTTON" && target.className === "delete-btn") {
      const task_id = target.parentElement.parentElement.id;
      const result = task_id.match(regex);
      const selected_task_id = result[0];
      // console.log("Delete Task ID: ", selected_task_id);

      // update ui
      const selected_task = taskContainer.get_specific_task(selected_task_id);
      // task state = render the current state HTML (task removal)
      let task_state = "";
      for (const [key, value] of Object.entries(selected_task.get_state())) {
        if (value === true) {
          task_state = key; // console.log(task_state);
          break;
        }
      }
      taskContainer.delete_task(selected_task_id);
      taskContainer.save_to_storage();
      // update ui
      if (task_state === "pending") {
        renderPendingTasks(pendingTasksHTML);
      } else if (task_state === "fulfilled") {
        renderFulfilledTasks(fulfilledTasksHTML);
      } else {
        renderRejectedTasks(rejectedTasksHTML);
      }
    }

    // ARCHIVE TASK
    if (target.tagName === "BUTTON" && target.className === "archive-btn") {
      const task_id = target.parentElement.parentElement.id;
      const result = task_id.match(regex);
      const selected_task_id = result[0]; // console.log("Archive Task ID: ", selected_task_id);
      const selected_task = taskContainer.get_specific_task(selected_task_id);

      selected_task.set_archived();
      taskContainer.save_to_storage();

      // update ui
      // task state = render the current state HTML (task removal)
      let task_state = "";
      for (const [key, value] of Object.entries(selected_task.get_state())) {
        if (value === true) {
          task_state = key; // console.log(task_state);
          break;
        }
      }
      // update ui
      if (task_state === "pending") {
        renderPendingTasks(pendingTasksHTML);
      } else if (task_state === "fulfilled") {
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
    console.log(taskContainer.get_all_task());
  });
}

// shows localStorage content
if (show_localStorage_btn) {
  show_localStorage_btn.addEventListener("click", () => {
    // CLEAR LOCAL STORAGE USING = localStorage.clear("Task_Container")
    const localStorageItems = JSON.parse(
      localStorage.getItem("Task_Container")
    );
    console.log(localStorageItems);
  });
}

// localStorage.clear("Task_Container")
