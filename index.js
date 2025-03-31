const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())

app.use(express.static('dist'))
app.use(express.json())


let persons = [
	{
	id: "1",
	name: "Arto Hellas",
	number: "040-123456"
	},
	{
	id: "2",
	name: "Ada Lovelace",
	number: "39-44-5323523"
	},
	{
	id: "3",
	name: "Dan Abramov",
	number: "12-43-234345"
	},
	{
	id: "4",
	name: "Mary Poppendieck",
	number: "39-23-6423122"
	}
]

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body',{
	skip: (req) => req.method !== 'POST'
}))

app.use(morgan('tiny', {
	skip: (req) => req.method === 'POST'
}))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
	response.json(result)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  
  if (person) {
	response.json(person)
  } else {
	console.log(`Person with id ${id} not found`)
	response.status(404).end()
  }	
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  console.log('delete', id)
  if (!persons.find(person => person.id === id)) {
	response.status(404).end()
  }
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
	return Math.floor(Math.random() * 1000000).toString()
}

app.post('/api/persons', (request, response) => {
	const person = request.body

	if (!person.name || !person.number) {
		return response.status(400).json({
			error: 'name or number missing'
		})
	}

	if (persons.find(p => p.name === person.name)) {
		return response.status(400).json({
			error: 'name is already in the phonebook'
		})
	}

	const newPerson = {
		id: generateId(),
		name: person.name,
		number: person.number
	}

	persons = persons.concat(newPerson)
	response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
