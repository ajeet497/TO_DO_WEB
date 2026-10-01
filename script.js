
/* ==================================
   TODO APP - COMPLETE JAVASCRIPT
   DATE REMOVED
================================== */


/* =========================
   SELECT ELEMENTS
========================= */

const TaskInput = document.querySelector("#taskInput");
const categoryInput = document.querySelector("#categoryInput");
const Addbtn = document.querySelector("#taskbtn");
const work = document.querySelector(".work");

const allBtn = document.querySelector("#all");
const activeBtn = document.querySelector("#Active");
const completedBtn = document.querySelector("#completed");
const clearCompletedBtn = document.querySelector("#clearcompleted");

const thought = document.querySelector("#thought span");


/* =========================
   LOCAL STORAGE
========================= */

let tasks = [];

try {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
} catch (error) {
    tasks = [];
}

let currentFilter = "all";


/* =========================
   SAVE TASKS
========================= */

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


/* =========================
   UPDATE COUNTS
========================= */

function updateCount() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const active = total - completed;

    allBtn.innerText = `All (${total})`;
    activeBtn.innerText = `Active (${active})`;
    completedBtn.innerText = `Completed (${completed})`;

}


/* =========================
   UPDATE ACTIVE FILTER
========================= */

function updateActiveFilter() {

    [allBtn, activeBtn, completedBtn].forEach(function(button) {
        button.classList.remove("active-filter");
    });

    if (currentFilter === "all") {
        allBtn.classList.add("active-filter");
    }
    else if (currentFilter === "active") {
        activeBtn.classList.add("active-filter");
    }
    else if (currentFilter === "completed") {
        completedBtn.classList.add("active-filter");
    }

}


/* =========================
   ADD TASK
========================= */

function addTask() {

    const taskText = TaskInput.value.trim();

    if (taskText === "") {
        TaskInput.focus();
        return;
    }

    const newTask = {

        id: Date.now().toString() +
            Math.random().toString(36).slice(2),

        text: taskText,

        completed: false,

        category: categoryInput.value

    };

    tasks.push(newTask);

    saveTasks();

    TaskInput.value = "";
    categoryInput.value = "Study";

    currentFilter = "all";

    renderTasks();

    TaskInput.focus();

}


/* =========================
   CREATE TASK CARD
========================= */

function createTaskCard(task) {

    const newCard = document.createElement("div");

    newCard.classList.add("task-card");

    newCard.dataset.id = task.id;


    /* CHECKBOX */

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.checked = task.completed;

    checkbox.setAttribute("aria-label", "Mark task completed");


    /* TASK INFORMATION */

    const taskInfo = document.createElement("div");

    taskInfo.classList.add("task-info");


    /* TASK TITLE */

    const title = document.createElement("div");

    title.classList.add("task-title");

    title.textContent = task.text;

    if (task.completed) {
        title.classList.add("completed-title");
    }


    /* CATEGORY */

    const category = document.createElement("div");

    category.classList.add("category");

    category.textContent = task.category || "Other";


    /* ACTIONS */

    const actions = document.createElement("div");

    actions.classList.add("actions");


    /* EDIT BUTTON */

    const editBtn = document.createElement("button");

    editBtn.classList.add("edit");

    editBtn.textContent = "✏️";

    editBtn.title = "Edit Task";

    editBtn.setAttribute("aria-label", "Edit task");


    /* DELETE BUTTON */

    const deleteBtn = document.createElement("button");

    deleteBtn.classList.add("delete");

    deleteBtn.textContent = "🗑️";

    deleteBtn.title = "Delete Task";

    deleteBtn.setAttribute("aria-label", "Delete task");


    /* CHECKBOX EVENT */

    checkbox.addEventListener("change", function() {

        task.completed = checkbox.checked;

        saveTasks();

        renderTasks();

    });


    /* EDIT EVENT */

    editBtn.addEventListener("click", function() {

        const editInput = document.createElement("input");

        editInput.type = "text";

        editInput.classList.add("edit-input");

        editInput.maxLength = 150;

        editInput.value = task.text;


        const saveBtn = document.createElement("button");

        saveBtn.classList.add("save-edit");

        saveBtn.textContent = "✓";

        saveBtn.title = "Save";


        const cancelBtn = document.createElement("button");

        cancelBtn.classList.add("cancel-edit");

        cancelBtn.textContent = "✕";

        cancelBtn.title = "Cancel";


        taskInfo.replaceChild(editInput, title);

        editBtn.style.display = "none";

        actions.insertBefore(saveBtn, deleteBtn);

        actions.insertBefore(cancelBtn, deleteBtn);

        editInput.focus();

        editInput.select();


        function saveEdit() {

            const updatedText = editInput.value.trim();

            if (updatedText === "") {
                editInput.focus();
                return;
            }

            task.text = updatedText;

            saveTasks();

            renderTasks();

        }


        function cancelEdit() {
            renderTasks();
        }


        saveBtn.addEventListener("click", saveEdit);

        cancelBtn.addEventListener("click", cancelEdit);


        editInput.addEventListener("keydown", function(event) {

            if (event.key === "Enter") {
                saveEdit();
            }

            if (event.key === "Escape") {
                cancelEdit();
            }

        });

    });


    /* DELETE EVENT */

    deleteBtn.addEventListener("click", function() {

        tasks = tasks.filter(function(item) {
            return item.id !== task.id;
        });

        saveTasks();

        renderTasks();

    });


    /* APPEND ELEMENTS */

    taskInfo.appendChild(title);

    actions.appendChild(editBtn);

    actions.appendChild(deleteBtn);

    newCard.appendChild(checkbox);

    newCard.appendChild(taskInfo);

    newCard.appendChild(category);

    newCard.appendChild(actions);

    return newCard;

}


/* =========================
   RENDER TASKS
========================= */

function renderTasks() {

    work.innerHTML = "";

    let filteredTasks = tasks;


    if (currentFilter === "all") {
        filteredTasks = tasks;
    }

    else if (currentFilter === "active") {

        filteredTasks = tasks.filter(function(task) {
            return !task.completed;
        });

    }

    else if (currentFilter === "completed") {

        filteredTasks = tasks.filter(function(task) {
            return task.completed;
        });

    }


    if (filteredTasks.length === 0) {

        const emptyMessage = document.createElement("div");

        emptyMessage.classList.add("empty-message");

        if (currentFilter === "all") {
            emptyMessage.textContent =
                "No tasks yet. Add your first task! ✨";
        }

        else if (currentFilter === "active") {
            emptyMessage.textContent =
                "No active tasks. Great work! 🎉";
        }

        else {
            emptyMessage.textContent =
                "No completed tasks yet.";
        }

        work.appendChild(emptyMessage);

    }


    filteredTasks.forEach(function(task) {

        const card = createTaskCard(task);

        work.appendChild(card);

    });


    updateCount();

    updateActiveFilter();

}


/* =========================
   FILTER BUTTON EVENTS
========================= */

allBtn.addEventListener("click", function() {

    currentFilter = "all";

    renderTasks();

});


activeBtn.addEventListener("click", function() {

    currentFilter = "active";

    renderTasks();

});


completedBtn.addEventListener("click", function() {

    currentFilter = "completed";

    renderTasks();

});


/* =========================
   CLEAR COMPLETED
========================= */

clearCompletedBtn.addEventListener("click", function() {

    tasks = tasks.filter(function(task) {
        return !task.completed;
    });

    saveTasks();

    renderTasks();

});


/* =========================
   ADD BUTTON
========================= */

Addbtn.addEventListener("click", addTask);


/* =========================
   ENTER KEY
========================= */

TaskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


/* =========================
   RANDOM MOTIVATIONAL QUOTES
========================= */

const quotes = [

    "Life is unpredictable",
    "Believe in yourself",
    "Small steps lead to big results",
    "Dream big, work hard",
    "Every day is a fresh start",
    "Your future depends on what you do today",
    "Don't stop until you're proud",
    "Progress, not perfection",
    "Make today count",
    "Consistency is the key to success",
    "Success starts with self-discipline",
    "Your only limit is your mind",
    "Stay focused and never give up",
    "Great things take time",
    "One day or day one, you decide",
    "Be stronger than your excuses",
    "Work hard in silence, let success make the noise",
    "A little progress each day adds up",
    "Turn your dreams into plans",
    "The secret of getting ahead is getting started",
    "You are capable of amazing things",
    "Don't wait for opportunity, create it",
    "Focus on your goals, not your obstacles",
    "Your effort today shapes your tomorrow",
    "Difficult roads often lead to beautiful destinations",
    "Keep going, you're getting there",
    "Every expert was once a beginner",
    "Discipline beats motivation",
    "Be the reason you believe in yourself",
    "Your mindset determines your direction",
    "Start where you are, use what you have",
    "Don't compare your journey with others",
    "The best time to start is now",
    "A goal without action is just a wish",
    "Make yourself proud",
    "You don't have to be perfect to begin",
    "Learn from yesterday, live for today",
    "Success is built one day at a time",
    "Stay patient and trust your journey",
    "Your hard work will pay off",
    "Small actions create big changes",
    "Don't let fear stop your progress",
    "Be consistent even when nobody is watching",
    "Every challenge is an opportunity to grow",
    "Your potential is limitless",
    "Choose progress over excuses",
    "Keep learning, keep growing",
    "The journey matters as much as the destination",
    "Wake up with determination, go to bed with satisfaction",
    "Great things never come from comfort zones",
    "Be better than you were yesterday",
    "Your dreams deserve your effort",
    "Take one step at a time",
    "You are writing your own story",
    "Hard work creates opportunities",
    "Stay hungry for knowledge",
    "Turn obstacles into opportunities",
    "A focused mind can achieve great things",
    "Today is another chance to improve"

];


/* RANDOM QUOTE */

const randomIndex = Math.floor(Math.random() * quotes.length);

thought.textContent = quotes[randomIndex];


/* =========================
   INITIAL RENDER
========================= */

renderTasks();