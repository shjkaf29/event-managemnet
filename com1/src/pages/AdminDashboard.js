import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.js';
import axios from 'axios';
import './AdminDashboard.css';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchApprovedEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5001/api/events?status=Approved');
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching approved events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedEvents();
  }, []);

  const deleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      setDeleteLoading(true);
      const response = await axios.delete(`http://localhost:5001/api/events/${eventId}`);
      
      if (response.data.success) {
        setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
        if (modalContent?._id === eventId) {
          setModalContent(null);
        }
        alert('Event deleted successfully');
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      alert(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/path/to/placeholder-image.jpg'; // Update with actual placeholder image path
  };

  return (
    <AdminLayout>
      <div className="dashboard-content">
        <header className="dashboard-header">
          <img 
            src="https://mjiit.utm.my/wp-content/uploads/2024/02/MJIIT-2.png" 
            alt="UTM Logo" 
            className="utm-logo"
          />
          <h1>UTM Event Management System</h1>
          <p>Welcome to the admin panel!</p>
        </header>

        {loading ? (
          <div className="loading-container">
            <p>Loading events...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={fetchApprovedEvents} className="retry-button">
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <h2>{events.length}</h2>
                <p>Total Approved Events</p>
              </div>
            </div>

            <div className="events-grid">
              {events.map((event) => (
                <div key={event._id} className="event-card">
                  {event.poster && (
                    <img 
                      src={event.poster} 
                      alt={event.name} 
                      className="event-banner"
                      onError={handleImageError}
                    />
                  )}
                  <div className="event-content">
                    <h3>{event.name}</h3>
                    <p><strong>Date:</strong> {formatDate(event.date)}</p>
                    <p><strong>Time:</strong> {event.time}</p>
                    <div className="button-group">
                      <button 
                        onClick={() => setModalContent(event)} 
                        className="view-button"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => deleteEvent(event._id)} 
                        className="delete-button"
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? 'Deleting...' : 'Delete Event'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {modalContent && (
          <div className="modal" onClick={() => setModalContent(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-button" onClick={() => setModalContent(null)}>
                ✖
              </button>
              <h2>{modalContent.name}</h2>
              {modalContent.poster && (
                <img 
                  src={modalContent.poster} 
                  alt={modalContent.name} 
                  className="modal-image"
                  onError={handleImageError}
                />
              )}
              <div className="modal-details">
                <p><strong>Date:</strong> {formatDate(modalContent.date)}</p>
                <p><strong>Time:</strong> {modalContent.time}</p>
                <p><strong>Venue:</strong> {modalContent.venue}</p>
                <p><strong>Details:</strong> {modalContent.eventDetails}</p>
                <p><strong>Open For:</strong> {modalContent.openFor}</p>
                <p><strong>Registration Link:</strong></p>
                <a 
                  href={modalContent.registrationLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="registration-link"
                >
                  {modalContent.registrationLink}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;