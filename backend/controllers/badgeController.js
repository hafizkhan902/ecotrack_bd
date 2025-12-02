import Badge from '../models/Badge.js';
import UserBadge from '../models/UserBadge.js';
import QuizAttempt from '../models/QuizAttempt.js';
import CarbonFootprint from '../models/CarbonFootprint.js';
import DailyChallenge from '../models/DailyChallenge.js';
import CommunityPost from '../models/CommunityPost.js';

// @desc    Get all badges
// @route   GET /api/badges
// @access  Private
export const getBadges = async (req, res, next) => {
  try {
    const badges = await Badge.find();

    res.json({
      success: true,
      count: badges.length,
      data: badges
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user badges
// @route   GET /api/badges/user
// @access  Private
export const getUserBadges = async (req, res, next) => {
  try {
    const userBadges = await UserBadge.find({ userId: req.user._id })
      .populate('badgeId');

    const badges = userBadges.map(ub => ({
      id: ub.badgeId._id,
      name: ub.badgeId.name,
      description: ub.badgeId.description,
      icon: ub.badgeId.icon,
      earned_at: ub.earnedAt
    }));

    res.json({
      success: true,
      count: badges.length,
      data: badges
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check and award badges
// @route   POST /api/badges/check
// @access  Private
export const checkAndAwardBadges = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get user stats
    const [quizCount, carbonCount, challengeCount, postCount] = await Promise.all([
      QuizAttempt.countDocuments({ userId }),
      CarbonFootprint.countDocuments({ userId }),
      DailyChallenge.countDocuments({ userId, completed: true }),
      CommunityPost.countDocuments({ userId })
    ]);

    // Get all badges
    const badges = await Badge.find();
    
    // Get user's existing badges
    const userBadges = await UserBadge.find({ userId });
    const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId.toString()));

    const badgesToAward = [];

    for (const badge of badges) {
      if (earnedBadgeIds.has(badge._id.toString())) continue;

      let shouldAward = false;

      switch (badge.requirement) {
        case 'quiz_count_1':
          shouldAward = quizCount >= 1;
          break;
        case 'quiz_count_10':
          shouldAward = quizCount >= 10;
          break;
        case 'carbon_calc_1':
          shouldAward = carbonCount >= 1;
          break;
        case 'challenge_count_5':
          shouldAward = challengeCount >= 5;
          break;
        case 'post_count_1':
          shouldAward = postCount >= 1;
          break;
      }

      if (shouldAward) {
        badgesToAward.push({
          userId,
          badgeId: badge._id
        });
      }
    }

    if (badgesToAward.length > 0) {
      await UserBadge.insertMany(badgesToAward);
    }

    res.json({
      success: true,
      badgesAwarded: badgesToAward.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create badge (admin)
// @route   POST /api/badges
// @access  Private/Admin
export const createBadge = async (req, res, next) => {
  try {
    const { name, description, icon, requirement } = req.body;

    const badge = await Badge.create({
      name,
      description,
      icon,
      requirement
    });

    res.status(201).json({
      success: true,
      data: badge
    });
  } catch (error) {
    next(error);
  }
};

