export default class TaskContainer {
  constructor() {
    this.task_container_obj = [];
  }

  add_task(task) {
    this.task_container_obj.push(task);
    this.save_to_storage();
  }

  save_to_storage() {
    localStorage.setItem(
      "Task_Container",
      JSON.stringify(this.task_container_obj)
    );
  }

  get_specific_task(task_id) {
    for (let i = 0; i < this.task_container_obj.length; i++) {
      const task = this.task_container_obj[i];
      if (task.id == task_id) {
        return task;
      }
    }
  }

  get_all_task() {
    return this.task_container_obj;
  }

  get_all_task_HTML() {
    let all_task_HTML = ``;
    this.task_container_obj.forEach((task) => {
      all_task_HTML += task.get_HTML();
    });
    return all_task_HTML;
  }

  get_all_pending_task_HTML() {
    let all_task_HTML = ``;
    this.task_container_obj.forEach((task) => {
      // console.log(task.state);
      if (task?.state?.pending === true && task.archived === false) {
        all_task_HTML += task.get_HTML();
      }
    });
    return all_task_HTML;
  }

  get_all_fulfilled_task_HTML() {
    let all_task_HTML = ``;
    this.task_container_obj.forEach((task) => {
      if (task?.state?.fulfilled === true && task.archived === false) {
        all_task_HTML += task.get_HTML();
      }
    });
    return all_task_HTML;
  }

  get_all_rejected_task_HTML() {
    let all_task_HTML = ``;
    this.task_container_obj.forEach((task) => {
      if (task?.state?.rejected === true && task.archived === false) {
        all_task_HTML += task.get_HTML();
      }
    });
    return all_task_HTML;
  }

  get_all_archived_task_HTML() {
    let all_task_HTML = ``;
    this.task_container_obj.forEach((task) => {
      if (task.archived === true) {
        all_task_HTML += task.get_archived_HTML();
      }
    });
    return all_task_HTML;
  }

  delete_task(task_id) {
    for (let i = 0; i < this.task_container_obj.length; i++) {
      const task = this.task_container_obj[i];
      if (task.id === Number(task_id)) {
        this.task_container_obj.splice(i, 1);
      }
    }
  }
}
