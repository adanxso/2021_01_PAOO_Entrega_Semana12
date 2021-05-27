const { Router } = require('express')
const multer = require('multer')
const Book = require('../models/Book')

const MIME_TYPE_EXT_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/bmp': 'bmp'
}

const storage = multer.diskStorage({
  destination: (_req, file, callback) =>
    callback(
      MIME_TYPE_EXT_MAP[file.mimetype]
        ? null
        : new Error('Invalid Mime Type'),
      'backend/images'
    ),
  filename: (req, file, callback) => {
    const name = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-')
    const ext = MIME_TYPE_EXT_MAP[file.mimetype]
    callback(null, `${name}-${Date.now()}.${ext}`)
  }
})

const router = Router()

router.post('', multer({ storage }).single('image'), (req, res) => {
  const imageURL= `${req.protocol}://${req.get('host')}`
  const book = new Book({
    ...req.body,
    imageURL: `${imageURL}/images/${req.file.filename}`
  })
  book.save()
    .then(book => {
      res.status(201)
        .json({
          bookId: book._id,
          title: book.title,
          author: book.author,
          pages: book.pages,
          imageURL: book.imageURL
        })
    })
})

router.put('/:bookId', multer({ storage }).single('image'), (req, res) => {
  const imageUrl = req.file
    ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    : req.body.imageUrl
  const book = new Book({
    _id: req.params.bookId,
    title: req.body.title,
    author: req.body.author,
    pages: req.body.pages,
    imageUrl
  })
  Book.updateOne({ _id: req.params.bookId }, book)
    .then(response => {
      res.status(200)
        .json({ message: 'Book Successfully updated' })
    })
})

router.get('', (_, res) => {
  Book
    .find()
    .then(doc => {
      res
        .status(200)
        .json(doc.map(el => ({
          bookId: el._id,
          title: el.title,
          author: el.author,
          pages: el.pages,
          imageURL: el.imageURL
        })))
    })
})

router.get('/:bookId', (req, res) => {
  Book.findById(req.params.bookId)
    .then(book => {
      if (book) {
        res.status(200)
          .json(book)
      } else {
        res.status(404)
          .json({ message: 'Book not found' })
      }
    })
})

router.delete('/:bookId', (req, res) => {
  Book
    .deleteOne({ _id: req.params.bookId })
    .then(response => {
      if (response) {
        res.status(200)
          .json({ message: 'Book successfully removed'})
      }
    })
})

module.exports = {
  router
}
