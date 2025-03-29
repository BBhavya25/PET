import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ChangePassword = ({ onLogin }) => {
  const [passwordData, setPasswordData] = useState({
    username: '',
    currentPassword: '',
    newPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!passwordData.username || !passwordData.currentPassword || !passwordData.newPassword) {
      setError('All fields are required')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      })
      const data = await response.json()
      
      if (data.message) {
        setSuccess(data.message)
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError(data.message || 'Password change failed')
      }
    } catch (err) {
      setError('Failed to connect to server')
    }
  }

  return (
    <div className="auth-container">
      <h2>Change Password</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={passwordData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
      <p>
        Remember your password?{' '}
        <span className="link" onClick={() => navigate('/login')}>
          Login
        </span>
      </p>
    </div>
  )
}

export default ChangePassword