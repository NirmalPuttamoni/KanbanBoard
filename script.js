const addRef = document.querySelector('.action-wrapper .add');
const removeRef = document.querySelector('.action-wrapper .delete');
const modeleRef = document.querySelector('.model');
const textareaRef = document.querySelector('.left-section textarea')
const taskTitleRef = document.querySelector('.left-section input');
const taskWrapperRef = document.querySelector('.tasks-wrapper');
const taskCategoryselectionRef = document.querySelectorAll('.right-section .category');
const categoryWrapperRef = document.querySelector('.category-wrapper');
const editRef = document.querySelector('.action-wrapper .edit');
const searchRef = document.querySelector('.tasks-search input');
const categorySectionRef = document.querySelector('.category-section-container');
const addBtnRef = document.querySelector('.left-section .add-btn');


addRef.addEventListener('click', e => {
    toggleModel();
});

function toggleModel() {
    defaultCategorySelection();
    const isHidden = modeleRef.classList.contains('hide');
    if (isHidden) {
        modeleRef.classList.remove('hide');
    }
    else {
        modeleRef.classList.add('hide');
    }
}

// Data collection
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

console.log(tasks)

function renderCacheData() {
    tasks.forEach(task => {
        createTask(task);
    })
}

renderCacheData();

function addDataIntoCache(newTask) {
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

addBtnRef.addEventListener('click', e => {

    const selectedCategory = document.querySelector('.right-section .category.selected').getAttribute('data-category');

    const title = taskTitleRef.value;
    const taskContent = textareaRef.value;

    if (title.trim() !== "" && taskContent.trim() !== "") {
        const newTask = {
            id: Math.floor((Math.random() * 1000) + 1),
            title: title,
            category: selectedCategory,
            taskContent: taskContent
        };
        addDataIntoCache(newTask);
        textareaRef.value = "";
        taskTitleRef.value = "";
        toggleModel();
        createTask(newTask);
    }
})


textareaRef.addEventListener('keydown', e => {

    if (e.key === 'Enter') {
        e.preventDefault();
        addBtnRef.click();
    }
    // const selectedCategory = document.querySelector('.right-section .category.selected').getAttribute('data-category'); 

    // if( e.key==='Enter' && e.target.value.trim() !=="" ){
    //     // console.log("Add Task", e.target.value);
    //     const newTask = {
    //         id : Math.floor((Math.random()*1000) +1),
    //         title : e.target.value,
    //         category: selectedCategory
    //     };
    //     addDataIntoCache(newTask);
    //     e.target.value="";
    //     toggleModel();
    //     createTask(newTask);
    // }
})


// function goToCategorySection(taskPriority, taskRef){
//     const boxRef = categorySectionRef.querySelectorAll('.box');
//     const backlogRef = categorySectionRef.querySelector('.Backlog');
//     const doingRef = categorySectionRef.querySelector('.Doing');
//     const reviewRef = categorySectionRef.querySelector('.Review');
//     const doneRef = categorySectionRef.querySelector('.Done');

//     boxRef.forEach( box => {
//         if(taskPriority==='p1'){
//             // backlogRef.appendChild()
//         }
//         if(taskPriority==='p2'){
//         }
//         if(taskPriority==='p3'){
//         }
//         if(taskPriority==='p4'){
//             console.log(taskPriority, taskRef);   
//         }
//     })
// }


function createTask(task) {
    const taskRef = document.createElement('div');
    taskRef.className = 'task';
    // taskRef.setAttribute('data-id',task.id);
    // <div class="task-edit-icon"></div>
    taskRef.dataset.id = task.id;
    taskRef.innerHTML = `
    <div class="task-category" data-priority="${task.category}"></div>
    <div class="task-id">ID : ${task.id}</div>
    <div class="task-title">Name : ${task.title}</div>
    <div class="task-content">
        <textarea>${task.taskContent}</textarea>
    </div>
    <div class="task-delete-icon"><i class="fa-duotone fa-trash"></i></div>
    `;

    // taskWrapperRef.appendChild(taskRef);

    const taskPriority = task.category;
    const boxRef = categorySectionRef.querySelectorAll('.box');
    const backlogRef = categorySectionRef.querySelector('.backlog');
    const doingRef = categorySectionRef.querySelector('.doing');
    const reviewRef = categorySectionRef.querySelector('.review');
    const doneRef = categorySectionRef.querySelector('.done');

    boxRef.forEach(box => {
        if (taskPriority === 'p1') {
            backlogRef.appendChild(taskRef);
        }
        if (taskPriority === 'p2') {
            doingRef.appendChild(taskRef);
        }
        if (taskPriority === 'p3') {
            reviewRef.appendChild(taskRef);
        }
        if (taskPriority === 'p4') {
            doneRef.appendChild(taskRef);
        }
    })




    // goToCategorySection(task.category);
    // console.log(taskRef);
    const textareaRef = taskRef.querySelector('.task-content textarea');
    textareaRef.addEventListener('change', e => {
        const updatedTextArea = e.target.value;
        const currentTaskId = task.id;
        // updateTitle(updatedTextArea, currentTaskId);
        updateTaskContent(updatedTextArea, currentTaskId);
        // console.log(updatedTextArea)
    })
}

taskCategoryselectionRef.forEach(ele => {
    ele.addEventListener('click', event => {
        removeSelection();
        event.target.classList.add('selected');
    })
})

function removeSelection() {
    taskCategoryselectionRef.forEach(ele => {
        ele.classList.remove('selected');
    })
}

// set P1 as Default category
function defaultCategorySelection() {
    const p1CategoryRef = document.querySelector('.right-section .category.p1');
    removeSelection();
    p1CategoryRef.classList.add('selected');
}

taskWrapperRef.addEventListener('click', e => {
    // Delete selected task
    if (e.target.classList.contains('fa-trash')) {
        const taskRef = e.target.closest('.task');
        // const taskId = taskRef.querySelector('.task-id').innerText;
        const taskId = taskRef.dataset.id;
        taskRef.remove();
        deleteTaskFromData(taskId);
    }
    // Change Priority of category
    if (e.target.classList.contains('task-category')) {

        const taskPriorityId = e.target.dataset.priority;
        const nextPriority = getNewPriority(taskPriorityId);
        e.target.dataset.priority = nextPriority;
        const taskId = e.target.parentNode.dataset.id;
        updatePriorityInCache(taskId, nextPriority);
    }

    // Title textArea Editable 
    // if(e.target.classList.contains('fa-pen')){

    //     const editIconRef = e.target.closest('.task-title');
    //     const titleTextareaRef = editIconRef.querySelector('textarea');

    //     if(editIconRef.classList.contains('editEnable')){
    //         editIconRef.classList.remove('editEnable');
    //         titleTextareaRef.disabled=true;
    //         // titleTextareaRef.style['pointer-events']= 'none';
    //     }
    //     else{
    //         editIconRef.classList.add('editEnable');
    //         titleTextareaRef.disabled=false;
    //         // titleTextareaRef.style['pointer-events']= 'all';
    //     }
    // }

})

// Change Priority
function getNewPriority(currentPriority) {

    const priorityList = ['p1', 'p2', 'p3', 'p4'];
    const currentPriorityIdx = priorityList.findIndex(a => currentPriority === a);
    const nextPriorityIdx = (currentPriorityIdx + 1) % (priorityList.length);

    return priorityList[nextPriorityIdx];
}

/************  Updating data in array and local storage ********************************/

//Delete task from cache
function deleteTaskFromData(taskId) {
    const selectedTaskIdx = tasks.findIndex((task) => Number(task.id) === Number(taskId));
    tasks.splice(selectedTaskIdx, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//Update Data in Cache
function updatePriorityInCache(taskId, nextPriority) {
    const taskIdIdx = tasks.findIndex(task => Number(taskId) === Number(task.id));
    tasks[taskIdIdx].category = nextPriority;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//Update Title data in Cache
// function updateTitle(newTextare, taskId) {
//     tasks.forEach(task => {
//         if (Number(task.id) === Number(taskId)) {
//             task.title = newTextare;
//         }
//     })
//     localStorage.setItem('tasks', JSON.stringify(tasks));
// }

//Update Title data in Cache
function updateTaskContent(newTextare, taskId) {
    tasks.forEach(task => {
        if (Number(task.id) === Number(taskId)) {
            task.taskContent = newTextare;
        }
    })
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/********************************  end  ********************************/


//Filter based on category

categoryWrapperRef.addEventListener('click', e => {
    if (e.target.classList.contains('category')) {
        const currentCategory = e.target.dataset.category;
        // console.log()
        filterCategory(currentCategory);
    }
})

function filterCategory(currentCategory) {
    const taskListRef = taskWrapperRef.querySelectorAll('.task');

    taskListRef.forEach(taskRef => {
        taskRef.classList.remove('hide');
        const taskCategory = taskRef.querySelector('.task-category').dataset.priority;
        if (taskCategory !== currentCategory) {
            taskRef.closest('.task').classList.add('hide');
        }
    })

}

// Enable delete functionality

removeRef.addEventListener('click', e => {
    console.log(e.target)
    if (e.target.classList.contains('enabled')) {
        e.target.classList.remove('enabled');
        taskWrapperRef.dataset.deleteDisabled = 'false';
    }
    else {
        e.target.classList.add('enabled');
        taskWrapperRef.dataset.deleteDisabled = 'true';
    }
})

// Edit enable  --> change category, edit textarea

editRef.addEventListener('click', e => {
    const editIconRef = e.target.closest('.edit');

    if (editIconRef.classList.contains('enabled')) {
        editIconRef.classList.remove('enabled');
        taskWrapperRef.dataset.editDisabled = 'false';
    }
    else {
        editIconRef.classList.add('enabled');
        taskWrapperRef.dataset.editDisabled = 'true';
    }
})

// Search by Task Id or Title

searchRef.addEventListener('keyup', e => {

    // using inMemory
    const remAlltasksRef = taskWrapperRef.querySelectorAll('.flex');
    // abcd.innerHTML = "";
    remAlltasksRef.forEach(e => {
        e.innerHTML = "";
    })
    // taskWrapperRef.innerHTML = "";
    tasks.forEach(task => {
        const serachText = e.target.value.toLowerCase();
        const currentTaskText = task.title.toLowerCase();
        const currentTaskId = String(task.id);
        if (currentTaskText.includes(serachText) || currentTaskId.includes(serachText) || serachText.trim() === "") {
            createTask(task);
        }
    })
    // using DOM
})