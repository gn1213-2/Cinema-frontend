import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Home from './components/Home';
import StaffPage from './components/StaffPage';
import UserBookings from './components/UserBookings';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userIsStaff = localStorage.getItem('isStaff') === 'true';
    const storedUsername = localStorage.getItem('username');
    
    console.log('Stored token:', token);
    console.log('Is staff:', userIsStaff);
    
    if (token) {
      setIsAuthenticated(true);
      setIsStaff(userIsStaff);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = (isAuth, isStaffMember, username, token) => {
    console.log("Received token from login:", token);
    localStorage.setItem('token', token);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('isStaff', isStaffMember);
    localStorage.setItem('username', username);
    
    setIsAuthenticated(true);
    setIsStaff(isStaffMember);
    setUsername(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isStaff');
    localStorage.removeItem('username');
    
    setIsAuthenticated(false);
    setIsStaff(false);
    setUsername('');
  };

  return (
    <Router>
      <div className="App">
        <Navbar 
          isAuthenticated={isAuthenticated} 
          isStaff={isStaff} 
          username={username} 
          onLogout={handleLogout} 
        />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
            } />
            <Route path="/staff" element={
              isAuthenticated && isStaff ? <StaffPage /> : <Navigate to="/" />
            } />
            <Route path="/my-bookings" element={
              isAuthenticated ? <UserBookings /> : <Navigate to="/login" />
            } />
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
