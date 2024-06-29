import { useState, useEffect} from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [notification, setNotification] = useState({message: null, type: ''})

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
    })
  },[])

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(person => person.name === newName)

    if(existingPerson){
      const confirmation = window.confirm(`'${newName}' is already added to phonebook, replace the old number with the new one?`)

      if (confirmation){
        const updatedPerson = { ...existingPerson, number: newNumber}
        personService
        .updateNumber(existingPerson.id, updatedPerson)
        .then(response => {
          setPersons(persons.map(person =>person.id !== existingPerson.id ? person : response.data))
          setNewName('')
          setNewNumber('')
          setNotification({message:`Updated '${existingPerson.name}' phone number`, type:'success'})
          setTimeout(() => {setNotification({message: null, type:''})}, 5000)
        }
      ).catch(error => {
          setNotification({message: `'${existingPerson.name}' was already removed from the server`, type:''})
          setTimeout(() => {setNotification({message: null, type:''})}, 5000)
          setPersons(persons.filter(p => p.id !== existingPerson.id))
          setNewName('')
          setNewNumber('')
        })
      }
    } else {
        personService
          .create(nameObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewNumber('')
            setNotification({message:`Added '${returnedPerson.name}'`, type:'success'})
            setTimeout(() => {setNotification({message: null, type:''})}, 5000)
        })
      }
  }

  const deleteName = (id) => {
    const personToDelete = persons.find(person => person.id === id)
    const confirmation = window.confirm(`Delete '${personToDelete.name}'?`)
  
    if (confirmation) {
      personService
        .deleteName(id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== id))
          setNewName('')
          setNewNumber('')
          setNotification({message:`Deleted '${personToDelete.name}'`, type:'success'})
          setTimeout(() => {setNotification({message: null, type:''})}, 5000)
        })
        .catch(error => {
          setNotification({message: `'${personToDelete.name}' was already removed from the server`, type:''})
          setTimeout(() => {setNotification({message: null, type:''})}, 10000)
          setPersons(persons.filter(p => p.id !== personToDelete.id))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setShowAll(false)
  }

  const personsToShow = showAll
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type}/>
      <Filter value={filter} onChange={handleFilterChange}/>
      <h3>add a new</h3>
      <PersonForm
        onSubmit={addName}
        nameValue={newName}
        onNameChange={handleNameChange}
        numValue={newNumber}
        onNumberChange={handleNumberChange}
        />
      <h3>Numbers</h3>

      <Persons personsToShow = {personsToShow} deleteName={deleteName} />
    </div>
  )
}

export default App