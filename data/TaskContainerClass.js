export default class TaskContainer {
  constructor() {
    this.taskContainerObject = [];
  }

  addTask(task) {
    this.taskContainerObject.push(task);
    this.saveToStorage();
  }

  saveToStorage() {
    localStorage.setItem(
      "TaskContainer",
      JSON.stringify(this.taskContainerObject)
    );
  }

  getTask(taskId) {
    for (let i = 0; i < this.taskContainerObject.length; i++) {
      const task = this.taskContainerObject[i];
      if (task.id == taskId) {
        return task;
      }
    }
  }

  getAllTask() {
    return this.taskContainerObject;
  }

  getAllTaskHTML() {
    let all_task_HTML = ``;
    this.taskContainerObject.forEach((task) => {
      all_task_HTML += task.getHTML();
    });
    return all_task_HTML;
  }

  getAllPendingTaskHTML() {
    let all_task_HTML = ``;
    this.taskContainerObject.forEach((task) => {
      if (task?.state?.pending === true && task.archived === false) {
        all_task_HTML += task.getHTML();
      }
    });
    return all_task_HTML;
  }

  getAllFulfilledTaskHTML() {
    let all_task_HTML = ``;
    this.taskContainerObject.forEach((task) => {
      if (task?.state?.fulfilled === true && task.archived === false) {
        all_task_HTML += task.getHTML();
      }
    });
    return all_task_HTML;
  }

  getAllRejectedTaskHTML() {
    let all_task_HTML = ``;
    this.taskContainerObject.forEach((task) => {
      if (task?.state?.rejected === true && task.archived === false) {
        all_task_HTML += task.getHTML();
      }
    });
    return all_task_HTML;
  }

  getAllArchivedTaskHTML() {
    let all_task_HTML = ``;
    this.taskContainerObject.forEach((task) => {
      if (task.archived === true) {
        all_task_HTML += task.getArchivedHTML();
      }
    });
    return all_task_HTML;
  }

  deleteTask(task_id) {
    for (let i = 0; i < this.taskContainerObject.length; i++) {
      const task = this.taskContainerObject[i];
      if (task.id === Number(task_id)) {
        this.taskContainerObject.splice(i, 1);
      }
    }
  }
}
