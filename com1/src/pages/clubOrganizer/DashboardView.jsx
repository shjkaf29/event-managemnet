import React, { useState, useEffect } from "react";
import "./styles.css";
import "./DashboardView.css"

const DashboardView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5001/api/events?status=Approved");
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedEvents();
  }, []);

  return (
    <div className="dashboard-view">
      <h1>Faculty Events This Month</h1>

      {loading ? (
        <p>Loading events...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="event-grid">
          {events.map((event) => (
            <div className="event-card" key={event._id}>
              <img src={event.poster || "https://via.placeholder.com/300"} alt={event.name} className="event-image" />
              <div className="event-details">
                <h3 className="event-name">{event.name}</h3>
                <p className="event-date">Date: {event.date}</p>
                <p className="event-description">{event.eventDetails}</p>
                <button 
                  className="read-more"
                  onClick={() => setModalContent(event)}
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalContent && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setModalContent(null)}>✖</button>
            <h2>{modalContent.name}</h2>
            <img src={modalContent.poster} alt={modalContent.name} className="modal-image" />
            <div className="modal-details">
              <p><strong>Date:</strong> {modalContent.date}</p>
              <p><strong>Time:</strong> {modalContent.time}</p>
              <p><strong>Venue:</strong> {modalContent.venue}</p>
              <p><strong>Details:</strong> {modalContent.eventDetails}</p>
              <a 
                href={modalContent.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="registration-link"
              >
                Register Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;