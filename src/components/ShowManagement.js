import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ShowingForm from './ShowingForm';

function ShowManagement() {
  const [showings, setShowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedShowing, setSelectedShowing] = useState(null);

  const fetchShowings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Fetching showings with token:', token);
      
      const response = await axios.get('https://cinema-backend-474u.onrender.com/api/movies/showings/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      
      console.log('Showings response:', response.data);
      setShowings(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching showings:', err);
      setError('Failed to fetch showings');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowings();
  }, []);

  const handleAddClick = () => {
    setSelectedShowing(null);
    setShowForm(true);
  };

  const handleEditClick = (showing) => {
    setSelectedShowing(showing);
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this showing?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://cinema-backend-474u.onrender.com/api/movies/showings/${id}/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        
        // Refresh the list
        fetchShowings();
      } catch (err) {
        console.error('Error deleting showing:', err);
        alert('Failed to delete showing');
      }
    }
  };

  const handleFormClose = (refreshNeeded = false) => {
    setShowForm(false);
    if (refreshNeeded) {
      fetchShowings();
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date';
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Movie Showings</h1>
        <button 
          className="btn btn-primary" 
          onClick={handleAddClick}
        >
          Add New Showing
        </button>
      </div>
      
      {showForm && (
        <ShowingForm 
          showing={selectedShowing} 
          onClose={handleFormClose} 
        />
      )}
      
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Movie</th>
              <th>Theater</th>
              <th>Date</th>
              <th>Time</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {showings.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No showings found</td>
              </tr>
            ) : (
              showings.map(showing => (
                <tr key={showing.id}>
                  <td>{showing.movie_title || 'Unknown'}</td>
                  <td>{showing.theater_name || 'Unknown'}</td>
                  <td>{formatDateTime(showing.start_time)?.split(',')[0] || 'N/A'}</td>
                  <td>{formatDateTime(showing.start_time)?.split(',')[1] || 'N/A'}</td>
                  <td>£{parseFloat(showing.price).toFixed(2)}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary me-2" 
                      onClick={() => handleEditClick(showing)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleDeleteClick(showing.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ShowManagement; 