import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookingModal from './BookingModal';

function Home({ isAuthenticated }) {
  const [showings, setShowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedShowing, setSelectedShowing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchShowings = async () => {
      try {
        // Public endpoint, no token needed
        const response = await axios.get('http://localhost:8000/api/movies/today-showings/');
        console.log('Today showings response:', response.data);
        
        if (Array.isArray(response.data) && response.data.length > 0) {
          setShowings(response.data);
        } else {
          console.warn('No showings returned from API or invalid format');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching showings:', err);
        setError(`Failed to fetch showings: ${err.response?.data?.error || err.message}`);
        setLoading(false);
      }
    };

    fetchShowings();
  }, []);

  const handleBookClick = (showing) => {
    if (isAuthenticated) {
      setSelectedShowing(showing);
      setShowModal(true);
    } else {
      // Redirect to login or show a message
      alert('Please log in to book tickets');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedShowing(null);
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

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"></div><p>Loading showings...</p></div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!showings || showings.length === 0) return <div className="alert alert-info mt-4">No showings available for today.</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Today's Showings</h1>
      
      <div className="row">
        {showings.map(showing => (
          <div className="col-md-4 mb-4" key={showing.id}>
            <div className="card h-100">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0">{showing.movie_title || 'Unknown Movie'}</h5>
              </div>
              <div className="card-body">
                <p><strong>Time:</strong> {formatDateTime(showing.start_time)}</p>
                <p><strong>Theater:</strong> {showing.theater_name || 'Unknown'}</p>
                <p><strong>Price:</strong> £{parseFloat(showing.price).toFixed(2)}</p>
              </div>
              <div className="card-footer">
                <button 
                  className="btn btn-primary w-100" 
                  onClick={() => handleBookClick(showing)}
                >
                  Book Tickets
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showModal && selectedShowing && (
        <BookingModal showing={selectedShowing} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default Home; 