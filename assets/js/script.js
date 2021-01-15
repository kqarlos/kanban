const formEl = document.querySelector("#task-form");
const tasksToDoEl = document.querySelector("#tasks-to-do");

// Handles task form submission
function taskFormHandler(e) {
    e.preventDefault();
    let taskNameInput = document.querySelector("input[name='task-name']").value;
    let taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("Fill out the task form!");
        return false;
    }
    
    formEl.reset();

    let taskData = {
        taskName: taskNameInput,
        taskType: taskTypeInput

    }
    renderTask(taskData);
}

//Renders a task to the page
function renderTask({ taskName, taskType }) {
    // Create list item
    let listItemEl = document.createElement("li");
    listItemEl.classList.add("task-item");
    // Create div holder
    let taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    // Add html content
    taskInfoEl.innerHTML =
        `<h3 class='task-name'>${taskName}</h3>
            <span class='task-type'>${taskType}</span>`;

    listItemEl.appendChild(taskInfoEl);
    // Add list item to list
    tasksToDoEl.appendChild(listItemEl);
}

formEl.addEventListener("submit", taskFormHandler);