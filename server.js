console.clear()

const express = require('express'),
      http= require('http'),
      bodyParser= require('body-parser'),
      mongoose = require('mongoose'),
      Todo = require('./todo')

let app = express(),
    port = 3000

app.use(express.static(__dirname + '/client'))
app.use(express.json())
mongoose.connect('mongodb://localhost/todoapp', 
  () => {
    console.log('Conexão com mongoDB local estabelecida')
})

app.post('/todos', async (req, res) => {
  console.log('-----------------')
  console.log('objeto recebido')
  console.log(req.body)
  console.log('-----------------')
  
  let description = req.body.description,
      tags = req.body.tags.split(',')

  let task = new Todo({
    description: description,
    tags: tags
  })

  await task.save((err, result) => {
    if(err)
      res.send(err)
    else {
      res.json({message: 'tarefa arquivada'})
      console.log('-----------------')
      console.log(result)
      console.log('-----------------')
    }
  })

})

app.get('/todos', (req, res) => {  
  Todo.find(
    {},
    {_id:0,__v:0},
    (err, result) => {
      if(!err)
        res.json(result)
      else
        res.json(err)
    }
  )
})

http.createServer(app).listen(port)
console.log(`Servidor rodando na porta: ${port}`)