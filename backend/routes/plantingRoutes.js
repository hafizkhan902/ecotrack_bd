import express from 'express';
import {
  getPlantingAreas,
  getPlantingArea,
  createPlantingArea,
  updatePlantingArea,
  deletePlantingArea,
  getPlantedTrees,
  plantTree,
  getUserPlantedTrees
} from '../controllers/plantingController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Planting areas
router.route('/areas')
  .get(getPlantingAreas)
  .post(admin, createPlantingArea);

router.route('/areas/:id')
  .get(getPlantingArea)
  .put(admin, updatePlantingArea)
  .delete(admin, deletePlantingArea);

// Planted trees
router.get('/trees', getPlantedTrees);
router.get('/trees/user', getUserPlantedTrees);
router.post('/trees', plantTree);

export default router;

