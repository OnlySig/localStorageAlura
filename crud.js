const taskContainer = document.querySelector(".app__section-task-list")
const formTask = document.querySelector(".app__form-add-task")
const btnToggleFormTask = document.querySelector(".app__button--add-task")
const formLabel = document.querySelector(".app__form-label")
const textarea = document.querySelector(".app__form-textarea")
const taskIcon = `
<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF" />
    <path
        d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
        fill="#01080E" 
    />
</svg>
`
const localStorageTarefas = localStorage.tarefas
let tarefas = localStorageTarefas ? JSON.parse(localStorageTarefas) : []

function createTask(tarefa) {
    const newLi = document.createElement("li")
    newLi.classList.add("app__section-task-list-item")

    const svgIcon = document.createElement("svg")
    svgIcon.innerHTML = taskIcon

    const newP = document.createElement("p")
    newP.classList.add("app__section-task-list-item-description")

    newP.textContent = tarefa.descricao

    newLi.appendChild(svgIcon)
    newLi.appendChild(newP)

    return newLi
}

tarefas.forEach(tarefa => {
    const taskItem = createTask(tarefa)
    taskContainer.appendChild(taskItem)
})

btnToggleFormTask.addEventListener("click", e => {
    formTask.classList.toggle("hidden")
    const btnCancelar = e.target.parentNode.children[3][2]
    btnCancelar.addEventListener("click", _ => formTask.classList.add("hidden"))
})

const updateLocalStorage = () => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas))
}

formTask.addEventListener("submit", e => {
    e.preventDefault()
    addTarefa()
})

formTask.addEventListener("keydown", e => {
    if(e.key === "Enter") {
        addTarefa()
    } 
})


function addTarefa() {
    const task = {
        descricao: textarea.value,
        concluida: false
    }
    tarefas.push(task)
    const taskItem = createTask(task)
    taskContainer.appendChild(taskItem)
    updateLocalStorage()
    textarea.value = ""
}
