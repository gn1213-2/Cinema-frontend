import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SnackForm({ snack, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity_available: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (snack) {
      setFormData({
        name: snack.name,
        description: snack.description,
        price: snack.price,
        quantity_available: snack.quantity_available
      });
    }
  }, [snack]);

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
      const headers = {
        'Authorization': `Token ${token}`
      };
      
      if (snack) {
        // Update existing snack
        await axios.put(
          `https://cinema-backend-474u.onrender.com/api/inventory/snacks/${snack.id}/`,
          formData,
          { headers }
        );
      } else {
        // Create new snack
        await axios.post(
          'https://cinema-backend-474u.onrender.com/api/inventory/snacks/',
          formData,
          { headers }
        );
      }
      
      onClose();
    } catch (err) {
      setError('Failed to save snack item');
      setSubmitting(false);
      console.error('Error saving snack:', err);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h4>{snack ? 'Edit Snack Item' : 'Add New Snack Item'}</h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Price</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="quantity_available" className="form-label">Quantity Available</label>
            <input
              type="number"
              className="form-control"
              id="quantity_available"
              name="quantity_available"
              value={formData.quantity_available}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="d-flex justify-content-end">
            <button 
              type="button" 
              className="btn btn-secondary me-2" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SnackForm; 