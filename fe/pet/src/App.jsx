import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import ChangePass from './components/ChangePassword'
import PetCare from './components/PetCare'

function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('petcare_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    localStorage.setItem('petcare_user', JSON.stringify(userData))
    setUser(userData)
    navigate('/petcare')
  }

  const handleLogout = () => {
    localStorage.removeItem('petcare_user')
    setUser(null)
    navigate('/login')
  }

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
      <Route path="/change-password" element={<ChangePass onLogin={handleLogin} />} />
      <Route 
        path="/petcare" 
        element={
          user ? (
            <PetCare user={user} onLogout={handleLogout} />
          ) : (
            <Login onLogin={handleLogin} />
          )
        } 
      />
      <Route path="*" element={<Login onLogin={handleLogin} />} />
    </Routes>
  )
}

export default App