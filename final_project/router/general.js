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
public_users.get('/', async function (req, res) {
  try {
    const retrievedBooks = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books)
      }, 500)
    })

    return res.status(200).json({ retrievedBooks })
  } catch (error) {
    return res.status(500).send('An error occurred while fetching books')
  }
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const { isbn } = req.params

  try {
    const retrievedBooks = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books)
      }, 500)
    })

    if (!retrievedBooks[isbn]) {
      return res.status(404).json({ message: 'Book not found' })
    }
    return res.status(200).json({ book: retrievedBooks[isbn] })
  } catch (error) {
    return res.status(500).send('An error occurred while fetching books with this ISBN')
  }
})

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const { author } = req.params

  try {
    const booksFromAuthor = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(Object.values(books).filter(book => book.author == author))
      }, 500)
    })

    if (!booksFromAuthor) {
      return res.status(404).json({ message: 'Books by author not found' })
    }
  
    return res.status(200).json({ books: booksFromAuthor })
  } catch (error) {
    return res.status(500).send('An error occurred while fetching books from this author')
  }
})

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const { title } = req.params

  try {
    const booksWithTitle = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(Object.values(books).filter(book => book.title == title))
      }, 500)
    })

    if (!booksWithTitle) {
      return res.status(404).json({ message: 'Books by author not found' })
    }
  
    return res.status(200).json({ books: booksWithTitle })
  } catch (error) {
    return res.status(500).send('An error occurred while fetching books with this title')
  }
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
