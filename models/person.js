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
		minlength: 3
	},
	number: {
		type: String,
		required: true,
		minlength: 8
	},
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		auto: true
	}
})
const Person = mongoose.model('Person', personSchema)
module.exports = Person