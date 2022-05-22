const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    required: true
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now()
  }
})

module.exports = mongoose.model('ToDos', todoSchema)