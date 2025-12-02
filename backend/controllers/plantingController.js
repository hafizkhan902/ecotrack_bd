import PlantingArea from '../models/PlantingArea.js';
import PlantedTree from '../models/PlantedTree.js';

// @desc    Get all planting areas
// @route   GET /api/planting/areas
// @access  Private
export const getPlantingAreas = async (req, res, next) => {
  try {
    const areas = await PlantingArea.find();

    res.json({
      success: true,
      count: areas.length,
      data: areas
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single planting area
// @route   GET /api/planting/areas/:id
// @access  Private
export const getPlantingArea = async (req, res, next) => {
  try {
    const area = await PlantingArea.findById(req.params.id);

    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Planting area not found'
      });
    }

    res.json({
      success: true,
      data: area
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create planting area
// @route   POST /api/planting/areas
// @access  Private/Admin
export const createPlantingArea = async (req, res, next) => {
  try {
    const area = await PlantingArea.create(req.body);

    res.status(201).json({
      success: true,
      data: area
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update planting area
// @route   PUT /api/planting/areas/:id
// @access  Private/Admin
export const updatePlantingArea = async (req, res, next) => {
  try {
    const area = await PlantingArea.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Planting area not found'
      });
    }

    res.json({
      success: true,
      data: area
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete planting area
// @route   DELETE /api/planting/areas/:id
// @access  Private/Admin
export const deletePlantingArea = async (req, res, next) => {
  try {
    const area = await PlantingArea.findByIdAndDelete(req.params.id);

    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Planting area not found'
      });
    }

    await PlantedTree.deleteMany({ plantingAreaId: req.params.id });

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get planted trees
// @route   GET /api/planting/trees
// @access  Private
export const getPlantedTrees = async (req, res, next) => {
  try {
    const { plantingAreaId } = req.query;
    const filter = {};

    if (plantingAreaId) filter.plantingAreaId = plantingAreaId;

    const trees = await PlantedTree.find(filter)
      .populate('plantingAreaId')
      .populate('plantedBy', 'fullName')
      .sort({ plantedAt: -1 });

    res.json({
      success: true,
      count: trees.length,
      data: trees
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Plant a tree
// @route   POST /api/planting/trees
// @access  Private
export const plantTree = async (req, res, next) => {
  try {
    const { plantingAreaId, treeType, notes } = req.body;

    // Verify planting area exists
    const area = await PlantingArea.findById(plantingAreaId);
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Planting area not found'
      });
    }

    const tree = await PlantedTree.create({
      plantingAreaId,
      treeType,
      plantedBy: req.user._id,
      notes
    });

    // Update planting area status
    await PlantingArea.findByIdAndUpdate(plantingAreaId, {
      isPlanted: true,
      updatedAt: new Date()
    });

    const populatedTree = await PlantedTree.findById(tree._id)
      .populate('plantingAreaId')
      .populate('plantedBy', 'fullName');

    res.status(201).json({
      success: true,
      data: populatedTree
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user planted trees
// @route   GET /api/planting/trees/user
// @access  Private
export const getUserPlantedTrees = async (req, res, next) => {
  try {
    const trees = await PlantedTree.find({ plantedBy: req.user._id })
      .populate('plantingAreaId')
      .sort({ plantedAt: -1 });

    res.json({
      success: true,
      count: trees.length,
      data: trees
    });
  } catch (error) {
    next(error);
  }
};

