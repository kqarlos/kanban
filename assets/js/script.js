const buttonEl = document.querySelector("#save-task");
const tasksToDoEl = document.querySelector("#tasks-to-do");

function createTaskHandler (){
    let taskItemEl = document.createElement("li");
    taskItemEl.classList.add("task-item")
    taskItemEl.textContent = "New Task";

    tasksToDoEl.appendChild(taskItemEl);
}

buttonEl.addEventListener("click", createTaskHandler);

