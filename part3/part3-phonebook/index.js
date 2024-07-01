/*
* This file hosts a RESTful API on a backend server
* Backend framework - Express.js (Node.js)
* Integrated with MongoDB
*/

// Built-in Third-party Middleware 
const express = require('express')
const app = express()
const Entry = require('./models/entry')
const cors = require('cors')
const morgan = require('morgan');
morgan.token('req-body', (request) => { return JSON.stringify(request.body);});

app.use(express.static('dist')) //serves static files form the `dist` directory
app.use(express.json()) //parses incoming json requests
app.use(cors()) //enables cross-origin resource sharing
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body')); //log HTTP request

// Route Handlers - functions in a Express application that are responsible for handling HTTP requests to a specific endpoints (or routes)
app.get('/api/info', (request, response, next) => {
  Entry.find({}).then(entries => {
    const date = new Date()
    const info = 
    ` <p>Phonebook has info for ${entries.length} people</p>
      <p>${date}</p> `
    response.send(info)
  }).catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Entry.find({}).then(entries=> {
    response.json(entries)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Entry.findById(request.params.id).then(entry => {
    if (entry){
      response.json(entry)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Entry.findByIdAndDelete(request.params.id).then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).json({ error: 'entry not found' })
      }
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const entry = new Entry({
    name: body.name,
    number: body.number,
  })

  entry.save()
    .then(savedEntry => {
      console.log('entry saved')
      response.json(savedEntry)
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body
  
  Entry.findByIdAndUpdate(
    request.params.id,
    {name, number},
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedEntry => {
      if (!updatedEntry){
        return response.status(404).json({ error: 'Update failed' })
      }
      response.json(updatedEntry)
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
  } else if (error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }

  next(error)
}
app.use(errorHandler) //handles errors passed to `next`

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})