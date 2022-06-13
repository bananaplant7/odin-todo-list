import { projects, saveProjects } from './localStorage.js';

export const projectsContainer = document.querySelector('#projectsContainer');

export const createProject = (title) => {
    return {
        title, todos: []
    };
};

export function addProject(project) {
    projects.push(project);
}

function clearProjects() {
    while (projectsContainer.firstChild) {
        projectsContainer.removeChild(projectsContainer.firstChild);
    }
}

function displayProjects() {
    /*
    <button class="tab project" id='project.title'>
        <div class="projectTitle">project.title</div> 
        <button class="deleteProjectBtn">🗑</button>
    </button> 
    */
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

export function renderProjects() {
    saveProjects();
    clearProjects();
    displayProjects();
}