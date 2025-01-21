import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  participants: { type: String, required: true },
  openFor: { type: String, required: true },
  eventDetails: { type: String, required: true },
  registrationLink: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  poster: { type: String, required: true },
  paperwork: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);
export default Event;