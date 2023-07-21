const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`
const form = document.querySelector('form')
const input = document.querySelector('input')
const deleteAllBtns = document.querySelectorAll('.delete-btn')
const navBtns = document.querySelectorAll('.nav__btn')
const backBtn = document.querySelector('.back-btn')

const categorizedList =  document.querySelector('.list-categorized .list')
const categorizedListFooter = categorizedList.parentElement.querySelector('.list-footer')
const categorizedListProgress = categorizedList.parentElement.querySelector('.progress')
const categorizedListEmptyWord = categorizedList.parentElement.querySelector('.empty-word')
const categorizedListDelBtn = categorizedList.parentElement.querySelector('.delete-btn')

const categorizedListTasks = document.querySelector('.list-categorized-tasks .list')

const categorizedTasksList = document.querySelector('.list-categorized-tasks .list')
const tasksTitle = document.querySelector('.tasks-category')

const categorizedListExistingData = JSON.parse(localStorage.getItem('categorized-list'))
let CATEGORIZED_LIST = categorizedListExistingData || []
let completedCategory = 0

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
                        <strong class="tasks-completed">${0} tasks</strong>
                    `;
    const trashIconBtn = li.querySelector('.trash-icon')
    trashIconBtn.addEventListener('click', function(e){ deleteRow(e, li, list.id) })

    const radioBtn = li.querySelector('.radio-btn')
    radioBtn.addEventListener('click', function(e) { markCompleted(e, li, list.id) })

    categorizedListProgress.innerText = `${completedCategory}/${CATEGORIZED_LIST.length} completed`
    toggleCategorizedListFooter()
})


form.addEventListener('submit', function(e) {
    e.preventDefault()
    addNewTodos()
    
})

// add new to Dos
function addNewTodos() {
    if(input.value.trim() == 0) return;
        
    if(form.dataset.list == 'categorized')  {
        addNewCategory()
    }

    clearInput()
}

// add category
function addNewCategory() {
    const id = 'li_' + Date.now()
    const li = document.createElement('li')
    categorizedList.appendChild(li)
    li.classList.add('list__item')
    li.id = id
    li.innerHTML = `
                        <div class="radio-btn"></div>
                            <p>${input.value}</p>
                            <div class="trash-icon">
                                ${trashIcon}
                            </div>
                        <strong class="tasks-completed">${0} tasks</strong>
                    `;
    li.addEventListener('click', showCategoryTasks)

    const trashIconBtn = li.querySelector('.trash-icon')
    trashIconBtn.addEventListener('click', function(e){ deleteRow(e, li, id) })

    const radioBtn = li.querySelector('.radio-btn')
    radioBtn.addEventListener('click', function(e) { markCompleted(e, li, id) })

    CATEGORIZED_LIST.push(
        {
            id,
            category: input.value,
            completed: false,
            tasks: [],
        }
    )
    updateLocalStorage()

    toggleCategorizedListFooter() 
    categorizedListProgress.innerText = `${completedCategory}/${CATEGORIZED_LIST.length} completed`

}

// show or navigate to category list's tasks if it has
function showCategoryTasks() {
    form.dataset.list = 'categorized_tasks'
    categorizedList.parentElement.style.display = 'none'
    categorizedListTasks.parentElement.style.display = 'flex'
    
}

// mark/outline completed
function markCompleted(e, li, id) {
    e.stopPropagation()
    li.classList.toggle('marked')
    const isMarked = li.classList.contains('marked')
    isMarked ? ++completedCategory  : --completedCategory

    const foundIndex = CATEGORIZED_LIST.findIndex(list => list.id == id)
    CATEGORIZED_LIST[foundIndex].completed = isMarked
    categorizedListProgress.innerText = `${completedCategory}/${CATEGORIZED_LIST.length} completed`
    updateLocalStorage()
    
}

// delete row
function deleteRow(e, li, id) {
    e.stopPropagation()
    li.parentElement.removeChild(li)
    li.classList.contains('marked') ? --completedCategory : 'do nothing'
    CATEGORIZED_LIST = CATEGORIZED_LIST.filter(list => list.id != id)
    categorizedListProgress.innerText = `${completedCategory}/${CATEGORIZED_LIST.length} completed`
    toggleCategorizedListFooter()
    updateLocalStorage()
}

// clear input 
function clearInput() {
    input.value = ''
}

// hide footer elements on categorized list
function toggleCategorizedListFooter() {
    const isListNotEmpty = categorizedList.firstElementChild
    categorizedListEmptyWord.style.display = isListNotEmpty ? 'none' : 'inline'
    categorizedListFooter.style.display = isListNotEmpty ? 'flex' : 'none'
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
    const currentListContainer  = e.currentTarget.parentElement.parentElement.querySelector('.list').parentElement
    if(currentListContainer.classList.contains('list-categorized')) {
        categorizedList.innerHTML = ''
        CATEGORIZED_LIST = []
        completedCategory = 0
        localStorage.removeItem('categorized-list')
        localStorage.removeItem('categorized-list_completed')
    
    }else if(currentListContainer.classList.contains('list-categorized-tasks')) {
        categorizedListTasks.innerHTML = ''
    }
    toggleCategorizedListFooter()
}