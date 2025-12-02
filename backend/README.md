# Eco Track Bangladesh - Backend API

A modular Node.js/Express backend with MongoDB for the Eco Track Bangladesh sustainability platform.

## Architecture

```
backend/
├── config/
│   └── db.js              # MongoDB connection configuration
├── controllers/           # Request handlers (business logic)
│   ├── authController.js
│   ├── profileController.js
│   ├── carbonController.js
│   ├── challengeController.js
│   ├── communityController.js
│   ├── blogController.js
│   ├── quizController.js
│   ├── badgeController.js
│   ├── ecoLocationController.js
│   ├── ecoEventController.js
│   ├── plantingController.js
│   └── leaderboardController.js
├── middleware/
│   └── auth.js            # JWT authentication & admin authorization
├── models/                # MongoDB/Mongoose schemas
│   ├── User.js
│   ├── CarbonFootprint.js
│   ├── DailyChallenge.js
│   ├── CommunityPost.js
│   ├── PostComment.js
│   ├── BlogPost.js
│   ├── QuizQuestion.js
│   ├── QuizAttempt.js
│   ├── Badge.js
│   ├── UserBadge.js
│   ├── UserGoal.js
│   ├── EcoLocation.js
│   ├── EcoEvent.js
│   ├── PlantingArea.js
│   └── PlantedTree.js
├── routes/                # API route definitions
│   ├── authRoutes.js
│   ├── profileRoutes.js
│   ├── carbonRoutes.js
│   ├── challengeRoutes.js
│   ├── communityRoutes.js
│   ├── blogRoutes.js
│   ├── quizRoutes.js
│   ├── badgeRoutes.js
│   ├── ecoLocationRoutes.js
│   ├── ecoEventRoutes.js
│   ├── plantingRoutes.js
│   └── leaderboardRoutes.js
├── services/
│   └── seedData.js        # Database seeding script
├── server.js              # Application entry point
└── package.json
```

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory:

```env
MONGO_DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

### 3. Seed Database (Optional)

To populate the database with initial data:

```bash
node services/seedData.js
```

### 4. Run the Server

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |
| POST | `/api/auth/forgot-password` | Request password reset |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update user profile |

### Carbon Footprint
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/carbon` | Get user's carbon footprints |
| POST | `/api/carbon` | Create new footprint calculation |

### Daily Challenges
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/challenges` | Get user's challenges |
| POST | `/api/challenges` | Create new challenge |
| PUT | `/api/challenges/:id` | Update challenge |
| DELETE | `/api/challenges/:id` | Delete challenge |

### Community
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/community/posts` | Get all posts |
| POST | `/api/community/posts` | Create new post |
| PUT | `/api/community/posts/:id/like` | Like a post |
| DELETE | `/api/community/posts/:id` | Delete post |
| GET | `/api/community/posts/:id/comments` | Get post comments |
| POST | `/api/community/posts/:id/comments` | Add comment |

### Blog
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blog` | Get all blog posts |
| GET | `/api/blog/:id` | Get single blog post |
| POST | `/api/blog` | Create blog post (admin) |
| PUT | `/api/blog/:id` | Update blog post (admin) |
| DELETE | `/api/blog/:id` | Delete blog post (admin) |

### Quiz
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quiz/questions` | Get active questions |
| GET | `/api/quiz/questions/all` | Get all questions (admin) |
| POST | `/api/quiz/questions` | Create question (admin) |
| PUT | `/api/quiz/questions/:id` | Update question (admin) |
| DELETE | `/api/quiz/questions/:id` | Delete question (admin) |
| GET | `/api/quiz/attempts` | Get user's quiz attempts |
| POST | `/api/quiz/attempts` | Submit quiz attempt |

### Badges
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/badges` | Get all badges |
| GET | `/api/badges/user` | Get user's earned badges |
| POST | `/api/badges/check` | Check and award badges |
| POST | `/api/badges` | Create badge (admin) |

### Eco Locations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/eco-locations` | Get all eco locations |
| GET | `/api/eco-locations/:id` | Get single location |
| POST | `/api/eco-locations` | Create location (admin) |
| PUT | `/api/eco-locations/:id` | Update location (admin) |
| DELETE | `/api/eco-locations/:id` | Delete location (admin) |

### Eco Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/eco-events` | Get active events |
| GET | `/api/eco-events/all` | Get all events (admin) |
| GET | `/api/eco-events/:id` | Get single event |
| POST | `/api/eco-events` | Create event (admin) |
| PUT | `/api/eco-events/:id` | Update event (admin) |
| DELETE | `/api/eco-events/:id` | Delete event (admin) |

### Tree Planting
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/planting/areas` | Get all planting areas |
| GET | `/api/planting/areas/:id` | Get single area |
| POST | `/api/planting/areas` | Create area (admin) |
| PUT | `/api/planting/areas/:id` | Update area (admin) |
| DELETE | `/api/planting/areas/:id` | Delete area (admin) |
| GET | `/api/planting/trees` | Get planted trees |
| GET | `/api/planting/trees/user` | Get user's planted trees |
| POST | `/api/planting/trees` | Plant a tree |

### Leaderboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaderboard` | Get leaderboard |

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

## User Roles

- **user**: Default role for all registered users
- **admin**: Can manage quiz questions, blog posts, eco events, and locations

## Error Handling

All API responses follow this format:

```json
{
  "success": true|false,
  "data": {...} | [...],
  "message": "Error message (if applicable)"
}
```

