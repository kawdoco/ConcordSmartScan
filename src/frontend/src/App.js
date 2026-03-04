import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserManagement from './components/UserManagement';
import AddNewStore from './components/AddNewStore';
import EditStore from './components/EditStore';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/stores/add" element={<AddNewStore />} />
          <Route path="/stores/edit" element={<EditStore />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;