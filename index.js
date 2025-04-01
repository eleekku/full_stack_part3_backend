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
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
  response.json(result)
})
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id	
  Person.findById(id).then(person => {
	if (person) {
	  response.json(person)
	} else {
	  response.status(404).end()
	}
  })
})


app.delete('/api/persons/:id', (request, response) => {
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
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  const person = new Person({
	name: body.name,
	number: body.number,
  })

  person.save().then(savedPerson => {
	response.json(savedPerson)
  })
  .catch(error => {
	console.log('error', error)
	response.status(400).json({ error: 'Name or number missing' })
  })
})