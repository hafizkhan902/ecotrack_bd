import express from 'express';
import {
  getEcoEvents,
  getAllEcoEvents,
  getEcoEvent,
  createEcoEvent,
  updateEcoEvent,
  deleteEcoEvent
} from '../controllers/ecoEventController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getEcoEvents);
router.get('/all', admin, getAllEcoEvents);
router.get('/:id', getEcoEvent);
router.post('/', admin, createEcoEvent);
router.put('/:id', admin, updateEcoEvent);
router.delete('/:id', admin, deleteEcoEvent);

export default router;

