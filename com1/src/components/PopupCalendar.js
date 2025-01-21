import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import './PopupCalendar.css';

const PopupCalendar = ({ fetchEventsApi }) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${fetchEventsApi}?status=Approved`);
      const approvedEvents = response.data.filter(event => event.status === 'Approved');
      setEvents(approvedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEventsApi]);

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      const compareDate = new Date(date);
      
      const isSameDate = 
        eventDate.getDate() === compareDate.getDate() &&
        eventDate.getMonth() === compareDate.getMonth() &&
        eventDate.getFullYear() === compareDate.getFullYear();
      
      return isSameDate && event.status === 'Approved';
    });
  };

  const handleDateClick = (date) => {
    const eventsOnDate = getEventsForDate(date);
    if (eventsOnDate.length > 0) {
      setSelectedEvents(eventsOnDate);
      setCurrentEventIndex(0);
      setShowPopup(true);
    }
  };

  const handleNextEvent = (e) => {
    e.stopPropagation();
    setCurrentEventIndex(prev => 
      prev < selectedEvents.length - 1 ? prev + 1 : prev
    );
  };

  const handlePrevEvent = (e) => {
    e.stopPropagation();
    setCurrentEventIndex(prev => prev > 0 ? prev - 1 : prev);
  };

  return (
    <>
      <div className="calendar-page-bg">
        <div className="bg-overlay"></div>
        <div 
          className="bg-slide" 
          style={{ 
            backgroundImage: `url('https://chancellery.utm.my/wp-content/uploads/sites/21/2020/12/masjid.jpg')`
          }}
        ></div>
      </div>
      
      <div className="calendar-container">
        <Calendar
          onChange={setDate}
          value={date}
          onClickDay={handleDateClick}
          tileClassName={({ date }) => {
            const eventsOnDate = getEventsForDate(date);
            return eventsOnDate.length > 0 ? 'react-calendar__tile--hasEvent' : '';
          }}
          tileContent={({ date }) => {
            const eventsOnDate = getEventsForDate(date);
            return eventsOnDate.length > 0 ? (
              <div 
                className="event-dot" 
                title={`${eventsOnDate.length} event(s) on this date`}
              />
            ) : null;
          }}
        />

        {showPopup && selectedEvents.length > 0 && (
          <div className="modal" onClick={() => setShowPopup(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-button" onClick={() => setShowPopup(false)}>
                ✖
              </button>

              {selectedEvents.length > 1 && (
                <div className="event-navigation">
                  <button 
                    onClick={handlePrevEvent}
                    disabled={currentEventIndex === 0}
                    className="nav-button prev"
                  >
                    ←
                  </button>
                  <span className="event-counter">
                    Event {currentEventIndex + 1} of {selectedEvents.length}
                  </span>
                  <button 
                    onClick={handleNextEvent}
                    disabled={currentEventIndex === selectedEvents.length - 1}
                    className="nav-button next"
                  >
                    →
                  </button>
                </div>
              )}

              <h2>{selectedEvents[currentEventIndex].name}</h2>
              {selectedEvents[currentEventIndex].poster && (
                <img 
                  src={selectedEvents[currentEventIndex].poster}
                  alt={selectedEvents[currentEventIndex].name}
                  className="modal-image"
                  onError={handleImageError}
                />
              )}
              <div className="modal-details">
                    <p><strong>Date:</strong> {formatDate(selectedEvents[currentEventIndex].date)}</p>
                    <p><strong>Time:</strong> {selectedEvents[currentEventIndex].time}</p>
                    <p><strong>Venue:</strong> {selectedEvents[currentEventIndex].venue}</p>
                   
                    {selectedEvents[currentEventIndex].registrationLink && (
                        <div>
                        <p><strong>Registration:</strong></p>
                        <a 
                            href={selectedEvents[currentEventIndex].registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="registration-link"
                        >
                            Register Here
                        </a>
                        </div>
                    )}
                </div>
            </div>
          </div>
        )}

        {loading && <div className="loading">Loading events...</div>}
        {error && <div className="error">{error}</div>}
      </div>
    </>
  );
};

export default PopupCalendar;