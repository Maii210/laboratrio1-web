// ── Elementos del DOM ──
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const addBtn = document.getElementById("addBtn");
const tasksList = document.getElementById("tasksList");

// ── Cargar tareas guardadas al iniciar ──
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

// ── Evento: click en "Agregar" ──
addBtn.addEventListener("click", function () {
  const description = taskInput.value.trim();
  const date = taskDate.value;

  if (description === "") {
    alert("Escribí una descripción para la tarea.");
    return;
  }

  const newTask = {
    id: Date.now(),
    description: description,
    date: date,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskDate.value = "";
});

// ── Guardar tareas en localStorage ──
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ── Renderizar todas las tareas en el DOM ──
function renderTasks() {
  tasksList.innerHTML = "";

  tasks.forEach(function (task) {
    const li = document.createElement("li");
    li.classList.add("task-item");
    if (task.completed) {
      li.classList.add("completed");
    }

    const description = document.createElement("span");
    description.classList.add("task-item__description");
    description.textContent = task.description;

    const date = document.createElement("span");
    date.classList.add("task-item__date");
    date.textContent = task.date;

    const checkBtn = document.createElement("button");
    checkBtn.classList.add("task-item__check");
    checkBtn.textContent = "✓";
    checkBtn.addEventListener("click", function () {
      toggleTask(task.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("task-item__delete");
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id);
    });

    li.appendChild(description);
    li.appendChild(date);
    li.appendChild(checkBtn);
    li.appendChild(deleteBtn);

    tasksList.appendChild(li);
  });
}

// ── Marcar/desmarcar tarea como completada ──
function toggleTask(id) {
  tasks = tasks.map(function (task) {
    if (task.id === id) {
      task.completed = !task.completed;
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  saveTasks();
  renderTasks();
}