import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AppProvider } from './contexts/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Quiz } from './pages/Quiz';
import { Calculator } from './pages/Calculator';
import { Tips } from './pages/Tips';
import { Challenges } from './pages/Challenges';
import { Dashboard } from './pages/Dashboard';
import { Community } from './pages/Community';
import { Blog } from './pages/Blog';
import { Map } from './pages/Map';
import { Profile } from './pages/Profile';
import { Leaderboard } from './pages/Leaderboard';
import { Admin } from './pages/Admin';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppProvider>
            <Router>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/tips" element={<Tips />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/community" element={<Community />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/map" element={<Map />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
              <Footer />
            </div>
            </Router>
          </AppProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
