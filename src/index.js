const todoContainer = document.querySelector('.todoContainer');

const newProjectBtn = document.querySelector('#newProjectBtn');
const projectModal = document.querySelector('#projectModal');
const overlay = document.querySelector('#overlay');
const projectForm = document.querySelector('#projectForm');
const projectModalCloseBtn = document.querySelector('#projectModalCloseBtn');
const projectName = document.querySelector('#projectName');
const addProjectBtn = document.querySelector('#addProjectBtn');

const projectsContainer = document.querySelector('#projectsContainer');


//#region // TODO STUFF
const createTodo = (title, desc, date, complete) => {
    return {
        title, desc, date, complete
    };
};

let homework = createTodo('Homework', 'Do math & physics hw', '2050-05-29', complete = false);
let homework2 = createTodo('Homework2', 'Do bio hw', '2050-05-29', complete = false);

let all = { todos: [] };
let today = { todos: [] };
let thisWeek = { todos: [] };

function addTodo(tab, todo) {
    tab.todos.push(todo);
}

addTodo(all, homework);
addTodo(all, homework2);


// function clearTodos(element) {
//     while (element.firstChild) {
//         element.removeChild(element.firstChild)
//     }
// }



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
    tab.todos.forEach(todo => {
        let li = document.createElement('li');
        li.classList.add('todo');

        let checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.classList.add('checkbox');

        let title = document.createElement('div');
        title.classList.add('title');
        title.textContent = todo.title;

        let desc = document.createElement('div');
        desc.classList.add('desc');
        desc.textContent = todo.desc;

        let date = document.createElement('div');
        date.classList.add('date');
        date.textContent = todo.date;

        li.appendChild(checkbox);
        li.appendChild(title);
        li.appendChild(desc);
        li.appendChild(date);

        todoContainer.appendChild(li);
    });
}

displayTodos(all);
//#endregion 


//#region // PROJECT STUFF
const createProject = (title) => {
    return {
        title, todos: []
    };
};

let project1 = createProject('Project 1');
let project2 = createProject('Project 2');

let projects = [];

function addProject(project) {
    projects.push(project);
}

addProject(project1);
addProject(project2);

function clearProjects() {
    while (projectsContainer.firstChild) {
        projectsContainer.removeChild(projectsContainer.firstChild);
    }
}

// <button class="project">Project 1</button>
function displayProjects() {
    projects.forEach(project => {
        let btn = document.createElement('button');
        btn.classList.add('project');
        btn.textContent = project.title;

        projectsContainer.appendChild(btn);
    });
}

function clearAndDisplayProjects() {
    clearProjects();
    displayProjects();
}

clearAndDisplayProjects();
//#endregion


//#region // MODAL STUFF
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

addProjectBtn.addEventListener('click', e => {
    e.preventDefault();
    if (projectName.value === '') { return; }
    let newProject = createProject(projectName.value);
    addProject(newProject);
    clearAndDisplayProjects();
    projectName.value = '';
    closeProjectModal();
});
//#endregion