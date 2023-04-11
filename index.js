class TaskManager {
  constructor() {
    this.taskList = JSON.parse(localStorage.getItem('tasks')) || [];
    this.storageKey = 'tasks';
  }

  // Create a new task object

    createTask = (description) => {
      const newTask = {
        description,
        completed: false,
        index: this.taskList.length + 1,
      };
      this.taskList.push(newTask);
      this.saveTasks();
    }

    // Returns an HTML template for a task

    displayWindow = (task) => `
      <div class="todoactivities" data-task-index="${task.index}">
        <label for="Item${task.index}" class="tasks-list">
          <button type="button" class="check-box ${task.completed ? 'checked' : ''}">&#x2713;</button>
          <input type="text" class="li-activity ${task.completed ? 'checked' : ''}" value="${task.description}" name="Item${task.index}" id="Item${task.index}">
            
        </label>
        <div id="index${task.index}" class="delete-button">
          <i class="bi bi-trash3-fill novisible trash" id="delete${task.index}"></i>
          <i class="bi bi-three-dots-vertical ellipse"></i>
        </div>
      </div>
    `

    // Find all checkboxes for each activity and update the task completion

    loadCheckBoxes = () => {
      const checkBoxes = document.querySelectorAll('.check-box');
      checkBoxes.forEach((checkbox) => {
        checkbox.addEventListener('click', (e) => {
          const taskId = parseInt(e.target.parentElement.parentElement.dataset.taskIndex, 10);
          const task = this.taskList.find((t) => t.index === taskId);
          task.completed = !task.completed;
          this.saveTasks();
          e.target.classList.toggle('checked');
          const input = e.target.parentElement.querySelector('.li-activity');
          input.classList.toggle('checked');
          this.completionState(parseInt(e.target.parentElement.parentElement.id, 10));
        });
      });
    }

    // Update the completion state of a task based on its parent index.

    completionState = (parentIndex) => {
      for (let i = 0; i < this.taskList.length; i += 1) {
        if (this.taskList[i].index === parentIndex + 1) {
          if (this.taskList[i].completed === true) {
            this.taskList[i].completed = false;
            this.saveTasks();
            return;
          }
          if (this.taskList[i].completed === false) {
            this.taskList[i].completed = true;
            this.saveTasks();
          }
        }
      }
    }

    // Activities added to the activities-list section of the HTML page.

    loadActivities = () => {
      const activitiesListSection = document.getElementById('activities-list');
      for (let i = 0; i < this.taskList.length; i += 1) {
        const itemList = document.createElement('li');
        itemList.id = i + 1;
        itemList.innerHTML = this.displayWindow(this.taskList[i]);
        activitiesListSection.appendChild(itemList);
      }
      this.loadCheckBoxes();
    }

    // Removes the corresponding task from tasklists.

    deleteTask = (taskId) => {
      this.taskList.splice(taskId, 1);
      for (let i = taskId; i < this.taskList.length; i += 1) {
        this.taskList[i].index -= 1;
      }
      this.saveTasks();
    }

    // Update the task activity

    upDateTask = (taskId, newDescription) => {
      this.taskList[taskId].description = newDescription;
      this.saveTasks();
      window.location.reload();
    }

    // Save the current tasklist.

    saveTasks = () => {
      localStorage.setItem(this.storageKey, JSON.stringify(this.taskList));
    }
}

const taskManager = new TaskManager();
taskManager.loadActivities();

const activitiesInput = document.getElementById('activities-input');
const addActivityBtn = document.getElementById('add-activity-btn');

// Add activity icon click action

addActivityBtn.addEventListener('click', () => {
  const activityValue = activitiesInput.value;
  if (activityValue !== '') {
    window.location.reload();
    taskManager.createTask(activityValue);
    activitiesInput.value = '';
  }
});

// Add activity press enter action

activitiesInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const activityValue = activitiesInput.value;
    if (activityValue !== '') {
      window.location.reload();
      taskManager.createTask(activityValue);
      activitiesInput.value = '';
    }
  }
});

// delete icon action

const deleteButton = document.querySelectorAll('.trash');
deleteButton.forEach((button) => {
  button.addEventListener('click', (e) => {
    const taskId = parseInt(e.target.parentElement.parentElement.id, 10);
    taskManager.deleteTask(taskId);
    window.location.reload();
  });
});

// update activity event listener

const activityField = document.querySelectorAll('.li-activity');
activityField.forEach((field, i) => {
  field.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const newDescription = e.target.value;
      taskManager.upDateTask(i, newDescription);
    }
  });
});

// clear button action

const clearButton = document.getElementById('clear-button');
clearButton.addEventListener('click', () => {
  taskManager.taskList = taskManager.taskList.filter((task) => !task.completed);
  taskManager.saveTasks();
  window.location.reload();
});
