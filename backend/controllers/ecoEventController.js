import EcoEvent from '../models/EcoEvent.js';

// @desc    Get all active eco events
// @route   GET /api/eco-events
// @access  Private
export const getEcoEvents = async (req, res, next) => {
  try {
    const { eventType, district, division } = req.query;
    const filter = { isActive: true };

    if (eventType) filter.eventType = eventType;
    if (district) filter.district = district;
    if (division) filter.division = division;

    const events = await EcoEvent.find(filter)
      .sort({ eventDate: 1 });

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all eco events (admin)
// @route   GET /api/eco-events/all
// @access  Private/Admin
export const getAllEcoEvents = async (req, res, next) => {
  try {
    const events = await EcoEvent.find()
      .sort({ eventDate: -1 });

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single eco event
// @route   GET /api/eco-events/:id
// @access  Private
export const getEcoEvent = async (req, res, next) => {
  try {
    const event = await EcoEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create eco event
// @route   POST /api/eco-events
// @access  Private/Admin
export const createEcoEvent = async (req, res, next) => {
  try {
    const event = await EcoEvent.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update eco event
// @route   PUT /api/eco-events/:id
// @access  Private/Admin
export const updateEcoEvent = async (req, res, next) => {
  try {
    const event = await EcoEvent.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete eco event
// @route   DELETE /api/eco-events/:id
// @access  Private/Admin
export const deleteEcoEvent = async (req, res, next) => {
  try {
    const event = await EcoEvent.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
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

