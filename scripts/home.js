import manageLocalStorage from "./manage-LocalStorage.js";
import Task from "../data/task-class.js";
import generateRandomNumber from "./task-id.js";
import task_container from "./task-container.js";

// localStorage.clear("Task_Container")

// task container UI
const task_container_HTML = document.querySelector(".task-container");
const pending_tasks = document.querySelector(".pending-tasks");
const fulfilled_tasks = document.querySelector(".fulfilled-tasks");
const rejected_tasks = document.querySelector(".rejected-tasks");
// add modal
const add_task_modal = document.querySelector("#add-task-dialog");
// add modal task buttons
const close_add_task_btn = document.querySelector(".close-add-task-btn");
const confirm_btn = document.querySelector(".confirm-btn");
// view modal
const view_task_modal = document.querySelector("#view-task-dialog");
// view modal task buttons
const close_view_task_btn = document.querySelector(".close-view-task-btn");
const save_btn = document.querySelector(".save-changes-btn");

// add-task buttons
const add_task_btn = document.querySelector(".add-task-btn");
const show_task_container_btn = document.querySelector(
  ".show-task-container-btn"
);
const show_localStorage_btn = document.querySelector(".show-localStorage-btn");

let selected_task_open;
// save the changes made to the input fields
// on load =  render the tasks in localStorage if there are any and add it to task container object
manageLocalStorage();
renderTasks(pending_tasks, fulfilled_tasks, rejected_tasks);

function renderTasks(pending_HTML, fulfilled_HTML, rejected_HTML) {
  const pending_tasks_HTML = task_container.get_all_pending_task_HTML();
  pending_HTML.innerHTML = pending_tasks_HTML;

  const fulfilled_tasks_HTML = task_container.get_all_fulfilled_task_HTML();
  fulfilled_HTML.innerHTML = fulfilled_tasks_HTML;

  const rejected_tasks_HTML = task_container.get_all_rejected_task_HTML();
  rejected_HTML.innerHTML = rejected_tasks_HTML;
}

function renderPendingTasks(HTML_element) {
  const pending_tasks_HTML = task_container.get_all_pending_task_HTML();
  HTML_element.innerHTML = pending_tasks_HTML;
}

function renderFulfilledTasks(HTML_element) {
  const fulfilled_tasks_HTML = task_container.get_all_fulfilled_task_HTML();
  HTML_element.innerHTML = fulfilled_tasks_HTML;
}

function renderRejectedTasks(HTML_element) {
  const rejected_tasks_HTML = task_container.get_all_rejected_task_HTML();
  HTML_element.innerHTML = rejected_tasks_HTML;
}

// Opens the add task modal
if (add_task_btn) {
  add_task_btn.addEventListener("click", () => {
    add_task_modal.showModal();
  });
}

// Closes the add task modal
if (close_add_task_btn) {
  close_add_task_btn.addEventListener("click", () => {
    add_task_modal.close();
  });
}

// Closes the add task modal
if (close_view_task_btn) {
  close_view_task_btn.addEventListener("click", () => {
    view_task_modal.close();
  });
}

function isWhiteSpaceOnly(input_string) {
  return input_string.trim() === "";
}

// adds new task to (task_container)
if (confirm_btn) {
  confirm_btn.addEventListener("click", () => {
    // get user input from task modal
    let name_input = document.querySelector(".task-name-input").value;
    let desc_input = document.querySelector(".task-description-input").value;
    let date_input = document.querySelector(".task-target-date-input").value;

    if (isWhiteSpaceOnly(name_input)) {
      alert("Empty Promises are not allowed!");
      return;
    }
    console.log(name_input);
    // creates an instance of (task) and then
    const new_task = new Task(
      generateRandomNumber(),
      name_input,
      desc_input,
      date_input,
      { pending: true, fulfilled: false, rejected: false },
      false
    );

    task_container.add_task(new_task); // console.log(new_task);

    add_task_modal.close(); // Closes the add task modal

    renderPendingTasks(pending_tasks); // render added task
  });
}

if (save_btn) {
  save_btn.addEventListener("click", () => {
    save_changes(selected_task_open);
  });
}

function save_changes(task_id) {
  const edit_task = task_container.get_specific_task(task_id);
  let name = document.querySelector(".view-task-name-input");
  let desc = document.querySelector(".view-task-description-input");
  let date = document.querySelector(".view-task-target-date-input");
  edit_task.name = name.value;
  edit_task.description = desc.value;
  edit_task.target_date = date.value;

  task_container.save_to_storage();
  view_task_modal.close();
  selected_task_open = null;
  renderTasks(pending_tasks, fulfilled_tasks, rejected_tasks);
}

if (task_container_HTML) {
  task_container_HTML.addEventListener("click", (event) => {
    let target = event.target; // console.log(target.tagName, target.className);

    if (
      target.tagName != "INPUT" &&
      target.tagName != "BUTTON" &&
      target.tagName != "DIV" &&
      target.tagName != "P"
    )
      return;
    let regex = /[0-9]*[0-9]/;
    let task_id;
    if (
      (target.tagName === "DIV" && target.className === "task") ||
      target.tagName === "P" ||
      (target.tagName === "DIV" && target.className === "task-btns")
    ) {
      view_task_modal.showModal();

      if (target.tagName === "DIV" && target.className === "task") {
        task_id = target.id; // console.log(task_id);
      } else {
        task_id = target.parentElement.id; // console.log(task_id);
      }
      const result = task_id?.match(regex);
      const selected_task = task_container.get_specific_task(result[0]);

      // set the input value from the task
      let name = document.querySelector(".view-task-name-input");
      let desc = document.querySelector(".view-task-description-input");
      let date = document.querySelector(".view-task-target-date-input");
      name.value = selected_task.name;
      desc.value = selected_task.description;
      date.value = selected_task.target_date;

      selected_task_open = selected_task.id;
    }

    // CHANGE TASK STATE
    if (target.tagName === "INPUT") {
      const parent_element = target.parentElement.parentElement;
      const task_id = target.parentElement.parentElement.id;
      const state_value = target.value;

      const input_radio_btns = parent_element.querySelectorAll("input");
      input_radio_btns.forEach((radio_btn) => {
        if (state_value === radio_btn.defaultValue) radio_btn.checked = true;
      });

      const result = task_id.match(regex);
      const selected_task = task_container.get_specific_task(result[0]);

      // previous state = render the current state HTML (task removal)
      let prev_state = "";
      for (const [key, value] of Object.entries(selected_task.get_state())) {
        if (value === true) {
          prev_state = key; // console.log(prev_state);
          break;
        }
      }
      // next state = render the next state HTML (task addition)
      selected_task.set_state(state_value); // console.log(state_value);

      // update ui
      if (
        (prev_state === "pending" && state_value === "fulfilled") ||
        (state_value === "pending" && prev_state === "fulfilled")
      ) {
        renderPendingTasks(pending_tasks);
        renderFulfilledTasks(fulfilled_tasks);
      } else if (
        (prev_state === "pending" && state_value === "rejected") ||
        (state_value === "pending" && prev_state === "rejected")
      ) {
        renderPendingTasks(pending_tasks);
        renderRejectedTasks(rejected_tasks);
      } else {
        renderFulfilledTasks(fulfilled_tasks);
        renderRejectedTasks(rejected_tasks);
      }
      task_container.save_to_storage();
    }

    // DELETE TASK
    if (target.tagName === "BUTTON" && target.className === "delete-btn") {
      const task_id = target.parentElement.parentElement.id;
      const result = task_id.match(regex);
      const selected_task_id = result[0];
      // console.log("Delete Task ID: ", selected_task_id);

      // update ui
      const selected_task = task_container.get_specific_task(selected_task_id);
      // task state = render the current state HTML (task removal)
      let task_state = "";
      for (const [key, value] of Object.entries(selected_task.get_state())) {
        if (value === true) {
          task_state = key; // console.log(task_state);
          break;
        }
      }
      task_container.delete_task(selected_task_id);
      task_container.save_to_storage();
      // update ui
      if (task_state === "pending") {
        renderPendingTasks(pending_tasks);
      } else if (task_state === "fulfilled") {
        renderFulfilledTasks(fulfilled_tasks);
      } else {
        renderRejectedTasks(rejected_tasks);
      }
    }

    // ARCHIVE TASK
    if (target.tagName === "BUTTON" && target.className === "archive-btn") {
      const task_id = target.parentElement.parentElement.id;
      const result = task_id.match(regex);
      const selected_task_id = result[0]; // console.log("Archive Task ID: ", selected_task_id);
      const selected_task = task_container.get_specific_task(selected_task_id);

      selected_task.set_archived();
      task_container.save_to_storage();

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
        renderPendingTasks(pending_tasks);
      } else if (task_state === "fulfilled") {
        renderFulfilledTasks(fulfilled_tasks);
      } else {
        renderRejectedTasks(rejected_tasks);
      }
    }
  });
}

// shows task_container content
if (show_task_container_btn) {
  show_task_container_btn.addEventListener("click", () => {
    console.log(task_container.get_all_task());
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
