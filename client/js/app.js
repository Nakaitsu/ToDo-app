function main() {
  'use strict'
  
  const todosPanel = document.querySelector('.painel-tarefas')
  const form = document.querySelector('[name=ToDoForms]')

  
  form.addEventListener('submit', event => {
    event.preventDefault()
    
    let description = document.querySelector('[name=description]'),
        tags = document.querySelector('[name=tags]')

    let xhr = new XMLHttpRequest(),
        url = '/todos'
    
    let task = {
      description: description.value,
      tags: tags.value
    }
    
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(task))

    // fetch('todos', {
    //   method: 'POST',
    //   headers: {'Content-type':'application/json'},
    //   body: JSON.stringify(task)
    // }).then( res => console.log('finalizado o request'))

    description.value = ''
    tags.value = ''

  }, false)
  
  // updateTodosPanel()

  function atualiza() {
    todosPanel.innerHTML = ""
  }
}

// function createTask(object) {
//   let description = object.description,
//       tags = object.tags

//   let todo = document.createElement('div')

// }

// function updateTodosPanel() {
//   httpRequest.get('/todos', toDos => {
//     toDos.foreach(toDo => {
//       let task = createTask(toDo)
//       todosPanel.append(task)
//     })
//   })
// }

window.onload = main