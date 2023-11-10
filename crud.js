const taskContainer = document.querySelector(".app__section-task-list")
const formTask = document.querySelector(".app__form-add-task")
const btnToggleFormTask = document.querySelector(".app__button--add-task")
const formLabel = document.querySelector(".app__form-label")
const taskAtiveDescription = document.querySelector(".app__section-active-task-description")
const textarea = document.querySelector(".app__form-textarea")
const btnDeleta = document.querySelector(".app__form-footer__button--delete")
const btnDeletaLimpaAll = document.querySelectorAll(".app__section-task-header__li__button")
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
let tarefaSelecionada = null
let itemTarefaSelecionada = null

let tarefaEmEdicao = null
let pEmEdicao = null

const selecionaTarefa = (tarefa, elemento) => {
    if(tarefa.concluida){
        return
    }

    document.querySelectorAll('.app__section-task-list-item-active').forEach(button => {
        button.classList.remove('app__section-task-list-item-active')
    })
    
    if (tarefaSelecionada == tarefa) {
        taskAtiveDescription.textContent = null
        itemTarefaSelecionada = null
        tarefaSelecionada = null
        return
    }
    
    tarefaSelecionada = tarefa
    itemTarefaSelecionada = elemento
    taskAtiveDescription.textContent = tarefa.descricao
    elemento.classList.add('app__section-task-list-item-active')
}

const localStorageTarefas = localStorage.tarefas
let tarefas = localStorageTarefas ? JSON.parse(localStorageTarefas) : []

const limpaForm = () => {
    tarefaEmEdicao = null
    pEmEdicao = null
    textarea.value = ''
    formTask.classList.add('hidden')
}

const selecionaTarefaParaEditar = (tarefa, elemento) => {
    if(tarefaEmEdicao == tarefa) {
        limpaForm()
        return
    }

    formLabel.textContent = "Editando Tarefa"
    tarefaEmEdicao = tarefa
    pEmEdicao = elemento
    textarea.value = tarefa.descricao
    formTask.classList.remove('hidden')
}

function createTask(tarefa) {
    const newLi = document.createElement("li")
    newLi.classList.add("app__section-task-list-item")

    const svgIcon = document.createElement("svg")
    svgIcon.innerHTML = taskIcon

    const newP = document.createElement("p")
    newP.classList.add("app__section-task-list-item-description")

    const imgBtnEditar = document.createElement("img")
    imgBtnEditar.setAttribute('src', 'imagens/edit.png')

    imgBtnEditar.addEventListener("click", e => {
        e.stopPropagation()
        selecionaTarefaParaEditar(tarefa, newP)
    })

    newP.textContent = tarefa.descricao

    const btnEditar = document.createElement("button")
    btnEditar.classList.add("app_button-edit")
    
    svgIcon.addEventListener("click", e => {
        if(tarefa == tarefaSelecionada) {
            e.stopPropagation()
            newLi.classList.add('app__section-task-list-item-complete')
            tarefaSelecionada.concluida = true
            updateLocalStorage()
        }
    })

    if(tarefa.concluida) {
        btnEditar.setAttribute("disabled", true)
        newLi.classList.add("app__section-task-list-item-complete")
    }

    newLi.addEventListener("click", e => {
        selecionaTarefa(tarefa, newLi)
    })

    newLi.appendChild(svgIcon)
    newLi.appendChild(newP)
    newLi.appendChild(btnEditar)
    btnEditar.appendChild(imgBtnEditar)

    return newLi
}

tarefas.forEach(tarefa => {
    const taskItem = createTask(tarefa)
    taskContainer.appendChild(taskItem)
})

btnToggleFormTask.addEventListener("click", e => {
    formLabel.textContent = "Adicionando tarefa"
    formTask.classList.toggle("hidden")
    const btnCancelar = e.target.parentNode.children[3][2]
    btnCancelar.addEventListener("click", _ => formTask.classList.add("hidden"))
})

btnDeleta.addEventListener("click", e => {
    if(tarefaSelecionada) {
        const index = tarefas.indexOf(tarefaSelecionada)
        console.log(index)
        if(index !== -1){
            tarefas.splice(index, 1)
        }
        itemTarefaSelecionada.remove()
        tarefas.filter(t => t != tarefaSelecionada)
        itemTarefaSelecionada = null
        tarefaSelecionada = null
    } else {
        alert("Para remover um elemento selecione/clique nele antes!")
    }
    updateLocalStorage()
    limpaForm()
})

btnDeletaLimpaAll.forEach(element => {
    element.addEventListener("click", e => {
        if(e.target.innerText == "Limpar todas as tarefas") {
            localStorage.removeItem('tarefas')
            document.querySelectorAll(".app__section-task-list-item").forEach(element => {
                element.remove()
            })
        } else {
            filtrarEremoverItens(true)
            function filtrarEremoverItens(precisaRemover) {
                // Recupera todos os itens do localStorage
                const todosItens = { ...localStorage };
              
                // Filtra os itens com base na variável booleana
                const itensFiltrados = Object.keys(todosItens).filter(chave => {
                  // Supondo que os valores são strings 'true' ou 'false'
                  const valorBooleano = JSON.parse(todosItens[chave]);
                  return valorBooleano !== precisaRemover;
                });
              
                // Remove os itens filtrados do localStorage
                itensFiltrados.forEach(chave => localStorage.removeItem(chave));
            }
            
            document.querySelectorAll(".app__section-task-list-item-complete").forEach(element => {
            element.remove()
            })
        }
    })
})


const updateLocalStorage = () => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas))
}

formTask.addEventListener("submit", e => {
    e.preventDefault()
    if(tarefaEmEdicao) {
        tarefaEmEdicao.descricao = textarea.value
        pEmEdicao.textContent = textarea.value
    } else {
        const task = {
            descricao: textarea.value,
            concluida: false
        }
        tarefas.push(task)
        const taskItem = createTask(task)
        taskContainer.appendChild(taskItem)
    }
    updateLocalStorage()
    limpaForm()
})

formTask.addEventListener("keydown", e => {
    if(e.key === "Enter") {
        if(tarefaEmEdicao) {
            tarefaEmEdicao.descricao = textarea.value
            pEmEdicao.textContent = textarea.value
        } else {
            const task = {
                descricao: textarea.value,
                concluida: false
            }
            tarefas.push(task)
            const taskItem = createTask(task)
            taskContainer.appendChild(taskItem)
        }
        updateLocalStorage()
        limpaForm()
    } 
})

document.addEventListener('TarefaFinalizada', e => {
    if(tarefaSelecionada) {
        tarefaSelecionada.concluida = true
        itemTarefaSelecionada.classList.add("app__section-task-list-item-complete")
        itemTarefaSelecionada.querySelector('button').setAttribute('disabled', true)
        updateLocalStorage()
    }
})