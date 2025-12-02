import mongoose from 'mongoose';

const plantedTreeSchema = new mongoose.Schema({
  plantingAreaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlantingArea',
    required: true
  },
  treeType: {
    type: String,
    required: true
  },
  plantedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  plantedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  }
});

plantedTreeSchema.index({ plantingAreaId: 1 });
plantedTreeSchema.index({ plantedBy: 1 });

export default mongoose.model('PlantedTree', plantedTreeSchema);

