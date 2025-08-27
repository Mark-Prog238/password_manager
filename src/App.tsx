import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Dashboard from './pages/dashboard'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in on app start
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    setLoggedIn(isLoggedIn);
  }, []);

  return (
   <Router>
    <Routes>
      <Route path="/" element={loggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
      <Route path="/dashboard" element={<Dashboard loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
    </Routes>
   </Router>  
  )
}

export default App