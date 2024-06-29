const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))

const cors = require('cors')
app.use(cors())

const morgan = require('morgan');
morgan.token('req-body', (request) => {
  return JSON.stringify(request.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));

const Entry = require('./models/entry')

/* app.get('/api/info', (request, response) => {
    const date = new Date()
    const info = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
    `
    response.send(info)
}) */

app.get('/api/persons', (request, response) => {
  Entry.find({}).then(entries=> {
    response.json(entries)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Entry.findById(request.params.id).then(entry => {
    response.json(entry)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Entry.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).json({ error: 'entry not found' })
      }
    })
    .catch(error => {
      response.status(500).json({ error: 'failed to delete entry' })
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name|| !body.number) {
      return response.status(400).json({ 
        error: 'need both name and number' 
      })
    }

  /*
  const nameExists = persons.some(person => person.name === body.name);
    if (nameExists) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        });
    } */

    const entry = new Entry ({
      name: body.name,
      number: body.number,
    })
  
    entry.save().then(savedEntry => {
      console.log('entry saved')
      response.json(savedEntry)
    })
  
})

// Middlware for handling unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})