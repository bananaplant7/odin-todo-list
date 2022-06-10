const allTab = document.querySelector('#all');
const todayTab = document.querySelector('#today');
const thisWeekTab = document.querySelector('#thisWeek');

const todoContainer = document.querySelector('.todoContainer');

const projectsContainer = document.querySelector('#projectsContainer');

const sidebar = document.querySelector('.sidebar');

const LOCAL_STORAGE_PROJECT_KEY = 'my.projects';
const LOCAL_STORAGE_ALL_KEY = 'my.allTab';
let projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];
let all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALL_KEY)) || { title: 'all', todos: [] };

//#region // TODO STUFF
// origin is where the todo was created
const createTodo = (title, desc, date, complete, origin) => {
    return {
        title, desc, date, complete, origin
    };
};

let today = { title: 'today', todos: [] };
let thisWeek = { title: 'thisWeek', todos: [] };

let currentTab = all;

function addTodo(todo) {
    currentTab.todos.push(todo);
}

function editTodo(todo, newTitle, newDesc, newDate) {
    todo.title = newTitle
    todo.desc = newDesc
    todo.date = newDate
}

function saveAllTab() {
    localStorage.setItem(LOCAL_STORAGE_ALL_KEY, JSON.stringify(all));
}

function clearTodos() {
    while (todoContainer.firstChild) {
        todoContainer.removeChild(todoContainer.firstChild);
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
        li.id = todo.title;

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

        if (todo.complete == true) {
            li.classList.add('checked');
            checkbox.checked = true;
        }

        let editTodoBtn = document.createElement('button');
        editTodoBtn.classList.add('editTodoBtn');
        editTodoBtn.textContent = '\u{1F4DD}'; 

        let deleteTodoBtn = document.createElement('button');
        deleteTodoBtn.classList.add('deleteTodoBtn');
        deleteTodoBtn.textContent = '\u{1F5D1}';

        li.appendChild(checkbox);
        li.appendChild(title);
        li.appendChild(desc);
        li.appendChild(date);
        li.appendChild(editTodoBtn)
        li.appendChild(deleteTodoBtn)
        todoContainer.appendChild(li);
    });
}

function renderTodos() {
    saveAllTab();
    saveProjects()
    clearTodos();
    displayTodos();
}

renderTodos();

// functionality to buttons on each todo
todoContainer.addEventListener('click', (e) => {
    let targetType = e.target.classList[0];
    let targetID = e.target.parentElement.id;
    // id allows us to target the specific todo in the array which  
    // we can modify and display these modifications
    let targetTodo = currentTab.todos.filter(todo => (todo.title === targetID))[0];
    // let targetIndex = currentTab.todos.findIndex(todo => (todo.title == targetID))

    if (targetType === 'checkbox') {
        // if todo complete, set it to incomplete and vice versa
        targetTodo.complete ? targetTodo.complete = false : targetTodo.complete = true;
        renderTodos();
    }

    if (targetType === 'editTodoBtn') {

        // repurpose dates so input type='Date' can accept them
        // • 'No date' = '' 
        // • 'Thu Jun 02 2022' = '2022-06-02'
        if (targetTodo.date === 'No date') {
            var date = '';
        } else {
            var date = new Date(targetTodo.date).toISOString().split('T')[0]
        }
        todoModalStuff.editingTodo(targetTodo.title, targetTodo.desc, date)

    }

    // if in all tab, remove from all tab. if not, remove from origin tab and all tab
    if (targetType === 'deleteTodoBtn') {
        let targetOrigin = targetTodo.origin
        let indexInAllTab = all.todos.findIndex(todo => (todo.title == targetID))
        if (targetOrigin !== 'all') {
            // finds the origin tab 
            let originTab = projects.filter(project => (project.title === targetOrigin))[0]
            // removes todo from origin tab by w/ index # & splice
            let indexInOrigin = originTab.todos.findIndex(todo => (todo.title == targetID))
            originTab.todos.splice(indexInOrigin, 1)
        }
        all.todos.splice(indexInAllTab,1)
        renderTodos();
    }



    
});
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

function saveProjects() {
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
        btn.classList.add('tab');
        btn.classList.add('project');
        btn.id = project.title;

        let projectTitle = document.createElement('div');
        projectTitle.classList.add('projectTitle');
        projectTitle.textContent = project.title;

        let deleteProjectBtn = document.createElement('button');
        deleteProjectBtn.classList.add('deleteProjectBtn');
        deleteProjectBtn.textContent = '\u{1F5D1}';

        btn.appendChild(projectTitle);
        btn.appendChild(deleteProjectBtn);

        projectsContainer.appendChild(btn);
    });
}

function renderProjects() {
    saveProjects();
    clearProjects();
    displayProjects();
}

renderProjects();

projectsContainer.addEventListener('click', (e) => {
    // find the id of parent -> index number -> modify array -> render
    let target = e.target;
    let parent = target.parentElement;
    let id = parent.id;
    let index = projects.findIndex(x => x.title === id);

    if (target.classList[0] === 'deleteProjectBtn') {
        // remve proj & todos from this proj in the all tab, currentTab = all, render
        projects.splice(index, 1);
        all.todos = all.todos.filter(todo => todo.origin !== id)
        currentTab = all
        allTab.classList.add('current')
        renderTodos()
        renderProjects();
    }
});
//#endregion

const projectModalStuff = (() => {
    // SELECTORS
    const newProjectBtn = document.querySelector('#newProjectBtn');
    const projectModal = document.querySelector('#projectModal');
    const overlay = document.querySelector('#overlay');
    const projectModalCloseBtn = document.querySelector('#projectModalCloseBtn');
    const projectName = document.querySelector('#projectName');
    const submitProjectBtn = document.querySelector('#submitProjectBtn');

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
            projectName.value = ''
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
    submitProjectBtn.addEventListener('click', e => {
        e.preventDefault();

        let projectTitle = projectName.value;

        if (projectTitle === '') {
            alert("Project name can't be empty");
        } else if (checkDuplicate(projects.map(project => project.title), projectTitle)) {
            alert("Project name must be unique");
        } else {
            let newProject = createProject(projectName.value);
            addProject(newProject);
            renderProjects();
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
    const todoModalTitle = document.querySelector('#todoModalTitle');
    const todoModalCloseBtn = document.querySelector('#todoModalCloseBtn');
    const todoName = document.querySelector('#todoName');
    const todoDetails = document.querySelector('#todoDetails');
    const todoDate = document.querySelector('#todoDate');
    const submitTodoBtn = document.querySelector('#submitTodoBtn');
    let targetTodo

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
            todoName.value = ''
            todoDetails.value = ''
            todoDate.value = ''
        }
    }

    // consumes array of strings & string and produces 
    // true or false to if that string is a duplicate
    function checkDuplicate(array, title) {
        return (array.indexOf(title) >= 0) ? true : false;
    }

    function editingTodo(name, details, date) {
        todoModalTitle.textContent = 'Edit Todo'
        submitTodoBtn.textContent = 'Change'
        openTodoModal();
        todoName.value = name
        todoDetails.value = details
        todoDate.value = date
        targetTodo = currentTab.todos.filter(todo => (todo.title === name))[0]
    }

    // EVENT LISTENERS
    newTodoBtn.addEventListener('click', () => {
        todoModalTitle.textContent = 'New Todo'
        submitTodoBtn.textContent = 'Add'
        openTodoModal();
    });

    todoModalCloseBtn.addEventListener('click', () => {
        closeTodoModal();
    });

    overlay.addEventListener('click', () => {
        closeTodoModal();
    });

    submitTodoBtn.addEventListener('click', e => {
        e.preventDefault();

        // repurpose dates (var here or else date is not accessible)
        // • '' = 'No date' (instead of 'Invalid date')
        // • '2022-06-02' = 'Thu Jun 02 2022' (more readable)
        if (todoDate.value === '') {
            var date = 'No date';
        } else {
            var date = new Date(todoDate.value.split('-')).toDateString();
        }

        if (todoName.value === '') {
            alert("Todo name can't be empty"); 
        }
        else if (todoModalTitle.textContent === 'Edit Todo') {
            if ( (todoName.value !== targetTodo.title) && 
                 (checkDuplicate(all.todos.map(todo => todo.title), todoName.value)) ) {
                    alert("Todo name must be unique");
            } else {
                editTodo(targetTodo, todoName.value, todoDetails.value, date)
                renderTodos()
                todoName.value = '';
                todoDetails.value = '';
                todoDate.value = '';
                closeTodoModal();
            }
        } else if (checkDuplicate(all.todos.map(todo => todo.title), todoName.value)) {
            alert("Todo name must be unique");
        } else {

            let newTodo =
                createTodo(
                    todoName.value,
                    todoDetails.value,
                    date,
                    complete = false,
                    currentTab.title
                );

            // when add new todo, add to current tab & all tab (bc all tab can
            // access ALL todos). If we're in the all tab, just add it once ofc.
            if (currentTab.title === 'all') {
                addTodo(newTodo);
            } else {
                addTodo(newTodo);
                all.todos.push(newTodo);
            }
            renderTodos();
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
        editingTodo
    };
})();

// setting the current tab
sidebar.addEventListener('click', (e) => {
    let target = e.target;
    let id = target.id;
    let tabs = document.querySelectorAll('.tab')

    // adding & removing hidden class to remove add todo btn in the today & 
    // this week tabs bc you should not be able to add todos in these tabs as
    // their contents should change dynamically w/ the date 
    if (target.classList[0] === 'tab') {
        tabs.forEach(tab => tab.classList.remove('current'))
        target.classList.add('current')
        if (target.classList[1] === 'project') {
            // this returns the project that matches the id
            let selectedProj = projects.filter(project => (project.title === id))[0];
            currentTab = selectedProj;
            newTodoBtn.classList.remove('hidden');
        } else {
            if (id === 'all') {
                currentTab = all;
                newTodoBtn.classList.remove('hidden');
            } else if (id === 'today') {
                currentTab = today;
                newTodoBtn.classList.add('hidden');
            } else {
                currentTab = thisWeek;
                newTodoBtn.classList.add('hidden');
            }
        }
        renderTodos();
    }
});