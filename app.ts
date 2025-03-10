


interface Task {
    id: number;
    title: string;
    states: string; 
    startDate: string;
    endDate: string;
}


const taskTitle = document.getElementById("taskTitle") as HTMLInputElement;
const startDate = document.getElementById("startDate") as HTMLInputElement;
const endDate = document.getElementById("endDate") as HTMLInputElement;
const addTaskBtn = document.getElementById("addTaskBtn") as HTMLButtonElement;
const tasksContainer = document.getElementById("tasksContainer") as HTMLUListElement;

// انشاء Array للداتا من local storage 
let tasks: Task[] = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")!) : [];
let lastId: number = localStorage.getItem("lastId") ? parseInt(localStorage.getItem("lastId")!) : 0;



// عرض التاسكات  
window.onload = displayTasks;



// إضافة تاسك جديد
function addTask(): void {
    if (!taskTitle.value.trim() || !startDate.value || !endDate.value) {
        alert("Please fill in all fields!");
        return;
    }

    const newTask: Task = {
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
function displayTasks(): void {
    tasksContainer.innerHTML = ""; // تفريغ القائمة قبل عرضها من جديد
    tasks.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.className = "task-item";
        taskItem.innerHTML = `
            <span>${task.title} (${task.startDate} - ${task.endDate})</span>
            <span>Status: <strong>${task.states}</strong></span>
            <div>

                ${
                    task.states === "Pending" 
                    ? `<button onclick="editTask(${task.id})">Edit</button>` 
                    : ""
                }
                ${
                    task.states === "Pending" 
                    ? `<button onclick="deleteTask(${task.id})">Delete</button>` 
                    : ""
                }
                    ${
                    task.states === "Pending" 
                    ? `<button onclick="toggleTaskStatus(${task.id})">✅ Complete</button>` 
                    : "" // إذا كانت المهمة "Completed" لن يظهر الزر
                }
            </div>
        `;
        tasksContainer.appendChild(taskItem);
    });
}



// تغيير حالة التاسك
function toggleTaskStatus(id: number): void {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].states = "Completed"; // تغيير الحالة مباشرة إلى "Completed"
        saveTasks();
        displayTasks();
    }
}


// حذف تاسك
function deleteTask(id: number): void {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    displayTasks();
}


// تعديل تاسك
function editTask(id: number): void {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        taskTitle.value = tasks[taskIndex].title;
        startDate.value = tasks[taskIndex].startDate;
        endDate.value = tasks[taskIndex].endDate;

        // قبل الحذف، نحتاج لتحديث lastId لضمان أنه لا يتم فقدان المعرفات
        lastId = Math.max(...tasks.map(task => task.id)); // تحديث lastId ليأخذ أكبر قيمة موجودة من المهام
        deleteTask(id); // حذف المهمة بعد أخذ القيم
    }
}


// حفظ التاسكات في Local Storage
function saveTasks(): void {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("lastId", (lastId).toString()); // حفظ الـ lastId بعد التحديث
}


// ربط زر الإضافة بوظيفة `addTask`
addTaskBtn.addEventListener("click", addTask);