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

app.route('/todos')
  .post(async (req, res) => {
    console.log('-----------------')
    console.log('objeto recebido')
    console.log(req.body)
    
    let description = req.body.description,
        tags = req.body.tags.split(','),
        task = new Todo({
          description: description,
          tags: tags
        })

    await task.save((err, result) => {
      if(err)
        res.json(err)
      else {
        res.json({message: 'tarefa arquivada'})
        console.log('-----------------')
        console.log(result)
      }
    })

  })
  .get((req, res) => {  
    Todo.find(
      {},
      {__v:0},
      (err, result) => {
        if(!err)
          res.json(result)
        else
          res.json(err)
      }
    )

    console.log('Uma solicitação get')
  })
  .put((req,res) => {
    Todo.find(
      {id: req.body.id},
      (err, result) => {
        if(err)
          res.json(err)
        else {
          let oldTodo = result
          console.log(result) //debug
          
          Todo.replaceOne(
            {id: req.body.id},
            {
              description: req.body.description,
              tags: req.body.tags.split(',')
            },
            (err, result) => {
              console.log(result) //debug

              res.json({
                message: 'Item modificado com sucesso',
                oldest: {
                  description: oldTodo.description,
                  tags: oldTodo.tags
                },
                newest: {
                  description: result.description,
                  tags: result.tags,
                }
              })
            }
          )
        }
      })

    console.log('uma solicitação put')
  })
  .delete((req,res) => {
    Todo.deleteOne(
      {id: req.body.id},
      (err, result) => {
        if(err)
          res.json(err)
        else
          res.json({message: 'Item excluido com sucesso'})
      })

    console.log('Uma solicitação de delete')
  })

http.createServer(app).listen(port)
console.log(`Servidor rodando na porta: ${port}`)