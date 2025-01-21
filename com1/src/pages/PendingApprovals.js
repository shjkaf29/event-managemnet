import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout.js";
import "./PendingApprovals.css";
import ImageWithFallback from '../components/ImageWithFallback.js';

const BASE_URL = "http://localhost:5001";

// Date formatter helper
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

const PendingApproval = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  const fetchPendingEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/events?status=Pending`);
      if (!response.ok) {
        throw new Error("Failed to fetch pending events.");
      }
      const data = await response.json();
      console.log('Received events:', data);

      const eventsWithUrls = data.map(event => {
        let posterUrl = null;
        let paperworkUrl = null;

        if (event.poster) {
          const cleanPosterPath = event.poster.replace(BASE_URL, '');
          posterUrl = `${BASE_URL}${cleanPosterPath.startsWith('/') ? '' : '/'}${cleanPosterPath}`;
        }

        if (event.paperwork) {
          const cleanPaperworkPath = event.paperwork.replace(BASE_URL, '');
          paperworkUrl = `${BASE_URL}${cleanPaperworkPath.startsWith('/') ? '' : '/'}${cleanPaperworkPath}`;
        }

        console.log('Processing event:', {
          name: event.name,
          originalPosterPath: event.poster,
          cleanPosterUrl: posterUrl
        });

        return {
          ...event,
          poster: posterUrl,
          paperwork: paperworkUrl
        };
      });
      
      setPendingEvents(eventsWithUrls);
    } catch (err) {
      console.error("Error fetching pending events:", err);
      setError("Failed to load pending events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const updateEventStatus = async (eventId, status) => {
    if (window.confirm(`Are you sure you want to ${status.toLowerCase()} this event?`)) {
      try {
        const response = await fetch(`${BASE_URL}/api/events/${eventId}`, {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status })
        });

        if (response.ok) {
          setPendingEvents(pendingEvents.filter((event) => event._id !== eventId));
          alert(`Event ${status.toLowerCase()} successfully!`);
        } else {
          throw new Error(`Failed to ${status.toLowerCase()} the event.`);
        }
      } catch (err) {
        console.error(`Error ${status.toLowerCase()}ing event:`, err);
        alert(`An error occurred while ${status.toLowerCase()}ing the event.`);
      }
    }
  };

  const viewEventDetails = (event) => {
    console.log('Viewing event details:', event);
    setModalContent(event);
  };

  return (
    <AdminLayout>
      <div className="pending-approval-content">
        <header className="pending-approval-header">
          <h1>Pending Event Approvals</h1>
          <p>Review and manage events awaiting approval</p>
        </header>

        {loading ? (
          <p>Loading pending events...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : pendingEvents.length > 0 ? (
          <div className="events-list">
            {pendingEvents.map((event) => (
              <div key={event._id} className="event-card">
                <div className="event-poster-container">
                  {event.poster && (
                    <ImageWithFallback
                      src={event.poster}
                      alt={event.name}
                      className="event-poster"
                    />
                  )}
                </div>
                <div className="event-details">
                  <h3>{event.name}</h3>
                  <p><strong>Date:</strong> {formatDate(event.date)}</p>
                  <p><strong>Time:</strong> {event.time}</p>
                  <p><strong>Venue:</strong> {event.venue}</p>
                  <p><strong>Participants:</strong> {event.participants}</p>
                  <button 
                    className="view-details-button"
                    onClick={() => viewEventDetails(event)}
                  >
                    View Details
                  </button>
                </div>
                <div className="event-actions">
                  <button
                    className="approve-button"
                    onClick={() => updateEventStatus(event._id, "Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => updateEventStatus(event._id, "Rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No pending events at the moment.</p>
        )}

        {modalContent && (
          <div className="modal">
            <div className="modal-content">
              <button className="close-button" onClick={() => setModalContent(null)}>✖</button>
              <h2>{modalContent.name}</h2>
              <div className="modal-poster-container">
                {modalContent.poster && (
                  <ImageWithFallback
                    src={modalContent.poster}
                    alt={modalContent.name}
                    className="modal-image"
                  />
                )}
              </div>
              <div className="modal-details">
                <p><strong>Date:</strong> {formatDate(modalContent.date)}</p>
                <p><strong>Time:</strong> {modalContent.time}</p>
                <p><strong>Venue:</strong> {modalContent.venue}</p>
                <p><strong>Participants:</strong> {modalContent.participants}</p>
                <p><strong>Open For:</strong> {modalContent.openFor}</p>
                <p><strong>Details:</strong> {modalContent.eventDetails}</p>
                {modalContent.paperwork && (
                  <p>
                    <strong>Paperwork:</strong>{' '}
                    <a 
                      href={modalContent.paperwork}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="document-link"
                    >
                      View Document
                    </a>
                  </p>
                )}
                {modalContent.registrationLink && (
                  <a 
                    href={modalContent.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="registration-link"
                  >
                    Registration Link
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PendingApproval;