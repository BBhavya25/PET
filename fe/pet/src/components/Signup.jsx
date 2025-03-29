import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!userData.username || !userData.email || !userData.password) {
      setError('All fields are required')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      const data = await response.json()
      
      if (data.user) {
        setSuccess('Account created successfully! Please login.')
        setUserData({
          username: '',
          email: '',
          password: ''
        })
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError(data.message || 'Signup failed')
      }
    } catch (err) {
      setError('Failed to connect to server')
    }
  }

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username*</label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email*</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password*</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{' '}
        <span className="link" onClick={() => navigate('/login')}>
          Login
        </span>
      </p>
    </div>
  )
}

export default Signup