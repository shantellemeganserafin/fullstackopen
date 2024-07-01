/*
* This file hosts a RESTful API on a backend server
* Backend framework - Express.js (Node.js)
* Integrated with MongoDB
*/

// Built-in Third-party Middleware 
const express = require('express')
const app = express()
const Note = require('./models/note')
const cors = require('cors')

app.use(express.static('dist')) //serves static files form the `dist` directory
app.use(express.json()) //parses incoming json requests
app.use(cors()) //enables cross-origin resource sharing

// Route Handlers - functions in a Express application that are responsible for handling HTTP requests to a specific endpoints (or routes)
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
  
app.post('/api/notes', (request, response, next) => {
    const body = request.body
  
    const note = new Note({
      content: body.content,
      important: body.important || false,
    })
  
    note.save().then(savedNote => {
      console.log('noted saved!')
      response.json(savedNote)
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findByIdAndUpdate(
    request.params.id, 
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  ) 
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

// Custome Middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint) //handles requests to unknown endpoints

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler) //handles errors passed to `next`

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})