const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`
const form = document.querySelector('form')
const input = document.querySelector('input')
const deleteAllBtns = document.querySelectorAll('.delete-btn')
const backBtn = document.querySelector('.back-btn')

const navBtns = document.querySelectorAll('.nav__btn')
const categorizedBtn =  navBtns[0]
const uncategorizedBtn =  navBtns[1]

const categorizedList =  document.querySelector('.list-categorized .list')
const categorizedListProgress = categorizedList.parentElement.querySelector('.progress')
const categorizedListDelBtn = categorizedList.parentElement.querySelector('.delete-btn')

const categorizedTasksList = document.querySelector('.list-categorized-tasks .list')
const categorizedTasksListProgress = categorizedTasksList.parentElement.querySelector('.progress')
const tasksCategory = document.querySelector('.tasks-category')

const uncategorizedList = document.querySelector('.list-uncategorized .list')

const categorizedListExistingData = JSON.parse(localStorage.getItem('categorized-list'))
let CATEGORIZED_LIST = categorizedListExistingData || []
let completedCategory = 0
let completedCategoryTask = 0
let lastVisitedCategory = null
let taskCount = 0



// load/read existing category list from local storage
CATEGORIZED_LIST.forEach(list => {
    const li = document.createElement('li')
    categorizedList.appendChild(li)
    li.classList.add('list__item')
    li.id = list.id
    if(list.completed) {
        li.classList.add('marked')
        ++completedCategory
    }
    li.innerHTML = `    <button class="edit-btn">Edit</button>
                        <button class="ok-btn">Ok</button>
                        <div class="editing-area">
                            <input>
                            <button class="cancel-btn">Cancel</button>
                        </div>
                        <div class="radio-btn"></div>
                            <p>${list.category}</p>
                            <div class="trash-icon">
                                ${trashIcon}
                            </div>
                        <strong class="tasks-count">${list.tasksList.tasks.length} tasks</strong>
                    `;
    li.addEventListener('click', function(){ showCategoryTasksList(categorizedList, list.category, li)})
    
    const editBtn = li.querySelector('.edit-btn')
    editBtn.addEventListener('click', function(e){ edit(e, li, editBtn) })

    const trashIconBtn = li.querySelector('.trash-icon')
    trashIconBtn.addEventListener('click', function(e){ deleteRow(e, li, list.id) })

    const radioBtn = li.querySelector('.radio-btn')
    radioBtn.addEventListener('click', function(e) { markListItem(e, li, list.id) })

    categorizedListProgress.innerText = `${completedCategory}/${CATEGORIZED_LIST.length} completed`
    toggleFooter(categorizedList)
})


form.addEventListener('submit', function(e) {
    e.preventDefault()
    addNewTodos()
})

// add new to Dos
function addNewTodos() {
    if(input.value.trim() == 0) return;
        
    switch(form.dataset.list ) {
        case 'categorized':
            addNewCategory()
            break
        case 'categorized_tasks':
            createCategoryTasks()
            break
        case 'uncategorized':
            createUncategorizedTasks()
            break
    }

    clearInput()
}

// add category
function addNewCategory() {
    const id = 'li_' + Date.now()
    const category = input.value
    const li = document.createElement('li')
    categorizedList.appendChild(li)
    li.classList.add('list__item')
    li.id = id
    li.innerHTML = `
                        <button class="edit-btn">Edit</button>
                        <button class="ok-btn">Ok</button>
                        <div class="editing-area">
                            <input>
                            <button class="cancel-btn">Cancel</button>
                        </div>
                        <div class="radio-btn"></div>
                            <p>${category}</p>
                            <div class="trash-icon">${trashIcon}</div>
                        <strong class="tasks-count">${0} tasks</strong>
                    `;
    li.addEventListener('click', function(){ showCategoryTasksList(categorizedList, category, li) })

    const editBtn = li.querySelector('.edit-btn')
    editBtn.addEventListener('click', function(e){ edit(e, li, editBtn) })

    const trashIconBtn = li.querySelector('.trash-icon')
    trashIconBtn.addEventListener('click', function(e){ deleteRow(e, li, id) })

    const radioBtn = li.querySelector('.radio-btn')
    radioBtn.addEventListener('click', function(e) { markListItem(e, li, id) })

    CATEGORIZED_LIST.push(
        {
            id,
            category: category,
            completed: false,
            tasksList: {completedTasks: 0, tasks: []},
        }
    )
    updateLocalStorage()

    categorizedListProgress.innerText = `${completedCategory}/${CATEGORIZED_LIST.length} completed`
    toggleFooter(categorizedList) 
}

// edit category
function edit(e, listItem, editBtn) {
    e.stopPropagation()
    editBtn.classList.add('hidden')
    const okBtn = listItem.querySelector('.ok-btn')
    const editingArea = listItem.querySelector('.editing-area')
    const cancelBtn = editingArea.querySelector('.cancel-btn') 
    const input = editingArea.querySelector('.editing-area input')
    const p = listItem.querySelector('p')

    input.value = p.innerText

    cancelBtn.addEventListener('click', function(e){ cancelEdit(e, editBtn, okBtn, editingArea) })
    okBtn.addEventListener('click', function(e){ updateEdit(e, input.value, p, editBtn, editingArea, okBtn, cancelBtn, listItem) })
    okBtn.classList.add('revealed')

    editingArea.classList.add('revealed')
    editingArea.addEventListener('click', function(e){ e.stopPropagation() })


}

// cancel edit
function cancelEdit(e, editBtn, okBtn, editingArea) {
    editBtn.classList.remove('hidden')
    okBtn.classList.remove('revealed')
    editingArea.classList.remove('revealed')
}

// update edited category 
 function updateEdit(e, newValue, p, editBtn, editingArea, okBtn, cancelBtn, listItem) {
    e.stopPropagation()
    if(newValue.trim().length == 0) return;

    p.innerText = newValue
    editBtn.classList.remove('hidden')
    okBtn.classList.remove('revealed')
    editingArea.classList.remove('revealed')

    const foundListItem = CATEGORIZED_LIST.find(list => list.id == listItem.id)
    foundListItem.category = newValue
    updateLocalStorage()
}

// show or navigate to category list's tasks if it has
function showCategoryTasksList(list, title, listItem) {
    form.dataset.list = 'categorized_tasks'
    input.placeholder = 'add new task here'
    input.value = ''
    categorizedList.parentElement.style.display = 'none'
    categorizedTasksList.parentElement.style.display = 'flex'
    categorizedBtn.style.color = '#EFEFEF'

    tasksCategory.innerText = title
    lastVisitedCategory = listItem
    loadCagtegoryTasks()
    toggleFooter(list)
}

// load or render tasks from clicked category
function loadCagtegoryTasks() {
    const listItem = CATEGORIZED_LIST.find(list => list.id == lastVisitedCategory.id)
    listItem.tasksList.tasks.forEach(task => {

        const li = document.createElement('li')
        categorizedTasksList.appendChild(li)
        li.classList.add('list__item')
        li.id = task.id
        if(task.marked) {
            li.classList.add('marked')
            ++completedCategoryTask
        }
        li.innerHTML = `    
                            <div class="radio-btn"></div>
                            <p>${task.task}</p>
                            <div class="trash-icon">
                                ${trashIcon}
                            </div>
                        `;
        const trashIconBtn = li.querySelector('.trash-icon')
        trashIconBtn.addEventListener('click', function(e){ deleteRow(e, li, task.id) })

        const radioBtn = li.querySelector('.radio-btn')
        radioBtn.addEventListener('click', function(e) { markListItem(e, li, task.id) })

        const foundIndex = CATEGORIZED_LIST.findIndex(list => list.id == lastVisitedCategory.id)
        // CATEGORIZED_LIST[foundIndex].tasksList.tasks.push(task)
        taskCount = CATEGORIZED_LIST[foundIndex].tasksList.tasks.length
        // toggleFooter(categorizedList) 
        categorizedTasksListProgress.innerText = `${completedCategoryTask}/${taskCount} completed`
        updateCategoryTasksCount()
        updateLocalStorage()
        toggleFooter(categorizedTasksList)
    })
}

// mark/outline list item
function markListItem(e, li, id) {
    e.stopPropagation()
    li.classList.toggle('marked')
    const isMarked = li.classList.contains('marked')
    switch(form.dataset.list) {
        case 'categorized': {
            isMarked ? ++completedCategory  : --completedCategory
            const foundIndex = CATEGORIZED_LIST.findIndex(list => list.id == id)
            CATEGORIZED_LIST[foundIndex].completed = isMarked
            categorizedListProgress.innerText = `${completedCategory}/${CATEGORIZED_LIST.length} completed`
            updateLocalStorage()
            break
        }
        case 'categorized_tasks':   {
            isMarked ? ++completedCategoryTask  : --completedCategoryTask
            const foundIndex = CATEGORIZED_LIST.findIndex(list => list.id == lastVisitedCategory.id)
            const tasks = CATEGORIZED_LIST[foundIndex].tasksList.tasks
            tasks.find(task => task.id == id).marked = isMarked
            CATEGORIZED_LIST.find(category => category.id == lastVisitedCategory.id).tasksList.completedTasks = completedCategoryTask

            categorizedTasksListProgress.innerText = `${completedCategoryTask}/${taskCount} completed`
            updateCategoryTasksCount()
            updateLocalStorage()
            break
        }   
    }

    
}

// delete row
function deleteRow(e, listItem, id) {
    e.stopPropagation()
    const list = listItem.parentElement
    list.removeChild(listItem)
    const isMarked = listItem.classList.contains('marked')

    switch(form.dataset.list) {
        case 'categorized':
            isMarked ? --completedCategory : 'do nothing'
            CATEGORIZED_LIST = CATEGORIZED_LIST.filter(list => list.id != id)
            categorizedListProgress.innerText = `${completedCategory}/${CATEGORIZED_LIST.length} completed`
            updateLocalStorage()
            break
        case 'categorized_tasks':
            isMarked ? --completedCategoryTask : 'do nothing'
            const foundIndex = CATEGORIZED_LIST.findIndex(list => list.id == lastVisitedCategory.id)
            const tasks = CATEGORIZED_LIST[foundIndex].tasksList.tasks
            const updatedTasks = tasks.filter(task => task.id != id)
            CATEGORIZED_LIST[foundIndex].tasksList.tasks = updatedTasks
            taskCount = updatedTasks.length
            categorizedTasksListProgress.innerText = `${completedCategoryTask}/${taskCount} completed`
            updateCategoryTasksCount()
            updateLocalStorage()
            break
    }
    toggleFooter(list)
}

// clear input 
function clearInput() {
    input.value = ''
}

// back button 
backBtn.addEventListener('click', function() {
    form.dataset.list = 'categorized'
    input.placeholder = 'what is it about?'
    input.value = ''
    categorizedList.parentElement.style.display = 'flex'
    categorizedTasksList.parentElement.style.display = 'none'
    categorizedBtn.style.color = ''
    removeLoadedTaskAndInfo()

})

// remove loaded task and it's info after heading back
function removeLoadedTaskAndInfo() {
    categorizedTasksList.innerHTML = ''
    completedCategoryTask = 0   
}

// hide list-footer elements 
function toggleFooter(list) {

    // if we are inside the tasks of category 
    if(form.dataset.list == 'categorized_tasks') {
        list = categorizedTasksList
    }

    const isListNotEmpty = list.firstElementChild
    const footer = list.parentElement.querySelector('.list-footer')
    const emptyWord = list.parentElement.querySelector('.empty-word')
    emptyWord.style.display = isListNotEmpty ? 'none' : 'inline'
    footer.style.display = isListNotEmpty ? 'flex' : 'none'
}

// update localstorage
function updateLocalStorage() {
    localStorage.setItem('categorized-list', JSON.stringify(CATEGORIZED_LIST))
    localStorage.setItem('categorized-list_completed', completedCategory)

    if(CATEGORIZED_LIST.length == 0) {
        localStorage.removeItem('categorized-list')
        localStorage.removeItem('categorized-list_completed')
    }
}

// delete or empty the current list
deleteAllBtns.forEach(btn => {
    btn.addEventListener('click', deleteCurrentList)
})

function deleteCurrentList(e) {
    const list = e.currentTarget.parentElement.parentElement.querySelector('.list')

    if(list.parentElement.classList.contains('list-categorized')) {
        categorizedList.innerHTML = ''
        CATEGORIZED_LIST = []
        completedCategory = 0
        localStorage.removeItem('categorized-list')
        localStorage.removeItem('categorized-list_completed')
    
    }else if(list.parentElement.classList.contains('list-categorized-tasks')) {
        categorizedTasksList.innerHTML = ''
        CATEGORIZED_LIST.find(category => category.id == lastVisitedCategory.id).tasksList.tasks = []
        
    }else if(list.parentElement.classList.contains('list-uncategorized')) {

    }
    toggleFooter(list)
}

// create category tasks
function createCategoryTasks() {
    const id = 'li_' + Date.now()
    const task = input.value
    const li = document.createElement('li')
    categorizedTasksList.appendChild(li)
    li.classList.add('list__item')
    li.id = id
    li.innerHTML = `
                        <div class="radio-btn"></div>
                        <p>${task}</p>
                        <div class="trash-icon">
                            ${trashIcon}
                        </div>
                    `;
    const trashIconBtn = li.querySelector('.trash-icon')
    trashIconBtn.addEventListener('click', function(e){ deleteRow(e, li, id) })

    const radioBtn = li.querySelector('.radio-btn')
    radioBtn.addEventListener('click', function(e) { markListItem(e, li, id) })

    // updateLocalStorage()
    const foundIndex = CATEGORIZED_LIST.findIndex(list => list.id == lastVisitedCategory.id)
    CATEGORIZED_LIST[foundIndex].tasksList.tasks.push(
        {
            id,
            task,
            marked: false
        }
    )
    taskCount = CATEGORIZED_LIST[foundIndex].tasksList.tasks.length
    // toggleFooter(categorizedList) 
    categorizedTasksListProgress.innerText = `${completedCategoryTask}/${taskCount} completed`
    updateCategoryTasksCount()
    updateLocalStorage()
    toggleFooter(categorizedTasksList)
}

// create uncategorized tasks
function createUncategorizedTasks() {
    
}

// upate progress length in categorzed_tasks panel DONE
// update tasks COUNT in categorized panel DONE
// load tasks from clicked category DONE
// update progress COUNT in categorzed_tasks panel by clicking radio btn when after refresh DONE

// when category is marked mark all of its tasks too


// update tasks count of specific category from categorized panel
function updateCategoryTasksCount() {
    const taskCountElement = lastVisitedCategory.querySelector('.tasks-count')
    taskCountElement.innerText = taskCount + ' tasks.'
}

// show the uncategorized list
uncategorizedBtn.addEventListener('click', showUncategorizedList)

function showUncategorizedList() {
    form.dataset.list = 'uncategorized'
    input.value = ''
    input.placeholder = 'add new task here'
    categorizedList.parentElement.style.display = 'none'
    categorizedTasksList.parentElement.style.display = 'none'
    uncategorizedList.parentElement.style.display = 'flex'
    categorizedBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
    uncategorizedBtn.style.backgroundColor = 'white'
    categorizedBtn.style.color = 'var(--primary-clr)'

    removeLoadedTaskAndInfo()
}

// show the categorized list
categorizedBtn.addEventListener('click', showCategoryList)

function showCategoryList() {
    form.dataset.list = 'categorized'
    input.value = ''
    input.placeholder = 'what is it about?'
    categorizedList.parentElement.style.display = 'flex'
    uncategorizedList.parentElement.style.display = 'none'
    uncategorizedBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
    categorizedBtn.style.backgroundColor = 'white'
}