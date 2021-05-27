const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  pages: {
    type: Number,
    required: false,
    default: 0
  },
  imageURL: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Book', bookSchema)
