import express from 'express';
import { getStats } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, admin, getStats);

export default router;

