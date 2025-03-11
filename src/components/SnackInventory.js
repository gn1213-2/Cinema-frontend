import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SnackForm from './SnackForm';

function SnackInventory() {
  const [snacks, setSnacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingSnack, setEditingSnack] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchSnacks = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching snacks with token:', token);
      
      const response = await axios.get('http://localhost:8000/api/inventory/snacks/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      
      setSnacks(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching snacks:', err);
      setError('Failed to fetch snack inventory');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnacks();
  }, []);

  const handleEdit = (snack) => {
    setEditingSnack(snack);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this snack item?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/inventory/snacks/${id}/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        fetchSnacks();
      } catch (err) {
        setError('Failed to delete snack item');
        console.error('Error deleting snack:', err);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSnack(null);
    fetchSnacks();
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Manage Snack Inventory</h3>
        <button 
          className="btn btn-success" 
          onClick={() => setShowForm(true)}
        >
          Add New Snack
        </button>
      </div>
      
      {showForm && (
        <SnackForm 
          snack={editingSnack} 
          onClose={handleFormClose} 
        />
      )}
      
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {snacks.length > 0 ? (
              snacks.map(snack => (
                <tr key={snack.id}>
                  <td>{snack.name}</td>
                  <td>{snack.description}</td>
                  <td>£{parseFloat(snack.price).toFixed(2)}</td>
                  <td>{snack.quantity_available}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary me-2" 
                      onClick={() => handleEdit(snack)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleDelete(snack.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No snacks available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SnackInventory; 