const express = require('express')
const morgan = require('morgan');
const app = express()

// Middleware - Parsing JSON request body
app.use(express.json())

// Create a custom token for the request body
morgan.token('req-body', (request) => {
  return JSON.stringify(request.body);
});

// Use morgan with the custom token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
    ,
    { 
      "id": "5",
      "name": "Taylor Swift", 
      "number": "39-23-232"
    }
]

app.get('/api/info', (request, response) => {
    const date = new Date()
    const info = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
    `
    response.send(info)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateId = () => {
  const randomId = Math.floor(Math.random() * 1000000);
  return String(randomId);
}

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name|| !body.number) {
      return response.status(400).json({ 
        error: 'need both name and number' 
      })
    }

    const nameExists = persons.some(person => person.name === body.name);
    if (nameExists) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        });
    }

    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    }
  
    persons = persons.concat(person)
  
    response.json(person)
})

// Middlware for handling unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// Start server
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})