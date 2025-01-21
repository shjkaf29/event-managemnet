import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import axios from 'axios';
import './AddEvent.css';

const AddEvent = () => {
  const initialFormState = {
    name: '',
    date: '',
    time: '',
    venue: '',
    participants: '',
    openFor: 'members',
    paperwork: null,
    poster: null,
    eventDetails: '',
    registrationLink: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [posterPreview, setPosterPreview] = useState(null);

  useEffect(() => {
    emailjs.init("qck_lHKH5_R3xj11h");
  }, []);

  const sendEmailNotification = async (eventData) => {
    try {
      console.log('Starting email notification...');
      const templateParams = {
        to_name: "Admin",
        event_name: eventData.name,
        event_date: eventData.date,
        event_time: eventData.time,
        event_venue: eventData.venue,
        participants: eventData.participants,
        event_details: eventData.eventDetails,
        to_email: "shakaif@graduate.utm.my"
      };

      console.log('Template params:', templateParams);

      const response = await emailjs.send(
        'service_ft4uk6h',
        'template_1wpj7bq',
        templateParams,
        'qck_lHKH5_R3xj11h'
      );

      console.log('Email response:', response);

      if (response.status === 200) {
        setEmailStatus('Email notification sent successfully');
        return true;
      }
    } catch (error) {
      console.error('Email notification failed:', error);
      setEmailStatus(`Failed to send email: ${error.message}`);
      return false;
    }
  };

  const formatToDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const parseDisplayDate = (displayDate) => {
    if (!displayDate) return '';
    const [day, month, year] = displayDate.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      if (name === 'poster' && file) {
        setPosterPreview(URL.createObjectURL(file));
      }
    } else if (name === 'date') {
      const formattedDate = formatToDisplayDate(value);
      setFormData(prev => ({ ...prev, [name]: formattedDate }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setPosterPreview(null);
    setEmailStatus('');
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => input.value = '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setEmailStatus('');

    if (!formData.poster || !formData.paperwork) {
      setError('Both event poster and paperwork are required');
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    const apiDate = parseDisplayDate(formData.date);
    formDataToSend.append('date', apiDate);

    if (formData.poster) {
      const posterFile = formData.poster;
      if (!posterFile.type.startsWith('image/')) {
        setError('Please upload a valid image file for the poster');
        setLoading(false);
        return;
      }
      formDataToSend.append('poster', posterFile);
    }

    if (formData.paperwork) {
      const paperworkFile = formData.paperwork;
      const validTypes = ['.pdf', '.doc', '.docx'];
      const fileExt = paperworkFile.name.substring(paperworkFile.name.lastIndexOf('.'));
      if (!validTypes.includes(fileExt.toLowerCase())) {
        setError('Please upload a valid document file (PDF, DOC, DOCX) for paperwork');
        setLoading(false);
        return;
      }
      formDataToSend.append('paperwork', paperworkFile);
    }

    Object.keys(formData).forEach(key => {
      if (key !== 'poster' && key !== 'paperwork' && key !== 'date') {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        'http://localhost:5001/api/events/create',
        formDataToSend,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data.success) {
        console.log('Event created, sending email notification...');
        const emailSent = await sendEmailNotification(formData);
        console.log('Email notification result:', emailSent);
        setSuccess('Event created successfully! Awaiting approval.');
        resetForm();
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-event-container">
      <h1>Add Event</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {emailStatus && <div className="email-status-message">{emailStatus}</div>}
      
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="name">Event Name<span className="required">*</span></label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleFormChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date<span className="required">*</span></label>
          <input 
            type="text" 
            id="date" 
            name="date" 
            placeholder="DD/MM/YYYY"
            pattern="\d{2}/\d{2}/\d{4}"
            value={formData.date} 
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 10) {
                setFormData(prev => ({ ...prev, date: value }));
              }
            }}
            onBlur={(e) => {
              const value = e.target.value;
              if (value && !/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                setError('Please enter date in DD/MM/YYYY format');
              } else {
                setError('');
              }
            }}
            required 
          />
          <small>Format: DD/MM/YYYY</small>
        </div>

        <div className="form-group">
          <label htmlFor="time">Time<span className="required">*</span></label>
          <input 
            type="time" 
            id="time" 
            name="time" 
            value={formData.time} 
            onChange={handleFormChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="venue">Venue<span className="required">*</span></label>
          <input 
            type="text" 
            id="venue" 
            name="venue" 
            value={formData.venue} 
            onChange={handleFormChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="participants">Number of Participants<span className="required">*</span></label>
          <input 
            type="number" 
            id="participants" 
            name="participants" 
            value={formData.participants} 
            onChange={handleFormChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="openFor">Open For<span className="required">*</span></label>
          <select 
            id="openFor" 
            name="openFor" 
            value={formData.openFor} 
            onChange={handleFormChange} 
            required
          >
            <option value="members">Members Only</option>
            <option value="both">Both Members and Non-Members</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="paperwork">Paperwork<span className="required">*</span></label>
          <input 
            type="file" 
            id="paperwork" 
            name="paperwork" 
            onChange={handleFormChange} 
            accept=".pdf,.doc,.docx" 
            required
          />
          <small>Upload PDF, DOC, or DOCX file</small>
        </div>

        <div className="form-group">
          <label htmlFor="poster">Event Poster<span className="required">*</span></label>
          <input 
            type="file" 
            id="poster" 
            name="poster" 
            onChange={handleFormChange} 
            accept="image/*" 
            required 
          />
          {posterPreview && (
            <div className="preview-image">
              <img src={posterPreview} alt="Poster preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="eventDetails">Event Details<span className="required">*</span></label>
          <textarea 
            id="eventDetails" 
            name="eventDetails" 
            value={formData.eventDetails} 
            onChange={handleFormChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="registrationLink">Registration Link<span className="required">*</span></label>
          <input 
            type="url" 
            id="registrationLink" 
            name="registrationLink" 
            value={formData.registrationLink} 
            onChange={handleFormChange} 
            required 
          />
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Creating Event..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default AddEvent;