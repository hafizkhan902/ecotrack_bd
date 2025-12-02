import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { profileApi, adminApi } from '../lib/api';
import { AdminQuizManager } from '../components/AdminQuizManager';
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  MapPin,
  Target,
  Users,
  BarChart3,
  Settings,
  Shield
} from 'lucide-react';

type Tab = 'overview' | 'quiz' | 'blog' | 'locations' | 'challenges' | 'users';

export const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizAttempts: 0,
    totalBlogPosts: 0,
    totalEcoLocations: 0,
    totalChallenges: 0,
    activeCommunityPosts: 0,
  });

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const profile = await profileApi.getProfile();

      if (profile?.role !== 'admin') {
        navigate('/dashboard');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await adminApi.getStats();
      setStats({
        totalUsers: data.totalUsers || 0,
        totalQuizAttempts: data.totalQuizAttempts || 0,
        totalBlogPosts: data.totalBlogPosts || 0,
        totalEcoLocations: data.totalEcoLocations || 0,
        totalChallenges: data.totalChallenges || 0,
        activeCommunityPosts: data.activeCommunityPosts || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'quiz' as Tab, label: 'Quiz Management', icon: HelpCircle },
    { id: 'blog' as Tab, label: 'Blog Posts', icon: FileText },
    { id: 'locations' as Tab, label: 'Eco Locations', icon: MapPin },
    { id: 'challenges' as Tab, label: 'Challenges', icon: Target },
    { id: 'users' as Tab, label: 'Users', icon: Users },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="h-10 w-10 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Manage all aspects of Eco Track Bangladesh</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all ${
                      activeTab === tab.id
                        ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="h-10 w-10 opacity-80" />
                      <span className="text-4xl font-bold">{stats.totalUsers}</span>
                    </div>
                    <p className="text-blue-100 font-medium">Total Users</p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between mb-4">
                      <HelpCircle className="h-10 w-10 opacity-80" />
                      <span className="text-4xl font-bold">{stats.totalQuizAttempts}</span>
                    </div>
                    <p className="text-emerald-100 font-medium">Quiz Attempts</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between mb-4">
                      <FileText className="h-10 w-10 opacity-80" />
                      <span className="text-4xl font-bold">{stats.totalBlogPosts}</span>
                    </div>
                    <p className="text-purple-100 font-medium">Blog Posts</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between mb-4">
                      <MapPin className="h-10 w-10 opacity-80" />
                      <span className="text-4xl font-bold">{stats.totalEcoLocations}</span>
                    </div>
                    <p className="text-orange-100 font-medium">Eco Locations</p>
                  </div>

                  <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between mb-4">
                      <Target className="h-10 w-10 opacity-80" />
                      <span className="text-4xl font-bold">{stats.totalChallenges}</span>
                    </div>
                    <p className="text-teal-100 font-medium">Daily Challenges</p>
                  </div>

                  <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between mb-4">
                      <BarChart3 className="h-10 w-10 opacity-80" />
                      <span className="text-4xl font-bold">{stats.activeCommunityPosts}</span>
                    </div>
                    <p className="text-pink-100 font-medium">Community Posts</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border-2 border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-start space-x-4">
                    <Settings className="h-8 w-8 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Admin Features</h3>
                      <ul className="space-y-2 text-gray-700 dark:text-gray-200">
                        <li className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                          <span>Manage quiz questions and answers</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                          <span>View and moderate community content</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                          <span>Monitor user activity and engagement</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                          <span>Manage eco locations and blog content</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'quiz' && <AdminQuizManager />}

            {activeTab !== 'overview' && activeTab !== 'quiz' && (
              <div className="text-center py-12">
                <div className="inline-block p-6 bg-gray-100 dark:bg-gray-700 rounded-full mb-6">
                  <Settings className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Management interface coming soon
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This section is under development and will be available in the next update
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
