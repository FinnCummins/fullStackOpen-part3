const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('post-content', function getId (req) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-content'))

let notes = [
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

app.delete('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    console.log(body)

    if (!body.name) {
        return response.status(400).json({ 
            error: 'name missing' 
        })
    }
    else if (!body.number) {
        return response.status(400).json({ 
            error: 'number missing' 
        })
    }
    else if (notes.find(note => note.name === body.name)) {
        return response.status(400).json({ 
            error: 'name already exists in the phone book' 
        })
    }


    const note = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
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