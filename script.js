
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const subjectInput = document.getElementById("subjectInput");
const priorityInput = document.getElementById("priorityInput");

const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const message = document.getElementById("message");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const progressText = document.getElementById("progressText");

const clearCompletedButton =
  document.getElementById("clearCompleted");

let tasks = [];

try {
  tasks = JSON.parse(
    localStorage.getItem("studyMateTasks") || "[]"
  );

  if (!Array.isArray(tasks)) {
    tasks = [];
  }
} catch {
  tasks = [];
}

function saveTasks() {
  try {
    localStorage.setItem(
      "studyMateTasks",
      JSON.stringify(tasks)
    );
  } catch {
    message.textContent =
      "Could not save tasks in this browser.";
  }
}

function updateProgress() {
  const completed = tasks.filter(
    task => task.completed
  ).length;

  const total = tasks.length;

  const percentage = total === 0
    ? 0
    : Math.round((completed / total) * 100);

  totalTasks.textContent = total;
  completedTasks.textContent = completed;
  progressText.textContent = percentage + "%";
}

function renderTasks() {
  taskList.replaceChildren();

  emptyMessage.hidden = tasks.length > 0;

  tasks.forEach(task => {
    const item = document.createElement("li");
    item.className = "task-item";

    if (task.completed) {
      item.classList.add("completed");
    }

    const info = document.createElement("div");
    info.className = "task-info";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute(
      "aria-label",
      "Mark " + task.name + " as completed"
    );

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const details = document.createElement("div");

    const name = document.createElement("div");
    name.className = "task-name";
    name.textContent = task.name;

    const meta = document.createElement("div");
    meta.className = "task-meta";
    meta.textContent = task.subject;

    const priority = document.createElement("div");
    priority.className = "priority";
    priority.textContent = task.priority + " priority";

    details.append(name, meta, priority);
    info.append(checkbox, details);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(
        currentTask => currentTask.id !== task.id
      );

      saveTasks();
      renderTasks();
      message.textContent = "Task deleted.";
    });

    item.append(info, deleteButton);
    taskList.append(item);
  });

  updateProgress();
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = taskInput.value.trim();

  if (!name) {
    message.textContent = "Please enter a task name.";
    return;
  }

  tasks.push({
    id: Date.now() + Math.random(),
    name: name,
    subject: subjectInput.value,
    priority: priorityInput.value,
    completed: false
  });

  saveTasks();
  renderTasks();

  taskForm.reset();
  message.textContent = "Study task added successfully!";
  taskInput.focus();
});

clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);

  saveTasks();
  renderTasks();

  message.textContent = "Completed tasks cleared.";
});

renderTasks();
