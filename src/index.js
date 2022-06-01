const todoContainer = document.querySelector('.todoContainer');

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

/* <button class="project" id='project.title'>
    <div class="projectTitle">project.title</div> <button class="deleteProjectBtn">&times;</button>
   </button> */
function displayProjects() {
    projects.forEach(project => {
        let btn = document.createElement('button');
        btn.classList.add('project');
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

function clearAndDisplayProjects() {
    clearProjects();
    displayProjects();
}
function onClickDeleteProject() {

}
projectsContainer.addEventListener('click', (e) => {
    let target = e.target;

    if (target.classList[0] === 'deleteProjectBtn') {
        let parent = target.parentElement;
        let id = parent.id;
        let index = projects.findIndex(x => x.title === id);
        projects.splice(index, 1);

        clearAndDisplayProjects();
    }
});


clearAndDisplayProjects();
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
    // true or false to if that string is unique
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
            clearAndDisplayProjects();
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