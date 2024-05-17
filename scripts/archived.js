import manageLocalStorage from "./manage-LocalStorage.js";
import task_container from "./task-container.js";

const archived_task = document.querySelector(".archived-task-container");

manageLocalStorage();
archived_task.innerHTML = task_container.get_all_archived_task_HTML();

archived_task.addEventListener("click", (event) => {
  const target = event.target;
  // console.log(target, target.tagName);

  if (target.tagName === "BUTTON") {
    const task_id = target.parentElement.parentElement.id;
    let regex = /[0-9]*[0-9]/;
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
    archived_task.innerHTML = task_container.get_all_archived_task_HTML();
  }
});

/* 
<button class="delete-btn">Delete</button>
<button class="unarchive-btn">Unarchive</button>
*/
