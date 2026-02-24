import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import UserManagement from './components/UserManagement';

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
    <div className="App">
      <UserManagement />
    </div>
  );
}

export default App;