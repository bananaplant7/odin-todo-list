import { saveAllTab, saveProjects } from './localStorage.js';

export const todoContainer = document.querySelector('.todoContainer');

// origin is where the todo was created
export const createTodo = (title, desc, date, complete, origin) => {
    return {
        title, desc, date, complete, origin
    };
};

export function addTodo(tab, todo) {
    tab.todos.push(todo);
}

export function editTodo(todo, newTitle, newDesc, newDate) {
    todo.title = newTitle;
    todo.desc = newDesc;
    todo.date = newDate;
}

function clearTodos() {
    while (todoContainer.firstChild) {
        todoContainer.removeChild(todoContainer.firstChild);
    }
}

function displayTodos(tab) {
    /*
    <li class="todo" id='todo.title'>
        <input class='checkbox' type=checkbox>
        <div class="title">Title</div>
        <div class="desc">Desc</div>
        <div class="date">Date</div>
        <button class="editTodoBtn">📝</button>
        <button class="deleteTodoBtn">🗑</button>
    </li>
    */
    tab.todos.forEach(todo => {
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
        li.appendChild(editTodoBtn);
        li.appendChild(deleteTodoBtn);
        todoContainer.appendChild(li);
    });
}

export function renderTodos(tab) {
    saveAllTab();
    saveProjects();
    clearTodos();
    displayTodos(tab);
}





