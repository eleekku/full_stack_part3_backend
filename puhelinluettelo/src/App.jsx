import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import Contacts from './services/Contacts'
import Notification from './components/Notification'

const addPerson = (event, persons, setPersons, newName, setNewName, newNumber, setNewNumber, setNotification) => {
  event.preventDefault()
  const newPerson = { name: newName, number: newNumber }
  if (newPerson.name === '') {
    alert('Name cannot be empty')
    return
  }
  if (persons.map(person => person.name).includes(newPerson.name) && persons.map(person => person.number).includes(newPerson.number)) {
    alert(`${newPerson.name} is already added to phonebook`)
    return
  }
  if (newPerson.number === '') {
    alert('Number cannot be empty')
    return
  }
  if (persons.map(person => person.name).includes(newPerson.name)) {
    alert(`${newPerson.name} is already added to phonebook. Do you want to update the number?`)
    const person = persons.find(person => person.name === newPerson.name)
    const updatedPerson = { ...person, number: newPerson.number }
    Contacts
      .update(person.id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
      })
      .catch(() => {
        setNotification({ message: `Information of ${newPerson.name} has already been removed from the database`, type: 'error'})
        setTimeout(() => {
          setNotification({message: null, type: ''})
        }, 5000)
      })
    setNewName('')
    setNewNumber('')
    return
  }
  if (newPerson.number) {
    Contacts
      .create(newPerson)
      .then(() => {
        Contacts.getAll().then(initialPersons => {
          setPersons(initialPersons)
        })
      })
    setNotification({ message: `Added ${newPerson.name}`, type: 'success'})
    setTimeout(() => {
      setNotification({message: null, type: ''})
    }, 5000)
    setNewName('')
    setNewNumber('')
  }
}

const removePerson = (id, persons, setPersons, setNotification) => {
  const person = persons.find(person => person.id === id)
  if (window.confirm(`Delete ${person.name}?`)) {
    Contacts
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch (() => {
        console.log('Error')
        setNotification({ message: `Information of ${person.name} has already been removed from the database`, type: 'error'})
        setTimeout(() => {
          setNotification({message: null, type: ''})
          setPersons(persons.filter(person => person.id !== id))
        }, 5000)
      })
  }
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: 'success' })

  useEffect(() => {
    Contacts
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNewNumber = (event, setNewNumber) => {
    setNewNumber(event.target.value)
  }

  const handleNewName = (event, setNewName) => {
    setNewName(event.target.value)
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type}/>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>add a new</h2>
      <form onSubmit={(event) => addPerson(event, persons, setPersons, newName, setNewName, newNumber, setNewNumber, setNotification)}>
        <div>
          name: <input value={newName} onChange={(event) => handleNewName(event, setNewName)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={(event) => handleNewNumber(event, setNewNumber)}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map(person => <Persons key={person.name} person={person} removePerson={(id) => removePerson(id, persons, setPersons, setNotification)} />)}
      </ul>
    </div>
  )
}

export default App