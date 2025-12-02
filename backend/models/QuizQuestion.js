import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  answerText: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    default: false
  },
  orderIndex: {
    type: Number,
    default: 0
  }
});

const quizQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 10
  },
  explanation: {
    type: String
  },
  answers: [answerSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
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

quizQuestionSchema.index({ isActive: 1, category: 1 });

export default mongoose.model('QuizQuestion', quizQuestionSchema);

