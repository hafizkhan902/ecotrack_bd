import { Link, useLocation } from 'react-router-dom';
import { Leaf, Moon, Sun, LogOut, User, Menu, X, LogIn, UserPlus, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { profileApi } from '../lib/api';

export const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const profile = await profileApi.getProfile();
        setIsAdmin(profile?.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-green-600 text-white'
        : 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900'
    }`;

  const mobileLinkClass = (path: string) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive(path)
        ? 'bg-green-600 text-white'
        : 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900'
    }`;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-green-600">Eco Track Bangladesh</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <Link to="/" className={linkClass('/')}>Home</Link>
            <Link to="/quiz" className={linkClass('/quiz')}>Quiz</Link>
            <Link to="/calculator" className={linkClass('/calculator')}>Calculator</Link>
            <Link to="/tips" className={linkClass('/tips')}>Tips</Link>
            <Link to="/challenges" className={linkClass('/challenges')}>Challenges</Link>
            <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
            <Link to="/community" className={linkClass('/community')}>Community</Link>
            <Link to="/leaderboard" className={linkClass('/leaderboard')}>Leaderboard</Link>
            <Link to="/blog" className={linkClass('/blog')}>Blog</Link>
            <Link to="/map" className={linkClass('/map')}>Map</Link>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 px-2">
                  Welcome!
                </span>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                    title="Admin Dashboard"
                  >
                    <Shield className="h-5 w-5" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  title="View Profile"
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all hover:shadow-lg"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium border-2 border-green-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 transition-all"
                  onClick={() => localStorage.setItem('authMode', 'signup')}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <Link to="/" className={mobileLinkClass('/')} onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/quiz" className={mobileLinkClass('/quiz')} onClick={() => setMobileMenuOpen(false)}>Quiz</Link>
            <Link to="/calculator" className={mobileLinkClass('/calculator')} onClick={() => setMobileMenuOpen(false)}>Calculator</Link>
            <Link to="/tips" className={mobileLinkClass('/tips')} onClick={() => setMobileMenuOpen(false)}>Tips</Link>
            <Link to="/challenges" className={mobileLinkClass('/challenges')} onClick={() => setMobileMenuOpen(false)}>Challenges</Link>
            <Link to="/dashboard" className={mobileLinkClass('/dashboard')} onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
            <Link to="/community" className={mobileLinkClass('/community')} onClick={() => setMobileMenuOpen(false)}>Community</Link>
            <Link to="/leaderboard" className={mobileLinkClass('/leaderboard')} onClick={() => setMobileMenuOpen(false)}>Leaderboard</Link>
            <Link to="/blog" className={mobileLinkClass('/blog')} onClick={() => setMobileMenuOpen(false)}>Blog</Link>
            <Link to="/map" className={mobileLinkClass('/map')} onClick={() => setMobileMenuOpen(false)}>Map</Link>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Shield className="h-5 w-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center space-x-2 px-3 py-3 rounded-md text-base font-medium bg-green-600 text-white hover:bg-green-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center space-x-2 px-3 py-3 rounded-md text-base font-medium border-2 border-green-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900"
                    onClick={() => {
                      localStorage.setItem('authMode', 'signup');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
