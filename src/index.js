import { all, projects, today, thisWeek, updateToday, updateThisWeek } from './localStorage.js';
import { projectsContainer, createProject, addProject, renderProjects } from './projects.js';
import { todoContainer, createTodo, addTodo, editTodo, renderTodos } from './todos.js';

const allTab = document.querySelector('#all');
const todayTab = document.querySelector('#today');
const thisWeekTab = document.querySelector('#thisWeek');
const sidebar = document.querySelector('.sidebar');



// initialize
let currentTab = all;
renderProjects();
renderTodos(currentTab);



// today & this week tabs (dynamically generated based on date)
todayTab.addEventListener('click', () => {
    updateToday();
    renderTodos(currentTab);
});

thisWeekTab.addEventListener('click', () => {
    updateThisWeek();
    renderTodos(currentTab);
});



// setting the current tab
sidebar.addEventListener('click', (e) => {
    let target = e.target;
    let id = target.id;
    let tabs = document.querySelectorAll('.tab');

    // adding & removing hidden class to remove add todo btn in the today & 
    // this week tabs bc you should not be able to add todos in these tabs as
    // their contents should change dynamically w/ the date 
    if (target.classList[0] === 'tab') {
        tabs.forEach(tab => tab.classList.remove('current'));
        target.classList.add('current');

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
        renderTodos(currentTab);
    }
});



// functionality to buttons on todos & projects
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
        renderTodos(currentTab);
    }

    if (targetType === 'editTodoBtn') {

        // repurpose dates so input type='Date' can accept them
        // • 'No date' = '' 
        // • 'Thu Jun 02 2022' = '2022-06-02'
        if (targetTodo.date === 'No date') {
            var date = '';
        } else {
            var date = new Date(targetTodo.date).toISOString().split('T')[0];
        }
        todoModalStuff.editingTodo(targetTodo.title, targetTodo.desc, date);

    }

    if (targetType === 'deleteTodoBtn') {
        let targetOrigin = targetTodo.origin;
        let indexInAllTab = all.todos.findIndex(todo => (todo.title == targetID));
        let indexInCurrentTab = currentTab.todos.findIndex(todo => (todo.title == targetID));

        if (targetOrigin === 'all') {
            if (currentTab.title === 'today' || currentTab.title === 'thisWeek') {
                currentTab.todos.splice(indexInCurrentTab, 1);
            }
        } else {
            let originTab = projects.filter(project => (project.title === targetOrigin))[0];
            let indexInOrigin = originTab.todos.findIndex(todo => (todo.title == targetID));

            if (currentTab.title === 'today' || currentTab.title === 'thisWeek') {
                currentTab.todos.splice(indexInCurrentTab, 1);
                originTab.todos.splice(indexInOrigin, 1);
            } else if (currentTab.title === 'all') {
                originTab.todos.splice(indexInOrigin, 1);
            } else {
                originTab.todos.splice(indexInOrigin, 1);
            }
        }
        all.todos.splice(indexInAllTab, 1);
        renderTodos(currentTab);
    }

});

projectsContainer.addEventListener('click', (e) => {
    let targetType = e.target.classList[0];
    let targetID = e.target.parentElement.id;
    let index = projects.findIndex(x => x.title === targetID);

    if (targetType === 'deleteProjectBtn') {
        let tabs = document.querySelectorAll('.tab');
        // remve proj & todos from this proj in the all tab, currentTab = all, render
        projects.splice(index, 1);
        all.todos = all.todos.filter(todo => todo.origin !== targetID);
        currentTab = all;
        tabs.forEach(tab => tab.classList.remove('current'));
        allTab.classList.add('current');
        renderTodos(currentTab);
        renderProjects();
    }
});



// new todo & new project modals
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
    let targetTodo;

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
            todoName.value = '';
            todoDetails.value = '';
            todoDate.value = '';
        }
    }

    // consumes array of strings & string and produces 
    // true or false to if that string is a duplicate
    function checkDuplicate(array, title) {
        return (array.indexOf(title) >= 0) ? true : false;
    }

    function editingTodo(name, details, date) {
        todoModalTitle.textContent = 'Edit Todo';
        submitTodoBtn.textContent = 'Change';
        openTodoModal();
        todoName.value = name;
        todoDetails.value = details;
        todoDate.value = date;
        targetTodo = currentTab.todos.filter(todo => (todo.title === name))[0];
    }

    // EVENT LISTENERS
    newTodoBtn.addEventListener('click', () => {
        todoModalTitle.textContent = 'New Todo';
        submitTodoBtn.textContent = 'Add';
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
            if ((todoName.value !== targetTodo.title) &&
                (checkDuplicate(all.todos.map(todo => todo.title), todoName.value))) {
                alert("Todo name must be unique");
            } else {
                editTodo(targetTodo, todoName.value, todoDetails.value, date);
                renderTodos(currentTab);
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
                    false,
                    currentTab.title
                );

            // when add new todo, add to current tab & all tab (bc all tab can
            // access ALL todos). If we're in the all tab, just add it once ofc.
            if (currentTab.title === 'all') {
                addTodo(currentTab, newTodo);
            } else {
                addTodo(currentTab, newTodo);
                all.todos.push(newTodo);
            }
            renderTodos(currentTab);
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
            projectName.value = '';
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
            let selectedTab = document.querySelector(`#${currentTab.title}`);
            selectedTab.classList.add('current');
        }
    });

    return {
        openProjectModal,
        closeProjectModal,
        checkDuplicate,
    };
})();