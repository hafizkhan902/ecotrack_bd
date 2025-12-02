import mongoose from 'mongoose';

const ecoLocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  city: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('EcoLocation', ecoLocationSchema);

