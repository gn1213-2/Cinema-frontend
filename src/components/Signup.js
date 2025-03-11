import React, { useState } from 'react';
import axios from 'axios';

function Signup({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isStaffMember, setIsStaffMember] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('https://cinema-backend-474u.onrender.com/api/users/signup/', {
        username,
        password,
        email,
        is_staff_member: isStaffMember
      });
      
      console.log('Signup successful:', response.data);
      
      // Log in the user automatically after successful signup
      onLogin(
        true,
        response.data.is_staff_member,
        response.data.username,
        response.data.token
      );
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating account');
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="login-container">
      <h2>Sign Up</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isStaffMember}
              onChange={(e) => setIsStaffMember(e.target.checked)}
            />
            Sign up as staff member
          </label>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup; 