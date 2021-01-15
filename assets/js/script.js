const formEl = document.querySelector("#task-form");
const tasksToDoEl = document.querySelector("#tasks-to-do");

function createTaskHandler(e) {
    e.preventDefault();
    let taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    
    // Create list item
    let listItemEl = document.createElement("li");
    listItemEl.classList.add("task-item");
    // Create div holder
    let taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    // Add html content
    taskInfoEl.innerHTML =
        `<h3 class='task-name'>${taskNameInput}</h3>
        <span class='task-type'>${taskTypeInput}</span>`;


    listItemEl.appendChild(taskInfoEl);
    // Add list item to list
    tasksToDoEl.appendChild(listItemEl);
}

formEl.addEventListener("submit", createTaskHandler);

