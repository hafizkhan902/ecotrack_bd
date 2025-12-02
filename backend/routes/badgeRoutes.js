import express from 'express';
import {
  getBadges,
  getUserBadges,
  checkAndAwardBadges,
  createBadge
} from '../controllers/badgeController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getBadges);
router.get('/user', getUserBadges);
router.post('/check', checkAndAwardBadges);
router.post('/', admin, createBadge);

export default router;

