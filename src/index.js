const todoContainer = document.querySelector('.todoContainer')

const createTodo = (title, desc, date, complete) => {
    return {
        title, desc, date, complete
    };
};

let homework = createTodo('Homework','Do math & physics hw','2050-05-29', complete = false)
let homework2 = createTodo('Homework2','Do bio hw','2050-05-29', complete = false)

let all = []
let today = []
let thisWeek = []
 
function addTodo(tab, todo) {
    tab.push(todo)
}

addTodo(all, homework)
addTodo(all, homework2)

/*

<li class="todo">
    <input class='checkbox' type=checkbox>
    <div class="title">Title</div>
    <div class="desc">Desc</div>
    <div class="date">Date</div>
</li>

*/
// accepts tab and creates a li for each todo of that tab
function displayTodos(tab) {
    tab.forEach(todo => {
        let li = document.createElement('li')
        li.classList.add('todo')

        let checkbox = document.createElement('input')
        checkbox.type = "checkbox"
        checkbox.classList.add('checkbox')

        let title = document.createElement('div')
        title.classList.add('title')
        title.textContent = todo.title

        let desc = document.createElement('div')
        desc.classList.add('desc')
        desc.textContent = todo.desc

        let date = document.createElement('div')
        date.classList.add('date')
        date.textContent = todo.date

        li.appendChild(checkbox)
        li.appendChild(title)
        li.appendChild(desc)
        li.appendChild(date)

        todoContainer.appendChild(li)
    
    })
}

displayTodos(all)


const newProjectBtn = document.querySelector('#newProjectBtn')
const projectModal = document.querySelector('#projectModal')
const overlay = document.querySelector('#overlay')
const projectForm = document.querySelector('#projectForm')
const projectModalCloseBtn = document.querySelector('#projectModalCloseBtn')

function openProjectModal() {
    if (projectModal == null) {
        return;
    } else {
        projectModal.classList.add('active');
        overlay.classList.add('active');
    }
}

function closeProjectModal() {
    if (projectModal == null) {
        return;
    } else {
        projectModal.classList.remove('active');
        overlay.classList.remove('active');
    }
}

newProjectBtn.addEventListener('click', () => {
    openProjectModal();
});

projectModalCloseBtn.addEventListener('click', () => {
    closeProjectModal();
});

overlay.addEventListener('click', () => {
    closeProjectModal();
});



