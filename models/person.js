const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

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
	},
	number: {
		type: String,
		required: true,
	},
})
const Person = mongoose.model('Person', personSchema)
module.exports = Person