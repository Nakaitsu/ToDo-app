const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
  description: {
    type: String,
    required: true,
    minLength: 1,
    validate: {
      validator: v => v.length >= 1,
      message: props => 'A descrição não pode ser vazia.'
    }
  },
  tags: {
    type: [String],
    required: true,
    minLength: [1],
    validate: {
      validator: v => v.length >= 1,
      message: props => 'A tarefa precisa conter no mínimo uma tag.'
    }
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now()
  }
})

module.exports = mongoose.model('ToDos', todoSchema)