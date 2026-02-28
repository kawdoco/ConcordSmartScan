import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './authentication/Login';
import AddUser from './users/AddUser';
import './App.css';

function LandingPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from backend API
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
    axios.get(`${apiUrl}/hello`)
      .then(response => {
        setMessage(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setMessage('Unable to connect to backend');
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to React + Spring Boot</h1>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <p>{message}</p>
        )}

        {/* ✅ Login Button */}
        <button 
          className="login-button"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        

      </header>
    </div>
  );
}


// Main App with Routes
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users/add" element={<AddUser />} />
      </Routes>
    </Router>
  );
}

export default App;
