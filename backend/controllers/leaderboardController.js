import User from '../models/User.js';
import QuizAttempt from '../models/QuizAttempt.js';
import DailyChallenge from '../models/DailyChallenge.js';
import UserBadge from '../models/UserBadge.js';

// @desc    Get leaderboard
// @route   GET /api/leaderboard
// @access  Private
export const getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find().select('_id fullName email');

    const leaderboardData = await Promise.all(
      users.map(async (user) => {
        const [quizAttempts, completedChallenges, badges] = await Promise.all([
          QuizAttempt.find({ userId: user._id }),
          DailyChallenge.countDocuments({ userId: user._id, completed: true }),
          UserBadge.countDocuments({ userId: user._id })
        ]);

        const avgScore = quizAttempts.length > 0
          ? quizAttempts.reduce((acc, q) => acc + (q.correctAnswers / q.totalQuestions) * 100, 0) / quizAttempts.length
          : 0;

        return {
          user_id: user._id,
          full_name: user.fullName || 'Anonymous',
          email: user.email,
          total_quizzes: quizAttempts.length,
          avg_quiz_score: Math.round(avgScore),
          total_challenges: completedChallenges,
          badge_count: badges
        };
      })
    );

    // Sort by composite score
    leaderboardData.sort((a, b) => {
      const scoreA = a.avg_quiz_score + a.total_challenges * 5 + a.badge_count * 10;
      const scoreB = b.avg_quiz_score + b.total_challenges * 5 + b.badge_count * 10;
      return scoreB - scoreA;
    });

    res.json({
      success: true,
      count: leaderboardData.length,
      data: leaderboardData.slice(0, 20)
    });
  } catch (error) {
    next(error);
  }
};

