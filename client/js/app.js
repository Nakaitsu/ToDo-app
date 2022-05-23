function main() {
  'use strict'

  const form = document.querySelector('[name=ToDoForms]'),
        filters = document.querySelectorAll('[data-filtro]')

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

  form.addEventListener('submit', event => {
    event.preventDefault()

    let xhr = new XMLHttpRequest(),
      description = document.querySelector('[name=description]'),
      tags = document.querySelector('[name=tags]'),
      task = {
        description: description.value,
        tags: tags.value
      }

    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = () => updateTodosPanel()
    xhr.send(JSON.stringify(task))

    description.value = ''
    tags.value = ''
  }, false)

  search['button'].addEventListener('click', event => {
    event.preventDefault()

    let searchString = search['input'].value
    search['input'].value = ''

    updateTodosPanel(searchTerm, searchString)
  })

  updateTodosPanel()
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

function updateTodosPanel(delegate, ...params) {
  const todosPanel = document.querySelector('.painel-tarefas'),
    url = '/todos'
  let xhr = new XMLHttpRequest()

  todosPanel.innerHTML = ""

  xhr.open('GET', url, true)
  xhr.onload = function () {
    let response = JSON.parse(xhr.response)

    if(delegate)
      response = delegate(response, params)

    if(response.length === 0 )
      todosPanel.append('Nenhum registro encontrado')
    else {
      response.forEach((reference) => {
        todo = createTodo(reference)
        todosPanel.append(todo)
      })
    }

  }
  xhr.send(null)
}

function deleteTodo(id) {
  let xhr = new XMLHttpRequest(),
      url = '/todos',
      json = {id: id}
  
  xhr.open('DELETE', url, true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onload = () => alert('test01')
  xhr.send(JSON.stringify(json))
}

function createTodo(reference) {
  let todo = document.createElement('div')
  todo.classList.add('tarefa', 'arredondar')

  todo.innerHTML =
    `
    <p class="descricao" data-tarefa-item="descricao"></p>
    <div class="tags" data-tarefa-item="tags"></div>
    <p class="data" data-tarefa-item="data"></p>

    <div class="tarefa-opcoes">
      <div class="deletar opcoes">
        <i onclick="deleteTodo('${reference._id}')" class="bi-x-lg"></i>
      </div>
      <div class="editar opcoes">
        <i onclick="editTodo('${reference._id}')" class="bi-pencil"></i>
      </div>
    </div>
    `
  populateTodo(todo, reference)
  return todo
}

function populateTodo(todo, todoRef) {
  todo = Array.from(todo.children)

  todo.forEach(data => {
    let role = data.dataset['tarefaItem']

    if (role === 'descricao') {
      data.innerHTML = todoRef.description
    }
    else if (role === 'tags') {
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
    else if (role === 'data') {
      let date = new Date(todoRef.createdAt),
        day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear()

      data.innerHTML = (day + ' / ' + month + ' / ' + year);
    }
  })
}

window.onload = main