import { Link } from 'react-router-dom';
import { Leaf, Calculator, BookOpen, Trophy, Users, Map } from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4)',
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <div className="flex justify-center mb-6">
            <Leaf className="h-24 w-24 text-green-400 animate-pulse drop-shadow-lg" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
            Eco Track Bangladesh
          </h1>
          <p className="text-xl md:text-2xl text-green-100 mb-8 animate-slide-up">
            Track your carbon footprint. Embrace sustainability. Build a greener Bangladesh.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link
              to="/calculator"
              className="px-8 py-4 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 transition-all duration-300 hover:scale-105 hover:shadow-soft-lg"
            >
              Calculate Your Impact
            </Link>
            <Link
              to="/quiz"
              className="px-8 py-4 bg-white text-green-600 rounded-2xl font-semibold hover:bg-green-50 transition-all duration-300 hover:scale-105 hover:shadow-soft-lg"
            >
              Take the Quiz
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
            Why Eco Track?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2 group">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calculator className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                Track Your Footprint
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Calculate your daily carbon emissions from electricity, transport, and lifestyle choices.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2 group">
              <div className="bg-red-100 dark:bg-red-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                Complete Challenges
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Take on daily eco-friendly challenges and build sustainable habits step by step.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2 group">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                Join Community
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Share ideas, learn from others, and be part of Bangladesh's eco movement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-red-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Bangladesh Needs Your Action
              </h2>
              <p className="text-green-50 text-lg mb-6">
                As one of the world's most climate-vulnerable nations, Bangladesh faces rising sea levels,
                extreme weather, and environmental challenges. Every small action counts.
              </p>
              <ul className="space-y-3 text-green-50">
                <li className="flex items-start">
                  <span className="text-2xl mr-2">🌊</span>
                  <span>Coastal communities at risk from rising waters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-2">♻️</span>
                  <span>Plastic pollution threatening our rivers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-2">🌡️</span>
                  <span>Increasing temperatures affecting agriculture</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/blog"
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-soft hover:shadow-soft-lg group"
              >
                <BookOpen className="h-12 w-12 text-green-600 mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-gray-800 dark:text-white">Read Stories</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Learn about local issues</p>
              </Link>

              <Link
                to="/map"
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-soft hover:shadow-soft-lg group"
              >
                <Map className="h-12 w-12 text-red-600 mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-gray-800 dark:text-white">Explore Map</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Find eco spots nearby</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Start Your Eco Journey Today
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of Bangladeshis making a difference, one sustainable choice at a time.
          </p>
          <Link
            to="/challenges"
            className="inline-block px-10 py-4 bg-green-600 text-white rounded-2xl text-lg font-semibold hover:bg-green-700 transition-all duration-300 hover:scale-105 hover:shadow-soft-lg"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};
