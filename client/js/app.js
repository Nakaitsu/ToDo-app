function main() {
  'use strict'
  
  const form = document.querySelector('[name=ToDoForms]')
  let search = {
    input: document.querySelector('[data-search-input'),
    button: document.querySelector('[data-search-btn]')
  }
  
  form.addEventListener('submit', event => {
    event.preventDefault()
    
    const url = '/todos'
    let xhr = new XMLHttpRequest(),
        description = document.querySelector('[name=description]'),
        tags = document.querySelector('[name=tags]')
    
    let task = {
      description: description.value,
      tags: tags.value
    }
    
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = () => console.log(xhr.response)
    xhr.send(JSON.stringify(task))

    description.value = ''
    tags.value = ''
    
  }, false)

  search['button'].addEventListener('click', event => {
    event.preventDefault()
    search['input'].value = ''
  })
  
  updateTodosPanel()
}

function updateTodosPanel(delegate) {
  const todosPanel = document.querySelector('.painel-tarefas'),
        url = '/todos'
  let xhr = new XMLHttpRequest()
  
  todosPanel.innerHTML = ""
  
  xhr.open('GET', url, true)
  xhr.onload = function() {
    let response = JSON.parse(xhr.response)

    if(delegate) {
      delegate(response)
    }
    else{
      response.forEach(task => {
        let todo = createTodo()
        populateTodo(todo, task)

        todosPanel.append(todo)
      })
    }
  }
  xhr.send(null)
}

function createTodo() {
  let todo = document.createElement('div')
  todo.classList.add('tarefa', 'arredondar')

  todo.innerHTML = 
  `
    <p class="descricao" data-tarefa-item="descricao"></p>
    <div class="tags" data-tarefa-item="tags"></div>
    <p class="data" data-tarefa-item="data"></p>
    <a class="deletar arredondar-p">X</a>
  `

  return todo
}

function populateTodo(todo, todoRef) {
  todo = Array.from(todo.children)
  
  todo.forEach(data => {
    let role = data.dataset['tarefaItem']

    if(role === 'descricao') {
      data.innerHTML = todoRef.description
    }
    else if(role === 'tags') {
      tags = todoRef.tags
        .toString()  
        .split(',')

      tags.forEach(tagContent => {
        let tag = document.createElement('p')
        tag.className = 'arredondar-p'

        tag.innerHTML = tagContent
        data.append(tag)
      })
    }
    else if(role === 'data') 
      data.innerHTML = todoRef.date;
  })
}

window.onload = main