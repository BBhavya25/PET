import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const PetCare = ({ user, onLogout }) => {
  const [pets, setPets] = useState([])
  const [petForm, setPetForm] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    owner: user._id
  })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchPets()
  }, [user._id])

  const fetchPets = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/pets?ownerId=${user._id}`)
      const data = await response.json()
      setPets(data)
    } catch (err) {
      setError('Failed to fetch pets')
    }
  }

  const handleInputChange = (e) => {
    setPetForm({
      ...petForm,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmitPet = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!petForm.name || !petForm.species) {
      setError('Name and species are required')
      return
    }

    try {
      const url = editingId 
        ? `http://localhost:5000/api/pets/${editingId}`
        : 'http://localhost:5000/api/pets'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(petForm)
      })
      const data = await response.json()
      
      if (data.pet) {
        if (editingId) {
          setPets(pets.map(pet => 
            pet._id === editingId ? data.pet : pet
          ))
        } else {
          setPets([...pets, data.pet])
        }
        resetForm()
      } else {
        setError(data.message || 'Failed to save pet')
      }
    } catch (err) {
      setError('Failed to connect to server')
    }
  }

  const handleEditPet = (pet) => {
    setPetForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed || '',
      age: pet.age || '',
      owner: user._id
    })
    setEditingId(pet._id)
  }

  const handleDeletePet = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/pets/${id}`, {
        method: 'DELETE'
      })
      setPets(pets.filter(pet => pet._id !== id))
    } catch (err) {
      setError('Failed to delete pet')
    }
  }

  const resetForm = () => {
    setPetForm({
      name: '',
      species: '',
      breed: '',
      age: '',
      owner: user._id
    })
    setEditingId(null)
  }

  return (
    <div className="petcare-container">
      <div className="header">
        <h2>Welcome, {user.username}!</h2>
        <button onClick={onLogout}>Logout</button>
      </div>
      
      <div className="pet-form">
        <h3>{editingId ? 'Edit Pet' : 'Add New Pet'}</h3>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmitPet}>
          <div className="form-group">
            <label>Name*</label>
            <input
              type="text"
              name="name"
              value={petForm.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Species*</label>
            <input
              type="text"
              name="species"
              value={petForm.species}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Breed</label>
            <input
              type="text"
              name="breed"
              value={petForm.breed}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={petForm.age}
              onChange={handleInputChange}
              min="0"
            />
          </div>
          <div className="form-actions">
            <button type="submit">
              {editingId ? 'Update Pet' : 'Add Pet'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="pet-list">
        <h3>Your Pets</h3>
        {pets.length === 0 ? (
          <p>No pets found. Add your first pet!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Species</th>
                <th>Breed</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pets.map(pet => (
                <tr key={pet._id}>
                  <td>{pet.name}</td>
                  <td>{pet.species}</td>
                  <td>{pet.breed || '-'}</td>
                  <td>{pet.age || '-'}</td>
                  <td>
                    <button onClick={() => handleEditPet(pet)}>Edit</button>
                    <button onClick={() => handleDeletePet(pet._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default PetCare