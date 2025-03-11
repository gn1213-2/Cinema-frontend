import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isAuthenticated, isStaff, username, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">Cinema App</Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/my-bookings">My Bookings</Link>
              </li>
            )}
            
            {isAuthenticated && isStaff && (
              <li className="nav-item">
                <Link className="nav-link" to="/staff">Staff Portal</Link>
              </li>
            )}
          </ul>
          
          <div className="navbar-text me-3">
            {isAuthenticated ? `Welcome, ${username}` : ''}
          </div>
          
          {isAuthenticated ? (
            <button 
              className="btn btn-outline-light" 
              onClick={onLogout}
            >
              Logout
            </button>
          ) : (
            <Link className="btn btn-outline-light" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 