import React from 'react';
import './EventModal.css'; // Optional, for styling

const EventModal = ({ show, date, events, onClose }) => {
  if (!show) return null;

  return (
    <div className="event-modal">
      <div className="modal-content">
        <h2>Events on {date.toDateString()}</h2>
        <ul>
          {events.length > 0 ? (
            events.map((event, index) => (
              <li key={index}>
                <h3>{event.name}</h3>
                <p>{event.details}</p>
              </li>
            ))
          ) : (
            <p>No events for this date.</p>
          )}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EventModal;
