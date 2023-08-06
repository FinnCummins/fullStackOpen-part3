require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Note = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

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

app.get('/api/persons/:id', (request, response, next) => {
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

app.delete('/api/persons/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
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

    note.save()
        .then(savedNote => {
            response.json(savedNote)
        })
        .catch(error => {
          console.error(error.message)

          if (error.name === 'CastError') {
            return response.status(400).send({ error: 'malformatted id' })
          }
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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)
