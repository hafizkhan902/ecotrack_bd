import DailyChallenge from '../models/DailyChallenge.js';

// @desc    Get user challenges
// @route   GET /api/challenges
// @access  Private
export const getChallenges = async (req, res, next) => {
  try {
    const challenges = await DailyChallenge.find({ userId: req.user._id })
      .sort({ challengeDate: -1 })
      .limit(parseInt(req.query.limit) || 30);

    res.json({
      success: true,
      count: challenges.length,
      data: challenges
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create challenge
// @route   POST /api/challenges
// @access  Private
export const createChallenge = async (req, res, next) => {
  try {
    const { challengeName, challengeDate } = req.body;

    const challenge = await DailyChallenge.create({
      userId: req.user._id,
      challengeName,
      challengeDate: challengeDate || new Date()
    });

    res.status(201).json({
      success: true,
      data: challenge
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update challenge
// @route   PUT /api/challenges/:id
// @access  Private
export const updateChallenge = async (req, res, next) => {
  try {
    const { completed } = req.body;

    let challenge = await DailyChallenge.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    challenge.completed = completed;
    if (completed) {
      challenge.completedAt = new Date();
    }

    await challenge.save();

    res.json({
      success: true,
      data: challenge
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete challenge
// @route   DELETE /api/challenges/:id
// @access  Private
export const deleteChallenge = async (req, res, next) => {
  try {
    const challenge = await DailyChallenge.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
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

