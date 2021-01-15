const formEl = document.querySelector("#task-form");
const tasksToDoEl = document.querySelector("#tasks-to-do");

function createTaskHandler(e) {
    e.preventDefault()
    let taskItemEl = document.createElement("li");
    taskItemEl.classList.add("task-item")
    taskItemEl.textContent = "New Task";

    tasksToDoEl.appendChild(taskItemEl);
}

formEl.addEventListener("submit", createTaskHandler);

