const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`
const form = document.querySelector('form')
const input = document.querySelector('input')
const deleteAllBtns = document.querySelectorAll('.delete-btn')
const navBtns = document.querySelectorAll('.nav__btn')
const backBtn = document.querySelector('.back-btn')

const list_CATEGORIZED =  document.querySelector('.list-categorized .list')
const listFooters = document.querySelectorAll('.list-footer')
const emptyWords = document.querySelectorAll('.empty-word')
const progressMssgs = document.querySelectorAll('.progress')

const catTasksContainer = document.querySelector('.list-categorized-tasks')
const tasksTitle = document.querySelector('.tasks-title')

let CATEGORIZED_LIST = []

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

function addNewCategory() {
    const li = document.createElement('li')
    list_CATEGORIZED.appendChild(li)
    li.classList.add('list__item')
    li.innerHTML = `
                        <div class="radio-btn"></div>
                            <p>${input.value}</p>
                            <div class="trash-icon">
                                ${trashIcon}
                            </div>
                        <p class="tasks-completed">${0} tasks</p>
                    `;
    const trashIconBtn = li.querySelector('.trash-icon')
    trashIconBtn.addEventListener('click', function(){ deleteRow(li, id) })

    const id = 'li_' + Date.now()
    CATEGORIZED_LIST.push(
        {
            id,
            category: input.value,
            completed: false,
            tasks: []
        }
    )
    // localStorage.setItem('categorized-list', JSON.stringify(CATEGORIZED_LIST))
}

// delete row
function deleteRow(li, id) {
    li.parentElement.removeChild(li)
    CATEGORIZED_LIST = CATEGORIZED_LIST.filter(list => list.id != id)
    // localStorage.setItem('categorized-list', JSON.stringify(CATEGORIZED_LIST))
}

// clear input 
function clearInput() {
    input.value = ''
}