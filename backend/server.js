import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import carbonRoutes from './routes/carbonRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import badgeRoutes from './routes/badgeRoutes.js';
import ecoLocationRoutes from './routes/ecoLocationRoutes.js';
import ecoEventRoutes from './routes/ecoEventRoutes.js';
import plantingRoutes from './routes/plantingRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/carbon', carbonRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/eco-locations', ecoLocationRoutes);
app.use('/api/eco-events', ecoEventRoutes);
app.use('/api/planting', plantingRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Eco Track API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
