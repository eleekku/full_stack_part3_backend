require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(cors())

app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body',{
  skip: (req) => req.method !== 'POST'
}))

app.use(morgan('tiny', {
  skip: (req) => req.method === 'POST'
}))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.get('/', (request, response) => {
  response.send('<h1>Weolcome to phonebook!</h1>')
})

app.get('/info', (request, response) => {
  const date = new Date()
  Person.find({}).then(result => {
	response.send(
	  `<p>Phonebook has info for ${result.length} people</p>
	  <p>${date}</p>`
	)
  })
  .catch(error => {
    console.error(error)
    response.status(500).send({ error: 'malformatted id' })
  })
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(result => {
  response.json(result)
  }
  )
  .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id	
  Person.findById(id).then(person => {
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
  })
  .catch(error => next(error))
 
})


app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  console.log('delete', id)
  Person.findByIdAndDelete(id).then(result => {
  if (result) {
    console.log('deleted', result)
  }
  else {
    console.log('not found')
    return response.status(404).end()
  }
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }
  const person = new Person({
  name: body.name,
  number: body.number,
  })

  person.save().then(savedPerson => {
  response.json(savedPerson)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body
  if (!name || !number) {
    return response.status(400).json({ error: 'name or number missing' })
  }
  const updatedPerson = { name, number }
  Person.findByIdAndUpdate(id, updatedPerson, { new: true, runValidators: true })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)