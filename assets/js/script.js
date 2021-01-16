let taskIdCounter = 0;
const formEl = document.querySelector("#task-form");
const tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");

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

    var isEdit = formEl.hasAttribute("data-task-id");

    let taskData = {
        taskName: taskNameInput,
        taskType: taskTypeInput
    }

    if (isEdit) {
        taskData.taskId = formEl.getAttribute("data-task-id");;
        completeEditTask(taskData);
    } else {
        renderTask(taskData);
    }

}

//Renders a task to the page
function renderTask({ taskName, taskType }) {
    // Create list item
    let taskItemEl = document.createElement("li");
    taskItemEl.classList.add("task-item");
    taskItemEl.setAttribute("data-task-id", taskIdCounter);

    // Create div holder
    let taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    // Add task name and type
    taskInfoEl.innerHTML =
        `<h3 class='task-name'>${taskName}</h3>
            <span class='task-type'>${taskType}</span>`;

    // Add content to list item holder and list
    taskItemEl.appendChild(taskInfoEl);
    taskItemEl.appendChild(createTaskActions(taskIdCounter));
    tasksToDoEl.appendChild(taskItemEl);
    taskIdCounter++;
}

function createTaskActions(taskId) {
    let actionsContainerEl = document.createElement("div");
    actionsContainerEl.className = "task-actions";

    //Create and append action buttons
    let editBtnEl = document.createElement("button");
    editBtnEl.textContent = "Edit";
    editBtnEl.className = "btn edit-btn";
    editBtnEl.setAttribute("data-task-id", taskId);
    actionsContainerEl.appendChild(editBtnEl);

    let deleteBtnEl = document.createElement("button");
    deleteBtnEl.textContent = "Delete";
    deleteBtnEl.className = "btn delete-btn";
    deleteBtnEl.setAttribute("data-task-id", taskId);
    actionsContainerEl.appendChild(deleteBtnEl);

    // Create and append select elements
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        // create and append option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        statusSelectEl.appendChild(statusOptionEl);
    }
    actionsContainerEl.appendChild(statusSelectEl);

    return actionsContainerEl;

}

formEl.addEventListener("submit", taskFormHandler);

function deleteTask(taskId) {
    let task = document.querySelector(`.task-item[data-task-id='${taskId}']`);
    task.remove();
}

function editTask() {
    let task = document.querySelector(`.task-item[data-task-id='${taskId}']`);
    let taskName = task.querySelector("h3.task-name").value;
    let taskType = task.querySelector("span.task-type").value;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
}

function completeEditTask({ taskName, taskType, taskId }) {
    let task = document.querySelector(`.task-item[data-task-id=${taskId}]`)
    task.querySelector("h3.task-name").textContent = taskName;
    task.querySelector("span.task-type").textContent = taskType;
    alert("Task Updated!");
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}

function taskButtonHandler(e) {
    let targetEl = e.target;
    if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    } else if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

}

pageContentEl.addEventListener("click", taskButtonHandler);