import express from 'express';
import {
  getQuestions,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  submitAttempt,
  getAttempts
} from '../controllers/quizController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Public routes (for authenticated users)
router.get('/questions', getQuestions);
router.get('/attempts', getAttempts);
router.post('/attempts', submitAttempt);

// Admin routes
router.get('/questions/all', admin, getAllQuestions);
router.post('/questions', admin, createQuestion);
router.put('/questions/:id', admin, updateQuestion);
router.delete('/questions/:id', admin, deleteQuestion);

export default router;

