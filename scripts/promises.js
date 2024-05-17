import manageLocalStorage from "./manageLocalStorage.js";
import task_container from "./taskContainer.js";

const all_task_container = document.querySelector(".all-task-container");
const view_task_modal = document.querySelector("#view-task-dialog");
// view modal task buttons
const close_view_task_btn = document.querySelector(".close-view-task-btn");
const save_btn = document.querySelector(".save-changes-btn");
let selected_task_open;

manageLocalStorage();
all_task_container.innerHTML = task_container.get_all_task_HTML();

// Closes the add task modal
if (close_view_task_btn) {
  close_view_task_btn.addEventListener("click", () => {
    view_task_modal.close();
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
  all_task_container.innerHTML = task_container.get_all_task_HTML();
}

all_task_container.addEventListener("click", (event) => {
  const target = event.target;

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
    console.log(selected_task);
    task_container.save_to_storage();
  }

  if (target.tagName === "BUTTON") {
    const task_id = target.parentElement.parentElement.id;

    if (target.className === "delete-btn") {
      const result = task_id?.match(regex);
      const selected_task_id = task_container.get_specific_task(result[0]).id;
      task_container.delete_task(selected_task_id);
      task_container.save_to_storage();
      console.log(selected_task_id);
    } else {
      const result = task_id?.match(regex);
      const selected_task = task_container.get_specific_task(result[0]);
      selected_task.set_archived();
      task_container.save_to_storage();
      console.log(selected_task);
    }
    all_task_container.innerHTML = task_container.get_all_task_HTML();
  }
});
