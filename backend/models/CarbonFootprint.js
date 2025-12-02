import mongoose from 'mongoose';

const carbonFootprintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  electricityKwh: {
    type: Number,
    default: 0
  },
  transportationKm: {
    type: Number,
    default: 0
  },
  transportationType: {
    type: String,
    default: ''
  },
  wasteKg: {
    type: Number,
    default: 0
  },
  totalCo2Kg: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  calculatedAt: {
    type: Date,
    default: Date.now
  }
});

carbonFootprintSchema.index({ userId: 1, calculatedAt: -1 });

export default mongoose.model('CarbonFootprint', carbonFootprintSchema);

