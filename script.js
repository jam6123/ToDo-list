const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`
const form = document.querySelector('form')
const input = document.querySelector('input')
const addBtn = document.querySelector('.add-btn')
const deleteAllBtns = document.querySelectorAll('.delete-btn')
const navBtns = document.querySelectorAll('.nav__btn')
const backBtn = document.querySelector('.back-btn')

// category list elements
const categNavBtn = document.querySelector('#categBtn')
const catListContainer =  document.querySelector('.list-categorized')
const categorizedList =  document.querySelector('.list-categorized .list')
const catListFooter = catListContainer.querySelector('.list-footer')
const catListSpan = catListContainer.querySelector('span')
const catListProgressMssg = catListContainer.querySelector('.progress-mssg')

// categorized task elements
const catTasksContainer = document.querySelector('.list-categorized-tasks')
const tasksTitle = document.querySelector('.tasks-title')

// uncategory list elements
const uncategNavBtn = document.querySelector('#uncategBtn')
const uncatListContainer =  document.querySelector('.list-uncategorized')
const uncategorizedList =  document.querySelector('.list-uncategorized .list')
const uncategDelBtn = document.querySelector('.list-uncategorized .delete-btn')

const CATEGORIZED_LIST_EXISTING_DATA = JSON.parse(localStorage.getItem('categories'))
let CATEGORIZED_LIST = CATEGORIZED_LIST_EXISTING_DATA || []
let completedCategory = localStorage.getItem('completed_category') || 0

// READ/LOAD EXISTING DATA
CATEGORIZED_LIST.forEach(category => {
    const listItem = document.createElement('li')
    listItem.classList.add('list__item')
    listItem.id = category.id
    categorizedList.appendChild(listItem)
    listItem.innerHTML = `
                            <div class="radio-btn ${category.completed ? 'ticked' : ''}"></div>
                            <p>${category.category}</p>
                            <div class="trash-icon">
                                ${trashIcon}
                            </div>
                            <p class="tasks-completed">${0} tasks</p>
                        `;
    listItemAddClickEvent(listItem, category.category)
    radioBtnAddClickEvent(listItem, category.id)
    trashIconBtnAddClickEvent(listItem, category.id)
    
    CATEGORIZED_LIST.length != 0 ? showCatListFooter() : 'do nothing'
})
// READ/LOAD EXISTING DATA

function listItemAddClickEvent(listItem, title) {
    listItem.addEventListener('click', function() {
        catTasksContainer.style.display = 'flex'
        catListContainer.style.display = 'none'
        tasksTitle.innerText = title   
        categNavBtn.style.color = 'var(--gray-clr)'

        input.placeholder = 'new task here'
        form.dataset.list = 'categorized_tasks'
    })
}
    
catListProgressMssg.innerText = `${completedCategory}/${CATEGORIZED_LIST.length} completed`

// add new To-Dos here
function addNewToDo() {
    if(input.value.trim() == '') return;
    if(form.dataset.list == 'categorized') {
        const category_ID = 'item_' + Date.now()
        const listItem = document.createElement('li')
        listItem.classList.add('list__item')
        listItem.id = category_ID
        categorizedList.appendChild(listItem)
        listItem.innerHTML = `
                                <div class="radio-btn"></div>
                                <p>${input.value}</p>
                                <div class="trash-icon">
                                    ${trashIcon}
                                </div>
                            `;
        listItemAddClickEvent(listItem, input.value)
        radioBtnAddClickEvent(listItem, category_ID)
        trashIconBtnAddClickEvent(listItem, category_ID)
        addNewCategory(category_ID, input.value) 
        
    }

    showCatListFooter()
}

// update completed tasks
function updateCompletedTask(listItem, categoryId) {
    const radioBtn = listItem.querySelector('.radio-btn')
    let isCompleted = radioBtn.classList.contains('ticked')

    isCompleted ? ++completedCategory : completedCategory != 0 ? --completedCategory : 'do nothing'

    CATEGORIZED_LIST.find(categ => {
        if(categ.id == categoryId) {
            categ.completed = isCompleted
        }
    })

    catListProgressMssg.innerText = `${completedCategory}/${CATEGORIZED_LIST.length} completed`

    localStorage.setItem('completed_category', completedCategory)
    localStorage.setItem('categories', JSON.stringify(CATEGORIZED_LIST))
}

// form
form.addEventListener('submit', function(e) {
    e.preventDefault()
    addNewToDo()
    clearInput()
})

// back button 
backBtn.addEventListener('click', function() {
    catTasksContainer.style.display = 'none'
    catListContainer.style.display = 'flex'
    categNavBtn.style.color = ''

    input.placeholder = 'what is it about?'
    form.dataset.list = 'categorized'
})

// delete buttons
deleteAllBtns.forEach(delBtn => {
    delBtn.addEventListener('click', deleteListItems)
})

// add click event listener on every instance of trash icon button
function trashIconBtnAddClickEvent(listItem, id) {
    const trashIconBtn = listItem.querySelector('.trash-icon')
    trashIconBtn.addEventListener('click', function(e) {
        e.stopPropagation()
        deleteRow(id)
    })

}

// add click event listener on every radio-btn element
function radioBtnAddClickEvent(listItem, id) {
    const radioBtn = listItem.querySelector('.radio-btn')
        radioBtn.addEventListener('click', function(e) {
            e.stopPropagation()
            radioBtn.classList.toggle('ticked')
            updateCompletedTask(listItem, id)
        })

}

// add new category list data
function addNewCategory(id, category) {
    const category_ID = 'cat_' + Date.now()
    CATEGORIZED_LIST.push({id: id, category: category, completed: false, tasks: []})
    localStorage.setItem('categories', JSON.stringify(CATEGORIZED_LIST))
    catListProgressMssg.innerText = `${completedCategory}/${CATEGORIZED_LIST.length} completed`
}


// delete a row on the list
function deleteRow(id) {
    const row = categorizedList.querySelector(`#${id}`)
    categorizedList.removeChild(row)
    row.firstElementChild.classList.contains('ticked') ? --completedCategory : 'do nothing'
    
    if(!categorizedList.firstElementChild) {
        hideCatListFooter()
    }
    updateCategorizedListData(id)
}

// update categorized list data 
function updateCategorizedListData(id) {
    const updatedListData = CATEGORIZED_LIST.filter(category => category.id != id)
    
    CATEGORIZED_LIST = updatedListData
    localStorage.setItem('completed_category', completedCategory)
    localStorage.setItem('categories', JSON.stringify(CATEGORIZED_LIST))
    catListProgressMssg.innerText = `${completedCategory}/${CATEGORIZED_LIST.length} completed`
}

// clear input
function clearInput() {
    input.value = ''
}

// remove categorized list footer 
function hideCatListFooter() {
    catListSpan.style.display = 'inline'
    catListFooter.style.display = 'none'
}

// add categorized list tooter 
function showCatListFooter() {
    catListSpan.style.display = 'none'
    catListFooter.style.display = 'flex'
}

// delete list items
function deleteListItems() {
    if(form.dataset.list == 'categorized') {
        categorizedList.innerHTML = ''
        CATEGORIZED_LIST = []
        completedCategory = 0
        localStorage.removeItem('categories')
        localStorage.removeItem('completed_category')
        hideCatListFooter()
    }else {
        uncategorizedList.innerHTML = ''
        
    }
}


navBtns.forEach(btn => {
    btn.addEventListener('click', toggleNav)
})

// change list to uncategorized/categorized vice-versa.
function toggleNav() {
    if(this.id == 'uncategBtn') {
        form.dataset.list = 'uncategorized'
        this.style.backgroundColor = 'white'
        categNavBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'

        uncatListContainer.style.display = 'flex'
        catListContainer.style.display = 'none'

        input.placeholder = 'new task here'
    }else {
        form.dataset.list = 'categorized'
        this.style.backgroundColor = 'white'
        uncategNavBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
    
        uncatListContainer.style.display = 'none'
        catListContainer.style.display = 'flex'
    
        input.placeholder = 'What is it about?'
    }
}