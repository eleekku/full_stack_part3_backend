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
		minlength: 3,
		validate: {
			validator: function(v) {
				return /^[a-zA-Z\s]+$/.test(v)
			},
			message: props => `${props.value} is not a valid name!`
		}
	},
	number: {
		type: String,
		required: true,
		minlength: 8,
		validate: {
			validator: function(v) {
				return /\d{2,3}-\d+/.test(v)
			},
			message: props => `${props.value} is not a valid phone number!`
		}
	},
})
const Person = mongoose.model('Person', personSchema)
module.exports = Person