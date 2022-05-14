const express = require('express'),
      http= require('http'),
      mongoose= require('mongoose'),
      bodyParser= require('body-parser')

let app = express(),
    port = 3000

app.use(express.static(__dirname + '/client'))
app.use(express.json())

const todoSchema = mongoose.Schema({
  description: String,
  tags: [String]
})

const todos = mongoose.model('ToDos', todoSchema)

app.post('/todos', (req, res) => {
  let test = req.body
  console.log(test)
})

app.get('/todos', (req, res) => {
  todos.find({}, (err, result) => {
    if(!err)
      res.json(result)
    else
      res.send(err)
  })
})

http.createServer(app).listen(port)
console.log(`Servidor rodando na porta: ${port}`)