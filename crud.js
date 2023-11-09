const taskContainer = document.querySelector(".app__section-task-list")
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

let tarefas = [
    {
        descricao: "tarafe Concluida",
        concluida: true
    }, 
    {
        descricao: "tarafe Pendente",
        concluida: false
    }
]


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