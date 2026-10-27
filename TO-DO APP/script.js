const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");

const STORAGE_KEY = "myTodoTasks";

// Load saved tasks from localStorage
let tasks = [];

try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    tasks = savedTasks ? JSON.parse(savedTasks) : [];

    if (!Array.isArray(tasks)) {
        tasks = [];
    }
} catch (error) {
    tasks = [];
}

// Save tasks
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Display tasks on the page
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task) {
        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        // Task text
        const span = document.createElement("span");
        span.textContent = task.text;
        span.className = "task-text";
        span.title = "Click to mark as done";

        // Mark task as done or undo it
        span.addEventListener("click", function () {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", function () {
            li.classList.add("task-exit");
            deleteBtn.disabled = true;

            setTimeout(function () {
                tasks = tasks.filter(function (item) {
                    return item.id !== task.id;
                });

                saveTasks();
                renderTasks();
            }, 250);
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    // Update count and empty message
    taskCount.textContent = "Total tasks: " + tasks.length;
    emptyMessage.hidden = tasks.length > 0;
}

// Add a task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        taskInput.focus();
        return;
    }

    const task = {
        id: Date.now() + Math.random(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}

// Add button
addBtn.addEventListener("click", addTask);

// Press Enter to add a task
taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Show saved tasks when the page opens
renderTasks();
