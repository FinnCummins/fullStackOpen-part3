require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Note = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('post-content', function getId (req) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-content'))

app.get('/', (request, response) => {
    console.log("Hello World")
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Note.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {

    Note.findById(request.params.id).then(note => {
      response.json(note)
    })
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

    if (body.name === undefined) {
        return response.status(400).json({ 
            error: 'name missing' 
        })
    }
    else if (body.number === undefined) {
        return response.status(400).json({ 
            error: 'number missing' 
        })
    }
    /*else if (notes.find(note => note.name === body.name)) {
        return response.status(400).json({ 
            error: 'name already exists in the phone book' 
        })
    }*/

    const note = new Note({
        name: body.name,
        number: body.number,
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${notes.length} people</p>
        <p>${new Date()}</p>
    `)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
