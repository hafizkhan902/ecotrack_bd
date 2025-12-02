import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Badge from '../models/Badge.js';
import BlogPost from '../models/BlogPost.js';
import EcoLocation from '../models/EcoLocation.js';
import QuizQuestion from '../models/QuizQuestion.js';

dotenv.config();

const badges = [
  { name: 'First Steps', description: 'Complete your first quiz', icon: 'Award', requirement: 'quiz_count_1' },
  { name: 'Quiz Master', description: 'Complete 10 quizzes', icon: 'Trophy', requirement: 'quiz_count_10' },
  { name: 'Carbon Aware', description: 'Calculate your carbon footprint', icon: 'Leaf', requirement: 'carbon_calc_1' },
  { name: 'Eco Warrior', description: 'Complete 5 daily challenges', icon: 'Target', requirement: 'challenge_count_5' },
  { name: 'Week Streak', description: 'Complete challenges for 7 days in a row', icon: 'Calendar', requirement: 'challenge_streak_7' },
  { name: 'Community Member', description: 'Make your first community post', icon: 'Users', requirement: 'post_count_1' },
  { name: 'Carbon Reducer', description: 'Reduce your footprint by 10%', icon: 'TrendingDown', requirement: 'carbon_reduction_10' }
];

const blogPosts = [
  {
    title: 'Climate Change Impact on Bangladesh',
    content: 'Bangladesh is one of the most climate-vulnerable countries in the world. Rising sea levels threaten coastal communities, while extreme weather events are becoming more frequent. This article explores the challenges and solutions for building climate resilience in Bangladesh.',
    imageUrl: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
    author: 'Dr. Rashid Ahmed'
  },
  {
    title: 'Plastic Pollution in Bangladesh Rivers',
    content: 'Our rivers are facing a severe plastic pollution crisis. From Dhaka to Chittagong, plastic waste clogs waterways and harms aquatic life. Learn about initiatives to reduce plastic use and promote sustainable alternatives across Bangladesh.',
    imageUrl: 'https://images.pexels.com/photos/3856033/pexels-photo-3856033.jpeg',
    author: 'Ayesha Khan'
  },
  {
    title: 'Solar Energy Revolution in Rural Bangladesh',
    content: 'Solar home systems have transformed rural Bangladesh, bringing clean electricity to millions. This success story showcases how renewable energy can drive sustainable development and improve lives in off-grid communities.',
    imageUrl: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg',
    author: 'Md. Karim'
  }
];

const ecoLocations = [
  { name: 'Dhaka Recycling Center', description: 'Main recycling facility accepting paper, plastic, and metal waste', latitude: 23.8103, longitude: 90.4125, category: 'Recycling Center', city: 'Dhaka' },
  { name: 'Ramna Park', description: 'Historic green space in the heart of Dhaka, perfect for eco-walks', latitude: 23.7379, longitude: 90.3958, category: 'Park', city: 'Dhaka' },
  { name: 'Chittagong Beach Cleanup Point', description: 'Regular beach cleanup initiative meeting point', latitude: 22.3569, longitude: 91.7832, category: 'Cleanup Site', city: 'Chittagong' },
  { name: 'Botanical Garden Mirpur', description: 'National botanical garden with diverse plant species', latitude: 23.8069, longitude: 90.3635, category: 'Park', city: 'Dhaka' },
  { name: 'Sylhet Tea Garden', description: 'Organic tea plantation promoting sustainable agriculture', latitude: 24.8949, longitude: 91.8687, category: 'Eco Farm', city: 'Sylhet' }
];

const quizQuestions = [
  {
    questionText: 'What percentage of plastic waste in Bangladesh is recycled?',
    difficulty: 'medium',
    category: 'Waste Management',
    points: 10,
    explanation: 'Only about 30% of plastic waste is recycled in Bangladesh, highlighting the need for better waste management systems.',
    answers: [
      { answerText: '10%', isCorrect: false, orderIndex: 0 },
      { answerText: '30%', isCorrect: true, orderIndex: 1 },
      { answerText: '50%', isCorrect: false, orderIndex: 2 },
      { answerText: '70%', isCorrect: false, orderIndex: 3 }
    ]
  },
  {
    questionText: 'Which renewable energy source is most suitable for rural Bangladesh?',
    difficulty: 'easy',
    category: 'Energy',
    points: 10,
    explanation: 'Solar energy is most suitable for rural Bangladesh due to abundant sunlight and decreasing costs of solar panels.',
    answers: [
      { answerText: 'Wind Energy', isCorrect: false, orderIndex: 0 },
      { answerText: 'Solar Energy', isCorrect: true, orderIndex: 1 },
      { answerText: 'Hydroelectric Power', isCorrect: false, orderIndex: 2 },
      { answerText: 'Geothermal Energy', isCorrect: false, orderIndex: 3 }
    ]
  },
  {
    questionText: 'How many liters of water does an average person in Dhaka use per day?',
    difficulty: 'hard',
    category: 'Water Conservation',
    points: 15,
    explanation: 'The average person in Dhaka uses approximately 120-150 liters of water per day, much of which could be conserved.',
    answers: [
      { answerText: '50-70 liters', isCorrect: false, orderIndex: 0 },
      { answerText: '80-100 liters', isCorrect: false, orderIndex: 1 },
      { answerText: '120-150 liters', isCorrect: true, orderIndex: 2 },
      { answerText: '200-250 liters', isCorrect: false, orderIndex: 3 }
    ]
  },
  {
    questionText: 'What is the main cause of air pollution in Dhaka?',
    difficulty: 'easy',
    category: 'Air Quality',
    points: 10,
    explanation: 'Vehicle emissions and brick kilns are the main causes of air pollution in Dhaka, contributing to poor air quality.',
    answers: [
      { answerText: 'Industrial factories', isCorrect: false, orderIndex: 0 },
      { answerText: 'Vehicle emissions and brick kilns', isCorrect: true, orderIndex: 1 },
      { answerText: 'Household waste burning', isCorrect: false, orderIndex: 2 },
      { answerText: 'Power plants', isCorrect: false, orderIndex: 3 }
    ]
  },
  {
    questionText: 'How much carbon dioxide does an average tree absorb per year?',
    difficulty: 'medium',
    category: 'Climate Change',
    points: 10,
    explanation: 'An average tree absorbs about 21 kg of CO2 per year, making tree planting an effective climate action.',
    answers: [
      { answerText: '10 kg per year', isCorrect: false, orderIndex: 0 },
      { answerText: '21 kg per year', isCorrect: true, orderIndex: 1 },
      { answerText: '50 kg per year', isCorrect: false, orderIndex: 2 },
      { answerText: '100 kg per year', isCorrect: false, orderIndex: 3 }
    ]
  },
  {
    questionText: 'What is the primary greenhouse gas responsible for climate change?',
    difficulty: 'easy',
    category: 'Climate Change',
    points: 10,
    explanation: 'Carbon dioxide (CO2) is the primary greenhouse gas responsible for climate change, mainly from burning fossil fuels.',
    answers: [
      { answerText: 'Oxygen', isCorrect: false, orderIndex: 0 },
      { answerText: 'Carbon Dioxide', isCorrect: true, orderIndex: 1 },
      { answerText: 'Nitrogen', isCorrect: false, orderIndex: 2 },
      { answerText: 'Hydrogen', isCorrect: false, orderIndex: 3 }
    ]
  },
  {
    questionText: 'How long does it take for a plastic bottle to decompose in nature?',
    difficulty: 'medium',
    category: 'Waste Management',
    points: 10,
    explanation: 'A plastic bottle takes approximately 450 years to decompose, making plastic waste a major environmental concern.',
    answers: [
      { answerText: '50 years', isCorrect: false, orderIndex: 0 },
      { answerText: '100 years', isCorrect: false, orderIndex: 1 },
      { answerText: '450 years', isCorrect: true, orderIndex: 2 },
      { answerText: '1000 years', isCorrect: false, orderIndex: 3 }
    ]
  },
  {
    questionText: "What percentage of Bangladesh's population is at risk from climate change impacts?",
    difficulty: 'hard',
    category: 'Climate Change',
    points: 15,
    explanation: "Approximately 70% of Bangladesh's population is at risk from climate change impacts, particularly from flooding and sea level rise.",
    answers: [
      { answerText: '30%', isCorrect: false, orderIndex: 0 },
      { answerText: '50%', isCorrect: false, orderIndex: 1 },
      { answerText: '70%', isCorrect: true, orderIndex: 2 },
      { answerText: '90%', isCorrect: false, orderIndex: 3 }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Badge.deleteMany({});
    await BlogPost.deleteMany({});
    await EcoLocation.deleteMany({});
    await QuizQuestion.deleteMany({});

    // Seed data
    await Badge.insertMany(badges);
    console.log('Badges seeded');

    await BlogPost.insertMany(blogPosts);
    console.log('Blog posts seeded');

    await EcoLocation.insertMany(ecoLocations);
    console.log('Eco locations seeded');

    await QuizQuestion.insertMany(quizQuestions);
    console.log('Quiz questions seeded');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

