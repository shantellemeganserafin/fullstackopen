// Purspose - backend server offers raw data in JSON format to the frontend
const express = require('express')
const app = express()
app.use(express.json())

// Middleware - Cross-Origin Resource Sharing
const cors = require('cors')

// Middleware - Express show static content, the page index.html and the JavaScript
app.use(express.static('dist'))

app.use(cors())

let notes = [
  {
    id: 1,
    content: "ws 1",
    important: true
  },
  {
    id: 2,
    content: "ws 2",
    important: false
  },
  {
    id: 3,
    content: "ws 3",
    important: true
  }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
}
  
app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = {
      content: body.content,
      important: Boolean(body.important) || false,
      id: generateId(),
    }
  
    notes = notes.concat(note)
  
    response.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})