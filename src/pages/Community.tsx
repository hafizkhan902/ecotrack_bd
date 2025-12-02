import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { communityApi } from '../lib/api';
import { Users, Send, ThumbsUp, Clock } from 'lucide-react';

interface CommunityPost {
  id: string;
  content: string;
  likes: number;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadPosts();
  }, [user, navigate]);

  const loadPosts = async () => {
    try {
      const response = await communityApi.getPosts();
      setPosts(response.data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPost.trim() || !user) return;

    try {
      await communityApi.createPost(newPost);
      setNewPost('');
      loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const likePost = async (postId: string) => {
    try {
      await communityApi.likePost(postId);
      loadPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">Loading community...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Users className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Eco Community
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Share ideas, inspire others, and learn from fellow eco-warriors
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Share Your Eco Idea
          </h2>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What eco-friendly action did you take today? Share your tips, experiences, or ideas..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white resize-none"
            rows={4}
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={createPost}
              disabled={!newPost.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
              <span>Post</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 dark:text-gray-300">
                No posts yet. Be the first to share your eco idea!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white">
                      {post.profiles?.full_name || 'Anonymous User'}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(post.created_at)}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-lg mb-4 whitespace-pre-wrap">
                  {post.content}
                </p>

                <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => likePost(post.id)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span className="font-semibold">{post.likes}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-12 bg-gradient-to-r from-green-600 to-red-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Community Guidelines</h3>
          <ul className="space-y-2 text-green-50">
            <li>• Share positive, actionable eco-friendly tips</li>
            <li>• Be respectful and supportive of others</li>
            <li>• Focus on solutions, not just problems</li>
            <li>• Inspire others with your sustainable actions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
