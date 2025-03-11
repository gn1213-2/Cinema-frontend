import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Fetching bookings with token:', token);
        
        const response = await axios.get('http://localhost:8000/api/movies/user-bookings/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        
        console.log('Bookings response:', response.data);
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(`Failed to fetch your bookings: ${err.response?.data?.error || err.message}`);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (bookings.length === 0) return <div className="alert alert-info">You don't have any bookings yet.</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">My Bookings</h1>
      
      <div className="row">
        {bookings.map(booking => (
          <div className="col-md-6 mb-4" key={booking.id}>
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">{booking.showing_details.movie_title}</h5>
              </div>
              <div className="card-body">
                <p><strong>Theater:</strong> {booking.showing_details.theater_name}</p>
                <p><strong>Date & Time:</strong> {formatDate(booking.showing_details.start_time)}</p>
                <p><strong>Seats:</strong> {booking.seats}</p>
                <p><strong>Price:</strong> £{(booking.showing_details.price * booking.seats).toFixed(2)}</p>
                <p><strong>Booking Date:</strong> {formatDate(booking.created_at)}</p>
              </div>
              <div className="card-footer text-muted">
                Booking ID: {booking.id}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserBookings; 