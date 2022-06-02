const todoContainer = document.querySelector('.todoContainer');

const projectsContainer = document.querySelector('#projectsContainer');

const LOCAL_STORAGE_PROJECT_KEY = 'my.projects';
let projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];



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


// for now, just keep it as all, later currentTab will be decided by event listeners to sidebar
let currentTab = all  


function addTodo(todo) {
    currentTab.todos.push(todo);
}

addTodo(homework);
addTodo(homework2);


function clearTodos() {
    while (todoContainer.firstChild) {
        todoContainer.removeChild(todoContainer.firstChild)
    }
}

/*
<li class="todo">
    <input class='checkbox' type=checkbox>
    <div class="title">Title</div>
    <div class="desc">Desc</div>
    <div class="date">Date</div>
</li>
*/
function displayTodos() {
    currentTab.todos.forEach(todo => {
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

function clearAndDisplayTodos() {
    clearTodos()
    displayTodos()
}

clearAndDisplayTodos();
//#endregion 


//#region // PROJECT STUFF
const createProject = (title) => {
    return {
        title, todos: []
    };
};

function addProject(project) {
    projects.push(project);
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projects));
}

function clearProjects() {
    while (projectsContainer.firstChild) {
        projectsContainer.removeChild(projectsContainer.firstChild);
    }
}

/* <button class="project" id='project.title'>
    <div class="projectTitle">project.title</div> <button class="deleteProjectBtn">&times;</button>
   </button> */
function displayProjects() {
    projects.forEach(project => {
        let btn = document.createElement('button');
        btn.classList.add('project', 'tab');
        btn.id = project.title;

        let projectTitle = document.createElement('div');
        projectTitle.classList.add('projectTitle');
        projectTitle.textContent = project.title;

        let deleteProjectBtn = document.createElement('button');
        deleteProjectBtn.classList.add('deleteProjectBtn');
        deleteProjectBtn.textContent = '\u00d7';

        btn.appendChild(projectTitle);
        btn.appendChild(deleteProjectBtn);

        projectsContainer.appendChild(btn);
    });
}

function render() {
    save();
    clearProjects();
    displayProjects();
}

projectsContainer.addEventListener('click', (e) => {
    // find the id of parent -> index number -> modify array
    let target = e.target;
    let parent = target.parentElement;
    let id = parent.id;
    let index = projects.findIndex(x => x.title === id);

    if (target.classList[0] === 'deleteProjectBtn') {
        projects.splice(index, 1);
        render();
    }
});


render(); 
//#endregion



const projectModalStuff = (() => {
    // SELECTORS
    const newProjectBtn = document.querySelector('#newProjectBtn');
    const projectModal = document.querySelector('#projectModal');
    const overlay = document.querySelector('#overlay');
    const projectModalCloseBtn = document.querySelector('#projectModalCloseBtn');
    const projectName = document.querySelector('#projectName');
    const addProjectBtn = document.querySelector('#addProjectBtn');

    // METHODS
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

    // consumes array of strings & string and produces 
    // true or false to if that string is a duplicate
    function checkDuplicate(array, title) {
        return (array.indexOf(title) >= 0) ? true : false;
    }

    // EVENT LISTENERS
    newProjectBtn.addEventListener('click', () => {
        openProjectModal();
    });

    projectModalCloseBtn.addEventListener('click', () => {
        closeProjectModal();
    });

    overlay.addEventListener('click', () => {
        closeProjectModal();
    });

    // If title non-empty & non-duplicate, create new project & add to  
    // projects[], clear & display projects, clear form, close modal
    addProjectBtn.addEventListener('click', e => {
        e.preventDefault();

        let projectTitle = projectName.value;

        if (projectTitle === '') {
            alert("Project name can't be empty");
        } else if (checkDuplicate(projects.map(project => project.title), projectTitle)) {
            alert("Project name must be unique");
        } else {
            let newProject = createProject(projectName.value);
            addProject(newProject);
            render();
            projectName.value = '';
            closeProjectModal();
        }
    });

    return {
        openProjectModal,
        closeProjectModal,
        checkDuplicate,
    };
})();

const todoModalStuff = (() => {
    // SELECTORS
    const newTodoBtn = document.querySelector('#newTodoBtn');
    const todoModal = document.querySelector('#todoModal');
    const overlay = document.querySelector('#overlay');
    const todoModalCloseBtn = document.querySelector('#todoModalCloseBtn');
    const todoName = document.querySelector('#todoName');
    const todoDetails = document.querySelector('#todoDetails');
    const todoDate = document.querySelector('#todoDate');
    const addTodoBtn = document.querySelector('#addTodoBtn');

    // METHODS
    function openTodoModal() {
        if (todoModal == null) {
            return;
        } else {
            todoModal.classList.add('active');
            overlay.classList.add('active');
        }
    }

    function closeTodoModal() {
        if (todoModal == null) {
            return;
        } else {
            todoModal.classList.remove('active');
            overlay.classList.remove('active');
        }
    }

    // consumes array of strings & string and produces 
    // true or false to if that string is a duplicate
    function checkDuplicate(array, title) {
        return (array.indexOf(title) >= 0) ? true : false;
    }

    // EVENT LISTENERS
    newTodoBtn.addEventListener('click', () => {
        openTodoModal();
    });

    todoModalCloseBtn.addEventListener('click', () => {
        closeTodoModal();
    });

    overlay.addEventListener('click', () => {
        closeTodoModal();
    });

    // let homework = createTodo('Homework', 'Do math & physics hw', '2050-05-29', complete = false);
    addTodoBtn.addEventListener('click', e => {
        e.preventDefault();

        // todoName.value;
        // todoDetails.value;
        // todoDate.value;

        if (todoName.value === '') {
            alert("Todo name can't be empty");
        } else if (checkDuplicate(currentTab.todos.map(todo => todo.title), todoName.value)) {
            alert("Todo name must be unique");
        } else {
            let newTodo = 
            createTodo(
                todoName.value, 
                todoDetails.value, 
                // below is just to turn "2022-06-02" -> 'Thu Jun 02 2022'
                new Date(todoDate.value).toDateString(), 
                complete = false
            );
            addTodo(newTodo);
            clearAndDisplayTodos();
            todoName.value = '';
            todoDetails.value = '';
            todoDate.value = '';
            closeTodoModal();
        }
    });

    return {
        openTodoModal,
        closeTodoModal,
        checkDuplicate,
    };
})();