import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { leaderboardApi } from '../lib/api';
import { Trophy, Award } from 'lucide-react';

interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  email: string;
  total_quizzes: number;
  avg_quiz_score: number;
  total_challenges: number;
  badge_count: number;
}

export const Leaderboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadLeaderboard();
  }, [user, navigate]);

  const loadLeaderboard = async () => {
    try {
      const response = await leaderboardApi.get();
      setLeaders(response.data || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <Trophy className="h-12 w-12 text-yellow-500 mr-4" />
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Leaderboard</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Top eco warriors of Bangladesh</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {leaders.length === 0 ? (
            <div className="p-12 text-center text-gray-600 dark:text-gray-300">
              No data available yet. Be the first to make an impact!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Rank</th>
                    <th className="px-6 py-4 text-left">User</th>
                    <th className="px-6 py-4 text-center">Quizzes</th>
                    <th className="px-6 py-4 text-center">Avg Score</th>
                    <th className="px-6 py-4 text-center">Challenges</th>
                    <th className="px-6 py-4 text-center">Badges</th>
                  </tr>
                </thead>
                <tbody>
                  {leaders.map((leader, index) => (
                    <tr
                      key={leader.user_id}
                      className={`border-b border-gray-200 dark:border-gray-700 ${
                        leader.user_id === user?.id ? 'bg-green-50 dark:bg-green-900' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {index < 3 ? (
                            <Trophy className={`h-6 w-6 mr-2 ${
                              index === 0 ? 'text-yellow-500' :
                              index === 1 ? 'text-gray-400' :
                              'text-orange-600'
                            }`} />
                          ) : (
                            <span className="text-lg font-bold text-gray-600 dark:text-gray-300 mr-2">
                              {index + 1}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800 dark:text-white">
                          {leader.full_name}
                          {leader.user_id === user?.id && (
                            <span className="ml-2 text-xs text-green-600 dark:text-green-400">(You)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700 dark:text-gray-300">
                        {leader.total_quizzes}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {leader.avg_quiz_score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700 dark:text-gray-300">
                        {leader.total_challenges}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Award className="h-5 w-5 text-yellow-500" />
                          <span className="font-bold text-gray-700 dark:text-gray-300">
                            {leader.badge_count}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
