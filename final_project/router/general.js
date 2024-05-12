const express = require('express')
let books = require('./booksdb.js')
let isValid = require('./auth_users.js').isValid
let users = require('./auth_users.js').users
const public_users = express.Router()

public_users.post('/register', (req, res) => {
  const { username, password } = req.body

  if (!username) {
    return res.status(400).json({ message: 'Username is required' })
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required' })
  }

  if (isValid(username)) {
    users.push({ username: username, password: password })
    return res.status(200).json({ message: 'User registered successfully' })
  }

  return res.status(400).json({ message: 'User already exists' })
})

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json({ books })
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' })
  }
  return res.status(200).json({ book: books[isbn] })
})

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params
  const booksFromAuthor = Object.values(books).filter(
    book => book.author == author
  )

  if (!booksFromAuthor) {
    return res.status(404).json({ message: 'Books by author not found' })
  }

  return res.status(200).json({ books: booksFromAuthor })
})

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params
  const booksWithTitle = Object.values(books).filter(
    book => book.title == title
  )

  if (!booksWithTitle) {
    return res.status(404).json({ message: 'Books by author not found' })
  }

  return res.status(200).json({ books: booksWithTitle })
})

// Get book reviews for a book based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' })
  }

  return res.status(200).send(books[isbn].reviews)
})

module.exports.general = public_users
