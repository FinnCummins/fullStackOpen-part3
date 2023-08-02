const express = require('express')
const app = express()

const notes = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
    console.log("Hello World")
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(notes)
})

app.get('/api/persons/:id', (request, response) => {
    const noteId = Number(request.params.id)
    const note = notes.find(note => note.id === noteId)

    if (note) {
        response.json(note)
    }
    else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${notes.length} people</p>
        <p>${new Date()}</p>
    `)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})