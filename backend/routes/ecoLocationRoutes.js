import express from 'express';
import {
  getEcoLocations,
  getEcoLocation,
  createEcoLocation,
  updateEcoLocation,
  deleteEcoLocation
} from '../controllers/ecoLocationController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getEcoLocations)
  .post(admin, createEcoLocation);

router.route('/:id')
  .get(getEcoLocation)
  .put(admin, updateEcoLocation)
  .delete(admin, deleteEcoLocation);

export default router;

