import User from '../models/User.js';
import QuizAttempt from '../models/QuizAttempt.js';
import BlogPost from '../models/BlogPost.js';
import EcoLocation from '../models/EcoLocation.js';
import DailyChallenge from '../models/DailyChallenge.js';
import CommunityPost from '../models/CommunityPost.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin only
export const getStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
      });
    }

    const [
      totalUsers,
      totalQuizAttempts,
      totalBlogPosts,
      totalEcoLocations,
      totalChallenges,
      activeCommunityPosts,
    ] = await Promise.all([
      User.countDocuments(),
      QuizAttempt.countDocuments(),
      BlogPost.countDocuments(),
      EcoLocation.countDocuments(),
      DailyChallenge.countDocuments(),
      CommunityPost.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalQuizAttempts,
        totalBlogPosts,
        totalEcoLocations,
        totalChallenges,
        activeCommunityPosts,
      },
    });
  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin stats',
    });
  }
};

