import mongoose from 'mongoose';

const attemptAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuizQuestion',
    required: true
  },
  answerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  answeredAt: {
    type: Date,
    default: Date.now
  }
});

const quizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  timeTaken: {
    type: Number // seconds
  },
  answers: [attemptAnswerSchema],
  completedAt: {
    type: Date,
    default: Date.now
  }
});

quizAttemptSchema.index({ userId: 1, completedAt: -1 });

export default mongoose.model('QuizAttempt', quizAttemptSchema);

