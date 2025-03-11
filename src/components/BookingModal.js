import React, { useState } from 'react';
import axios from 'axios';

function BookingModal({ showing, onClose }) {
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/movies/book/',
        {
          showing_id: showing.id,
          seats: seats
        },
        {
          headers: {
            'Authorization': `Token ${token}`
          }
        }
      );
      
      setSuccess(true);
      setLoading(false);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      setError('Failed to book tickets. Please try again.');
      setLoading(false);
      console.error('Booking error:', err);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Book Tickets</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {success ? (
              <div className="alert alert-success">
                Booking successful! Redirecting...
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                
                <div className="mb-3">
                  <label htmlFor="movie" className="form-label">Movie</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={showing.movie.title} 
                    disabled 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="theater" className="form-label">Theater</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={showing.theater.name} 
                    disabled 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="datetime" className="form-label">Date & Time</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={`${showing.date} at ${showing.time}`} 
                    disabled 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="seats" className="form-label">Number of Seats</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="seats" 
                    min="1" 
                    max="10" 
                    value={seats} 
                    onChange={(e) => setSeats(parseInt(e.target.value))} 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">Total Price</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={`£${(showing.price * seats).toFixed(2)}`} 
                    disabled 
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100" 
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingModal; 