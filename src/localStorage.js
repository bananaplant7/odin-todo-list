import { isToday, isThisWeek } from 'date-fns';
const LOCAL_STORAGE_PROJECT_KEY = 'my.projects';
const LOCAL_STORAGE_ALL_KEY = 'my.allTab';
export let projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];
export let all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALL_KEY)) || { title: 'all', todos: [] };

export function saveAllTab() {
    localStorage.setItem(LOCAL_STORAGE_ALL_KEY, JSON.stringify(all));
}
export function saveProjects() {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projects));
}

// today and thisWeek tabs are done differently: their todos are dynamically
// generated based on the date, no local storage.

export let today = { title: 'today', todos: [] };

export let thisWeek = { title: 'thisWeek', todos: [] };

export function updateToday() {
    let dueToday = all.todos.filter(todo => isToday(new Date(todo.date)));
    today.todos = dueToday;
}

export function updateThisWeek() {
    let dueThisWeek = all.todos.filter(todo => isThisWeek(new Date(todo.date)));
    thisWeek.todos = dueThisWeek;
}
