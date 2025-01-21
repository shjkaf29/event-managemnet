import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      poster: req.files['poster'] ? `/uploads/posters/${req.files['poster'][0].filename}` : null,
      paperwork: req.files['paperwork'] ? `/uploads/paperwork/${req.files['paperwork'][0].filename}` : null
    };

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({ success: true, message: 'Event created successfully', event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const events = await Event.find(query);
    res.json(events);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};