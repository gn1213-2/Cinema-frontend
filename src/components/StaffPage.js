import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ShowManagement from './ShowManagement';
import SnackInventory from './SnackInventory';
import UserManagement from './UserManagement';

function StaffPage() {
  const [activeTab, setActiveTab] = useState('shows');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRemoveTestData = async () => {
    if (window.confirm('WARNING: This will permanently delete ALL showings and bookings. This action cannot be undone. Are you sure?')) {
      setLoading(true);
      setMessage('');
      setError('');
      
      try {
        const token = localStorage.getItem('token');
        console.log('Removing data with token:', token);
        
        const response = await axios.delete(
          'https://cinema-backend-474u.onrender.com/api/movies/remove-test-showings/',
          {
            headers: {
              'Authorization': `Token ${token}`
            }
          }
        );
        
        console.log('Remove response:', response.data);
        setMessage(response.data.message);
        setLoading(false);
      } catch (err) {
        console.error('Error removing data:', err);
        
        if (err.response?.status === 403) {
          setError('Permission denied: You do not have the required permissions to perform this action.');
        } else {
          setError(`Failed to remove data: ${err.response?.data?.error || err.message}`);
        }
        
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Staff Management Portal</h1>
      
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Content Management</h5>
            </div>
            <div className="card-body">
              <Link to="/staff/shows" className="btn btn-outline-primary me-2 mb-2">
                Show Management
              </Link>
              <button 
                className="btn btn-outline-primary mb-2"
                onClick={() => setActiveTab('users')}
              >
                User Management
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">System Management</h5>
            </div>
            <div className="card-body">
              <button 
                className="btn btn-danger" 
                onClick={handleRemoveTestData}
                disabled={loading}
              >
                {loading ? 'Removing...' : 'Remove All Showings & Bookings'}
              </button>
              <p className="text-muted mt-2 small">
                This will permanently delete all showings and bookings from the system.
                Use with caution!
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'shows' ? 'active' : ''}`}
            onClick={() => setActiveTab('shows')}
          >
            Show Management
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'snacks' ? 'active' : ''}`}
            onClick={() => setActiveTab('snacks')}
          >
            Snack Inventory
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
        </li>
      </ul>
      
      {activeTab === 'shows' && <ShowManagement />}
      {activeTab === 'snacks' && <SnackInventory />}
      {activeTab === 'users' && <UserManagement />}
    </div>
  );
}

export default StaffPage; 