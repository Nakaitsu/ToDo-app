const mainPanel = {
  title: document.querySelector('[data-title]'),
  form: document.querySelector('[name=AddTodoForm]'),
  description: document.getElementById('description'),
  tags: document.getElementById('tags'),
  button: document.querySelector('[data-main-button]')
}

function main() {
  'use strict'

  const filters = document.querySelectorAll('[data-filtro]')
  let url = '/todos',
      search = {
        input: document.querySelector('[data-search-input]'),
        button: document.querySelector('[data-search-btn]')
      },
      filter = {
        newest: (context) => {
          let newest = []
  
          for(let i = context.length - 1; i >= 0; i--) {
            newest.push(context[i])
          }
          return newest
        },
        oldest: (context) => {
          let oldest = []
  
          oldest = context.filter(elem => elem)
          return oldest
        },
        tag: (context) => {
          //fazer ainda
        }
      }

  filters.forEach(f => {
    if(f.dataset.filtro === 'recente') {
      f.addEventListener(
        'click',
        e => {
          e.preventDefault()
          updateTodosPanel(filter.newest)
        })
    }
    else if(f.dataset.filtro === 'antigo') {
      f.addEventListener(
      'click',
      e => {
        e.preventDefault() 
        updateTodosPanel(filter.oldest)
      })
    }
    // else if(f.dataset.filtro === 'tag') {
    //   f.addEventListener('click',
    //   updateTodosPanel(filter.tag), false)
    // }
  })

  mainPanel.button.addEventListener('click', async function(event) {
    event.preventDefault()

    let content = {
        id: undefined,
        description: mainPanel.description.value 
          ? mainPanel.description.value 
          : undefined,
        tags: mainPanel.tags.value 
          ? mainPanel.tags.value.split(',') 
          :  undefined
      }

    if(this.dataset.editMode === 'false') {
      await makeRequest('POST', url, content)
    }
    else if(this.dataset.editMode === 'true'){
      content.id = sessionStorage.getItem('editing')
      await makeRequest('PUT', url, content)

      mainPanel.title.textContent = "Adicionar nova tarefa"
      mainPanel.button.classList.remove('editMode')
      mainPanel.button.classList.add('addMode')
      mainPanel.button.dataset['editMode'] = 'false'
    }

    updateTodosPanel()

    mainPanel.description.value = ''
    mainPanel.tags.value = ''
  }, false)

  search['button'].addEventListener('click', event => {
    event.preventDefault()

    let searchString = search['input'].value
    search['input'].value = ''

    updateTodosPanel(searchTerm, searchString)
  })

  updateTodosPanel()
}

function makeRequest(method, url, content = null) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = function() {
      if(this.status >= 200 && this.status < 300) {
        resolve(JSON.parse(xhr.response))
      }
      else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        })
      }
    }
    xhr.onerror = function() {
      reject({
        status: this.status,
        statusText: xhr.statusText
      })
    }
    
    if(content != null){
      xhr.send(JSON.stringify(content))
    }
    else 
      xhr.send()
  })
}

function searchTerm(context, searchString) {
  let result = []
  searchString = searchString.toString()

  result = context.filter(elem => {
    return elem.description
      .toLowerCase()
      .includes(searchString.toLowerCase())
  })
  
  return result
}

async function updateTodosPanel(delegate, ...params) {
  const todosPanel = document.querySelector('.painel-tarefas'),
    url = '/todos'
  let result = await makeRequest('GET', url)
  
  if(delegate)
    result = delegate(result, params)

  todosPanel.innerHTML = ""

  if(result.length === 0 )
    todosPanel.append('Nenhum registro encontrado')
  else {
    result.forEach(reference => {
      todo = createTodo(reference)

      todosPanel.append(todo) 
    })
  }
}

async function deleteTodo(id) {
  let url = '/todos',
    todoID = {id: id}
  
  await makeRequest('DELETE', url, todoID)

  updateTodosPanel()
}

function editTodo(id, todoElement) {
  let todo = {
    description: todoElement.children[0].textContent,
    tags: Array.from(todoElement.children[1].childNodes)
        .map(elem => elem.textContent )
        .toString()
  }

  sessionStorage.setItem('editing', id)

  mainPanel.description.value = todo.description
  mainPanel.tags.value = todo.tags
  mainPanel.title.textContent = 'Editar tarefa'
  mainPanel.button.classList.remove('addMode')
  mainPanel.button.classList.add('editMode')
  mainPanel.button.dataset['editMode'] = true
}

function createTodo(reference) {
  let todo = document.createElement('div')
  todo.classList.add('tarefa', 'arredondar')
  todo.dataset.id = reference._id
  todo.dataset.tarefa = null

  todo.innerHTML =
    `
    <p class="descricao" data-tarefa-item="descricao"></p>
    <div class="tags" data-tarefa-item="tags"></div>
    <p class="data" data-tarefa-item="data"></p>

    <div class="tarefa-opcoes">
      <div class="deletar opcoes" data-deletar>
        <i class="bi-x-lg" data-deletar></i>
      </div>
      <div class="editar opcoes" data-editar>
        <i class="bi-pencil" data-editar></i>
      </div>
    </div>
    `

  populateTodo(todo, reference)

  todo.addEventListener('click', event => {
    if(event.target.dataset.hasOwnProperty('editar')) {
      document.querySelectorAll('.tarefa')
        .forEach(todo => todo.classList.remove('editing'))

      todo.classList.add('editing')

      
      editTodo(reference._id, todo)
    }
    else if(event.target.dataset.hasOwnProperty('deletar')) {
      deleteTodo(reference._id)
    }
  })

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
    else if(role === 'data') {
      let date = new Date(todoRef.createdAt),
        day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear()

      data.innerHTML = (day + ' / ' + month + ' / ' + year);
    }
  })
}

window.onload = main