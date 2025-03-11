import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ShowingForm({ showing = null, onClose }) {
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [formData, setFormData] = useState({
    movie: showing?.movie || '',
    theater: showing?.theater || '',
    start_time: showing?.start_time ? new Date(showing.start_time).toISOString().slice(0, 16) : '',
    price: showing?.price || ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [moviesResponse, theatersResponse] = await Promise.all([
          axios.get('https://cinema-backend-474u.onrender.com/api/movies/movies/', {
            headers: { 'Authorization': `Token ${token}` }
          }),
          axios.get('https://cinema-backend-474u.onrender.com/api/movies/theaters/', {
            headers: { 'Authorization': `Token ${token}` }
          })
        ]);
        
        setMovies(moviesResponse.data);
        setTheaters(theatersResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching form data:', err);
        setError('Failed to load form data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      console.log('Submitting showing data:', formData);
      
      if (showing) {
        // Update existing showing
        await axios.put(
          `https://cinema-backend-474u.onrender.com/api/movies/showings/${showing.id}/`,
          formData,
          {
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Create new showing
        await axios.post(
          'https://cinema-backend-474u.onrender.com/api/movies/showings/',
          formData,
          {
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      setSubmitting(false);
      onClose(true); // Pass true to indicate refresh is needed
    } catch (err) {
      console.error('Error saving showing:', err);
      setError(`Failed to save showing: ${err.response?.data?.detail || err.message}`);
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center">Loading form data...</div>;

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">{showing ? 'Edit Showing' : 'Add New Showing'}</h5>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="movie" className="form-label">Movie</label>
            <select
              id="movie"
              name="movie"
              className="form-select"
              value={formData.movie}
              onChange={handleChange}
              required
            >
              <option value="">Select a movie</option>
              {movies.map(movie => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label htmlFor="theater" className="form-label">Theater</label>
            <select
              id="theater"
              name="theater"
              className="form-select"
              value={formData.theater}
              onChange={handleChange}
              required
            >
              <option value="">Select a theater</option>
              {theaters.map(theater => (
                <option key={theater.id} value={theater.id}>
                  {theater.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label htmlFor="start_time" className="form-label">Start Time</label>
            <input
              type="datetime-local"
              id="start_time"
              name="start_time"
              className="form-control"
              value={formData.start_time}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Price (£)</label>
            <input
              type="number"
              id="price"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div className="d-flex justify-content-end">
            <button 
              type="button" 
              className="btn btn-secondary me-2"
              onClick={() => onClose()}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : (showing ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ShowingForm; 