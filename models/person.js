const mongoose = require('mongoose')

const password = process.argv[2]
const url = env.process.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
	console.log('connected to MongoDB')
  })
  .catch((error) => {
	console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3
	},
	number: {
		type: String,
		required: true,
		minlength: 8
	}
})
const Person = mongoose.model('Person', personSchema)