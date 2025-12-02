import { Link } from 'react-router-dom';
import { Leaf, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Youtube } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <div className="p-2 bg-emerald-500 rounded-lg group-hover:bg-emerald-400 transition-colors">
                <Leaf className="h-8 w-8" />
              </div>
              <span className="text-xl font-bold">Eco Track Bangladesh</span>
            </Link>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Empowering Bangladeshi citizens to live sustainably and reduce their carbon footprint through education, action, and community engagement.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-emerald-400" />
                <a href="mailto:info@ecotrackbd.org" className="hover:text-emerald-400 transition-colors">
                  info@ecotrackbd.org
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-emerald-400" />
                <a href="tel:+8801234567890" className="hover:text-emerald-400 transition-colors">
                  +880 1234-567890
                </a>
              </div>
              <div className="flex items-start space-x-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-emerald-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Eco Quiz</span>
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Carbon Calculator</span>
                </Link>
              </li>
              <li>
                <Link to="/challenges" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Daily Challenges</span>
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Eco Map</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-emerald-400">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Blog</span>
                </Link>
              </li>
              <li>
                <Link to="/tips" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Eco Tips</span>
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Community</span>
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Leaderboard</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-emerald-400">Connect With Us</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Follow us on social media for daily eco tips, challenges, and community updates.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-emerald-600 rounded-lg transition-all transform hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-emerald-600 rounded-lg transition-all transform hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-emerald-600 rounded-lg transition-all transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-emerald-600 rounded-lg transition-all transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-emerald-600 rounded-lg transition-all transform hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-2">Newsletter</p>
              <p className="text-sm text-gray-300 mb-3">Get weekly eco tips delivered to your inbox</p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
                />
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              <p>&copy; {currentYear} Eco Track Bangladesh. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                About Us
              </a>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Built with dedication for a greener Bangladesh
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
