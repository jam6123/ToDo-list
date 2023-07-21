const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`
const form = document.querySelector('form')
const input = document.querySelector('input')
const deleteAllBtns = document.querySelectorAll('.delete-btn')
const navBtns = document.querySelectorAll('.nav__btn')
const backBtn = document.querySelector('.back-btn')

const categorizedList =  document.querySelector('.list-categorized .list')
const categorizedListProgress = categorizedList.parentElement.querySelector('.progress')
const categorizedListDelBtn = categorizedList.parentElement.querySelector('.delete-btn')

const categorizedListTasks = document.querySelector('.list-categorized-tasks .list')
const categorizedListTasksProgress = categorizedListTasks.parentElement.querySelector('.progress')

const categorizedTasksList = document.querySelector('.list-categorized-tasks .list')
const tasksCategory = document.querySelector('.tasks-category')

const categorizedListExistingData = JSON.parse(localStorage.getItem('categorized-list'))
let CATEGORIZED_LIST = categorizedListExistingData || []
let completedCategory = 0
let completedCategoryTask = 0
let visitedCategoryId;
let lastVisitedCategory;
let taskCount;



// load/read existing category list from local storage
CATEGORIZED_LIST.forEach(list => {
    const li = document.createElement('li')
    categorizedList.appendChild(li)
    li.classList.add('list__item')
    if(list.completed) {
        li.classList.add('marked')
        ++completedCategory
    }
    li.id = list.id
    li.innerHTML = `
                        <div class="radio-btn"></div>
                            <p>${list.category}</p>
                            <div class="trash-icon">
                                ${trashIcon}
                            </div>
                        <strong class="tasks-count">${list.tasksList.tasks.length} tasks</strong>
                    `;
    li.addEventListener('click', function(){ showCategoryTasksList(categorizedList, list.category, list.id, li)})
    
    const trashIconBtn = li.querySelector('.trash-icon')
    trashIconBtn.addEventListener('click', function(e){ deleteRow(e, li, list.id) })

    const radioBtn = li.querySelector('.radio-btn')
    radioBtn.addEventListener('click', function(e) { markCompleted(e, li, list.id) })

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
                        <div class="radio-btn"></div>
                            <p>${category}</p>
                            <div class="trash-icon">
                                ${trashIcon}
                            </div>
                        <strong class="tasks-count">${0} tasks</strong>
                    `;
    li.addEventListener('click', function(){ showCategoryTasksList(categorizedList, category, id, li) })

    const trashIconBtn = li.querySelector('.trash-icon')
    trashIconBtn.addEventListener('click', function(e){ deleteRow(e, li, id) })

    const radioBtn = li.querySelector('.radio-btn')
    radioBtn.addEventListener('click', function(e) { markCompleted(e, li, id) })

    CATEGORIZED_LIST.push(
        {
            id,
            category: category,
            completed: false,
            tasksList: {completedTasks: 0, tasks: []},
        }
    )
    updateLocalStorage()

    toggleFooter(categorizedList) 
    categorizedListProgress.innerText = `${completedCategory}/${CATEGORIZED_LIST.length} completed`

}

// show or navigate to category list's tasks if it has
function showCategoryTasksList(list, title, id, listItem) {
    form.dataset.list = 'categorized_tasks'
    input.placeholder = 'add new task here'
    categorizedList.parentElement.style.display = 'none'
    categorizedListTasks.parentElement.style.display = 'flex'

    visitedCategoryId = id
    tasksCategory.innerText = title
    lastVisitedCategory = listItem
    loadCagtegoryTasks()
    toggleFooter(list)
}

// load or render tasks from clicked category
function loadCagtegoryTasks() {
    
}

// mark/outline completed
function markCompleted(e, li, id) {
    e.stopPropagation()
    li.classList.toggle('marked')
    const isMarked = li.classList.contains('marked')
    switch(form.dataset.list) {
        case 'categorized':
            isMarked ? ++completedCategory  : --completedCategory
            const foundIndex = CATEGORIZED_LIST.findIndex(list => list.id == id)
            CATEGORIZED_LIST[foundIndex].completed = isMarked
            categorizedListProgress.innerText = `${completedCategory}/${CATEGORIZED_LIST.length} completed`
            updateLocalStorage()
            break
        case 'categorized_tasks':
            isMarked ? ++completedCategoryTask  : --completedCategoryTask
            break
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
    input.placeholder = 'What is it about?'
    categorizedList.parentElement.style.display = 'flex'
    categorizedListTasks.parentElement.style.display = 'none'

})

// hide footer elements on categorized list
function toggleFooter(list) {

    // if we are inside the tasks of category 
    if(form.dataset.list == 'categorized_tasks') {
        list = categorizedListTasks
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
        categorizedListTasks.innerHTML = ''
        
    }else if(list.parentElement.classList.contains('list-uncategorized')) {

    }
    toggleFooter(list)
}

// create category tasks
function createCategoryTasks() {
    const id = 'li_' + Date.now()
    const task = input.value
    const li = document.createElement('li')
    categorizedListTasks.appendChild(li)
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

    // const radioBtn = li.querySelector('.radio-btn')
    // radioBtn.addEventListener('click', function(e) { markCompleted(e, li, id) })

    // updateLocalStorage()
    const foundIndex = CATEGORIZED_LIST.findIndex(list => list.id == visitedCategoryId)
    CATEGORIZED_LIST[foundIndex].tasksList.tasks.push(task)
    taskCount = CATEGORIZED_LIST[foundIndex].tasksList.tasks.length
    // toggleFooter(categorizedList) 
    categorizedListTasksProgress.innerText = `${completedCategoryTask}/${taskCount} completed`
    updateCategoryTasksCount()
    updateLocalStorage()
    toggleFooter(categorizedListTasks)
}

// upate progress length in categorzed_tasks panel DONE
// update tasks COUNT in categorized panel DONE

// update progress COUNT in categorzed_tasks panel 
// when category is marked mark all of its tasks too
// load tasks from clicked category


// update tasks count of specific category from categorized panel
function updateCategoryTasksCount() {
    const taskCountElement = lastVisitedCategory.querySelector('.tasks-count')
    taskCountElement.innerText = taskCount + ' tasks.'
}