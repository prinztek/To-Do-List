export default class Task {
  constructor(id, name, description, target_date, state, archived) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.target_date = target_date;
    this.state = state;
    this.archived = archived;
  }

  // Setter methods
  set_name(name) {
    this.name = name;
  }

  set_description(description) {
    this.description = description;
  }

  set_target_date(target_date) {
    this.target_date = target_date;
  }

  set_state(change_state) {
    for (let key in this.state) {
      if (key != change_state) {
        this.state[key] = false;
      } else {
        this.state[key] = true;
      }
    }
  }

  set_archived() {
    this.archived = !this.archived;
  }

  // Getter methods
  get_details() {
    return `${this.id} ${this.name}, ${this.description}, ${this.target_date}`;
  }

  get_state() {
    return this.state;
  }

  get_true_state() {
    for (const [key, value] of Object.entries(this.state)) {
      if (value === true) {
        return `<p class="task-current-state">State: ${key}</p>`;
      }
    }
  }

  get_HTML() {
    return `
  <div class="task" id="task-no-${this.id}">
    <p class="task-name">${this.name}</p>
    <p class="task-description">${this.description}</p>
    <p class="task-target-date">Due: ${this.target_date}</p>
    <div class="task-states">
      <input type="radio" class="pending" id="pending-${this.id}" name="state-${
      this.id
    }" value="pending" ${this.state.pending === true ? "checked" : ""} />
      <label for="pending-${this.id}">PENDING</label>
      <input type="radio" class="fulfilled" id="fulfilled-${
        this.id
      }" name="state-${this.id}" value="fulfilled" ${
      this.state.fulfilled === true ? "checked" : ""
    } />
      <label for="fulfilled-${this.id}">FULFILLED</label>
      <input type="radio" class="rejected" id="rejected-${
        this.id
      }" name="state-${this.id}" value="rejected" ${
      this.state.rejected === true ? "checked" : ""
    } />
      <label for="rejected-${this.id}">REJECTED</label>
    </div>
      <div class="task-btns">
        <button class="delete-btn">Delete</button>
        ${
          this.archived === false
            ? `<button class="archive-btn">Archive</button>`
            : `<button class="unarchive-btn">Unarchive</button>`
        }
      </div>
  </div>`;
  }

  get_archived_HTML() {
    return `
    <div class="task" id="task-no-${this.id}">
      <p class="task-name">${this.name}</p>
      <p class="task-description">${this.description}</p>
      <p class="task-target-date">
      ${this.target_date.length > 0 ? "" : "Due"} ${this.target_date}</p>
      ${this.get_true_state()}
      <div class="task-btns">
        <button class="delete-btn" data-action="delete">Delete</button>
        ${
          this.archived === false
            ? `<button class="archive-btn">Archive</button>`
            : `<button class="unarchive-btn">Unarchive</button>`
        }
      </div>
    </div>
    `;
  }
}
