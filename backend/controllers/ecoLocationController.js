import EcoLocation from '../models/EcoLocation.js';

// @desc    Get all eco locations
// @route   GET /api/eco-locations
// @access  Private
export const getEcoLocations = async (req, res, next) => {
  try {
    const { category, city } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (city) filter.city = city;

    const locations = await EcoLocation.find(filter);

    res.json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single eco location
// @route   GET /api/eco-locations/:id
// @access  Private
export const getEcoLocation = async (req, res, next) => {
  try {
    const location = await EcoLocation.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create eco location
// @route   POST /api/eco-locations
// @access  Private/Admin
export const createEcoLocation = async (req, res, next) => {
  try {
    const location = await EcoLocation.create(req.body);

    res.status(201).json({
      success: true,
      data: location
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update eco location
// @route   PUT /api/eco-locations/:id
// @access  Private/Admin
export const updateEcoLocation = async (req, res, next) => {
  try {
    const location = await EcoLocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete eco location
// @route   DELETE /api/eco-locations/:id
// @access  Private/Admin
export const deleteEcoLocation = async (req, res, next) => {
  try {
    const location = await EcoLocation.findByIdAndDelete(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

