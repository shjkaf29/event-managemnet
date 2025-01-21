import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import Event from '../models/Event.js';
import { uploadFields, processImage } from '../middleware/multerConfig.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email verification failed:', error);
  } else {
    console.log('Email server ready');
  }
});

// Email notification function
const sendEventNotification = async (event, type = 'new') => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: type === 'new' ? '🆕 New Event Submission' : `📢 Event ${event.status} Update`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #003366;">${type === 'new' ? 'New Event Submission' : 'Event Status Update'}</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
            <h3 style="color: #0066cc;">${event.name}</h3>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Venue:</strong> ${event.venue}</p>
            <p><strong>Participants:</strong> ${event.participants}</p>
            ${type === 'status' ? `<p><strong>Status:</strong> ${event.status}</p>` : ''}
            <p><strong>Open For:</strong> ${event.openFor}</p>
            <p><strong>Details:</strong> ${event.eventDetails}</p>
          </div>
          <div style="margin-top: 20px; text-align: center;">
            <a href="http://localhost:3000/admin" 
               style="background-color: #0066cc; color: white; padding: 10px 20px; 
                      text-decoration: none; border-radius: 5px;">
              Review Event
            </a>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// Get events route
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const events = await Event.find(query).sort({ createdAt: -1 });
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const eventsWithUrls = events.map(event => ({
      ...event.toObject(),
      poster: event.poster ? `${baseUrl}${event.poster}` : null,
      paperwork: event.paperwork ? `${baseUrl}${event.paperwork}` : null
    }));

    res.json(eventsWithUrls);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
});

// Create event route
router.post('/create', uploadFields, processImage, async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    const eventData = {
      ...req.body,
      poster: req.files['poster'] ? `/uploads/posters/${req.files['poster'][0].filename}` : null,
      paperwork: req.files['paperwork'] ? `/uploads/paperwork/${req.files['paperwork'][0].filename}` : null
    };

    const event = new Event(eventData);
    await event.save();

    // Send notification
    await sendEventNotification(eventData);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: {
        ...event.toObject(),
        poster: event.poster ? `${baseUrl}${event.poster}` : null,
        paperwork: event.paperwork ? `${baseUrl}${event.paperwork}` : null
      }
    });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update event status route
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const event = await Event.findByIdAndUpdate(id, { status }, { new: true });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Send status update notification
    await sendEventNotification(event.toObject(), 'status');

    res.json({
      success: true,
      message: `Event ${status.toLowerCase()} successfully`,
      event
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete event route
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.poster) {
      try {
        await fs.unlink(path.join(__dirname, '..', event.poster));
      } catch (err) {
        console.error('Error deleting poster:', err);
      }
    }

    if (event.paperwork) {
      try {
        await fs.unlink(path.join(__dirname, '..', event.paperwork));
      } catch (err) {
        console.error('Error deleting paperwork:', err);
      }
    }

    await Event.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event'
    });
  }
});

export default router;