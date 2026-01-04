$(document).ready(function() {
  let taskList = [];
  let activeView = "all";
  
  displayTasks();
  
  // Create new task
  $("#createTask").click(createNewTask);
  $("#newTask").keypress(function(e) {
    if (e.which === 13) createNewTask();
  });
  
  function createNewTask() {
    let taskContent = $("#newTask").val().trim();
    if (taskContent !== "") {
      taskList.push({ content: taskContent, isDone: false });
      displayTasks();
      $("#newTask").val("");
    }
  }
  
  // Mark task as complete/incomplete
  $("#allTasks").on("click", ".task-content", function() {
    let taskIndex = $(this).parent().data("position");
    taskList[taskIndex].isDone = !taskList[taskIndex].isDone;
    displayTasks();
  });
  
  // Remove task
  $("#allTasks").on("click", ".remove-btn", function(e) {
    e.stopPropagation();
    let taskIndex = $(this).parent().parent().data("position");
    taskList.splice(taskIndex, 1);
    displayTasks();
  });
  
  // Modify task
  $("#allTasks").on("click", ".modify-btn", function(e) {
    e.stopPropagation();
    let taskIndex = $(this).parent().parent().data("position");
    let updatedContent = prompt("Update your task:", taskList[taskIndex].content);
    if (updatedContent !== null && updatedContent.trim() !== "") {
      taskList[taskIndex].content = updatedContent.trim();
      displayTasks();
    }
  });
  
  // View filter
  $(".view-btn").click(function() {
    $(".view-btn").removeClass("selected");
    $(this).addClass("selected");
    activeView = $(this).data("view");
    displayTasks();
  });
  
  // Display tasks based on filter
  function displayTasks() {
    $("#allTasks").empty();
    let visibleCount = 0;
    
    taskList.forEach((task, idx) => {
      if (
        activeView === "all" ||
        (activeView === "completed" && task.isDone) ||
        (activeView === "pending" && !task.isDone)
      ) {
        visibleCount++;
        let taskItem = $("<li>").attr("data-position", idx);
        let contentDiv = $("<div>").addClass("task-content").text((task.isDone ? "✓ " : "○ ") + task.content);
        if (task.isDone) contentDiv.addClass("done");
        
        let btnContainer = $("<div>").addClass("action-btns");
        let modifyButton = $("<button>").text("Edit").addClass("modify-btn");
        let removeButton = $("<button>").text("Delete").addClass("remove-btn");
        btnContainer.append(modifyButton, removeButton);
        
        taskItem.append(contentDiv, btnContainer);
        $("#allTasks").append(taskItem);
      }
    });
    
    // Update summary
    let completedCount = taskList.filter(t => t.isDone).length;
    let totalCount = taskList.length;
    if (totalCount === 0) {
      $("#taskSummary").text("No tasks yet - add one to get started!");
    } else {
      $("#taskSummary").text(`${totalCount} total tasks • ${completedCount} completed • ${totalCount - completedCount} remaining`);
    }
  }
});
 // Save to localStorage
  function saveTasks() {
    localStorage.setItem("taskList", JSON.stringify(taskList));
  }

  // Task summary
  function updateSummary() {
    let completed = taskList.filter(t => t.isDone).length;
    let total = taskList.length;

    if (total === 0) {
      $("#taskSummary").text("No tasks yet - add one to get started!");
    } else {
      $("#taskSummary").text(
        `${total} total • ${completed} completed • ${total - completed} remaining`
      );
    }
  }
});