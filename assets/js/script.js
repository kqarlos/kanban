let taskIdCounter = 0;
const formEl = document.querySelector("#task-form");
const tasksToDoEl = document.querySelector("#tasks-to-do");
const pageContentEl = document.querySelector("#page-content");
const tasksInProgressEl = document.querySelector("#tasks-in-progress");
const tasksCompletedEl = document.querySelector("#tasks-completed");
let tasks = [];

// Handles task form submission
function taskFormHandler(e) {
    e.preventDefault();
    //Gets name and type from form
    let taskNameInput = document.querySelector("input[name='task-name']").value;
    let taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("Fill out the task form!");
        return false;
    }

    formEl.reset();

    //Check if form input is an edit or a new task, render and update accordingly
    let isEdit = formEl.hasAttribute("data-task-id");
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
    // Create task list item
    let taskItemEl = document.createElement("li");
    taskItemEl.classList.add("task-item");
    taskItemEl.setAttribute("data-task-id", taskIdCounter);
    taskItemEl.setAttribute("draggable", "true");

    // Create task info elements
    let taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML =
        `<h3 class='task-name'>${taskData.name}</h3>
            <span class='task-type'>${taskData.type}</span>`;

    // Add info and actions elements to task list item
    taskItemEl.appendChild(taskInfoEl);
    let taskActionsEl = createTaskActions(taskIdCounter);
    taskItemEl.appendChild(taskActionsEl);

    //Check status render in the appropiate container element 
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

    //Update task data with ID
    taskData.id = taskIdCounter;
    // Update tasks list and local storage
    tasks.push(taskData);
    saveTasks();

    taskIdCounter++;
}

// Creates acton eleemetns for a task
function createTaskActions(taskId) {
    let actionsContainerEl = document.createElement("div");
    actionsContainerEl.className = "task-actions";

    //Create and append edit and delete buttons
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
    let statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    actionsContainerEl.appendChild(statusSelectEl);

    let statusChoices = ["To Do", "In Progress", "Completed"];
    for (let i = 0; i < statusChoices.length; i++) {
        // create and append option element
        let statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        statusSelectEl.appendChild(statusOptionEl);
    }
    return actionsContainerEl;
}

// Deletes a task from the task list
function deleteTask(taskId) {
    //Get task using the taskID and rmeove it from the DOM
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
    // Update tasks in localStorage
    saveTasks();
}

// Edit a task. Gets task info and displays it on the form to be edited
function editTask(taskId) {
    let task = document.querySelector(`.task-item[data-task-id='${taskId}']`);
    let taskName = task.querySelector("h3.task-name").textContent;
    let taskType = task.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
}

// renders updated task info
function completeEditTask({ name, type, taskId }) {
    // GEts task id and inf
    let task = document.querySelector(`.task-item[data-task-id='${taskId}']`)
    task.querySelector("h3.task-name").textContent = name;
    task.querySelector("span.task-type").textContent = type;
    //update task arrays and local storage
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = name;
            tasks[i].type = type;
        }
    }
    saveTasks();
    // resets form
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
    alert("Task Updated!");
}

// Checks the if the event target is a button and calls its respective handler
function taskButtonHandler(e) {
    let targetEl = e.target;
    if (targetEl.matches(".delete-btn")) {
        let taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    } else if (targetEl.matches(".edit-btn")) {
        let taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
}

// Gets task to be updated and appends it to it's new section
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

    // update task's in tasks array and local storage
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    saveTasks();
}

// Save task id to dataTransfer is element being drag is a task list item
function dragTaskHandler(e) {
    if (e.target.matches("li.task-item")) {
        let taskId = e.target.getAttribute("data-task-id");
        e.dataTransfer.setData("text/plain", taskId);
    }
}

// Change section background when hovering over with dragged task list item
function dropZoneDragHandler(e) {
    // If target is within a task section
    let taskListEl = e.target.closest(".task-list");
    if (taskListEl) {
        e.preventDefault();
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
}

// Handles status change when dropping task list item
function dropTaskHandler(e) {
    e.preventDefault();
    // Get id and dragged element
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
    // Revert section background style
    dropZoneEl.removeAttribute("style");
    // Add task to drop zone
    dropZoneEl.appendChild(draggableElement);

    // update task's in tasks array and localStorage
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }
    saveTasks();
}

// Remove styling of task list section when dragLeave
function dragLeaveHandler(e) {
    let taskListEl = e.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
}

// Save task list to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    var savedTasks = (JSON.parse(localStorage.getItem("tasks")) || []);
    savedTasks.forEach(task => {
        renderTask(task);
    });
}

// Event Listeners
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);

// Load tasks upon loading
$(loadTasks()); 
