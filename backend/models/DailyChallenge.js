import mongoose from 'mongoose';

const dailyChallengeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challengeName: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  challengeDate: {
    type: Date,
    default: () => new Date().setHours(0, 0, 0, 0)
  }
});

dailyChallengeSchema.index({ userId: 1, challengeDate: -1 });

export default mongoose.model('DailyChallenge', dailyChallengeSchema);

