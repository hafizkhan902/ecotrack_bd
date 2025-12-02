import CarbonFootprint from '../models/CarbonFootprint.js';

// @desc    Get user carbon footprints
// @route   GET /api/carbon
// @access  Private
export const getCarbonFootprints = async (req, res, next) => {
  try {
    const footprints = await CarbonFootprint.find({ userId: req.user._id })
      .sort({ calculatedAt: -1 })
      .limit(parseInt(req.query.limit) || 10);

    res.json({
      success: true,
      count: footprints.length,
      data: footprints
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create carbon footprint
// @route   POST /api/carbon
// @access  Private
export const createCarbonFootprint = async (req, res, next) => {
  try {
    const { electricityKwh, transportationKm, transportationType, wasteKg, totalCo2Kg, category } = req.body;

    const footprint = await CarbonFootprint.create({
      userId: req.user._id,
      electricityKwh,
      transportationKm,
      transportationType,
      wasteKg,
      totalCo2Kg,
      category
    });

    res.status(201).json({
      success: true,
      data: footprint
    });
  } catch (error) {
    next(error);
  }
};

