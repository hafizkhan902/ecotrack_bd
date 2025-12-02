import mongoose from 'mongoose';

const ecoEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  eventTime: {
    type: String
  },
  locationName: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  city: {
    type: String
  },
  district: {
    type: String,
    required: true
  },
  division: {
    type: String,
    required: true
  },
  organizer: {
    type: String
  },
  contactInfo: {
    type: String
  },
  maxParticipants: {
    type: Number,
    default: 50
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ecoEventSchema.index({ eventType: 1, district: 1, division: 1, eventDate: 1, isActive: 1 });

export default mongoose.model('EcoEvent', ecoEventSchema);

