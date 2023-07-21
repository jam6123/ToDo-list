const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`
const form = document.querySelector('form')
const input = document.querySelector('input')
const deleteAllBtns = document.querySelectorAll('.delete-btn')
const navBtns = document.querySelectorAll('.nav__btn')
const backBtn = document.querySelector('.back-btn')

const categorizedList =  document.querySelector('.list-categorized .list')
const categorizedListFooter = categorizedList.parentElement.querySelector('.list-footer')
const categorizedListProgress = categorizedList.parentElement.querySelector('.progress')

const categorizedTasksList = document.querySelector('.list-categorized-tasks .list')
const tasksTitle = document.querySelector('.tasks-category')

let CATEGORIZED_LIST = []
let completedCategory = 0


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

    const emptyWord = li.parentElement.parentElement.querySelector('.empty-word')
    emptyWord.style.display = 'none'

    categorizedListFooter.style.display = 'flex'
    categorizedListProgress.innerText = `${completedCategory}/${CATEGORIZED_LIST.length} completed`

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
    updateLocalStorage()
}

// clear input 
function clearInput() {
    input.value = ''
}

// update localstorage
function updateLocalStorage() {
    localStorage.setItem('categorized-list', JSON.stringify(CATEGORIZED_LIST))
    localStorage.setItem('categorized-list_completed', completedCategory)

    if(JSON.parse(localStorage.getItem('categorized-list')).length == 0) {
        localStorage.removeItem('categorized-list')
        localStorage.removeItem('categorized-list_completed')
    }
}