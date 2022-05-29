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
    console.log('-------POST--------')
    console.log(req.body)

    let task = new Todo({
      description: req.body.description,
      tags: req.body.tags
    })

    let error = task.validateSync()

    if(error != undefined) {
      res.json({error: 'validation error'})
      console.log('erro de validação')
    }
    else {
      await task.save((err, result) => {
        if(err){
          res.json({error : err})
          console.log('erro salvando')
        }
        else
          res.json({message: 'Nova Tarefa arquivada'})
      })
    }
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
  })
  .put(async (req,res) => {
    Todo.updateOne(
      {_id: req.body.id},
      {description: req.body.description, tags: req.body.tags},
      (err, result) => {
        res.json({message: 'Tarefa editada com sucesso'})
      }
    )
  })
  .delete((req,res) => {
    Todo.remove(
      {_id: req.body.id},
      (err, result) => {
        if(err)
          res.json(err)
        else
          res.json({message: 'Item excluido com sucesso'})
      })
  })

http.createServer(app).listen(port)
console.log(`Servidor rodando na porta: ${port}`)