let taskIdCounter = 0;
const formEl = document.querySelector("#task-form");
const tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

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
        name: taskNameInput,
        type: taskTypeInput,
    }

    if (isEdit) {
        taskData.taskId = formEl.getAttribute("data-task-id");;
        completeEditTask(taskData);
    } else {
        taskData.status = "to do";
        renderTask(taskData);
    }

}

//Renders a task to the page
function renderTask(taskData) {
    // Create list item
    let taskItemEl = document.createElement("li");
    taskItemEl.classList.add("task-item");
    taskItemEl.setAttribute("data-task-id", taskIdCounter);
    taskItemEl.setAttribute("draggable", "true");

    // Create div holder
    let taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    // Add task name and type
    taskInfoEl.innerHTML =
        `<h3 class='task-name'>${taskData.name}</h3>
            <span class='task-type'>${taskData.type}</span>`;

    // Add content to list item holder and list
    taskItemEl.appendChild(taskInfoEl);
    let taskActionsEl = createTaskActions(taskIdCounter);
    taskItemEl.appendChild(taskActionsEl);

    switch (taskData.status) {
        case ("to do"):
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.appendChild(taskItemEl);
            break;
        case "completed":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.appendChild(taskItemEl);
            break;
        case "in progress":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(taskItemEl);
            break;
    }




    //Update task data object
    taskData.id = taskIdCounter;
    tasks.push(taskData);
    saveTasks();
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
    actionsContainerEl.appendChild(statusSelectEl);


    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        // create and append option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        statusSelectEl.appendChild(statusOptionEl);
    }
    // actionsContainerEl.appendChild(statusSelectEl);
    return actionsContainerEl;

}

formEl.addEventListener("submit", taskFormHandler);

function deleteTask(taskId) {
    let task = document.querySelector(`.task-item[data-task-id='${taskId}']`);
    task.remove();

    // update task array
    let updatedTaskArr = [];
    for (let i = 0; i < tasks.length; i++) {
        // don't add task if there is an ID match
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    tasks = updatedTaskArr;
    saveTasks();
}

function editTask(taskId) {
    let task = document.querySelector(`.task-item[data-task-id='${taskId}']`);
    let taskName = task.querySelector("h3.task-name").textContent;
    let taskType = task.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
}

function completeEditTask({ name, type, taskId }) {
    let task = document.querySelector(`.task-item[data-task-id='${taskId}']`)
    task.querySelector("h3.task-name").textContent = name;
    task.querySelector("span.task-type").textContent = type;
    //update task arrays
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }
    saveTasks();
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

function taskStatusChangeHandler(e) {
    // Get task id, selected status option and task
    let taskId = e.target.getAttribute("data-task-id");
    let statusValue = e.target.value.toLowerCase();
    let task = document.querySelector(`.task-item[data-task-id='${taskId}']`);
    // Move task to the correct section
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(task);
    } else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(task);
    } else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(task);
    }

    // update task's in tasks array
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    saveTasks();
}

function dragTaskHandler(e) {
    if (e.target.matches("li.task-item")) {
        let taskId = e.target.getAttribute("data-task-id");
        e.dataTransfer.setData("text/plain", taskId);
    }
}

function dropZoneDragHandler(e) {
    // If target is within a task list
    let taskListEl = e.target.closest(".task-list");
    if (taskListEl) {
        e.preventDefault();
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
}

function dropTaskHandler(e) {
    e.preventDefault();

    // Get id and draggaed element
    let id = e.dataTransfer.getData("text/plain");
    let draggableElement = document.querySelector(`[data-task-id='${id}']`);
    // Get dropzone element
    let dropZoneEl = e.target.closest(".task-list");
    let statusType = dropZoneEl.id;

    // Get element status type and update it according to the drop zone 
    let statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    if (statusType === "tasks-to-do") {
        statusSelectEl.selectedIndex = 0;
    }
    else if (statusType === "tasks-in-progress") {
        statusSelectEl.selectedIndex = 1;
    }
    else if (statusType === "tasks-completed") {
        statusSelectEl.selectedIndex = 2;
    }
    dropZoneEl.removeAttribute("style");
    // Add task to drop zone
    dropZoneEl.appendChild(draggableElement);

    // update task's in tasks array
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }
    saveTasks();
}

// Remove styling of task list element when dragLeave
function dragLeaveHandler(e) {
    var taskListEl = e.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    var savedTasks = (JSON.parse(localStorage.getItem("tasks")) || []);
    savedTasks.forEach(task => {
        renderTask(task);
    });
}

pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);

loadTasks();
