
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");

let tasks = [];

// Update task count and empty message
function updateDisplay() {
    const remaining = tasks.filter(task => !task.completed).length;

    taskCount.textContent =
        `${remaining} task${remaining === 1 ? "" : "s"} remaining`;

    emptyMessage.style.display =
        tasks.length === 0 ? "block" : "none";
}

// Display all tasks
function renderTasks() {
    taskList.replaceChildren();

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        const completeButton = document.createElement("button");
        completeButton.className = "complete-btn";
        completeButton.textContent =
            task.completed ? "Undo" : "Complete";
        completeButton.setAttribute(
            "aria-label",
            task.completed ? "Mark task incomplete" : "Mark task complete"
        );

        completeButton.addEventListener("click", () => {
            task.completed = !task.completed;
            renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", "Delete task");

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            renderTasks();
        });

        li.append(taskText, completeButton, deleteButton);
        taskList.appendChild(li);
    });

    updateDisplay();
}

// Add a new task
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {
        taskInput.focus();
        return;
    }

    tasks.push({
        id: Date.now() + Math.random(),
        text: text,
        completed: false
    });

    taskInput.value = "";
    taskInput.focus();

    renderTasks();
});

// Initial display
renderTasks();
