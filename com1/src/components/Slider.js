import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Slider.css';

const BASE_URL = 'http://localhost:5001';
const DEFAULT_IMAGE = 'https://chancellery.utm.my/wp-content/uploads/sites/21/2020/12/utm.jpg';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
};

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % (slides.length || 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + (slides.length || 1)) % (slides.length || 1));
  }, [slides.length]);

  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/events?status=Approved`);
        setSlides(response.data);
      } catch (error) {
        console.error('Error fetching approved events:', error);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedEvents();
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const renderDefaultSlide = () => (
    <div className="slide active">
      <div className="slide-image">
        <img src={DEFAULT_IMAGE} alt="UTM Campus" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div className="slide-content">
        <h2>Welcome to UTM Events</h2>
        <p className="event-details">Stay tuned for upcoming events and activities</p>
      </div>
    </div>
  );

  return (
    <div className="slider-container">
      <div className="slider">
        {slides.length === 0 ? (
          renderDefaultSlide()
        ) : (
          slides.map((slide, index) => (
            <div key={slide._id} className={`slide ${index === currentIndex ? 'active' : ''}`}>
              <div className="slide-image">
                <img 
                  src={slide.poster}
                  alt={slide.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_IMAGE;
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="slide-content">
                <h2>{slide.name}</h2>
                <p className="event-date">
                  <strong>Date:</strong> {formatDate(slide.date)} | <strong>Time:</strong> {slide.time}
                </p>
                <p className="event-venue">
                  <strong>Venue:</strong> {slide.venue}
                </p>
                <div className="button-group">
                  {slide.registrationLink && (
                    <a 
                      href={slide.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="register-button"
                    >
                      Register Now
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {slides.length > 0 && (
        <div className="slider-navigation">
          <button className="prev" onClick={prevSlide}>{'>'}</button>
          <button className="next" onClick={nextSlide}>{'<'}</button>
          <div className="dots">
            {slides.map((_, index) => (
              <span 
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Slider;