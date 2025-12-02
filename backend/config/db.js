import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_DB_URI;
    
    if (!mongoUri) {
      console.error('Error: MONGO_DB_URI is not defined in environment variables');
      console.error('Please create a .env file in the backend directory with your MongoDB URI');
      process.exit(1);
    }
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

