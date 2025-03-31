const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument and name and number as optional arguments')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.zjh0c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})

if (!person.name || !person.number) {
  console.log('Name or number missing')
  mongoose.connection.close()
  process.exit(1)
}

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
  return
}

  Person.findOne({ name: person.name })
  .then(existingPerson => {
    if (existingPerson) {
      console.log(`Person with name "${person.name}" already exists.`);
      mongoose.connection.close();
      process.exit(1);
    } else {
      return person.save();
    }
  })
  .then(result => {
    if (result) {
      console.log(`Added ${person.name} number ${person.number} to phonebook`);
    }
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('Error:', error.message);
    mongoose.connection.close();
  });