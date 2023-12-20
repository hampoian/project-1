// script.js
document.addEventListener("DOMContentLoaded", function () {
    const taskList = document.getElementById("task-list");

    // Fetch tasks from the API and render them
    fetch("http://localhost:5000/tasks")
        .then(response => response.json())
        .then(tasks => renderTasks(tasks));

    function renderTasks(tasks) {
        taskList.innerHTML = "";

        tasks.forEach(task => {
            const taskDiv = createTaskElement(task);
            taskList.appendChild(taskDiv);
        });

        // Enable drag-and-drop
        enableDragAndDrop();
    }

    function createTaskElement(task) {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task";
        taskDiv.id = "task-" + task.id;
        taskDiv.textContent = task.title;
        taskDiv.draggable = true;
        taskDiv.dataset.taskId = task.id;

        taskDiv.addEventListener("dragstart", handleDragStart);
        taskDiv.addEventListener("dragover", handleDragOver);
        taskDiv.addEventListener("dragenter", handleDragEnter);
        taskDiv.addEventListener("dragleave", handleDragLeave);
        taskDiv.addEventListener("drop", handleDrop);
        taskDiv.addEventListener("dragend", handleDragEnd);

        const commentsDiv = document.createElement("div");
        commentsDiv.className = "comments";
        task.comments.forEach(comment => {
            const commentDiv = document.createElement("div");
            commentDiv.className = "comment";
            commentDiv.textContent = comment;
            commentsDiv.appendChild(commentDiv);
        });

        taskDiv.appendChild(commentsDiv);

        return taskDiv;
    }

    function enableDragAndDrop() {
        const tasks = document.querySelectorAll(".task");

        tasks.forEach(task => {
            task.addEventListener("dragstart", handleDragStart);
            task.addEventListener("dragover", handleDragOver);
            task.addEventListener("dragenter", handleDragEnter);
            task.addEventListener("dragleave", handleDragLeave);
            task.addEventListener("drop", handleDrop);
            task.addEventListener("dragend", handleDragEnd);
        });
    }

    let draggedTaskId;

    function handleDragStart(e) {
        draggedTaskId = e.target.dataset.taskId;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", draggedTaskId);
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDragEnter(e) {
        e.target.classList.add("drag-over");
    }

    function handleDragLeave(e) {
        e.target.classList.remove("drag-over");
    }

    function handleDrop(e) {
        e.preventDefault();
        const targetTaskId = e.target.dataset.taskId;

        if (draggedTaskId !== targetTaskId) {
            // Implement the reordering logic here
            console.log("Reordering logic:", draggedTaskId, targetTaskId);

            // Remove the drag-over class
            e.target.classList.remove("drag-over");
        }
    }

    function handleDragEnd() {
        const tasks = document.querySelectorAll(".task");
        tasks.forEach(task => {
            task.classList.remove("drag-over");
        });
    }
});
