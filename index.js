require('dotenv').config()
const { application } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (request, response) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {

  const info = {
    content: persons.length,
    date: new Date()
  }

  const infoPage = `
          <p>Phonebook has info for ${info.content} people</p>
          <p>${info.date}</p>
          `

  response.send(infoPage)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {

  const max = 1000 //change this to increase possible IDs

  return Math.floor(Math.random() * max)
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  const person = persons.find(person => person.name === body.name)

  if (person) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})