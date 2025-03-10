var taskTitle = document.getElementById("taskTitle");
var startDate = document.getElementById("startDate");
var endDate = document.getElementById("endDate");
var addTaskBtn = document.getElementById("addTaskBtn");
var tasksContainer = document.getElementById("tasksContainer");
// انشاء Array للداتا من local storage 
var tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];
var lastId = localStorage.getItem("lastId") ? parseInt(localStorage.getItem("lastId")) : 0;
// عرض التاسكات  
window.onload = displayTasks;
// إضافة تاسك جديد
function addTask() {
    if (!taskTitle.value.trim() || !startDate.value || !endDate.value) {
        alert("Please fill in all fields!");
        return;
    }
    var newTask = {
        id: lastId + 1, // استخدام lastId لزيادة الرقم
        title: taskTitle.value.trim(),
        states: "Pending",
        startDate: startDate.value,
        endDate: endDate.value
    };
    tasks.push(newTask);
    lastId++; // زيادة قيمة lastId بعد إضافة المهمة
    saveTasks();
    displayTasks();
    taskTitle.value = "";
    startDate.value = "";
    endDate.value = "";
}
// عرض التاسكات 
function displayTasks() {
    tasksContainer.innerHTML = ""; // تفريغ القائمة قبل عرضها من جديد
    tasks.forEach(function (task) {
        var taskItem = document.createElement("li");
        taskItem.className = "task-item";
        taskItem.innerHTML = "\n            <span>".concat(task.title, " (").concat(task.startDate, " - ").concat(task.endDate, ")</span>\n            <span>Status: <strong>").concat(task.states, "</strong></span>\n            <div>\n\n                ").concat(task.states === "Pending"
            ? "<button onclick=\"editTask(".concat(task.id, ")\">Edit</button>")
            : "", "\n                ").concat(task.states === "Pending"
            ? "<button onclick=\"deleteTask(".concat(task.id, ")\">Delete</button>")
            : "", "\n                    ").concat(task.states === "Pending"
            ? "<button onclick=\"toggleTaskStatus(".concat(task.id, ")\">\u2705 Complete</button>")
            : "" // إذا كانت المهمة "Completed" لن يظهر الزر
        , "\n            </div>\n        ");
        tasksContainer.appendChild(taskItem);
    });
}
// تغيير حالة التاسك
function toggleTaskStatus(id) {
    var taskIndex = tasks.findIndex(function (task) { return task.id === id; });
    if (taskIndex !== -1) {
        tasks[taskIndex].states = "Completed"; // تغيير الحالة مباشرة إلى "Completed"
        saveTasks();
        displayTasks();
    }
}
// حذف تاسك
function deleteTask(id) {
    tasks = tasks.filter(function (task) { return task.id !== id; });
    saveTasks();
    displayTasks();
}
// تعديل تاسك
function editTask(id) {
    var taskIndex = tasks.findIndex(function (task) { return task.id === id; });
    if (taskIndex !== -1) {
        taskTitle.value = tasks[taskIndex].title;
        startDate.value = tasks[taskIndex].startDate;
        endDate.value = tasks[taskIndex].endDate;
        // قبل الحذف، نحتاج لتحديث lastId لضمان أنه لا يتم فقدان المعرفات
        lastId = Math.max.apply(Math, tasks.map(function (task) { return task.id; })); // تحديث lastId ليأخذ أكبر قيمة موجودة من المهام
        deleteTask(id); // حذف المهمة بعد أخذ القيم
    }
}
// حفظ التاسكات في Local Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("lastId", (lastId).toString()); // حفظ الـ lastId بعد التحديث
}
// ربط زر الإضافة بوظيفة `addTask`
addTaskBtn.addEventListener("click", addTask);
