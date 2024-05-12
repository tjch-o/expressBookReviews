const express = require('express')
const jwt = require('jsonwebtoken')
let books = require('./booksdb.js')
const regd_users = express.Router()

let users = []

// Check if the username is already registered
const isValid = username => {
  const user = users.find(user => user.username == username)
  return !user
}

// Check if username and password match the one we have in records
const authenticatedUser = (username, password) => {
  const user = users.find(
    user => user.username == username && user.password == password
  )
  return user
}

// Only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body

  if (!username) {
    return res.status(400).json({ message: 'Username is required' })
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required' })
  }

  if (!authenticatedUser(username, password)) {
    console.log(users)
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const accessToken = jwt.sign(
    { username: username, password: password },
    'access',
    {
      expiresIn: '1h'
    }
  )

  req.session.authorization = { accessToken: accessToken, username: username }
  return res.status(200).json({ message: 'User logged in successfully' })
})

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params
  const { review } = req.body

  if (req.session.authorization['username']) {
    if (books[isbn]) {
      books[isbn].reviews[req.session.authorization['username']] = review
      return res
        .status(200)
        .send(
          `The review by ${req.session.authorization['username']} for the book with ISBN ${isbn} has been successfully added`
        )
    }

    return res.status(404).send(`Book ${isbn} cannot be found`)
  }

  return res.status(403).send('User not authenticated')
})

// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params

  if (req.session.authorization['username']) {
    if (books[isbn]) {
      if (books[isbn].reviews[req.session.authorization['username']]) {
        delete books[isbn].reviews[req.session.authorization['username']]
        return res
          .status(200)
          .send(
            `Reviews for the book with ISBN ${isbn} posted by ${req.session.authorization['username']} has been successfully deleted`
          )
      }

      return res
        .status(404)
        .send(
          `No reviews found for the book with ISBN ${isbn} posted by ${req.session.authorization['username']}`
        )
    }

    return res.status(404).send('Book ${isbn} cannot be found')
  }

  return res.status(403).send('User not authenticated')
})

module.exports.authenticated = regd_users
module.exports.isValid = isValid
module.exports.users = users
