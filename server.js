const express = require('express'),
      http= require('http'),
      mongoose= require('mongoose'),
      bodyParser= require('body-parser')

let app = express(),
    port = 3000

app.use(express.static(__dirname + '/client'))
app.use(express.json())
mongoose.connect('mongodb://localhost/todoapp')

const todoSchema = mongoose.Schema({
  description: String,
  tags: [String],
  modified: Date
})

const todos = mongoose.model('ToDos', todoSchema)

app.post('/todos', async (req, res) => {
  console.log('objeto recebido')
  console.log(req.body)

  let description = req.body.description,
      tags = req.body.tags.split(',')

  let task = todos({
    description: description,
    tags: tags
  })

  await task.save((err, result) => {
    if(err)
      res.send(err)
    else
      res.json({message: 'tarefa arquivada'})
  })

})

app.get('/todos', (req, res) => {
  todos.find({}, (err, result) => {
    if(!err)
      res.json(result)
    else
      res.json(err)
  })
})

http.createServer(app).listen(port)
console.log(`Servidor rodando na porta: ${port}`)