let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const count = document.getElementById("count");

form.addEventListener("submit", saveTask);

function saveTask(e) {
  e.preventDefault();

  const taskId = document.getElementById("taskId").value;
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;

  if (title === "" || dueDate === "") {
    alert("Title and Due Date Required");
    return;
  }

  if (taskId) {
    tasks = tasks.map((task) =>
      task.id == taskId
        ? {
            id: Number(taskId),
            title,
            description,
            dueDate,
            priority,
          }
        : task,
    );
  } else {
    tasks.push({
      id: Date.now(),
      title,
      description,
      dueDate,
      priority,
    });
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));

  form.reset();
  document.getElementById("taskId").value = "";

  displayTasks();
}

function displayTasks(data = tasks) {
  taskList.innerHTML = "";

  count.innerText = data.length;

  if (data.length === 0) {
    taskList.innerHTML = "<h2>No Tasks Found</h2>";

    return;
  }

  data.forEach((task) => {
    taskList.innerHTML += `

        <div class="task">

            <span class="badge ${task.priority.toLowerCase()}">
                ${task.priority}
            </span>

            <h3>${task.title}</h3>

            <p>${task.description}</p>

            <p>
                <strong>📅 Due:</strong>
                ${task.dueDate}
            </p>

            <div class="actions">

                <button
                class="edit"
                onclick="editTask(${task.id})">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                class="delete"
                onclick="deleteTask(${task.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        </div>

        `;
  });
}

function editTask(id) {
  const task = tasks.find((task) => task.id === id);

  document.getElementById("taskId").value = task.id;
  document.getElementById("title").value = task.title;
  document.getElementById("description").value = task.description;
  document.getElementById("dueDate").value = task.dueDate;
  document.getElementById("priority").value = task.priority;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function deleteTask(id) {
  if (confirm("Delete this task?")) {
    tasks = tasks.filter((task) => task.id !== id);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();
  }
}

document.getElementById("search").addEventListener("input", filterTasks);

document
  .getElementById("filterPriority")
  .addEventListener("change", filterTasks);

function filterTasks() {
  const search = document.getElementById("search").value.toLowerCase();

  const priority = document.getElementById("filterPriority").value;

  const filtered = tasks.filter((task) => {
    const matchTitle = task.title.toLowerCase().includes(search);

    const matchPriority = priority === "All" || task.priority === priority;

    return matchTitle && matchPriority;
  });

  displayTasks(filtered);
}

displayTasks();
