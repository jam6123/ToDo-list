const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`
const form = document.querySelector('form')
const input = document.querySelector('input')
const addBtn = document.querySelector('.add-btn')
const deleteAllBtns = document.querySelectorAll('.delete-btn')

// category list elements
const categNavBtn = document.querySelector('#categBtn')
const catListContainer =  document.querySelector('.list-categorized')
const categorizedList =  document.querySelector('.list-categorized .list')
const catListFooter = catListContainer.querySelector('.list-footer')
const catListSpan = catListContainer.querySelector('span')
const catProgressMssg = catListContainer.querySelector('.progress-mssg')

// uncategory list elements
const uncategNavBtn = document.querySelector('#uncategBtn')
const uncatListContainer =  document.querySelector('.list-uncategorized')
const uncategorizedList =  document.querySelector('.list-uncategorized .list')
const uncategDelBtn = document.querySelector('.list-uncategorized .delete-btn')

const CATEGORIZED_LIST_EXISTING_DATA = JSON.parse(localStorage.getItem('categories'))
let CATEGORIZED_LIST = CATEGORIZED_LIST_EXISTING_DATA || []
let completedCategory = localStorage.getItem('completed_category') || 0

// read/load exsiting data
function readExistingData() {
    CATEGORIZED_LIST.forEach(category => {
        const listItem = document.createElement('li')
        listItem.classList.add('list__item')
        listItem.id = category.id
        categorizedList.appendChild(listItem)
        listItem.innerHTML = `
                                <div class="radio-btn"></div>
                                <p>${category.category}</p>
                                <div class="trash-icon">
                                    ${trashIcon}
                                </div>
                            `
        listItem.addEventListener('click', function(e) {
            
        })
        
        updateCompletedTask(listItem, category.id, category)

        // add click event listener on every instance of trash icon button
        const trashIconBtn = listItem.querySelector('.trash-icon')
        trashIconBtn.addEventListener('click', function(e) {
            e.stopPropagation()
            deleteRow(e, category.id) 
        })
    })
    if(CATEGORIZED_LIST.length != 0) {
        showCatListFooter() 
    }
}
readExistingData()

// update completed tasks
function updateCompletedTask(listItem, categoryId, category = 'just added') {
    const radioBtn = listItem.querySelector('.radio-btn')
    category.completed ? radioBtn.classList.add('ticked') : ''
    
    radioBtn.addEventListener('click', function(e) {
        e.stopPropagation()
        this.classList.toggle('ticked')
        
        if(this.classList.contains('ticked')) {
            isCompleted = true
            ++completedCategory
        }else {
            isCompleted = false
            completedCategory != 0 ? --completedCategory : '' 
        }
        localStorage.setItem('completed_category', completedCategory)
        CATEGORIZED_LIST.find(categ => {
            if(categ.id == categoryId) {
                categ.completed = isCompleted
                localStorage.setItem('categories', JSON.stringify(CATEGORIZED_LIST))
            }
        })
        catProgressMssg.innerText = `${completedCategory}/${CATEGORIZED_LIST.length} completed`
    })
    catProgressMssg.innerText = `${completedCategory}/${CATEGORIZED_LIST.length} completed`
}

form.addEventListener('submit', function(e) {
    e.preventDefault()
    addNewToDo()
    clearInput()
})

deleteAllBtns.forEach(delBtn => {
    delBtn.addEventListener('click', deleteListItems)
})

// add new To-Do
function addNewToDo() {
    if(input.value == '') return;
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
                            `
        listItem.addEventListener('click', function(e) {
            if(e.currentTarget == e.target) {
            }
        })

        updateCompletedTask(listItem, category_ID)

        // add click event listener on every instance of trash icon button
        const trashIconBtn = listItem.querySelector('.trash-icon')
        trashIconBtn.addEventListener('click', function(e) {
            e.stopPropagation()
            deleteRow(e, category_ID)
        })
        addNewCategory(category_ID, input.value) 
        
    }
    showCatListFooter()
}

// add new category list data
function addNewCategory(id, category) {
    const category_ID = 'cat_' + Date.now()
    CATEGORIZED_LIST.push({id: id, category: category, completed: false, tasks: []})
    catProgressMssg.innerText = `0/${CATEGORIZED_LIST.length} completed`
    localStorage.setItem('categories', JSON.stringify(CATEGORIZED_LIST))
}


// delete a row on the list
function deleteRow(e, id) {
    const row = categorizedList.querySelector(`#${id}`)
    categorizedList.removeChild(row)
    if(!categorizedList.firstElementChild) {
        hideCatListFooter()
    }
    updateCategorizedListData(id)
    catProgressMssg.innerText = `0/${CATEGORIZED_LIST.length} completed`
}

// update categorized list data 
function updateCategorizedListData(id) {
    const updatedListData = CATEGORIZED_LIST.filter(category => id != id) 
    CATEGORIZED_LIST = updatedListData
    localStorage.setItem('categories', JSON.stringify(CATEGORIZED_LIST))
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
        localStorage.removeItem('categories')
        CATEGORIZED_LIST = []
        completedCategory = 0
        localStorage.removeItem('completed_category')
        hideCatListFooter()
    }else {
        uncategorizedList.innerHTML = ''
        
    }
}

const navBtns = document.querySelectorAll('.nav__btn')

navBtns.forEach(btn => {
    btn.addEventListener('click', toggleNav)
})

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