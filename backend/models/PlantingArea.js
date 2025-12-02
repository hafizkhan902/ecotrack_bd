import mongoose from 'mongoose';

const plantingAreaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
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
  district: {
    type: String,
    required: true
  },
  division: {
    type: String,
    required: true
  },
  problemType: {
    type: String,
    default: 'Deforestation'
  },
  isPlanted: {
    type: Boolean,
    default: false
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

export default mongoose.model('PlantingArea', plantingAreaSchema);

