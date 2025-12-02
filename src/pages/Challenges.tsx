import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { challengesApi } from '../lib/api';
import { Trophy, CheckCircle, Circle, Plus, Trash2 } from 'lucide-react';

interface Challenge {
  id: string;
  challengeName: string;
  completed: boolean;
  completedAt?: string;
}

const defaultChallenges = [
  'Use public transport or carpool',
  'Avoid using plastic bags',
  'Turn off lights when leaving a room',
  'Use reusable water bottle',
  'Recycle paper and plastic waste',
  'Take shorter showers',
  'Unplug unused electronics',
  'Eat a plant-based meal',
  'Walk or cycle instead of driving',
  'Compost food waste',
];

export const Challenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [newChallenge, setNewChallenge] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadChallenges();
    } else {
      loadLocalChallenges();
    }
  }, [user]);

  const loadChallenges = async () => {
    if (!user) return;

    try {
      const response = await challengesApi.getAll(30);
      const data = response.data || [];

      if (data.length > 0) {
        setChallenges(data);
      } else {
        // Create initial challenges
        const initialChallenges = defaultChallenges.slice(0, 5);
        for (const name of initialChallenges) {
          await challengesApi.create(name);
        }
        const newResponse = await challengesApi.getAll(30);
        setChallenges(newResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLocalChallenges = () => {
    const saved = localStorage.getItem('challenges');
    if (saved) {
      setChallenges(JSON.parse(saved));
    } else {
      const initial = defaultChallenges.slice(0, 5).map((name, index) => ({
        id: `local-${index}`,
        challengeName: name,
        completed: false,
      }));
      setChallenges(initial);
      localStorage.setItem('challenges', JSON.stringify(initial));
    }
    setLoading(false);
  };

  const toggleChallenge = async (challengeId: string) => {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) return;

    const updatedCompleted = !challenge.completed;

    if (user) {
      try {
        await challengesApi.update(challengeId, updatedCompleted);
        setChallenges(
          challenges.map((c) =>
            c.id === challengeId
              ? { ...c, completed: updatedCompleted, completedAt: updatedCompleted ? new Date().toISOString() : undefined }
              : c
          )
        );
      } catch (error) {
        console.error('Error updating challenge:', error);
      }
    } else {
      const updated = challenges.map((c) =>
        c.id === challengeId ? { ...c, completed: updatedCompleted } : c
      );
      setChallenges(updated);
      localStorage.setItem('challenges', JSON.stringify(updated));
    }
  };

  const addChallenge = async () => {
    if (!newChallenge.trim()) return;

    if (user) {
      try {
        await challengesApi.create(newChallenge);
        const response = await challengesApi.getAll(30);
        setChallenges(response.data || []);
      } catch (error) {
        console.error('Error adding challenge:', error);
      }
    } else {
      const newChallengeObj: Challenge = {
        id: `local-${Date.now()}`,
        challengeName: newChallenge,
        completed: false,
      };
      const updated = [...challenges, newChallengeObj];
      setChallenges(updated);
      localStorage.setItem('challenges', JSON.stringify(updated));
    }

    setNewChallenge('');
  };

  const deleteChallenge = async (challengeId: string) => {
    if (user) {
      try {
        await challengesApi.delete(challengeId);
        setChallenges(challenges.filter((c) => c.id !== challengeId));
      } catch (error) {
        console.error('Error deleting challenge:', error);
      }
    } else {
      const updated = challenges.filter((c) => c.id !== challengeId);
      setChallenges(updated);
      localStorage.setItem('challenges', JSON.stringify(updated));
    }
  };

  const completedCount = challenges.filter((c) => c.completed).length;
  const progress = challenges.length > 0 ? (completedCount / challenges.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">Loading challenges...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Daily Eco Challenges
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Complete daily tasks to build sustainable habits
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-gray-800 dark:text-white">
                Today's Progress
              </span>
              <span className="text-2xl font-bold text-green-600">
                {completedCount} / {challenges.length}
              </span>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {progress === 100 && challenges.length > 0 && (
            <div className="bg-gradient-to-r from-green-100 to-yellow-100 dark:from-green-900 dark:to-yellow-900 p-4 rounded-lg mb-6 text-center">
              <p className="text-lg font-bold text-green-800 dark:text-green-200">
                Congratulations! You completed all challenges today!
              </p>
            </div>
          )}

          <div className="space-y-3 mb-6">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  challenge.completed
                    ? 'bg-green-50 dark:bg-green-900 border-green-500'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center flex-1">
                  <button
                    onClick={() => toggleChallenge(challenge.id)}
                    className="mr-4 focus:outline-none"
                  >
                    {challenge.completed ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                  <span
                    className={`text-lg ${
                      challenge.completed
                        ? 'line-through text-gray-500 dark:text-gray-400'
                        : 'text-gray-800 dark:text-white'
                    }`}
                  >
                    {challenge.challengeName}
                  </span>
                </div>
                <button
                  onClick={() => deleteChallenge(challenge.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={newChallenge}
              onChange={(e) => setNewChallenge(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addChallenge()}
              placeholder="Add a new challenge..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={addChallenge}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-red-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Build Lasting Habits</h3>
          <p className="text-green-50">
            Consistency is key to creating a sustainable lifestyle. By completing these daily challenges,
            you are making a real difference for Bangladesh's environment. Each small action adds up to
            significant positive change over time.
          </p>
        </div>
      </div>
    </div>
  );
};
